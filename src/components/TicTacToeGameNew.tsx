'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GameBoard } from '@/components/GameBoard';
import { GameStatus } from '@/components/GameStatus';
import { GameModeSelector } from '@/components/GameModeSelectorClean';
import { GameState, GameMode, Difficulty } from '@/types/game';
import { 
  createEmptyBoard, 
  checkWinner, 
  isBoardFull, 
  getWinningCombination,
  getNextPlayer,
  getAIMove
} from '@/lib/gameLogic';
import { RefreshCw, Home, Sparkles, Gamepad2 } from 'lucide-react';

const createInitialGameState = (gameMode: GameMode, difficulty: Difficulty = 'medium'): GameState => ({
  board: createEmptyBoard(),
  currentPlayer: 'X',
  winner: null,
  isGameOver: false,
  gameMode,
  difficulty,
  score: {
    X: 0,
    O: 0,
    draws: 0
  }
});

export function TicTacToeGame() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [winningCombination, setWinningCombination] = useState<number[] | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [isAIThinking, setIsAIThinking] = useState(false);

  const playSound = (type: 'win' | 'draw' | 'start') => {
    if (typeof window === 'undefined') return;
    
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      
      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      switch (type) {
        case 'win':
          oscillator.frequency.setValueAtTime(523, audioContext.currentTime);
          oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1);
          oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2);
          oscillator.frequency.setValueAtTime(1047, audioContext.currentTime + 0.3);
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6);
          break;
        case 'draw':
          oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
          oscillator.frequency.setValueAtTime(350, audioContext.currentTime + 0.1);
          oscillator.frequency.setValueAtTime(300, audioContext.currentTime + 0.2);
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
          break;
        case 'start':
          oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
          oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
          break;
      }
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.8);
    } catch (error) {
      console.warn('Audio playback not supported');
    }
  };

  const handleModeSelect = (mode: GameMode, difficulty?: Difficulty) => {
    const newGameState = createInitialGameState(mode, difficulty);
    setGameState(newGameState);
    playSound('start');
  };

  const handleCellClick = (index: number) => {
    if (!gameState || gameState.board[index] || gameState.isGameOver || isAIThinking) return;

    const newBoard = [...gameState.board];
    newBoard[index] = gameState.currentPlayer;

    const winner = checkWinner(newBoard);
    const isFull = isBoardFull(newBoard);
    const isGameOver = winner !== null || isFull;

    const newGameState = {
      ...gameState,
      board: newBoard,
      winner,
      isGameOver,
      currentPlayer: isGameOver ? gameState.currentPlayer : getNextPlayer(gameState.currentPlayer),
      score: {
        ...gameState.score,
        ...(winner === 'X' && { X: gameState.score.X + 1 }),
        ...(winner === 'O' && { O: gameState.score.O + 1 }),
        ...(isGameOver && !winner && { draws: gameState.score.draws + 1 })
      }
    };

    setGameState(newGameState);

    if (winner) {
      setWinningCombination(getWinningCombination(newBoard));
      setShowAlert(true);
      playSound('win');
      setTimeout(() => setShowAlert(false), 3000);
    } else if (isFull) {
      setShowAlert(true);
      playSound('draw');
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  // AI Logic
  useEffect(() => {
    if (!gameState || gameState.gameMode !== 'ai' || gameState.currentPlayer !== 'O' || gameState.isGameOver) {
      return;
    }

    setIsAIThinking(true);
    const aiDelay = gameState.difficulty === 'easy' ? 500 : gameState.difficulty === 'medium' ? 1000 : 1500;
    
    const timeoutId = setTimeout(() => {
      const aiMove = getAIMove(gameState.board, gameState.difficulty);
      if (aiMove !== -1) {
        handleCellClick(aiMove);
      }
      setIsAIThinking(false);
    }, aiDelay);

    return () => clearTimeout(timeoutId);
  }, [gameState?.currentPlayer, gameState?.board, gameState?.gameMode]);

  const resetGame = () => {
    if (!gameState) return;
    
    const newGameState = {
      ...gameState,
      board: createEmptyBoard(),
      currentPlayer: 'X' as const,
      winner: null,
      isGameOver: false
    };
    
    setGameState(newGameState);
    setWinningCombination(null);
    setShowAlert(false);
    setIsAIThinking(false);
  };

  const resetScore = () => {
    if (!gameState) return;
    
    const newGameState = createInitialGameState(gameState.gameMode, gameState.difficulty);
    setGameState(newGameState);
    setWinningCombination(null);
    setShowAlert(false);
    setIsAIThinking(false);
  };

  const backToMenu = () => {
    setGameState(null);
    setWinningCombination(null);
    setShowAlert(false);
    setIsAIThinking(false);
  };

  if (!gameState) {
    return <GameModeSelector onModeSelect={handleModeSelect} />;
  }

  return (
    <div className="modern-container">
      <div className="text-center pb-8 pt-8">
        <h1 className="modern-title">
          TIC-TAC-TOE
        </h1>
        <p className="modern-subtitle">
          {gameState.gameMode === 'ai' ? 'Playing Against AI' : 'Local Multiplayer Mode'}
        </p>
      </div>
      <div className="space-y-6">
        {showAlert && (
          <Alert className="modern-alert mb-6">
            <AlertDescription className="text-center font-semibold">
              {gameState.winner 
                ? `${gameState.gameMode === 'ai' && gameState.winner === 'O' ? 'AI' : `Player ${gameState.winner}`} Wins!`
                : 'Draw Game!'
              }
            </AlertDescription>
          </Alert>
        )}

        <GameStatus 
          currentPlayer={gameState.currentPlayer}
          winner={gameState.winner}
          gameMode={gameState.gameMode}
        />

        <div className="flex justify-center">
          <GameBoard
            board={gameState.board}
                onCellClick={handleCellClick}
                winningCombination={winningCombination}
                disabled={gameState.isGameOver || isAIThinking}
              />
            </div>

            <div className="modern-button-container">
              <button
                onClick={resetGame}
                className="modern-button primary"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                New Game
              </button>
              <button
                onClick={resetScore}
                className="modern-button secondary"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Reset Score
              </button>
              <Button
                onClick={backToMenu}
                variant="outline"
                className="modern-button"
              >
                <Home className="w-4 h-4 mr-2" />
                Change Mode
              </Button>
            </div>
          </div>
        </div>

        <div className="modern-instructions">
          <h3 className="modern-section-title">How to Play</h3>
          <p className="modern-text">
            Get three X's or O's in a row to win!
            {gameState.gameMode === 'ai' && ' You are X, AI is O!'}
          </p>
        </div>
      </div>
    </div>
  );
}
