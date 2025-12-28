"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RotateCcw } from "lucide-react";

type Board = number[][];
type Direction = "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight";

const BOARD_SIZE = 4;

const tileVariants: Record<number, string> = {
  0: "bg-zinc-900/60 text-transparent",
  2: "bg-zinc-800 text-zinc-200",
  4: "bg-zinc-700 text-zinc-100",
  8: "bg-amber-500 text-white",
  16: "bg-orange-500 text-white",
  32: "bg-orange-600 text-white",
  64: "bg-orange-700 text-white",
  128: "bg-amber-400 text-[#050816]",
  256: "bg-yellow-400 text-[#050816]",
  512: "bg-lime-400 text-[#050816]",
  1024: "bg-emerald-400 text-[#050816]",
  2048: "bg-emerald-500 text-white",
};

function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array(BOARD_SIZE).fill(0)
  );
}

function addRandomTile(board: Board) {
  const emptyTiles: Array<{ row: number; col: number }> = [];

  board.forEach((row, rowIndex) => {
    row.forEach((value, colIndex) => {
      if (value === 0) {
        emptyTiles.push({ row: rowIndex, col: colIndex });
      }
    });
  });

  if (emptyTiles.length === 0) return board;

  const randomIndex = Math.floor(Math.random() * emptyTiles.length);
  const { row, col } = emptyTiles[randomIndex];
  const nextBoard = board.map((r) => [...r]);
  nextBoard[row][col] = Math.random() < 0.9 ? 2 : 4;
  return nextBoard;
}

function initializeBoard() {
  let board = createEmptyBoard();
  board = addRandomTile(board);
  board = addRandomTile(board);
  return board;
}

function compressRow(row: number[]) {
  const filtered = row.filter((value) => value !== 0);
  const newRow: number[] = [];
  let scoreGained = 0;

  for (let i = 0; i < filtered.length; i += 1) {
    if (filtered[i] === filtered[i + 1]) {
      const merged = filtered[i] * 2;
      newRow.push(merged);
      scoreGained += merged;
      i += 1;
    } else {
      newRow.push(filtered[i]);
    }
  }

  while (newRow.length < BOARD_SIZE) {
    newRow.push(0);
  }

  return { row: newRow, scoreGained };
}

function arraysEqual(a: number[], b: number[]) {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

function moveLeft(board: Board) {
  let moved = false;
  let scoreGained = 0;

  const newBoard = board.map((row) => {
    const { row: compressed, scoreGained: rowScore } = compressRow(row);
    if (!arraysEqual(row, compressed)) {
      moved = true;
    }
    scoreGained += rowScore;
    return compressed;
  });

  return { board: newBoard, moved, scoreGained };
}

function reverseRows(board: Board) {
  return board.map((row) => [...row].reverse());
}

function transpose(board: Board) {
  return board[0].map((_, colIndex) =>
    board.map((row) => row[colIndex])
  );
}

function move(board: Board, direction: Direction) {
  switch (direction) {
    case "ArrowLeft":
      return moveLeft(board);
    case "ArrowRight": {
      const reversed = reverseRows(board);
      const { board: movedBoard, moved, scoreGained } = moveLeft(reversed);
      return {
        board: reverseRows(movedBoard),
        moved,
        scoreGained,
      };
    }
    case "ArrowUp": {
      const transposed = transpose(board);
      const { board: movedBoard, moved, scoreGained } = moveLeft(transposed);
      return {
        board: transpose(movedBoard),
        moved,
        scoreGained,
      };
    }
    case "ArrowDown": {
      const transposed = transpose(board);
      const reversed = reverseRows(transposed);
      const { board: movedBoard, moved, scoreGained } = moveLeft(reversed);
      return {
        board: transpose(reverseRows(movedBoard)),
        moved,
        scoreGained,
      };
    }
    default:
      return { board, moved: false, scoreGained: 0 };
  }
}

function isGameOver(board: Board) {
  const hasEmpty = board.some((row) => row.some((value) => value === 0));
  if (hasEmpty) return false;

  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      const current = board[row][col];
      if (
        (col < BOARD_SIZE - 1 && current === board[row][col + 1]) ||
        (row < BOARD_SIZE - 1 && current === board[row + 1][col])
      ) {
        return false;
      }
    }
  }
  return true;
}

export default function TwentyFortyEightPage() {
  const router = useRouter();
  const [checkingSession, setCheckingSession] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [board, setBoard] = useState<Board>(() => initializeBoard());
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [status, setStatus] = useState<"playing" | "won" | "lost">("playing");

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("postura_user");
      if (!raw) {
        router.replace("/login");
        return;
      }
      setIsAuthorized(true);
    } finally {
      setCheckingSession(false);
    }
  }, [router]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedBest = window.localStorage.getItem("postura_2048_best");
    if (storedBest) {
      setBestScore(Number(storedBest));
    }
  }, []);

  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      if (typeof window !== "undefined") {
        window.localStorage.setItem("postura_2048_best", String(score));
      }
    }
  }, [score, bestScore]);

  const handleMove = useCallback((direction: Direction) => {
    setBoard((current) => {
      const { board: movedBoard, moved, scoreGained } = move(current, direction);
      if (!moved) return current;

      const withTile = addRandomTile(movedBoard);
      setScore((prev) => prev + scoreGained);
      return withTile;
    });
  }, []);

  const keyListener = useCallback(
    (event: KeyboardEvent) => {
      if (
        event.key === "ArrowUp" ||
        event.key === "ArrowDown" ||
        event.key === "ArrowLeft" ||
        event.key === "ArrowRight"
      ) {
        event.preventDefault();
        if (status === "playing") {
          handleMove(event.key);
        }
      }
    },
    [handleMove, status]
  );

  useEffect(() => {
    window.addEventListener("keydown", keyListener);
    return () => {
      window.removeEventListener("keydown", keyListener);
    };
  }, [keyListener]);

  useEffect(() => {
    const has2048 = board.some((row) => row.includes(2048));
    if (has2048 && status === "playing") {
      setStatus("won");
      return;
    }
    if (status !== "lost" && isGameOver(board)) {
      setStatus("lost");
    }
  }, [board, status]);

  const bestTile = useMemo(
    () => Math.max(...board.flat()),
    [board]
  );

  function resetGame() {
    setBoard(initializeBoard());
    setScore(0);
    setStatus("playing");
  }

  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050816] text-sm text-zinc-400">
        Validando sessão...
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#02030b] via-[#05021a] to-[#04000a] px-4 py-10 text-zinc-100">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <section className="relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-[#0b1024] via-[#07051a] to-[#03020a] p-6 shadow-[0_20px_120px_rgba(89,0,255,0.25)]">
          <div className="absolute -right-8 -top-8 h-48 w-48 rounded-full bg-gradient-to-br from-sky-500/40 via-purple-500/30 to-pink-500/20 blur-3xl" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.4em] text-purple-200">
                React + Vite Arcade
              </span>
              <h1 className="text-3xl font-semibold">
                Laboratório 2048 com visual Neon Postura
              </h1>
              <p className="text-sm text-zinc-400">
                Combine blocos com as setas ou gestos. Inspirado nos painéis da plataforma,
                este modo recreativo ajuda o time a relaxar entre uma automação e outra.
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="rounded-2xl border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.4em] text-indigo-200">
                  React 19
                </div>
                <div className="rounded-2xl border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.4em] text-pink-200">
                  Vite DX
                </div>
                <div className="rounded-2xl border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.4em] text-sky-200">
                  Dark Labs
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-zinc-200">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.4em] text-zinc-400">
                <span>Score</span>
                <span>Meta</span>
              </div>
              <div className="flex items-end justify-between">
                <p className="text-4xl font-bold text-white">{score}</p>
                <p className="text-2xl font-semibold text-emerald-300">2048</p>
              </div>
              <Button
                onClick={resetGame}
                className="mt-2 flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-500 to-sky-500 text-sm font-semibold"
              >
                <RotateCcw className="h-4 w-4" />
                Reiniciar partida
              </Button>
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Score", value: score },
              { label: "Melhor", value: bestScore },
              { label: "Maior bloco", value: bestTile },
              {
                label: "Status",
                value:
                  status === "playing"
                    ? "em jogo"
                    : status === "won"
                    ? "você venceu!"
                    : "fim de jogo",
                accent:
                  status === "won"
                    ? "text-emerald-300"
                    : status === "lost"
                    ? "text-rose-300"
                    : "text-white",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 backdrop-blur"
              >
                <p className="text-[11px] uppercase tracking-[0.4em] text-zinc-500">
                  {item.label}
                </p>
                <p className={cn("text-2xl font-bold", item.accent)}>{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#03030e] via-[#050315] to-[#04000c] p-5 shadow-[0_25px_120px_rgba(0,0,0,0.6)]">
          <div className="absolute inset-0 opacity-30 blur-3xl">
            <div className="h-full w-full bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500" />
          </div>
          <div className="relative rounded-[28px] border border-white/5 bg-[#040517]/90 p-5 shadow-inner shadow-black/70">
            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(0, 1fr))`,
              }}
            >
              {board.map((row, rowIndex) =>
                row.map((value, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={cn(
                      "flex aspect-square items-center justify-center rounded-[22px] text-3xl font-semibold shadow-lg transition-all duration-200",
                      value !== 0 ? "shadow-[0_8px_25px_rgba(0,0,0,0.35)]" : "",
                      tileVariants[value] ?? "bg-purple-500 text-white"
                    )}
                  >
                    {value !== 0 ? value : ""}
                  </div>
                ))
              )}
            </div>

            {status !== "playing" && (
              <div className="absolute inset-5 flex flex-col items-center justify-center rounded-[24px] border border-white/10 bg-black/80 text-center backdrop-blur">
                <p className="text-3xl font-bold">
                  {status === "won" ? "Você alcançou 2048!" : "Fim de jogo"}
                </p>
                <p className="mt-2 text-sm text-zinc-300">
                  Clique em Reiniciar partida e tente superar o melhor score.
                </p>
                <Button className="mt-5 rounded-2xl" onClick={resetGame}>
                  Jogar de novo
                </Button>
              </div>
            )}
          </div>
        </div>

        <section className="grid gap-4 text-sm text-zinc-300 lg:grid-cols-2">
          <Card className="border border-white/10 bg-white/5 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-white">
                Controles rápidos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-2xl border border-dashed border-white/15 px-4 py-3">
                Use as setas ou deslize no touchpad para mover os blocos. Quando
                blocos com o mesmo valor colidem, eles se fundem.
              </div>
              <div className="rounded-2xl border border-dashed border-white/15 px-4 py-3">
                Alcance o bloco 2048 antes que o tabuleiro fique sem movimentos. O
                jogo continua depois disso para disputar o melhor score.
              </div>
            </CardContent>
          </Card>
          <Card className="border border-white/10 bg-white/5 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-white">
                Dicas de ritmo React + Vite
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-2xl border border-dashed border-white/15 px-4 py-3">
                Pense como um bundler: mantenha blocos semelhantes próximos para gerar
                combinações em cascata.
              </div>
              <div className="rounded-2xl border border-dashed border-white/15 px-4 py-3">
                Ao liberar linhas por completo, você cria “slots” para tiles mais altos,
                semelhante a otimizar imports no Vite.
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
