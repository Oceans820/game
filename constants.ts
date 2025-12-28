
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
    instruction: "物质并非永恒，唯有影子可以被重塑。 \n[ 靠近灯柱 ] 按 [ E ] 剥离影子。 再次按 [ E ] 放置。 \n[ 左右键 ] 移动，[ 空格 ] 跳跃。",
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
    instruction: "多个影片可以互相叠加。 \n通过层层叠放 [ E ]，折叠出通往天际的阶梯。 \n[ R ] 可重置关卡。",
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
    instruction: "深渊横亘在眼前，实体的地面已断裂。 \n剥离左侧最深沉的影子，在鸿沟上方按 [ E ] 铺设桥梁。 \n影子虽轻，却能承载你的意志。",
    playerStart: { x: 50, y: 600 },
    target: { x: 1100, y: 600 },
    objects: [
      { id: 'ground-1', x: 0, y: 700, width: 300, height: 100, type: 'platform' },
      { id: 'ground-2', x: 900, y: 700, width: 300, height: 100, type: 'platform' },
      { id: 'source-far', x: 150, y: 450, width: 40, height: 250, type: 'shadow-source' },
      { id: 'portal', x: 1100, y: 600, width: 50, height: 100, type: 'portal' }
    ]
  },
  {
    id: 4,
    name: "影之交响 (Shadow Symphony)",
    instruction: "在错落的孤岛间，影子是唯一的路标。 \n你需要将影子从一个台阶搬运到下一个。 \n节奏是关键，不要在虚无中迷失。",
    playerStart: { x: 100, y: 600 },
    target: { x: 1000, y: 150 },
    objects: [
      { id: 'ground', x: 0, y: 700, width: 250, height: 100, type: 'platform' },
      { id: 'island-1', x: 450, y: 550, width: 100, height: 20, type: 'platform' },
      { id: 'island-2', x: 750, y: 400, width: 100, height: 20, type: 'platform' },
      { id: 'source-1', x: 120, y: 400, width: 30, height: 300, type: 'shadow-source' },
      { id: 'source-2', x: 480, y: 300, width: 20, height: 250, type: 'shadow-source' },
      { id: 'portal', x: 1000, y: 150, width: 50, height: 100, type: 'portal' }
    ]
  },
  {
    id: 5,
    name: "完整之影 (The Complete Shadow)",
    instruction: "阿飞，影子会减缓你的坠落。 \n手持影子时，你会像羽毛一样轻盈地降落。 \n在空中按 [ E ]，将影子铺在脚下。",
    playerStart: { x: 50, y: 200 },
    target: { x: 1050, y: 600 },
    objects: [
      { id: 'start-pad', x: 0, y: 300, width: 200, height: 20, type: 'platform' },
      { id: 'island-mid', x: 400, y: 450, width: 60, height: 10, type: 'platform' },
      { id: 'source-top', x: 80, y: 50, width: 20, height: 250, type: 'shadow-source' },
      { id: 'source-mid', x: 420, y: 350, width: 20, height: 100, type: 'shadow-source' },
      { id: 'source-low', x: 800, y: 500, width: 20, height: 300, type: 'shadow-source' },
      { id: 'portal', x: 1050, y: 600, width: 60, height: 120, type: 'portal' }
    ]
  }
];
