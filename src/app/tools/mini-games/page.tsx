
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type SquareValue = 'X' | 'O' | null;

function Square({ value, onSquareClick }: { value: SquareValue; onSquareClick: () => void }) {
  return (
    <button className="h-24 w-24 border-2 border-primary m-1 text-5xl font-bold flex items-center justify-center" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function calculateWinner(squares: SquareValue[]) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default function MiniGamesPage() {
  const [squares, setSquares] = React.useState<SquareValue[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = React.useState(true);
  
  function handleClick(i: number) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else if (squares.every(Boolean)) {
    status = 'Draw!';
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  const handleReset = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Mini Game: Tic-Tac-Toe</CardTitle>
        <CardDescription>A simple, classic game to pass the time.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <div className="text-xl font-semibold">{status}</div>
        <div className="grid grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <Square key={i} value={squares[i]} onSquareClick={() => handleClick(i)} />
          ))}
        </div>
        <Button onClick={handleReset} variant="outline">Reset Game</Button>
      </CardContent>
    </Card>
  );
}
