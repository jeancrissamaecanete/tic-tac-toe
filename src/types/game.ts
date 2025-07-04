export type Player = 'X' | 'O' | null;

export type Board = Player[];

export type GameMode = 'local' | 'ai';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface GameState {
  board: Board;
  currentPlayer: Player;
  winner: Player;
  isGameOver: boolean;
  gameMode: GameMode;
  difficulty: Difficulty;
  score: {
    X: number;
    O: number;
    draws: number;
  };
}

export interface GameStats {
  totalGames: number;
  xWins: number;
  oWins: number;
  draws: number;
}
