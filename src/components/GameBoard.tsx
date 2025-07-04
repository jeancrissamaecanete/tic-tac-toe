'use client';

import { Button } from '@/components/ui/button';
import { Player } from '@/types/game';
import { cn } from '@/lib/utils';

interface GameBoardProps {
  board: Player[];
  onCellClick: (index: number) => void;
  winningCombination: number[] | null;
  disabled: boolean;
}

export function GameBoard({ board, onCellClick, winningCombination, disabled }: GameBoardProps) {
  const getCellContent = (cell: Player) => {
    if (cell === 'X') {
      return '✖';
    } else if (cell === 'O') {
      return '⭕';
    }
    return '';
  };

  const playSound = (type: 'click' | 'win' | 'draw') => {
    // Create simple 8-bit sound effects using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    switch (type) {
      case 'click':
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        break;
      case 'win':
        oscillator.frequency.setValueAtTime(523, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime + 0.3);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
        break;
      case 'draw':
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(350, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(300, audioContext.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        break;
    }
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const handleCellClick = (index: number) => {
    if (!disabled && !board[index]) {
      playSound('click');
      onCellClick(index);
    }
  };

  return (
    <div className="relative">
      {/* Retro Grid Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-lg"></div>
      
      {/* Game Grid */}
      <div className="relative grid grid-cols-3 gap-2 p-4 bg-black/60 rounded-lg border-4 border-cyan-400 shadow-2xl shadow-cyan-400/50">
        {board.map((cell, index) => (
          <Button
            key={index}
            variant="outline"
            className={cn(
              "aspect-square text-6xl font-bold h-24 w-24 transition-all duration-300 transform hover:scale-105 font-mono",
              "bg-gradient-to-br from-gray-800 to-gray-900 border-4 border-purple-400 hover:border-cyan-400",
              "shadow-lg shadow-purple-400/50 hover:shadow-cyan-400/50",
              winningCombination?.includes(index) && "bg-gradient-to-br from-green-400 to-emerald-500 border-green-300 shadow-green-400/50 animate-pulse",
              cell === 'X' && "text-pink-400 shadow-pink-400/50",
              cell === 'O' && "text-cyan-400 shadow-cyan-400/50",
              !cell && !disabled && "hover:bg-gradient-to-br hover:from-purple-600 hover:to-blue-600"
            )}
            onClick={() => handleCellClick(index)}
            disabled={disabled || cell !== null}
          >
            <span className="drop-shadow-2xl pixel-text">
              {getCellContent(cell)}
            </span>
          </Button>
        ))}
      </div>
      
      {/* Animated Border Effect */}
      <div className="absolute inset-0 rounded-lg border-2 border-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 opacity-30 animate-pulse pointer-events-none"></div>
    </div>
  );
}
