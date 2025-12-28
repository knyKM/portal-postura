"use client";

import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RotateCcw } from "lucide-react";

type Cell = string | null;

type Tetromino = {
  name: string;
  color: string;
  rotations: number[][][];
};

type ActivePiece = {
  shape: Tetromino;
  rotationIndex: number;
  position: { x: number; y: number };
};

type GameState = {
  board: Cell[][];
  piece: ActivePiece;
  nextShape: Tetromino;
  score: number;
  lines: number;
  status: "playing" | "over";
};

type GameAction =
  | { type: "TICK" }
  | { type: "MOVE"; dx: number; dy: number }
  | { type: "ROTATE" }
  | { type: "DROP" }
  | { type: "RESET" };

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const START_X = Math.floor(BOARD_WIDTH / 2) - 2;

const TETROMINOES: Tetromino[] = [
  {
    name: "I",
    color: "from-cyan-400 to-cyan-300 text-[#032027]",
    rotations: [
      [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      [
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
      ],
    ],
  },
  {
    name: "J",
    color: "from-indigo-400 to-indigo-500 text-white",
    rotations: [
      [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0],
      ],
      [
        [0, 1, 1],
        [0, 1, 0],
        [0, 1, 0],
      ],
      [
        [0, 0, 0],
        [1, 1, 1],
        [0, 0, 1],
      ],
      [
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0],
      ],
    ],
  },
  {
    name: "L",
    color: "from-amber-400 to-orange-500 text-[#221002]",
    rotations: [
      [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0],
      ],
      [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 1],
      ],
      [
        [0, 0, 0],
        [1, 1, 1],
        [1, 0, 0],
      ],
      [
        [1, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
      ],
    ],
  },
  {
    name: "O",
    color: "from-yellow-300 to-yellow-400 text-[#201701]",
    rotations: [
      [
        [1, 1],
        [1, 1],
      ],
    ],
  },
  {
    name: "S",
    color: "from-emerald-400 to-emerald-500 text-[#031a11]",
    rotations: [
      [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0],
      ],
      [
        [0, 1, 0],
        [0, 1, 1],
        [0, 0, 1],
      ],
    ],
  },
  {
    name: "T",
    color: "from-purple-400 to-purple-500 text-white",
    rotations: [
      [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0],
      ],
      [
        [0, 1, 0],
        [0, 1, 1],
        [0, 1, 0],
      ],
      [
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0],
      ],
      [
        [0, 1, 0],
        [1, 1, 0],
        [0, 1, 0],
      ],
    ],
  },
  {
    name: "Z",
    color: "from-rose-400 to-rose-500 text-white",
    rotations: [
      [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0],
      ],
      [
        [0, 0, 1],
        [0, 1, 1],
        [0, 1, 0],
      ],
    ],
  },
];

function createEmptyBoard(): Cell[][] {
  return Array.from({ length: BOARD_HEIGHT }, () =>
    Array<Cell>(BOARD_WIDTH).fill(null)
  );
}

function randomShape() {
  return TETROMINOES[Math.floor(Math.random() * TETROMINOES.length)];
}

function createActivePiece(shape: Tetromino): ActivePiece {
  return {
    shape,
    rotationIndex: 0,
    position: { x: START_X, y: 0 },
  };
}

function getMatrix(piece: ActivePiece) {
  const rotations = piece.shape.rotations;
  return rotations[piece.rotationIndex % rotations.length];
}

function canPlace(matrix: number[][], position: { x: number; y: number }, board: Cell[][]) {
  for (let y = 0; y < matrix.length; y += 1) {
    for (let x = 0; x < matrix[y].length; x += 1) {
      if (matrix[y][x]) {
        const boardX = position.x + x;
        const boardY = position.y + y;
        if (
          boardX < 0 ||
          boardX >= BOARD_WIDTH ||
          boardY >= BOARD_HEIGHT ||
          (boardY >= 0 && board[boardY][boardX])
        ) {
          return false;
        }
      }
    }
  }
  return true;
}

function mergePiece(board: Cell[][], piece: ActivePiece) {
  const matrix = getMatrix(piece);
  const newBoard = board.map((row) => [...row]);

  for (let y = 0; y < matrix.length; y += 1) {
    for (let x = 0; x < matrix[y].length; x += 1) {
      if (matrix[y][x]) {
        const boardX = piece.position.x + x;
        const boardY = piece.position.y + y;
        if (boardY >= 0) {
          newBoard[boardY][boardX] = piece.shape.color;
        }
      }
    }
  }
  return newBoard;
}

function clearCompletedLines(board: Cell[][]) {
  let cleared = 0;
  const remaining = board.filter((row) => {
    const full = row.every((cell) => cell !== null);
    if (full) {
      cleared += 1;
      return false;
    }
    return true;
  });

  const newRows = Array.from({ length: cleared }, () =>
    Array<Cell>(BOARD_WIDTH).fill(null)
  );

  const newBoard = [...newRows, ...remaining];
  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array<Cell>(BOARD_WIDTH).fill(null));
  }

  return { board: newBoard.slice(-BOARD_HEIGHT), linesCleared: cleared };
}

function tryMovePiece(
  state: GameState,
  dx: number,
  dy: number,
  rotationDelta = 0
) {
  const { piece, board } = state;
  const rotations = piece.shape.rotations;
  const nextRotation =
    (piece.rotationIndex + rotationDelta + rotations.length) % rotations.length;
  const matrix = rotations[nextRotation];
  const nextPosition = {
    x: piece.position.x + dx,
    y: piece.position.y + dy,
  };

  if (canPlace(matrix, nextPosition, board)) {
    return {
      ...piece,
      rotationIndex: nextRotation,
      position: nextPosition,
    };
  }

  return null;
}

function lockAndSpawn(state: GameState): GameState {
  const merged = mergePiece(state.board, state.piece);
  const { board, linesCleared } = clearCompletedLines(merged);
  const scoreGain = linesCleared > 0 ? linesCleared * 120 : 0;
  const nextPiece = createActivePiece(state.nextShape);
  const upcomingShape = randomShape();
  const nextMatrix = getMatrix(nextPiece);

  if (!canPlace(nextMatrix, nextPiece.position, board)) {
    return {
      ...state,
      board,
      score: state.score + scoreGain,
      lines: state.lines + linesCleared,
      status: "over",
    };
  }

  return {
    ...state,
    board,
    piece: nextPiece,
    nextShape: upcomingShape,
    score: state.score + scoreGain,
    lines: state.lines + linesCleared,
  };
}

function tickDown(state: GameState): GameState {
  if (state.status !== "playing") return state;
  const moved = tryMovePiece(state, 0, 1);
  if (moved) {
    return { ...state, piece: moved };
  }
  return lockAndSpawn(state);
}

function dropInstant(state: GameState): GameState {
  if (state.status !== "playing") return state;
  let tempState = state;
  // soft drop until we can't
  while (true) {
    const moved = tryMovePiece(tempState, 0, 1);
    if (!moved) {
      break;
    }
    tempState = { ...tempState, piece: moved };
  }
  return lockAndSpawn(tempState);
}

function createInitialGameState(): GameState {
  const firstShape = randomShape();
  const nextShape = randomShape();
  return {
    board: createEmptyBoard(),
    piece: createActivePiece(firstShape),
    nextShape,
    score: 0,
    lines: 0,
    status: "playing",
  };
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "RESET":
      return createInitialGameState();
    case "TICK":
      return tickDown(state);
    case "MOVE":
      if (state.status !== "playing") return state;
      if (action.dy === 1) {
        const moved = tryMovePiece(state, 0, 1);
        if (moved) {
          return { ...state, piece: moved, score: state.score + 5 };
        }
        return lockAndSpawn(state);
      }
      {
        const moved = tryMovePiece(state, action.dx, action.dy);
        if (moved) {
          return { ...state, piece: moved };
        }
        return state;
      }
    case "ROTATE":
      if (state.status !== "playing") return state;
      {
        const rotated = tryMovePiece(state, 0, 0, 1);
        if (rotated) {
          return { ...state, piece: rotated };
        }
        return state;
      }
    case "DROP":
      return dropInstant(state);
    default:
      return state;
  }
}

export default function TetrisPage() {
  const router = useRouter();
  const [checkingSession, setCheckingSession] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [gameState, dispatch] = useReducer(
    gameReducer,
    undefined,
    () => createInitialGameState()
  );

  const dropSpeed = useMemo(
    () => Math.max(220, 900 - gameState.lines * 15),
    [gameState.lines]
  );

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
    if (!isAuthorized || checkingSession) return;
    if (gameState.status !== "playing") return;
    const interval = setInterval(() => {
      dispatch({ type: "TICK" });
    }, dropSpeed);
    return () => clearInterval(interval);
  }, [dropSpeed, gameState.status, isAuthorized, checkingSession]);

  const handleKey = useCallback(
    (event: KeyboardEvent) => {
      if (!isAuthorized || checkingSession) return;
      if (
        event.key === "ArrowLeft" ||
        event.key === "ArrowRight" ||
        event.key === "ArrowDown"
      ) {
        event.preventDefault();
      }

      if (gameState.status === "over" && event.key === "Enter") {
        dispatch({ type: "RESET" });
        return;
      }

      if (gameState.status !== "playing") return;

      switch (event.key) {
        case "ArrowLeft":
          dispatch({ type: "MOVE", dx: -1, dy: 0 });
          break;
        case "ArrowRight":
          dispatch({ type: "MOVE", dx: 1, dy: 0 });
          break;
        case "ArrowDown":
          dispatch({ type: "MOVE", dx: 0, dy: 1 });
          break;
        case "ArrowUp":
          dispatch({ type: "ROTATE" });
          break;
        case " ":
        case "Spacebar":
          event.preventDefault();
          dispatch({ type: "DROP" });
          break;
        default:
          break;
      }
    },
    [gameState.status, isAuthorized, checkingSession]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  const resetGame = () => dispatch({ type: "RESET" });

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

  const { board, piece, nextShape, score, lines, status } = gameState;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#03010f] via-[#05031a] to-[#04000a] px-4 py-10 text-zinc-100">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <section className="relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-[#0a0f23] via-[#060518] to-[#03000b] p-6 shadow-[0_25px_120px_rgba(58,0,107,0.35)]">
          <div className="absolute inset-y-0 right-0 w-48 rounded-full bg-gradient-to-b from-sky-500/40 via-purple-500/30 to-pink-500/20 blur-[120px]" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.4em] text-sky-200">
                React + Vite Labs
              </span>
              <h1 className="text-3xl font-semibold">Arena Tetris Postura</h1>
              <p className="text-sm text-zinc-400">
                Sequencie tetrominos para manter o fluxo e treinar coordenação enquanto o SOC aguarda novas automações.
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="rounded-2xl border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.4em] text-purple-200">
                  Modo Arcade
                </div>
                <div className="rounded-2xl border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.4em] text-pink-200">
                  Visual Neon
                </div>
              </div>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-5 text-sm text-zinc-200 backdrop-blur">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.4em] text-zinc-500">
                <span>Score</span>
                <span>Linhas</span>
              </div>
              <div className="mt-2 flex items-end justify-between">
                <p className="text-4xl font-bold text-white">{score}</p>
                <p className="text-2xl font-semibold text-emerald-300">{lines}</p>
              </div>
              <Button
                onClick={resetGame}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-500 to-sky-500 text-sm font-semibold"
              >
                <RotateCcw className="h-4 w-4" />
                Reiniciar partida
              </Button>
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Score", value: score },
              { label: "Linhas", value: lines },
              {
                label: "Velocidade",
                value: `${Math.round(1000 / dropSpeed)}x`,
              },
              {
                label: "Status",
                value: status === "playing" ? "Em jogo" : "Fim de jogo",
                accent: status === "playing" ? "text-sky-200" : "text-rose-300",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 backdrop-blur"
              >
                <p className="text-[11px] uppercase tracking-[0.4em] text-zinc-500">
                  {item.label}
                </p>
                <p className={cn("text-2xl font-semibold", item.accent)}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#02020d] via-[#050315] to-[#03000a] p-4 shadow-[0_25px_120px_rgba(0,0,0,0.65)]">
            <div className="absolute inset-0 opacity-20 blur-3xl">
              <div className="h-full w-full bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500" />
            </div>
            <div className="relative rounded-[28px] border border-white/5 bg-[#040517]/95 p-4 shadow-inner shadow-black/70">
              <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${BOARD_WIDTH}, minmax(0, 1fr))` }}>
                {board.map((row, y) =>
                  row.map((cell, x) => {
                    const isGhost =
                      cell === null &&
                      (() => {
                        const matrix = getMatrix(piece);
                        for (let py = 0; py < matrix.length; py += 1) {
                          for (let px = 0; px < matrix[py].length; px += 1) {
                            if (matrix[py][px]) {
                              const boardX = piece.position.x + px;
                              const boardY = piece.position.y + py;
                              if (boardX === x && boardY === y) {
                                return true;
                              }
                            }
                          }
                        }
                        return false;
                      })();
                    return (
                      <div
                        key={`${x}-${y}`}
                        className={cn(
                          "flex aspect-square items-center justify-center rounded-[8px] text-lg font-bold transition-all duration-200",
                          cell
                            ? `bg-gradient-to-br ${cell} shadow-[0_6px_18px_rgba(0,0,0,0.45)]`
                            : isGhost
                            ? "border border-dashed border-white/10 bg-white/5"
                            : "bg-black/20"
                        )}
                      />
                    );
                  })
                )}
              </div>
              {status === "over" && (
                <div className="absolute inset-4 flex flex-col items-center justify-center rounded-[24px] border border-white/10 bg-black/80 text-center backdrop-blur">
                  <p className="text-3xl font-bold">Fim de jogo</p>
                  <p className="text-sm text-zinc-300">
                    Pressione Enter ou clique em Reiniciar para tentar novamente.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <Card className="border border-white/10 bg-white/5 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-white">
                  Próximo tetromino
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-fit rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="grid grid-cols-4 gap-1">
                    {nextShape.rotations[0].map((row, y) =>
                      row.map((value, x) => (
                        <div
                          key={`${y}-${x}`}
                          className={cn(
                            "h-5 w-5 rounded-md",
                            value ? `bg-gradient-to-br ${nextShape.color}` : "bg-black/30"
                          )}
                        />
                      ))
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-white/10 bg-white/5 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-white">
                  Controles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-zinc-300">
                <div className="rounded-2xl border border-dashed border-white/15 px-4 py-3">
                  Setas esquerda/direita movem lateralmente. Seta para cima gira o tetromino.
                </div>
                <div className="rounded-2xl border border-dashed border-white/15 px-4 py-3">
                  Seta para baixo acelera o drop. Espaço executa queda instantânea.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
