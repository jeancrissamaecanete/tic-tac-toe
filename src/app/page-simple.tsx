"use client";

import { useState } from "react";

type Player = 'X' | 'O' | null;

export default function Home() {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [winner, setWinner] = useState<Player | 'draw' | null>(null);

  const checkWinner = (board: Player[]): Player | 'draw' | null => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (const [a, b, c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    if (board.every(cell => cell !== null)) {
      return 'draw';
    }

    return null;
  };

  const handleCellClick = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const newWinner = checkWinner(newBoard);
    if (newWinner) {
      setWinner(newWinner);
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
  };

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
        width: "100%",
        textAlign: "center"
      }}>
        <h1 style={{ 
          fontSize: "3rem", 
          fontWeight: "bold", 
          color: "#1f2937",
          marginBottom: "2rem",
          background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text"
        }}>
          🎮 TIC-TAC-TOE
        </h1>
        
        {winner ? (
          <div style={{ 
            fontSize: "1.5rem", 
            fontWeight: "bold", 
            color: winner === 'draw' ? "#f59e0b" : winner === 'X' ? "#3b82f6" : "#ef4444",
            marginBottom: "2rem",
            padding: "1rem 2rem",
            backgroundColor: winner === 'draw' ? "#fffbeb" : winner === 'X' ? "#eff6ff" : "#fef2f2",
            border: `2px solid ${winner === 'draw' ? "#f59e0b" : winner === 'X' ? "#3b82f6" : "#ef4444"}`,
            borderRadius: "1rem",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
          }}>
            {winner === 'draw' ? "🤝 It's a Draw!" : `🎉 Player ${winner} Wins!`}
          </div>
        ) : (
          <div style={{ 
            fontSize: "1.25rem", 
            color: "#64748b", 
            marginBottom: "2rem",
            padding: "1rem 2rem",
            backgroundColor: "#f8fafc",
            border: "2px solid #e2e8f0",
            borderRadius: "1rem",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
          }}>
            Current Player: <span style={{ fontWeight: "bold", color: currentPlayer === "X" ? "#3b82f6" : "#ef4444" }}>{currentPlayer}</span>
          </div>
        )}

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "0.75rem",
          maxWidth: "320px",
          margin: "0 auto 2rem auto"
        }}>
          {board.map((cell, index) => (
            <button
              key={index}
              onClick={() => handleCellClick(index)}
              style={{
                width: "100px",
                height: "100px",
                backgroundColor: "#ffffff",
                border: cell === "X" ? "3px solid #93c5fd" : cell === "O" ? "3px solid #fca5a5" : "3px solid #e5e7eb",
                borderRadius: "1rem",
                fontSize: "2.5rem",
                fontWeight: "bold",
                color: cell === "X" ? "#3b82f6" : "#ef4444",
                cursor: cell || winner ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
              disabled={!!cell || !!winner}
            >
              {cell}
            </button>
          ))}
        </div>

        <button
          onClick={resetGame}
          style={{
            backgroundColor: "#3b82f6",
            color: "white",
            padding: "1rem 2rem",
            border: "none",
            borderRadius: "1rem",
            fontSize: "1rem",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: "0 4px 6px -1px rgba(59, 130, 246, 0.3)"
          }}
        >
          🔄 New Game
        </button>

        <div style={{
          marginTop: "2rem",
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
      </div>
    </div>
  );
}
