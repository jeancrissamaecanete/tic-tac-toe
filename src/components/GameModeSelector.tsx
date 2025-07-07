'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GameMode, Difficulty } from '@/types/game';
import { Bot, Users, Gamepad2, Star } from 'lucide-react';

interface GameModeSelectorProps {
  onModeSelect: (mode: GameMode, difficulty?: Difficulty) => void;
}

export function GameModeSelector({ onModeSelect }: GameModeSelectorProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 flex items-center justify-center">
      <div className="max-w-4xl w-full">
        <div className="text-center pb-8 pt-8">
          <h1 className="text-6xl font-bold text-white mb-4 tracking-tight">
            <Gamepad2 className="inline-block w-16 h-16 text-blue-400 mr-4" />
            TIC-TAC-TOE
          </h1>
          <p className="text-xl text-slate-300">
            Choose your game mode
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Local Multiplayer */}
          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 cursor-pointer group">
            <CardHeader className="text-center">
              <Users className="w-16 h-16 text-green-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <CardTitle className="text-2xl text-white">Local Multiplayer</CardTitle>
              <CardDescription className="text-slate-300">
                Play with a friend on the same device
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button
                onClick={() => onModeSelect('local')}
                className="w-full bg-green-500 hover:bg-green-400 text-white font-semibold py-3 text-lg transition-all duration-200"
              >
                Start Game
              </Button>
            </CardContent>
          </Card>

          {/* AI Mode */}
          <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300">
            <CardHeader className="text-center">
              <Bot className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <CardTitle className="text-2xl text-white">VS AI</CardTitle>
              <CardDescription className="text-slate-300">
                Challenge the computer at different difficulty levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                <Button
                  onClick={() => onModeSelect('ai', 'easy')}
                  className="bg-green-500 hover:bg-green-400 text-white font-semibold py-3 transition-all duration-200"
                >
                  <Star className="w-5 h-5 mr-2" />
                  Easy
                </Button>
                <Button
                  onClick={() => onModeSelect('ai', 'medium')}
                  className="bg-yellow-500 hover:bg-yellow-400 text-white font-semibold py-3 transition-all duration-200"
                >
                  <div className="flex items-center justify-center">
                    <Star className="w-4 h-4 mr-1" />
                    <Star className="w-4 h-4 mr-2" />
                    Medium
                  </div>
                </Button>
                <Button
                  onClick={() => onModeSelect('ai', 'hard')}
                  className="bg-red-500 hover:bg-red-400 text-white font-semibold py-3 transition-all duration-200"
                >
                  <div className="flex items-center justify-center">
                    <Star className="w-4 h-4 mr-1" />
                    <Star className="w-4 h-4 mr-1" />
                    <Star className="w-4 h-4 mr-2" />
                    Hard
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8 text-slate-400">
          Built with React 19, Next.js 15, Tailwind CSS, and shadcn/ui
        </div>
      </div>
    </div>
  );
}
