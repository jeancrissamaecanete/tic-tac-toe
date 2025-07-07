'use client';

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
      return 'X';
    } else if (cell === 'O') {
      return 'O';
    }
    return '';
  };

  const playSound = (type: 'click' | 'win' | 'draw') => {
    try {
      // Create simple 8-bit sound effects using Web Audio API
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContextClass();
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
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
          break;
      }
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch {
      // Fallback if Web Audio API is not available
      // Audio not available in this environment
    }
  };

  const handleCellClick = (index: number) => {
    if (!disabled && !board[index]) {
      playSound('click');
      onCellClick(index);
    }
  };

  return (
    <div className="relative">
      {/* Game Grid */}
      <div className="grid grid-cols-3 gap-2 w-80 h-80 bg-gradient-to-br from-gray-200 to-gray-300 p-4 rounded-2xl shadow-inner">
        {board.map((cell, index) => (
          <button
            key={index}
            className={cn(
              "relative flex items-center justify-center text-4xl font-bold rounded-xl transition-all duration-300 transform hover:scale-105",
              "bg-white shadow-lg hover:shadow-xl",
              "border-2 border-gray-200 hover:border-gray-300",
              {
                "bg-gradient-to-br from-blue-100 to-blue-200 border-blue-300 text-blue-600": cell === 'X',
                "bg-gradient-to-br from-red-100 to-red-200 border-red-300 text-red-600": cell === 'O',
                "bg-gradient-to-br from-green-200 to-green-300 border-green-400 shadow-2xl animate-pulse": winningCombination?.includes(index),
                "opacity-50 cursor-not-allowed": disabled && !cell,
                "hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100": !cell && !disabled,
              }
            )}
            onClick={() => handleCellClick(index)}
            disabled={disabled || cell !== null}
          >
            <span className={cn(
              "transition-all duration-300",
              {
                "animate-bounce": cell && winningCombination?.includes(index),
                "scale-110": cell
              }
            )}>
              {getCellContent(cell)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
