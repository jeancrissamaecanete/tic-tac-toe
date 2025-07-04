'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GameBoard } from '@/components/GameBoard';
import { GameStatus } from '@/components/GameStatus';
import { GameModeSelector } from '@/components/GameModeSelector';
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
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-2xl mx-auto">
        <Card className="mb-6 bg-black/80 border-4 border-cyan-400 shadow-2xl shadow-cyan-400/50">
          <CardHeader className="text-center">
            <CardTitle className="text-5xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent flex items-center justify-center gap-2 font-mono">
              <Gamepad2 className="w-12 h-12 text-cyan-400" />
              TIC-TAC-TOE
              <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
            </CardTitle>
            <CardDescription className="text-xl text-purple-300 font-mono">
              {gameState.gameMode === 'ai' ? 'Battle against the AI!' : 'Challenge your friend!'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {showAlert && (
              <Alert className="border-green-400 bg-green-900/50 border-2">
                <AlertDescription className="text-center font-semibold text-green-300 font-mono">
                  {gameState.winner 
                    ? `🎉 ${gameState.gameMode === 'ai' && gameState.winner === 'O' ? 'AI' : `PLAYER ${gameState.winner}`} WINS!`
                    : '🤝 DRAW GAME! Great battle!'
                  }
                </AlertDescription>
              </Alert>
            )}

            <GameStatus 
              currentPlayer={gameState.currentPlayer}
              winner={gameState.winner}
              isGameOver={gameState.isGameOver}
              gameMode={gameState.gameMode}
              difficulty={gameState.difficulty}
              score={gameState.score}
            />

            <div className="flex justify-center">
              <GameBoard
                board={gameState.board}
                onCellClick={handleCellClick}
                winningCombination={winningCombination}
                disabled={gameState.isGameOver || isAIThinking}
              />
            </div>

            <div className="flex justify-center gap-4">
              <Button
                onClick={resetGame}
                variant="outline"
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white border-2 border-purple-400 hover:border-purple-300 font-mono"
              >
                <RefreshCw className="w-4 h-4" />
                NEW GAME
              </Button>
              <Button
                onClick={resetScore}
                variant="outline"
                className="flex items-center gap-2 bg-pink-600 hover:bg-pink-500 text-white border-2 border-pink-400 hover:border-pink-300 font-mono"
              >
                <RefreshCw className="w-4 h-4" />
                RESET SCORE
              </Button>
              <Button
                onClick={backToMenu}
                variant="outline"
                className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white border-2 border-cyan-400 hover:border-cyan-300 font-mono"
              >
                <Home className="w-4 h-4" />
                MENU
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-2 border-pink-400 text-white">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-2 font-mono text-pink-300">🎮 HOW TO PLAY</h3>
              <p className="text-sm text-pink-200 font-mono">
                Get three X&apos;s or O&apos;s in a row to win! Think fast and play smart! 🚀
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
