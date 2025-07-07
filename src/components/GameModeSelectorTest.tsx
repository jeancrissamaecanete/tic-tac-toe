'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GameMode, Difficulty } from '@/types/game';

interface GameModeSelectorProps {
  onModeSelect: (mode: GameMode, difficulty?: Difficulty) => void;
}

export function GameModeSelector({ onModeSelect }: GameModeSelectorProps) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-gray-800 mb-4">
            🎮 Tic-Tac-Toe
          </h1>
          <p className="text-xl text-gray-600">
            Choose Your Game Mode
          </p>
        </div>

        {/* Game Mode Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Local 2-Player Mode */}
          <Card className="bg-white shadow-2xl hover:shadow-3xl transition-shadow duration-300 border-0">
            <CardHeader className="text-center pb-6">
              <div className="text-6xl mb-4">👥</div>
              <CardTitle className="text-2xl font-bold text-gray-800">
                Local 2-Player
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-lg text-gray-600">
                Play with a friend on the same device
              </p>
              <Button
                onClick={() => onModeSelect('local')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                size="lg"
              >
                Start Local Game
              </Button>
            </CardContent>
          </Card>

          {/* AI Mode */}
          <Card className="bg-white shadow-2xl hover:shadow-3xl transition-shadow duration-300 border-0">
            <CardHeader className="text-center pb-6">
              <div className="text-6xl mb-4">🤖</div>
              <CardTitle className="text-2xl font-bold text-gray-800">
                VS Computer
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-lg text-gray-600">
                Challenge the AI at different difficulty levels
              </p>
              <div className="space-y-3">
                <Button
                  onClick={() => onModeSelect('ai', 'easy')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
                >
                  🟢 Easy
                </Button>
                <Button
                  onClick={() => onModeSelect('ai', 'medium')}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
                >
                  🟡 Medium
                </Button>
                <Button
                  onClick={() => onModeSelect('ai', 'hard')}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
                >
                  🔴 Hard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-gray-500">
            Built with React & Next.js
          </p>
        </div>
      </div>
    </div>
  );
}
