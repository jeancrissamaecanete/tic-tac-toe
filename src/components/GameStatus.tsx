'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Player } from '@/types/game';
import { Trophy, Users, RotateCcw } from 'lucide-react';

interface GameStatusProps {
  currentPlayer: Player;
  winner: Player;
  isGameOver: boolean;
  score: {
    X: number;
    O: number;
    draws: number;
  };
}

export function GameStatus({ currentPlayer, winner, isGameOver, score }: GameStatusProps) {
  const getStatusMessage = () => {
    if (winner) {
      return (
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <span className="font-bold text-lg">
            Player {winner} wins! 🎉
          </span>
        </div>
      );
    }
    if (isGameOver && !winner) {
      return (
        <div className="flex items-center gap-2">
          <RotateCcw className="w-5 h-5 text-gray-500" />
          <span className="font-bold text-lg">It's a draw! 🤝</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2">
        <Users className="w-5 h-5 text-blue-500" />
        <span className="font-bold text-lg">
          Player {currentPlayer}'s turn
        </span>
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-center">
          {getStatusMessage()}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex justify-center gap-4">
          <div className="text-center">
            <Badge variant="secondary" className="mb-1">
              Player X
            </Badge>
            <div className="text-2xl font-bold text-blue-600">{score.X}</div>
          </div>
          <div className="text-center">
            <Badge variant="secondary" className="mb-1">
              Draws
            </Badge>
            <div className="text-2xl font-bold text-gray-600">{score.draws}</div>
          </div>
          <div className="text-center">
            <Badge variant="secondary" className="mb-1">
              Player O
            </Badge>
            <div className="text-2xl font-bold text-red-600">{score.O}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
