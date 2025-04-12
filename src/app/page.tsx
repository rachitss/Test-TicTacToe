"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const initialBoard = Array(9).fill(null);

export default function Home() {
  const [board, setBoard] = useState(initialBoard);
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [winner, setWinner] = useState<string | null>(null);
  const [isDraw, setIsDraw] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameTime, setGameTime] = useState(0);
  const [gameActive, setGameActive] = useState(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (gameActive && gameStarted) {
      intervalId = setInterval(() => {
        setGameTime((prevTime) => prevTime + 1);
      }, 1000);
    }

    if (!gameStarted) {
      setGameTime(0);
    }

    return () => clearInterval(intervalId);
  }, [gameActive, gameStarted]);

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
        return { winner: board[a], line: lines[i] };
      }
    }

    return null;
  };

  const checkDraw = (board: (string | null)[]) => {
    return board.every((cell) => cell !== null);
  };

  useEffect(() => {
    if (!gameActive || !gameStarted) return;

    const result = checkWinner(board);
    const draw = checkDraw(board);

    if (result) {
      setWinner(result.winner);
      setWinningLine(result.line);
      setGameActive(false)
      return
    }

    if (draw) {
      setIsDraw(true);
      setGameActive(false);
      return;
    }
  }, [board, gameActive]);

  const handleClick = (index: number) => {
    if (!gameStarted || !gameActive || board[index] || winner || isDraw) return;

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
    setGameActive(false);
    setGameStarted(false);
    setWinningLine(null);
  };

  const [winningLine, setWinningLine] = useState<number[] | null>(null);

  const surrenderGame = () => {
    if (!gameStarted || !gameActive) return;
    const otherPlayer = currentPlayer === "X" ? "O" : "X";
    setWinner(otherPlayer);
    setGameActive(false);
  };

  const getCellStyle = (index: number) => {
    let baseStyle = "w-24 h-24 rounded-lg text-5xl font-bold flex items-center justify-center shadow-md transition-colors duration-300 text-black bg-sky-100 hover:bg-sky-200";
    if (winningLine && winningLine.includes(index)) {
      baseStyle += winner === "X" ? " bg-red-300" : " bg-green-300";
    } else {
      baseStyle += " hover:bg-sky-200";
    }
    return baseStyle;
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString()
      .toString()
      .padStart(2, "0")}`;
  };

  return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-6xl font-bold mb-4 text-blue-600 text-center text-stroke-black-4">Blue XO</h1>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {board.map((cell, index) => (
              <button
                  key={index}
                  data-index={index}
                  style={{
                    backgroundColor: winningLine?.includes(index)
                        ? winner === "X"
                            ? "#fca5a5"
                            : "#bbf7d0"
                        : "",
                  }}
                  className={getCellStyle(index)}
                  onClick={() => handleClick(index)}
                  disabled={!gameStarted || cell || winner || isDraw}
              >
                {cell}
              </button>
          ))}
        </div>
        {winner && (
            <div className="mt-6 text-2xl font-semibold text-blue-900">
              {winner} wins
            </div>
        )}

        {isDraw && (
            <div className="mt-6 text-2xl font-semibold text-blue-900">
              It's a draw!
            </div>
        )}

        <div className="mb-4 mt-6">
          Time Elapsed: <span className="font-semibold">{formatTime(gameTime)}</span>
        </div>

        {gameStarted && !winner && !isDraw && (
            <div className="mt-8">
          <span className="mr-2 text-lg">Current Player:</span>
              <span
                  className={`font-semibold text-lg ${currentPlayer === "X" ? "text-cyan-600" : "text-turquoise-600"}`}
              >
            {currentPlayer}
          </span>
            </div>
        )}

        {!gameStarted ? (
            <Button
                variant="outline"
                className="mt-6"
                onClick={() => {
                  setGameStarted(true);
                  setGameActive(true);
                }}
            >
              Start Game
            </Button>
        ) : (
            <div className="flex mt-6 space-x-4">
              <Button variant="outline" onClick={resetGame}>
                Reset Game
              </Button>
              <Button variant="outline" onClick={surrenderGame}>
                Surrender
              </Button>
            </div>
        )}
      </div>
  );
}
