export type Player = 'X' | 'O' | null;

export type Board = Player[];

export interface GameState {
  board: Board;
  currentPlayer: Player;
  winner: Player;
  isGameOver: boolean;
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
