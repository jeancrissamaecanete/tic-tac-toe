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
  return (
    <div className="grid grid-cols-3 gap-2 p-4 bg-slate-100 rounded-lg shadow-inner">
      {board.map((cell, index) => (
        <Button
          key={index}
          variant="outline"
          className={cn(
            "aspect-square text-4xl font-bold h-20 w-20 transition-all duration-200 hover:scale-105",
            "bg-white border-2 border-slate-300",
            winningCombination?.includes(index) && "bg-green-100 border-green-500 shadow-lg",
            cell === 'X' && "text-blue-600",
            cell === 'O' && "text-red-600",
            !cell && !disabled && "hover:bg-slate-50"
          )}
          onClick={() => onCellClick(index)}
          disabled={disabled || cell !== null}
        >
          {cell}
        </Button>
      ))}
    </div>
  );
}
