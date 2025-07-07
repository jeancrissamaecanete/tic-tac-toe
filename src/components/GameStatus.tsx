'use client';

import { Player, GameMode } from '@/types/game';

interface GameStatusProps {
  currentPlayer: Player;
  winner: Player | 'draw';
  gameMode: GameMode;
}

export function GameStatus({ currentPlayer, winner, gameMode }: GameStatusProps) {
  const getStatusMessage = () => {
    if (winner === 'draw') {
      return (
        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border-l-4 border-yellow-500 p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="text-2xl mr-3">🤝</div>
            <span className="font-bold text-xl text-yellow-700">
              It's a Draw!
            </span>
          </div>
        </div>
      );
    }
    
    if (winner) {
      const isAI = gameMode === 'ai' && winner === 'O';
      return (
        <div className="bg-gradient-to-r from-green-100 to-emerald-100 border-l-4 border-green-500 p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="text-2xl mr-3">🎉</div>
            <span className="font-bold text-xl text-green-700">
              {isAI ? 'AI' : `Player ${winner}`} Wins!
            </span>
          </div>
        </div>
      );
    }
    
    const isAITurn = gameMode === 'ai' && currentPlayer === 'O';
    return (
      <div className="bg-gradient-to-r from-blue-100 to-purple-100 border-l-4 border-blue-500 p-4 rounded-lg shadow-md">
        <div className="flex items-center">
          <div className="text-2xl mr-3">{isAITurn ? '🤖' : '👤'}</div>
          <span className="font-bold text-lg text-blue-700">
            {isAITurn ? 'AI' : `Player ${currentPlayer}`}'s Turn
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {getStatusMessage()}
    </div>
  );
}
