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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <Card className="bg-black/80 border-4 border-cyan-400 shadow-2xl shadow-cyan-400/50 backdrop-blur-sm">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-6xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4 font-mono pixel-font">
              <Gamepad2 className="inline-block w-16 h-16 text-cyan-400 mr-4" />
              TIC-TAC-TOE
            </CardTitle>
            <CardDescription className="text-xl text-purple-300 font-mono">
              Choose your game mode, retro warrior!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Local Multiplayer */}
            <Card className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-2 border-pink-400 hover:border-pink-300 transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Users className="w-12 h-12 text-pink-400" />
                    <div>
                      <h3 className="text-2xl font-bold text-pink-400 font-mono">2 PLAYER</h3>
                      <p className="text-pink-300 font-mono text-sm">Challenge a friend locally</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => onModeSelect('local')}
                    className="bg-pink-500 hover:bg-pink-400 text-white font-mono text-lg px-8 py-3 border-2 border-pink-400 hover:border-pink-300 transition-all duration-300 transform hover:scale-105"
                  >
                    PLAY
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* AI Mode */}
            <Card className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-2 border-cyan-400 hover:border-cyan-300 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <Bot className="w-12 h-12 text-cyan-400" />
                    <div>
                      <h3 className="text-2xl font-bold text-cyan-400 font-mono">VS AI</h3>
                      <p className="text-cyan-300 font-mono text-sm">Battle against the machine</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <Button
                    onClick={() => onModeSelect('ai', 'easy')}
                    className="bg-green-500 hover:bg-green-400 text-white font-mono py-4 border-2 border-green-400 hover:border-green-300 transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="text-center">
                      <Star className="w-6 h-6 mx-auto mb-1" />
                      <div>EASY</div>
                    </div>
                  </Button>
                  <Button
                    onClick={() => onModeSelect('ai', 'medium')}
                    className="bg-yellow-500 hover:bg-yellow-400 text-white font-mono py-4 border-2 border-yellow-400 hover:border-yellow-300 transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="text-center">
                      <div className="flex justify-center mb-1">
                        <Star className="w-4 h-4" />
                        <Star className="w-4 h-4" />
                      </div>
                      <div>MEDIUM</div>
                    </div>
                  </Button>
                  <Button
                    onClick={() => onModeSelect('ai', 'hard')}
                    className="bg-red-500 hover:bg-red-400 text-white font-mono py-4 border-2 border-red-400 hover:border-red-300 transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="text-center">
                      <div className="flex justify-center mb-1">
                        <Star className="w-4 h-4" />
                        <Star className="w-4 h-4" />
                        <Star className="w-4 h-4" />
                      </div>
                      <div>HARD</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Decorative Elements */}
            <div className="text-center text-purple-400 font-mono text-sm">
              🎮 Made with love for retro gaming fans 🎮
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
