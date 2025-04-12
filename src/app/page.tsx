"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const initialBoard = Array(9).fill(null);

export default function Home() {
  const [board, setBoard] = useState(initialBoard);
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [winner, setWinner] = useState<string | null>(null);
  const [isDraw, setIsDraw] = useState(false);
  const [gameTime, setGameTime] = useState(0);
  const [gameActive, setGameActive] = useState(true);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (gameActive) {
      intervalId = setInterval(() => {
        setGameTime((prevTime) => prevTime + 1);
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [gameActive]);

  const checkWinner = (board: (string | null)[]) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    return null;
  };

  const checkDraw = (board: (string | null)[]) => {
    return board.every((cell) => cell !== null);
  };

  useEffect(() => {
    if (!gameActive) return;

    const winner = checkWinner(board);
    const draw = checkDraw(board);

    if (winner) {
      setWinner(winner);
      setGameActive(false);
      return;
    }

    if (draw) {
      setIsDraw(true);
      setGameActive(false);
      return;
    }
  }, [board, gameActive]);

  const handleClick = (index: number) => {
    if (board[index] || winner || isDraw) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
  };

  const resetGame = () => {
    setBoard(initialBoard);
    setCurrentPlayer("X");
    setWinner(null);
    setIsDraw(false);
    setGameTime(0);
    setGameActive(true);
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-4 text-primary">Aqua Tac Toe</h1>

      <div className="mb-4">
        Time Elapsed: <span className="font-semibold">{formatTime(gameTime)}</span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {board.map((cell, index) => (
          <button
            key={index}
            className={`w-24 h-24 rounded-lg text-5xl font-bold flex items-center justify-center shadow-md transition-colors duration-300
              ${cell === "X"
                ? "text-cyan-600 bg-cyan-100 hover:bg-cyan-200"
                : cell === "O"
                ? "text-turquoise-600 bg-turquoise-100 hover:bg-turquoise-200"
                : "bg-white hover:bg-teal-50"
              }
            `}
            onClick={() => handleClick(index)}
            disabled={cell || winner || isDraw}
          >
            {cell}
          </button>
        ))}
      </div>

      {winner && (
        <div className="mt-6 text-2xl font-semibold text-primary">
          {winner} wins!
        </div>
      )}

      {isDraw && (
        <div className="mt-6 text-2xl font-semibold text-primary">
          It's a draw!
        </div>
      )}

      <div className="mt-8">
        <span className="mr-2 text-lg">
          Current Player:
        </span>
        <span className={`font-semibold text-lg ${currentPlayer === 'X' ? 'text-cyan-600' : 'text-turquoise-600'}`}>
          {currentPlayer}
        </span>
      </div>

      <Button variant="outline" className="mt-6" onClick={resetGame}>
        Reset Game
      </Button>
    </div>
  );
}

const turquoise = {
  50: '#E0FFFF',
  100: '#B4E4E4',
  200: '#88D4D4',
  300: '#5AC4C4',
  400: '#40B4B4',
  500: '#26A4A4',
  600: '#159494',
  700: '#0A8484',
  800: '#047474',
  900: '#006464',
}
