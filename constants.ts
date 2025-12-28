
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
    instruction: "在这个黑白交织的世界，物质并非永恒，唯有影子可以被重塑。 \n[ 靠近灯柱 ] 并按下 [ E ] 剥离它的影子。 再次按下 [ E ] 将影片放置在虚空中。 \n利用 [ 左右方向键 ] 移动，[ 空格 ] 跳跃，抵达高处的白昼之门。",
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
    instruction: "影子的厚度源于光的缺席。多个影片可以互相叠加。 \n当你剥离一个影子并放置后，可以折返剥离另一个。 \n通过层层叠放 [ E ]，阿飞能折叠出通往天际的阶梯。 目标在云端之上。",
    playerStart: { x: 100, y: 600 },
    target: { x: 1000, y: 200 },
    objects: [
      { id: 'ground', x: 0, y: 700, width: 1200, height: 100, type: 'platform' },
      { id: 'source-1', x: 300, y: 500, width: 30, height: 200, type: 'shadow-source' },
      { id: 'source-2', x: 400, y: 500, width: 30, height: 200, type: 'shadow-source' },
      { id: 'source-3', x: 500, y: 500, width: 30, height: 200, type: 'shadow-source' },
      { id: 'portal', x: 1000, y: 200, width: 50, height: 100, type: 'portal' }
    ]
  },
  {
    id: 3,
    name: "光影错位 (Displaced Light)",
    instruction: "有时，通往未来的路需要借用过去的影。 \n深渊横亘在眼前，实体的地面已断裂。 \n剥离左侧最深沉的影子，在鸿沟上方按 [ E ] 铺设桥梁。 记住，影子虽轻，却能承载你的意志。",
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
