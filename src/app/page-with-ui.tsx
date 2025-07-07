"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Player = 'X' | 'O' | null;

export default function Home() {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [winner, setWinner] = useState<Player | 'draw' | null>(null);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });

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
      // Update scores
      setScores(prev => ({
        ...prev,
        [newWinner === 'draw' ? 'draws' : newWinner]: prev[newWinner === 'draw' ? 'draws' : newWinner] + 1
      }));
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
  };

  const resetScores = () => {
    setScores({ X: 0, O: 0, draws: 0 });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 text-white flex flex-col items-center justify-center p-8">
      <Card className="bg-black/20 backdrop-blur-lg border-white/20 text-white">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold mb-2">Tic-Tac-Toe</CardTitle>
          <CardDescription className="text-gray-300">
            A modern twist on the classic game
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score Display */}
          <div className="flex justify-center space-x-4">
            <Badge variant="secondary" className="text-lg px-3 py-1">
              X: {scores.X}
            </Badge>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              O: {scores.O}
            </Badge>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              Draws: {scores.draws}
            </Badge>
          </div>

          {/* Game Status */}
          <div className="text-center">
            {winner ? (
              <div className="text-2xl font-bold">
                {winner === 'draw' ? "It's a draw!" : `Player ${winner} wins!`}
              </div>
            ) : (
              <div className="text-xl">
                Current player: <span className="font-bold text-blue-400">{currentPlayer}</span>
              </div>
            )}
          </div>

          {/* Game Board */}
          <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
            {board.map((cell, index) => (
              <Button
                key={index}
                onClick={() => handleCellClick(index)}
                variant="outline"
                size="lg"
                className="w-20 h-20 text-3xl font-bold bg-white/10 border-white/30 hover:bg-white/20 transition-all duration-200"
              >
                {cell}
              </Button>
            ))}
          </div>

          {/* Control Buttons */}
          <div className="flex justify-center space-x-4">
            <Button onClick={resetGame} variant="default" size="lg">
              New Game
            </Button>
            <Button onClick={resetScores} variant="outline" size="lg">
              Reset Scores
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
