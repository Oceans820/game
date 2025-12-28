
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { CANVAS_WIDTH, CANVAS_HEIGHT, GRAVITY, JUMP_FORCE, MOVE_SPEED } from '../constants';
import { GameLevel, GameObject, Vector2D } from '../types';

interface GameCanvasProps {
  level: GameLevel;
  onLevelComplete: () => void;
  onNarrativeUpdate: (text: string) => void;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ level, onLevelComplete, onNarrativeUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [player, setPlayer] = useState<Vector2D>(level.playerStart);
  const [velocity, setVelocity] = useState<Vector2D>({ x: 0, y: 0 });
  const [isGrounded, setIsGrounded] = useState(false);
  const [dynamicObjects, setDynamicObjects] = useState<GameObject[]>(level.objects);
  const [heldObject, setHeldObject] = useState<GameObject | null>(null);
  const [keys, setKeys] = useState<Record<string, boolean>>({});

  // Reset state when level changes
  useEffect(() => {
    setPlayer(level.playerStart);
    setVelocity({ x: 0, y: 0 });
    setDynamicObjects(level.objects.map(obj => ({ ...obj })));
    setHeldObject(null);
  }, [level]);

  // Handle Input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => setKeys(prev => ({ ...prev, [e.code]: true }));
    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys(prev => ({ ...prev, [e.code]: false }));
      if (e.code === 'KeyE') handleInteraction();
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [player, dynamicObjects, heldObject]);

  const handleInteraction = () => {
    if (heldObject) {
      // Place the object
      setHeldObject(null);
      return;
    }

    // Try to pick up a shadow source nearby
    const source = dynamicObjects.find(obj => 
      obj.type === 'shadow-source' && 
      Math.abs(obj.x + obj.width / 2 - (player.x + 15)) < 100 &&
      Math.abs(obj.y + obj.height / 2 - (player.y + 20)) < 100
    );

    if (source) {
      const newFoldedShadow: GameObject = {
        id: `folded-${Date.now()}`,
        x: player.x,
        y: player.y - 40,
        width: 60,
        height: 10,
        type: 'folded-shadow',
        isDetached: true
      };
      setDynamicObjects(prev => [...prev, newFoldedShadow]);
      setHeldObject(newFoldedShadow);
    }
  };

  // Game Loop
  useEffect(() => {
    let animationFrameId: number;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    const update = () => {
      // Player Movement
      let nextVx = 0;
      if (keys['KeyA']) nextVx = -MOVE_SPEED;
      if (keys['KeyD']) nextVx = MOVE_SPEED;
      
      let nextVy = velocity.y + GRAVITY;
      if (keys['Space'] && isGrounded) {
        nextVy = JUMP_FORCE;
        setIsGrounded(false);
      }

      const nextPlayerPos = {
        x: player.x + nextVx,
        y: player.y + nextVy
      };

      // Collision Detection
      let collided = false;
      let grounded = false;

      // Platform collisions
      dynamicObjects.forEach(obj => {
        if (obj.type === 'platform' || (obj.type === 'folded-shadow' && obj !== heldObject)) {
          // Bottom check (standing on)
          if (
            player.x + 30 > obj.x &&
            player.x < obj.x + obj.width &&
            player.y + 40 <= obj.y &&
            nextPlayerPos.y + 40 >= obj.y
          ) {
            nextPlayerPos.y = obj.y - 40;
            nextVy = 0;
            grounded = true;
          }
          // Simple wall check
          if (
             nextPlayerPos.x + 30 > obj.x &&
             nextPlayerPos.x < obj.x + obj.width &&
             nextPlayerPos.y + 35 > obj.y &&
             nextPlayerPos.y < obj.y + obj.height
          ) {
            nextPlayerPos.x = player.x;
          }
        }
      });

      // Constraints
      if (nextPlayerPos.x < 0) nextPlayerPos.x = 0;
      if (nextPlayerPos.x > CANVAS_WIDTH - 30) nextPlayerPos.x = CANVAS_WIDTH - 30;

      // Portal Check
      if (
        Math.abs(nextPlayerPos.x - level.target.x) < 40 &&
        Math.abs(nextPlayerPos.y - level.target.y) < 60
      ) {
        onLevelComplete();
      }

      setPlayer(nextPlayerPos);
      setVelocity({ x: nextVx, y: nextVy });
      setIsGrounded(grounded);

      // Handle Held Object position
      if (heldObject) {
        setDynamicObjects(prev => prev.map(obj => 
          obj.id === heldObject.id ? { ...obj, x: player.x - 15, y: player.y - 20 } : obj
        ));
      }

      draw(ctx);
      animationFrameId = requestAnimationFrame(update);
    };

    const draw = (context: CanvasRenderingContext2D) => {
      context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      // Background gradient
      const grad = context.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
      grad.addColorStop(0, '#111');
      grad.addColorStop(1, '#000');
      context.fillStyle = grad;
      context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw Grid (Subtle)
      context.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      context.lineWidth = 1;
      for(let i=0; i<CANVAS_WIDTH; i+=50) {
        context.beginPath();
        context.moveTo(i, 0);
        context.lineTo(i, CANVAS_HEIGHT);
        context.stroke();
      }
      for(let i=0; i<CANVAS_HEIGHT; i+=50) {
        context.beginPath();
        context.moveTo(0, i);
        context.lineTo(CANVAS_WIDTH, i);
        context.stroke();
      }

      // Draw Static Objects
      dynamicObjects.forEach(obj => {
        if (obj.type === 'platform') {
          context.fillStyle = '#fff';
          context.fillRect(obj.x, obj.y, obj.width, obj.height);
        } else if (obj.type === 'shadow-source') {
          // Source
          context.fillStyle = '#333';
          context.fillRect(obj.x, obj.y, obj.width, obj.height);
          // Highlight
          context.strokeStyle = '#fff';
          context.lineWidth = 2;
          context.strokeRect(obj.x, obj.y, obj.width, obj.height);
          // Flowing geometry effect
          const time = Date.now() * 0.002;
          context.beginPath();
          context.strokeStyle = 'rgba(255,255,255,0.3)';
          context.moveTo(obj.x, obj.y + Math.sin(time) * 10);
          context.lineTo(obj.x + obj.width, obj.y + Math.cos(time) * 10);
          context.stroke();
        } else if (obj.type === 'folded-shadow') {
          context.fillStyle = obj === heldObject ? 'rgba(255,255,255,0.8)' : '#fff';
          context.shadowBlur = 10;
          context.shadowColor = '#fff';
          context.fillRect(obj.x, obj.y, obj.width, obj.height);
          context.shadowBlur = 0;
        } else if (obj.type === 'portal') {
          // Portal (The White Door)
          context.fillStyle = '#fff';
          context.fillRect(obj.x, obj.y, obj.width, obj.height);
          context.shadowBlur = 30;
          context.shadowColor = '#fff';
          context.strokeRect(obj.x - 5, obj.y - 5, obj.width + 10, obj.height + 10);
          context.shadowBlur = 0;
        }
      });

      // Draw Player (Afei)
      context.fillStyle = '#fff';
      context.fillRect(player.x, player.y, 30, 40);
      // Eye
      context.fillStyle = '#000';
      context.fillRect(player.x + (velocity.x >= 0 ? 18 : 5), player.y + 10, 5, 5);

      // Instruction Text
      context.fillStyle = 'rgba(255, 255, 255, 0.7)';
      context.font = '16px Inter';
      context.textAlign = 'center';
      context.fillText(level.instruction, CANVAS_WIDTH / 2, 50);
    };

    update();
    return () => cancelAnimationFrame(animationFrameId);
  }, [player, dynamicObjects, isGrounded, velocity, heldObject, keys, level]);

  return (
    <div className="relative flex items-center justify-center w-full h-full bg-black overflow-hidden">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="max-w-full max-h-full border border-white/20 shadow-2xl"
      />
    </div>
  );
};

export default GameCanvas;
