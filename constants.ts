
import { GameLevel } from './types';

export const CANVAS_WIDTH = 1200;
export const CANVAS_HEIGHT = 800;
export const GRAVITY = 0.5;
export const JUMP_FORCE = -12;
export const MOVE_SPEED = 5;

export const INITIAL_LEVELS: GameLevel[] = [
  {
    id: 1,
    name: "影子剥离 (Shadow Peeling)",
    instruction: "在这里，影子是可以剥离的。站在灯柱旁，按下 [E] 将它的影子拉出来。 [Space] 跳跃，[A][D] 移动。",
    playerStart: { x: 100, y: 600 },
    target: { x: 1000, y: 400 },
    objects: [
      { id: 'ground', x: 0, y: 700, width: 1200, height: 100, type: 'platform' },
      { id: 'source-1', x: 500, y: 500, width: 20, height: 200, type: 'shadow-source' },
      { id: 'high-ledge', x: 900, y: 500, width: 200, height: 20, type: 'platform' },
      { id: 'portal', x: 1000, y: 400, width: 50, height: 100, type: 'portal' }
    ]
  },
  {
    id: 2,
    name: "折叠梯子 (Folding the Ladder)",
    instruction: "影子的质量可以叠加。多剥离几个影子，把它们层叠成通往白昼的梯子。",
    playerStart: { x: 100, y: 600 },
    target: { x: 1000, y: 200 },
    objects: [
      { id: 'ground', x: 0, y: 700, width: 1200, height: 100, type: 'platform' },
      { id: 'source-1', x: 300, y: 500, width: 30, height: 200, type: 'shadow-source' },
      { id: 'source-2', x: 350, y: 500, width: 30, height: 200, type: 'shadow-source' },
      { id: 'source-3', x: 400, y: 500, width: 30, height: 200, type: 'shadow-source' },
      { id: 'portal', x: 1000, y: 200, width: 50, height: 100, type: 'portal' }
    ]
  },
  {
    id: 3,
    name: "光影错位 (Displaced Light)",
    instruction: "有时候，影子比实物更坚固。剥离远处的影子，填补眼前的鸿沟。",
    playerStart: { x: 50, y: 600 },
    target: { x: 1100, y: 600 },
    objects: [
      { id: 'ground-1', x: 0, y: 700, width: 300, height: 100, type: 'platform' },
      { id: 'ground-2', x: 900, y: 700, width: 300, height: 100, type: 'platform' },
      { id: 'source-far', x: 150, y: 400, width: 40, height: 300, type: 'shadow-source' },
      { id: 'portal', x: 1100, y: 600, width: 50, height: 100, type: 'portal' }
    ]
  }
];
