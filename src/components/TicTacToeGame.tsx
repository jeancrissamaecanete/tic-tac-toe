'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GameBoard } from '@/components/GameBoard';
import { GameStatus } from '@/components/GameStatus';
import { Player, GameState } from '@/types/game';
import { 
  createEmptyBoard, 
  checkWinner, 
  isBoardFull, 
  getWinningCombination,
  getNextPlayer 
} from '@/lib/gameLogic';
import { RefreshCw, Sparkles } from 'lucide-react';

const initialGameState: GameState = {
  board: createEmptyBoard(),
  currentPlayer: 'X',
  winner: null,
  isGameOver: false,
  score: {
    X: 0,
    O: 0,
    draws: 0
  }
};

export function TicTacToeGame() {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [winningCombination, setWinningCombination] = useState<number[] | null>(null);
  const [showAlert, setShowAlert] = useState(false);

  const handleCellClick = (index: number) => {
    if (gameState.board[index] || gameState.isGameOver) return;

    const newBoard = [...gameState.board];
    newBoard[index] = gameState.currentPlayer;

    const winner = checkWinner(newBoard);
    const isFull = isBoardFull(newBoard);
    const isGameOver = winner !== null || isFull;

    setGameState(prev => ({
      ...prev,
      board: newBoard,
      winner,
      isGameOver,
      currentPlayer: isGameOver ? prev.currentPlayer : getNextPlayer(prev.currentPlayer),
      score: {
        ...prev.score,
        ...(winner === 'X' && { X: prev.score.X + 1 }),
        ...(winner === 'O' && { O: prev.score.O + 1 }),
        ...(isGameOver && !winner && { draws: prev.score.draws + 1 })
      }
    }));

    if (winner) {
      setWinningCombination(getWinningCombination(newBoard));
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    } else if (isFull) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  const resetGame = () => {
    setGameState(prev => ({
      ...prev,
      board: createEmptyBoard(),
      currentPlayer: 'X',
      winner: null,
      isGameOver: false
    }));
    setWinningCombination(null);
    setShowAlert(false);
  };

  const resetScore = () => {
    setGameState(initialGameState);
    setWinningCombination(null);
    setShowAlert(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <Card className="mb-6">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center justify-center gap-2">
              <Sparkles className="w-8 h-8 text-yellow-500" />
              Tic-Tac-Toe
              <Sparkles className="w-8 h-8 text-yellow-500" />
            </CardTitle>
            <CardDescription className="text-lg">
              Challenge your friend to a classic game of strategy!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {showAlert && (
              <Alert className="border-green-200 bg-green-50">
                <AlertDescription className="text-center font-semibold">
                  {gameState.winner 
                    ? `🎉 Congratulations Player ${gameState.winner}! You won!`
                    : '🤝 Great game! It\'s a draw!'
                  }
                </AlertDescription>
              </Alert>
            )}

            <GameStatus 
              currentPlayer={gameState.currentPlayer}
              winner={gameState.winner}
              isGameOver={gameState.isGameOver}
              score={gameState.score}
            />

            <div className="flex justify-center">
              <GameBoard
                board={gameState.board}
                onCellClick={handleCellClick}
                winningCombination={winningCombination}
                disabled={gameState.isGameOver}
              />
            </div>

            <div className="flex justify-center gap-4">
              <Button
                onClick={resetGame}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                New Game
              </Button>
              <Button
                onClick={resetScore}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Reset Score
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-2">How to Play</h3>
              <p className="text-sm opacity-90">
                Take turns placing X's and O's on the grid. Get three in a row horizontally, 
                vertically, or diagonally to win!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
