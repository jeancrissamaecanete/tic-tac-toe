"use client";

import { useState, useEffect, useCallback } from "react";
import { Player, GameMode, GameState } from "@/types/game";

// Confetti Component
interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
}

const Confetti: React.FC<{ winner: Player; onComplete: () => void }> = ({ winner, onComplete }) => {
  const [particles, setParticles] = useState<ConfettiParticle[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined' || !winner || winner === 'draw') return;

    const colors = winner === "X" ? ["#93c5fd", "#bfdbfe", "#dbeafe"] : ["#fca5a5", "#fecaca", "#fee2e2"];
    const newParticles: ConfettiParticle[] = [];

    // Safe window width access
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 800;

    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * windowWidth,
        y: -10,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 6 + 4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 6,
      });
    }

    setParticles(newParticles);

    const interval = setInterval(() => {
      setParticles((prev) =>
        prev.map((particle) => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          rotation: particle.rotation + particle.rotationSpeed,
        }))
      );
    }, 16);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      setParticles([]);
      onComplete();
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [winner, onComplete]);

  if (typeof window === 'undefined') return null;

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1000 }}>
      {particles.map((particle) => (
        <div
          key={particle.id}
          style={{
            position: "absolute",
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            borderRadius: "50%",
            transform: `rotate(${particle.rotation}deg)`,
            opacity: particle.y < (typeof window !== 'undefined' ? window.innerHeight : 600) ? 1 : 0,
          }}
        />
      ))}
    </div>
  );
};

// Game Logic Functions
const checkWinner = (board: Player[]): Player => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
  ];
  
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
};

const isBoardFull = (board: Player[]): boolean => {
  return board.every(cell => cell !== null);
};

const getWinningCombination = (board: Player[]): number[] | null => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
  ];
  
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return lines[i];
    }
  }
  return null;
};

// Sound Effects
const playSound = (type: 'move' | 'win' | 'draw' | 'button') => {
  if (typeof window === 'undefined') return;
  
  try {
    if (typeof window === 'undefined') return;
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
    const audioContext = new AudioContextClass();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Set sound parameters based on type
    switch (type) {
      case 'move':
        // Pleasant click sound
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
        break;
        
      case 'win':
        // Victory fanfare
        const frequencies = [523, 659, 784, 1047]; // C, E, G, C
        frequencies.forEach((freq, index) => {
          const osc = audioContext.createOscillator();
          const gain = audioContext.createGain();
          osc.connect(gain);
          gain.connect(audioContext.destination);
          
          osc.frequency.setValueAtTime(freq, audioContext.currentTime + index * 0.15);
          gain.gain.setValueAtTime(0.1, audioContext.currentTime + index * 0.15);
          gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + index * 0.15 + 0.3);
          
          osc.start(audioContext.currentTime + index * 0.15);
          osc.stop(audioContext.currentTime + index * 0.15 + 0.3);
        });
        break;
        
      case 'draw':
        // Neutral sound
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.3);
        gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.3);
        break;
        
      case 'button':
        // Soft button click
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.05);
        gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.05);
        break;
    }
  } catch {
    // Silently fail if audio context is not available
  }
};

const getComputerMove = (board: Player[]): number => {
  // Simple AI: try to win, block player, or take center/corner
  const availableMoves = board.map((cell, index) => cell === null ? index : null)
                             .filter(val => val !== null) as number[];
  
  if (availableMoves.length === 0) return -1;
  
  // Try to win
  for (const move of availableMoves) {
    const testBoard = [...board];
    testBoard[move] = 'O';
    if (checkWinner(testBoard) === 'O') {
      return move;
    }
  }
  
  // Try to block player
  for (const move of availableMoves) {
    const testBoard = [...board];
    testBoard[move] = 'X';
    if (checkWinner(testBoard) === 'X') {
      return move;
    }
  }
  
  // Take center if available
  if (availableMoves.includes(4)) {
    return 4;
  }
  
  // Take corners
  const corners = [0, 2, 6, 8];
  const availableCorners = corners.filter(corner => availableMoves.includes(corner));
  if (availableCorners.length > 0) {
    return availableCorners[Math.floor(Math.random() * availableCorners.length)];
  }
  
  // Take any available move
  return availableMoves[Math.floor(Math.random() * availableMoves.length)] || -1;
};

export default function Home() {
  const [gameState, setGameState] = useState<GameState>({
    board: Array(9).fill(null),
    currentPlayer: "X",
    winner: null,
    isGameOver: false,
    gameMode: "local",
    score: { X: 0, O: 0, draws: 0 },
    winningCombination: null,
  });
  const [gameMode, setGameMode] = useState<GameMode>("local");
  const [gameStarted, setGameStarted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleCellClick = (index: number) => {
    if (gameState.board[index] || gameState.winner) return;

    // Play move sound
    playSound('move');

    setGameState(prevState => {
      const newBoard = [...prevState.board];
      newBoard[index] = prevState.currentPlayer;

      const winner = checkWinner(newBoard);
      const winningCombination = getWinningCombination(newBoard);
      const isDraw = !winner && isBoardFull(newBoard);

      const newScore = { ...prevState.score };
      if (winner && winner !== "draw") {
        newScore[winner]++;
        setShowConfetti(true);
        // Play win sound
        setTimeout(() => playSound('win'), 100);
      } else if (isDraw) {
        newScore.draws++;
        // Play draw sound
        setTimeout(() => playSound('draw'), 100);
      }

      return {
        ...prevState,
        board: newBoard,
        currentPlayer: prevState.currentPlayer === "X" ? "O" : "X",
        winner: winner || (isDraw ? "draw" : null),
        isGameOver: winner !== null || isDraw,
        score: newScore,
        winningCombination,
      };
    });
  };

  const handleComputerMove = useCallback(() => {
    if (gameState.currentPlayer === "O" && gameMode === "ai" && !gameState.winner) {
      const computerMove = getComputerMove(gameState.board);
      if (computerMove !== -1) {
        setTimeout(() => {
          // Play computer move sound
          playSound('move');
          
          setGameState(prevState => {
            const newBoard = [...prevState.board];
            newBoard[computerMove] = "O";

            const winner = checkWinner(newBoard);
            const winningCombination = getWinningCombination(newBoard);
            const isDraw = !winner && isBoardFull(newBoard);

            const newScore = { ...prevState.score };
            if (winner && winner !== "draw") {
              newScore[winner]++;
              setShowConfetti(true);
              // Play win sound
              setTimeout(() => playSound('win'), 100);
            } else if (isDraw) {
              newScore.draws++;
              // Play draw sound
              setTimeout(() => playSound('draw'), 100);
            }

            return {
              ...prevState,
              board: newBoard,
              currentPlayer: "X",
              winner: winner || (isDraw ? "draw" : null),
              isGameOver: winner !== null || isDraw,
              score: newScore,
              winningCombination,
            };
          });
        }, 500);
      }
    }
  }, [gameState.currentPlayer, gameState.board, gameState.winner, gameMode]);

  useEffect(() => {
    handleComputerMove();
  }, [handleComputerMove]); // Simplified dependencies

  const resetGame = () => {
    playSound('button');
    setGameState(prevState => ({
      ...prevState,
      board: Array(9).fill(null),
      currentPlayer: "X",
      winner: null,
      isGameOver: false,
      winningCombination: null,
    }));
    setShowConfetti(false);
  };

  const resetScore = () => {
    playSound('button');
    setGameState(prevState => ({
      ...prevState,
      score: { X: 0, O: 0, draws: 0 },
    }));
  };

  const selectGameMode = (mode: GameMode) => {
    playSound('button');
    setGameMode(mode);
    setGameStarted(true);
    setGameState({
      board: Array(9).fill(null),
      currentPlayer: "X",
      winner: null,
      isGameOver: false,
      gameMode: mode,
      score: { X: 0, O: 0, draws: 0 },
      winningCombination: null,
    });
  };

  const goBack = () => {
    playSound('button');
    setGameStarted(false);
    setShowConfetti(false);
  };

  // Game Mode Selection Screen
  if (!gameStarted) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        background: "linear-gradient(135deg, #dbeafe 0%, #e9d5ff 100%)", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        fontFamily: "system-ui, -apple-system, sans-serif"
      }}>
        <div style={{
          backgroundColor: "white",
          borderRadius: "1.5rem",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          padding: "3rem",
          maxWidth: "32rem",
          width: "100%",
          textAlign: "center"
        }}>
          <h1 style={{ 
            fontSize: "3rem", 
            fontWeight: "bold", 
            color: "#1f2937",
            marginBottom: "1rem",
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>
            🎮 TIC-TAC-TOE
          </h1>
          
          <p style={{ 
            fontSize: "1.25rem", 
            color: "#4b5563",
            marginBottom: "3rem"
          }}>
            Choose Your Game Mode
          </p>
          
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem"
          }}>
            <button
              onClick={() => selectGameMode("local")}
              style={{
                background: "linear-gradient(135deg, #dbeafe, #bfdbfe)",
                padding: "2rem",
                borderRadius: "1rem",
                border: "2px solid #e5e7eb",
                cursor: "pointer",
                transition: "all 0.3s ease",
                fontSize: "1.125rem",
                fontWeight: "600"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 20px 40px -10px rgba(0, 0, 0, 0.2)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 10px 25px -5px rgba(0, 0, 0, 0.1)";
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>👥</div>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#1f2937", marginBottom: "0.5rem" }}>
                Local 2-Player
              </div>
              <div style={{ color: "#4b5563" }}>
                Play with a friend on the same device
              </div>
            </button>
            
            <button
              onClick={() => selectGameMode("ai")}
              style={{
                background: "linear-gradient(135deg, #f3e8ff, #e9d5ff)",
                padding: "2rem",
                borderRadius: "1rem",
                border: "2px solid #e5e7eb",
                cursor: "pointer",
                transition: "all 0.3s ease",
                fontSize: "1.125rem",
                fontWeight: "600"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 20px 40px -10px rgba(0, 0, 0, 0.2)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 10px 25px -5px rgba(0, 0, 0, 0.1)";
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🤖</div>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#1f2937", marginBottom: "0.5rem" }}>
                VS Computer
              </div>
              <div style={{ color: "#4b5563" }}>
                Challenge the AI with smart moves
              </div>
            </button>
          </div>
          
          <div style={{
            marginTop: "2rem",
            paddingTop: "2rem",
            borderTop: "1px solid #e5e7eb"
          }}>
            <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
              Built with React 19, Next.js 15, Tailwind CSS, and shadcn/ui
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Game Screen
  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "linear-gradient(135deg, #dbeafe 0%, #e9d5ff 100%)", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      fontFamily: "system-ui, -apple-system, sans-serif",
      padding: "2rem"
    }}>
      <div style={{
        backgroundColor: "white",
        borderRadius: "1.5rem",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        padding: "3rem",
        maxWidth: "40rem",
        width: "100%"
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", marginBottom: "2rem" }}>
          <button
            onClick={goBack}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#6b7280",
              color: "white",
              border: "none",
              borderRadius: "0.5rem",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "500",
              transition: "all 0.2s"
            }}
            onMouseOver={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = "#4b5563";
            }}
            onMouseOut={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = "#6b7280";
            }}
          >
            ← Back
          </button>
          <h1 style={{ 
            fontSize: "2.5rem", 
            fontWeight: "bold", 
            color: "#1f2937",
            margin: 0,
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>
            🎮 TIC-TAC-TOE
          </h1>
        </div>

        {/* Game Status */}
        <div style={{ marginBottom: "2rem", textAlign: "center" }}>
          {gameState.winner && gameState.winner !== "draw" ? (
            <div style={{ 
              fontSize: "1.5rem", 
              fontWeight: "bold", 
              color: gameState.winner === "X" ? "#60a5fa" : "#f87171",
              marginBottom: "1rem",
              padding: "1.5rem 2rem",
              backgroundColor: gameState.winner === "X" ? "#eff6ff" : "#fef2f2",
              border: `2px solid ${gameState.winner === "X" ? "#93c5fd" : "#fca5a5"}`,
              borderRadius: "1rem",
              boxShadow: `0 10px 25px -5px ${gameState.winner === "X" ? "rgba(147, 197, 253, 0.3)" : "rgba(252, 165, 165, 0.3)"}`,
            }}>
              🎉 Player {gameState.winner} Wins!
            </div>
          ) : gameState.winner === "draw" ? (
            <div style={{ 
              fontSize: "1.5rem", 
              fontWeight: "bold", 
              color: "#f59e0b",
              marginBottom: "1rem",
              padding: "1.5rem 2rem",
              backgroundColor: "#fffbeb",
              border: "2px solid #fbbf24",
              borderRadius: "1rem",
              boxShadow: "0 10px 25px -5px rgba(251, 191, 36, 0.3)",
            }}>
              🤝 It&apos;s a Draw!
            </div>
          ) : (
            <div style={{ 
              fontSize: "1.25rem", 
              color: "#64748b", 
              marginBottom: "1rem",
              padding: "1rem 2rem",
              backgroundColor: "#f8fafc",
              border: "2px solid #e2e8f0",
              borderRadius: "1rem",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}>
              {gameMode === "ai" && gameState.currentPlayer === "O" ? (
                <span>🤖 Computer is thinking...</span>
              ) : (
                <>Current Player: <span style={{ fontWeight: "bold", color: gameState.currentPlayer === "X" ? "#60a5fa" : "#f87171" }}>{gameState.currentPlayer}</span></>
              )}
            </div>
          )}
          
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginBottom: "1.5rem" }}>
            <div style={{ 
              padding: "0.75rem 1.5rem", 
              backgroundColor: "#dbeafe", 
              borderRadius: "1rem", 
              fontWeight: "600", 
              border: "2px solid #93c5fd",
              boxShadow: "0 4px 6px -1px rgba(147, 197, 253, 0.2)"
            }}>
              Player X: {gameState.score.X}
            </div>
            <div style={{ 
              padding: "0.75rem 1.5rem", 
              backgroundColor: "#fee2e2", 
              borderRadius: "1rem", 
              fontWeight: "600", 
              border: "2px solid #fca5a5",
              boxShadow: "0 4px 6px -1px rgba(252, 165, 165, 0.2)"
            }}>
              Player O: {gameState.score.O}
            </div>
          </div>
          
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <button
              onClick={resetGame}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "#10b981",
                color: "white",
                border: "none",
                borderRadius: "0.75rem",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "1rem",
                boxShadow: "0 4px 6px -1px rgba(16, 185, 129, 0.3)",
                transition: "all 0.2s"
              }}
              onMouseOver={(e) => {
                (e.target as HTMLButtonElement).style.backgroundColor = "#059669";
                (e.target as HTMLButtonElement).style.transform = "translateY(-2px)";
                (e.target as HTMLButtonElement).style.boxShadow = "0 8px 15px -3px rgba(16, 185, 129, 0.4)";
              }}
              onMouseOut={(e) => {
                (e.target as HTMLButtonElement).style.backgroundColor = "#10b981";
                (e.target as HTMLButtonElement).style.transform = "translateY(0)";
                (e.target as HTMLButtonElement).style.boxShadow = "0 4px 6px -1px rgba(16, 185, 129, 0.3)";
              }}
            >
              🔄 New Game
            </button>
            <button
              onClick={resetScore}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "0.75rem",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "1rem",
                boxShadow: "0 4px 6px -1px rgba(239, 68, 68, 0.3)",
                transition: "all 0.2s"
              }}
              onMouseOver={(e) => {
                (e.target as HTMLButtonElement).style.backgroundColor = "#dc2626";
                (e.target as HTMLButtonElement).style.transform = "translateY(-2px)";
                (e.target as HTMLButtonElement).style.boxShadow = "0 8px 15px -3px rgba(239, 68, 68, 0.4)";
              }}
              onMouseOut={(e) => {
                (e.target as HTMLButtonElement).style.backgroundColor = "#ef4444";
                (e.target as HTMLButtonElement).style.transform = "translateY(0)";
                (e.target as HTMLButtonElement).style.boxShadow = "0 4px 6px -1px rgba(239, 68, 68, 0.3)";
              }}
            >
              🗑️ Reset Score
            </button>
          </div>
        </div>

        {/* Game Board */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "0.75rem",
          maxWidth: "320px",
          margin: "0 auto 2rem auto",
        }}>
          {gameState.board.map((cell, index) => {
            const isWinningCell = gameState.winningCombination?.includes(index);
            const isWinnerX = gameState.winner === "X";
            
            return (
              <button
                key={index}
                onClick={() => handleCellClick(index)}
                style={{
                  width: "100px",
                  height: "100px",
                  backgroundColor: isWinningCell ? (isWinnerX ? "#eff6ff" : "#fef2f2") : "#ffffff",
                  border: isWinningCell 
                    ? `4px solid ${isWinnerX ? "#3b82f6" : "#ef4444"}` 
                    : cell === "X" 
                      ? "3px solid #93c5fd" 
                      : cell === "O" 
                        ? "3px solid #fca5a5" 
                        : "3px solid #e5e7eb",
                  borderRadius: "1rem",
                  fontSize: "2.5rem",
                  fontWeight: "bold",
                  cursor: gameState.winner ? "default" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: isWinningCell 
                    ? (isWinnerX ? "#1d4ed8" : "#dc2626")
                    : cell === "X" 
                      ? "#60a5fa" 
                      : "#f87171",
                  transition: "all 0.3s",
                  boxShadow: isWinningCell 
                    ? `0 10px 25px -5px ${isWinnerX ? "rgba(59, 130, 246, 0.4)" : "rgba(239, 68, 68, 0.4)"}` 
                    : cell === "X" 
                      ? "0 4px 12px rgba(147, 197, 253, 0.25)" 
                      : cell === "O" 
                        ? "0 4px 12px rgba(252, 165, 165, 0.25)" 
                        : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  transform: isWinningCell ? "scale(1.05)" : "scale(1)",
                }}
                onMouseOver={(e) => {
                  if (!cell && !gameState.winner) {
                    (e.target as HTMLButtonElement).style.backgroundColor = "#f8fafc";
                    (e.target as HTMLButtonElement).style.transform = "scale(1.05)";
                    (e.target as HTMLButtonElement).style.borderColor = gameState.currentPlayer === "X" ? "#93c5fd" : "#fca5a5";
                  }
                }}
                onMouseOut={(e) => {
                  if (!cell && !gameState.winner) {
                    (e.target as HTMLButtonElement).style.backgroundColor = "#ffffff";
                    (e.target as HTMLButtonElement).style.transform = "scale(1)";
                    (e.target as HTMLButtonElement).style.borderColor = "#e5e7eb";
                  }
                }}
              >
                {cell}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{
          textAlign: "center",
          paddingTop: "2rem",
          borderTop: "1px solid #e5e7eb"
        }}>
          <p style={{
            color: "#6b7280",
            fontSize: "0.875rem",
            margin: 0
          }}>
            Built with React 19, Next.js 15, Tailwind CSS, and shadcn/ui
          </p>
        </div>

        {/* Confetti */}
        {showConfetti && gameState.winner && gameState.winner !== "draw" && (
          <Confetti
            winner={gameState.winner}
            onComplete={() => setShowConfetti(false)}
          />
        )}
      </div>
    </div>
  );
}
