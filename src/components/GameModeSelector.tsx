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
    <div className="min-h-screen bg-black pixel-bg p-4 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <div className="pixel-card p-8 mb-8">
          <div className="text-center pb-8">
            <h1 className="text-8xl font-bold text-cyan-400 mb-4 pixel-font pixel-glow">
              <Gamepad2 className="inline-block w-20 h-20 text-yellow-400 mr-4" />
              TIC-TAC-TOE
            </h1>
            <p className="text-2xl text-purple-300 pixel-text">
              CHOOSE YOUR BATTLE MODE, PIXEL WARRIOR!
            </p>
          </div>
          
          {/* Local Multiplayer */}
          <div className="pixel-card mb-6 p-6 border-pink-400 hover:border-pink-300 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <Users className="w-16 h-16 text-pink-400" />
                <div>
                  <h3 className="text-4xl font-bold text-pink-400 pixel-font">2 PLAYER</h3>
                  <p className="text-pink-300 pixel-text">LOCAL MULTIPLAYER MODE</p>
                </div>
              </div>
              <button
                onClick={() => onModeSelect('local')}
                className="pixel-button bg-pink-500 hover:bg-pink-400 text-white px-8 py-4 text-xl"
              >
                ► PLAY
              </button>
            </div>
          </div>

          {/* AI Mode */}
          <div className="pixel-card p-6 border-cyan-400 hover:border-cyan-300 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-6">
                <Bot className="w-16 h-16 text-cyan-400" />
                <div>
                  <h3 className="text-4xl font-bold text-cyan-400 pixel-font">VS AI</h3>
                  <p className="text-cyan-300 pixel-text">BATTLE THE MACHINE</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => onModeSelect('ai', 'easy')}
                className="pixel-button bg-green-500 hover:bg-green-400 text-white py-6 text-lg"
              >
                <div className="text-center">
                  <Star className="w-8 h-8 mx-auto mb-2" />
                  <div className="pixel-text">EASY</div>
                </div>
              </button>
              <button
                onClick={() => onModeSelect('ai', 'medium')}
                className="pixel-button bg-yellow-500 hover:bg-yellow-400 text-white py-6 text-lg"
              >
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <Star className="w-6 h-6" />
                    <Star className="w-6 h-6" />
                  </div>
                  <div className="pixel-text">MEDIUM</div>
                </div>
              </button>
              <button
                onClick={() => onModeSelect('ai', 'hard')}
                className="pixel-button bg-red-500 hover:bg-red-400 text-white py-6 text-lg"
              >
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <Star className="w-6 h-6" />
                    <Star className="w-6 h-6" />
                    <Star className="w-6 h-6" />
                  </div>
                  <div className="pixel-text">HARD</div>
                </div>
              </button>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="text-center text-purple-400 pixel-text mt-8">
            🎮 CRAFTED FOR RETRO GAMING LEGENDS 🎮
          </div>
        </div>
      </div>
    </div>
  );
}
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
