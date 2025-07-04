import { Board, Player, Difficulty } from '@/types/game';

export const WINNING_COMBINATIONS = [
  [0, 1, 2], // Top row
  [3, 4, 5], // Middle row
  [6, 7, 8], // Bottom row
  [0, 3, 6], // Left column
  [1, 4, 7], // Middle column
  [2, 5, 8], // Right column
  [0, 4, 8], // Diagonal top-left to bottom-right
  [2, 4, 6], // Diagonal top-right to bottom-left
];

export const checkWinner = (board: Board): Player => {
  for (const [a, b, c] of WINNING_COMBINATIONS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
};

export const isBoardFull = (board: Board): boolean => {
  return board.every(cell => cell !== null);
};

export const getWinningCombination = (board: Board): number[] | null => {
  for (const [a, b, c] of WINNING_COMBINATIONS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return [a, b, c];
    }
  }
  return null;
};

export const createEmptyBoard = (): Board => {
  return Array(9).fill(null);
};

export const getNextPlayer = (currentPlayer: Player): Player => {
  return currentPlayer === 'X' ? 'O' : 'X';
};

// AI Logic
export const getAIMove = (board: Board, difficulty: Difficulty): number => {
  const availableMoves = board.map((cell, index) => cell === null ? index : null).filter(val => val !== null) as number[];
  
  if (availableMoves.length === 0) return -1;
  
  switch (difficulty) {
    case 'easy':
      return getRandomMove(availableMoves);
    case 'medium':
      return getMediumMove(board, availableMoves);
    case 'hard':
      return getHardMove(board, availableMoves);
    default:
      return getRandomMove(availableMoves);
  }
};

const getRandomMove = (availableMoves: number[]): number => {
  return availableMoves[Math.floor(Math.random() * availableMoves.length)];
};

const getMediumMove = (board: Board, availableMoves: number[]): number => {
  // 50% chance to play optimally, 50% random
  if (Math.random() < 0.5) {
    return getHardMove(board, availableMoves);
  }
  return getRandomMove(availableMoves);
};

const getHardMove = (board: Board, availableMoves: number[]): number => {
  // Try to win
  for (const move of availableMoves) {
    const testBoard = [...board];
    testBoard[move] = 'O';
    if (checkWinner(testBoard) === 'O') {
      return move;
    }
  }
  
  // Block player from winning
  for (const move of availableMoves) {
    const testBoard = [...board];
    testBoard[move] = 'X';
    if (checkWinner(testBoard) === 'X') {
      return move;
    }
  }
  
  // Take center if available
  if (availableMoves.includes(4)) {
    return 4;
  }
  
  // Take corners
  const corners = [0, 2, 6, 8];
  const availableCorners = corners.filter(corner => availableMoves.includes(corner));
  if (availableCorners.length > 0) {
    return availableCorners[Math.floor(Math.random() * availableCorners.length)];
  }
  
  // Take any available move
  return getRandomMove(availableMoves);
};
