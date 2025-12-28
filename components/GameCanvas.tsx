
import React, { useEffect, useRef, useState } from 'react';
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

  useEffect(() => {
    resetLevel();
  }, [level]);

  const resetLevel = () => {
    setPlayer(level.playerStart);
    setVelocity({ x: 0, y: 0 });
    setDynamicObjects(level.objects.map(obj => ({ ...obj })));
    setHeldObject(null);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys(prev => ({ ...prev, [e.code]: true }));
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys(prev => ({ ...prev, [e.code]: false }));
      if (e.code === 'KeyE') handleInteraction();
      if (e.code === 'KeyR') resetLevel();
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
      setHeldObject(null);
      return;
    }
    // 增大了垂直交互范围 (120 -> 220) 确保高处影子可剥离
    const source = dynamicObjects.find(obj => 
      obj.type === 'shadow-source' && 
      Math.abs(obj.x + obj.width / 2 - (player.x + 15)) < 150 &&
      Math.abs(obj.y + obj.height / 2 - (player.y + 20)) < 220
    );
    if (source) {
      const newFoldedShadow: GameObject = {
        id: `folded-${Date.now()}`,
        x: player.x,
        y: player.y - 40,
        width: 100, // 增加影子宽度，提升关卡容错率
        height: 12,
        type: 'folded-shadow',
        isDetached: true
      };
      setDynamicObjects(prev => [...prev, newFoldedShadow]);
      setHeldObject(newFoldedShadow);
    }
  };

  useEffect(() => {
    let animationFrameId: number;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    const update = () => {
      let nextVx = 0;
      if (keys['KeyA'] || keys['ArrowLeft']) nextVx = -MOVE_SPEED;
      if (keys['KeyD'] || keys['ArrowRight']) nextVx = MOVE_SPEED;
      
      let nextVy = velocity.y + GRAVITY;
      if ((keys['Space'] || keys['ArrowUp']) && isGrounded) {
        nextVy = JUMP_FORCE;
        setIsGrounded(false);
      }
      const nextPlayerPos = { x: player.x + nextVx, y: player.y + nextVy };
      let grounded = false;

      dynamicObjects.forEach(obj => {
        if (obj.type === 'platform' || (obj.type === 'folded-shadow' && obj !== heldObject)) {
          if (player.x + 30 > obj.x && player.x < obj.x + obj.width && player.y + 40 <= obj.y && nextPlayerPos.y + 40 >= obj.y) {
            nextPlayerPos.y = obj.y - 40;
            nextVy = 0;
            grounded = true;
          }
          if (nextPlayerPos.x + 30 > obj.x && nextPlayerPos.x < obj.x + obj.width && nextPlayerPos.y + 35 > obj.y && nextPlayerPos.y < obj.y + obj.height) {
            nextPlayerPos.x = player.x;
          }
        }
      });

      // 掉落重置
      if (nextPlayerPos.y > CANVAS_HEIGHT) {
        resetLevel();
        return;
      }

      if (nextPlayerPos.x < 0) nextPlayerPos.x = 0;
      if (nextPlayerPos.x > CANVAS_WIDTH - 30) nextPlayerPos.x = CANVAS_WIDTH - 30;
      
      if (Math.abs(nextPlayerPos.x - level.target.x) < 40 && Math.abs(nextPlayerPos.y - level.target.y) < 80) {
        onLevelComplete();
      }

      setPlayer(nextPlayerPos);
      setVelocity({ x: nextVx, y: nextVy });
      setIsGrounded(grounded);
      if (heldObject) {
        setDynamicObjects(prev => prev.map(obj => obj.id === heldObject.id ? { ...obj, x: player.x - 35, y: player.y - 30 } : obj));
      }
      draw(ctx);
      animationFrameId = requestAnimationFrame(update);
    };

    const draw = (context: CanvasRenderingContext2D) => {
      context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      const grad = context.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
      grad.addColorStop(0, '#0a0a0a');
      grad.addColorStop(1, '#000000');
      context.fillStyle = grad;
      context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      // Grid lines
      context.strokeStyle = 'rgba(255, 255, 255, 0.02)';
      context.lineWidth = 1;
      for(let i=0; i<CANVAS_WIDTH; i+=100) {
        context.beginPath(); context.moveTo(i, 0); context.lineTo(i, CANVAS_HEIGHT); context.stroke();
      }

      dynamicObjects.forEach(obj => {
        if (obj.type === 'platform') {
          context.fillStyle = '#ffffff'; context.fillRect(obj.x, obj.y, obj.width, obj.height);
        } else if (obj.type === 'shadow-source') {
          const dist = Math.sqrt(Math.pow(obj.x + obj.width/2 - (player.x + 15), 2) + Math.pow(obj.y + obj.height/2 - (player.y + 20), 2));
          const isNearby = dist < 220;
          context.fillStyle = isNearby ? '#666' : '#222'; context.fillRect(obj.x, obj.y, obj.width, obj.height);
          context.strokeStyle = isNearby ? '#fff' : '#444'; context.lineWidth = isNearby ? 2 : 1; context.strokeRect(obj.x, obj.y, obj.width, obj.height);
          if (isNearby) {
            context.fillStyle = '#fff'; context.font = 'bold 12px Inter'; context.textAlign = 'center';
            context.fillText('PEEL [E]', obj.x + obj.width / 2, obj.y - 15);
          }
        } else if (obj.type === 'folded-shadow') {
          context.fillStyle = obj === heldObject ? 'rgba(255,255,255,0.6)' : '#ffffff';
          context.shadowBlur = 10; context.shadowColor = '#fff'; context.fillRect(obj.x, obj.y, obj.width, obj.height); context.shadowBlur = 0;
        } else if (obj.type === 'portal') {
          const time = Date.now() * 0.003;
          context.fillStyle = '#fff'; context.shadowBlur = 30 + Math.sin(time) * 15; context.shadowColor = '#fff'; context.fillRect(obj.x, obj.y, obj.width, obj.height); context.shadowBlur = 0;
        }
      });
      context.fillStyle = '#ffffff'; context.fillRect(player.x, player.y, 30, 40);
      context.fillStyle = '#000000'; context.fillRect(player.x + (velocity.x >= 0 ? 18 : 5), player.y + 10, 6, 6);
    };
    update();
    return () => cancelAnimationFrame(animationFrameId);
  }, [player, dynamicObjects, isGrounded, velocity, heldObject, keys, level]);

  return (
    <div className="relative flex items-center justify-center w-full h-full bg-black overflow-hidden">
      <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="max-w-full max-h-full border border-white/5" />
    </div>
  );
};

export default GameCanvas;
