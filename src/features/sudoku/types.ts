export type Difficulty = 'easy' | 'medium' | 'hard';

export interface GameResult {
  date: string;
  time: number;
  difficulty: Difficulty;
}

export type GameStatus = 'playing' | 'paused' | 'won' | 'lost';