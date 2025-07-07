'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GameMode, Difficulty } from '@/types/game';
import { Users, Bot, Trophy, Star, Zap, Target } from 'lucide-react';

interface GameModeSelectorProps {
  onModeSelect: (mode: GameMode, difficulty?: Difficulty) => void;
}

export function GameModeSelector({ onModeSelect }: GameModeSelectorProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full">
        {/* Header */}
        <div className="text-center pb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Tic-Tac-Toe
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Choose Mode
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto"></div>
        </div>

        {/* Game Mode Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Local 2-Player Mode */}
          <Card className="group relative overflow-hidden border-0 shadow-xl bg-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardHeader className="relative pb-4">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full mx-auto mb-4 shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-center text-gray-800">
                Local 2-Player
              </CardTitle>
            </CardHeader>
            <CardContent className="relative text-center space-y-6">
              <p className="text-gray-600 text-lg">
                Play with a friend on the same device
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <Star className="w-4 h-4" />
                <span>Perfect for friends & family</span>
              </div>
              <Button
                onClick={() => onModeSelect('local')}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                size="lg"
              >
                Start Local Game
              </Button>
            </CardContent>
          </Card>

          {/* AI Mode */}
          <Card className="group relative overflow-hidden border-0 shadow-xl bg-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardHeader className="relative pb-4">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-4 shadow-lg">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-center text-gray-800">
                VS Computer
              </CardTitle>
            </CardHeader>
            <CardContent className="relative text-center space-y-6">
              <p className="text-gray-600 text-lg">
                Challenge the AI at different difficulty levels
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <Target className="w-4 h-4" />
                <span>Test your strategic skills</span>
              </div>
              <div className="space-y-3">
                <Button
                  onClick={() => onModeSelect('ai', 'easy')}
                  variant="outline"
                  className="w-full border-2 border-green-300 text-green-600 hover:bg-green-50 hover:border-green-400 font-semibold py-3 px-6 rounded-lg transition-all duration-300 group/btn"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Zap className="w-4 h-4 group-hover/btn:animate-pulse" />
                    <span>Easy</span>
                  </div>
                </Button>
                <Button
                  onClick={() => onModeSelect('ai', 'medium')}
                  variant="outline"
                  className="w-full border-2 border-yellow-300 text-yellow-600 hover:bg-yellow-50 hover:border-yellow-400 font-semibold py-3 px-6 rounded-lg transition-all duration-300 group/btn"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Zap className="w-4 h-4 group-hover/btn:animate-pulse" />
                    <span>Medium</span>
                  </div>
                </Button>
                <Button
                  onClick={() => onModeSelect('ai', 'hard')}
                  variant="outline"
                  className="w-full border-2 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 font-semibold py-3 px-6 rounded-lg transition-all duration-300 group/btn"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Zap className="w-4 h-4 group-hover/btn:animate-pulse" />
                    <span>Hard</span>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            Built with React & Next.js
          </p>
        </div>
      </div>
    </div>
  );
}
