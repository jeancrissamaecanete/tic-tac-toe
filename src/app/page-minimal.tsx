"use client";

import { useState } from "react";

type Player = 'X' | 'O' | null;

export default function Home() {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [winner, setWinner] = useState<Player | 'draw' | null>(null);

  const checkWinner = (board: Player[]): Player | 'draw' | null => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (const [a, b, c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    if (board.every(cell => cell !== null)) {
      return 'draw';
    }

    return null;
  };

  const handleCellClick = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const newWinner = checkWinner(newBoard);
    if (newWinner) {
      setWinner(newWinner);
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-8">Tic-Tac-Toe</h1>
      
      <div className="mb-6">
        {winner ? (
          <div className="text-2xl font-bold text-center">
            {winner === 'draw' ? "It's a draw!" : `Player ${winner} wins!`}
          </div>
        ) : (
          <div className="text-xl text-center">
            Current player: {currentPlayer}
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 mb-6">
        {board.map((cell, index) => (
          <button
            key={index}
            onClick={() => handleCellClick(index)}
            className="w-20 h-20 bg-gray-800 hover:bg-gray-700 border-2 border-gray-600 rounded-lg flex items-center justify-center text-3xl font-bold transition-colors"
          >
            {cell}
          </button>
        ))}
      </div>

      <button
        onClick={resetGame}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
      >
        Reset Game
      </button>
    </div>
  );
}
