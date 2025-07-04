'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Player, GameMode, Difficulty } from '@/types/game';
import { Trophy, Users, RotateCcw, Bot, Crown, Zap } from 'lucide-react';

interface GameStatusProps {
  currentPlayer: Player;
  winner: Player;
  isGameOver: boolean;
  gameMode: GameMode;
  difficulty?: Difficulty;
  score: {
    X: number;
    O: number;
    draws: number;
  };
}

export function GameStatus({ currentPlayer, winner, isGameOver, gameMode, difficulty, score }: GameStatusProps) {
  const getStatusMessage = () => {
    if (winner) {
      const isPlayerWin = winner === 'X';
      const isAIWin = winner === 'O' && gameMode === 'ai';
      
      return (
        <div className="flex items-center gap-2 justify-center">
          {isPlayerWin ? (
            <Crown className="w-8 h-8 text-yellow-400 animate-bounce" />
          ) : (
            <Trophy className="w-8 h-8 text-purple-400 animate-bounce" />
          )}
          <span className="font-bold text-2xl font-mono pixel-text">
            {isPlayerWin ? 'PLAYER WINS!' : isAIWin ? 'AI WINS!' : `PLAYER ${winner} WINS!`}
          </span>
          <span className="text-3xl animate-pulse">🎉</span>
        </div>
      );
    }
    if (isGameOver && !winner) {
      return (
        <div className="flex items-center gap-2 justify-center">
          <RotateCcw className="w-8 h-8 text-cyan-400 animate-spin" />
          <span className="font-bold text-2xl font-mono pixel-text">DRAW GAME!</span>
          <span className="text-3xl animate-pulse">🤝</span>
        </div>
      );
    }
    
    const isAITurn = currentPlayer === 'O' && gameMode === 'ai';
    return (
      <div className="flex items-center gap-2 justify-center">
        {isAITurn ? (
          <Bot className="w-8 h-8 text-cyan-400 animate-pulse" />
        ) : (
          <Users className="w-8 h-8 text-pink-400 animate-pulse" />
        )}
        <span className="font-bold text-2xl font-mono pixel-text">
          {isAITurn ? 'AI THINKING...' : `PLAYER ${currentPlayer} TURN`}
        </span>
        <Zap className="w-6 h-6 text-yellow-400 animate-bounce" />
      </div>
    );
  };

  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className="w-full bg-black/80 border-4 border-purple-400 shadow-2xl shadow-purple-400/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-center text-purple-300">
          {getStatusMessage()}
        </CardTitle>
        {gameMode === 'ai' && difficulty && (
          <div className="text-center">
            <Badge className={`${getDifficultyColor()} text-white font-mono text-sm px-4 py-1`}>
              {difficulty.toUpperCase()} AI
            </Badge>
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex justify-center gap-6">
          <div className="text-center">
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg p-4 border-2 border-pink-400 shadow-lg shadow-pink-400/50">
              <Badge variant="secondary" className="mb-2 bg-pink-400 text-white font-mono">
                PLAYER X
              </Badge>
              <div className="text-3xl font-bold text-pink-400 font-mono pixel-text">{score.X}</div>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg p-4 border-2 border-gray-400 shadow-lg shadow-gray-400/50">
              <Badge variant="secondary" className="mb-2 bg-gray-400 text-white font-mono">
                DRAWS
              </Badge>
              <div className="text-3xl font-bold text-gray-400 font-mono pixel-text">{score.draws}</div>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg p-4 border-2 border-cyan-400 shadow-lg shadow-cyan-400/50">
              <Badge variant="secondary" className="mb-2 bg-cyan-400 text-white font-mono">
                {gameMode === 'ai' ? 'AI' : 'PLAYER O'}
              </Badge>
              <div className="text-3xl font-bold text-cyan-400 font-mono pixel-text">{score.O}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
