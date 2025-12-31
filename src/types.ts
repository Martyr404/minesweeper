export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Expert' | 'Custom';

export interface DifficultyConfig {
  rows: number;
  cols: number;
  mines: number;
}

export interface CellData {
  row: number;
  col: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborCount: number;
}

export type BoardData = CellData[][];

export type GameStatus = 'idle' | 'playing' | 'won' | 'lost';

export const DIFFICULTIES: Record<Exclude<DifficultyLevel, 'Custom'>, DifficultyConfig> = {
  Beginner: { rows: 9, cols: 9, mines: 10 },
  Intermediate: { rows: 16, cols: 16, mines: 40 },
  Expert: { rows: 16, cols: 30, mines: 99 },
};
