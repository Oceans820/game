
export interface Vector2D {
  x: number;
  y: number;
}

export interface GameObject {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'platform' | 'player' | 'shadow-source' | 'portal' | 'folded-shadow';
  isDetached?: boolean;
}

export interface GameLevel {
  id: number;
  name: string;
  instruction: string;
  objects: GameObject[];
  playerStart: Vector2D;
  target: Vector2D;
}

export interface NarrativeState {
  currentText: string;
  history: string[];
}
