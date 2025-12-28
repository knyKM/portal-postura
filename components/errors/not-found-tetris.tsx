"use client";

import { useCallback, useEffect, useMemo, useReducer } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
const BOARD_HEIGHT = 18;
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

function rotate(piece: ActivePiece): ActivePiece {
  return {
    ...piece,
    rotationIndex: (piece.rotationIndex + 1) % piece.shape.rotations.length,
  };
}

function getActiveMatrix(piece: ActivePiece) {
  return piece.shape.rotations[piece.rotationIndex];
}

function collides(board: Cell[][], piece: ActivePiece, offsetX: number, offsetY: number) {
  const matrix = getActiveMatrix(piece);
  for (let y = 0; y < matrix.length; y += 1) {
    for (let x = 0; x < matrix[y].length; x += 1) {
      if (!matrix[y][x]) continue;
      const newX = piece.position.x + x + offsetX;
      const newY = piece.position.y + y + offsetY;
      if (
        newX < 0 ||
        newX >= BOARD_WIDTH ||
        newY < 0 ||
        newY >= BOARD_HEIGHT ||
        board[newY]?.[newX]
      ) {
        return true;
      }
    }
  }
  return false;
}

function mergePiece(board: Cell[][], piece: ActivePiece) {
  const newBoard = board.map((row) => [...row]);
  const matrix = getActiveMatrix(piece);
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (!value) return;
      const boardY = piece.position.y + y;
      const boardX = piece.position.x + x;
      if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
        newBoard[boardY][boardX] = piece.shape.color;
      }
    });
  });
  return newBoard;
}

function clearLines(board: Cell[][]) {
  const filtered = board.filter((row) => row.some((cell) => !cell));
  const cleared = BOARD_HEIGHT - filtered.length;
  const newBoard = [...Array.from({ length: cleared }, () => Array<Cell>(BOARD_WIDTH).fill(null)), ...filtered];
  return { newBoard, cleared };
}

function lockPiece(state: GameState) {
  const merged = mergePiece(state.board, state.piece);
  const { newBoard, cleared } = clearLines(merged);
  const score = state.score + cleared * 100;
  const lines = state.lines + cleared;
  const nextShape = state.nextShape;
  const nextPiece = createActivePiece(nextShape);
  if (collides(newBoard, nextPiece, 0, 0)) {
    return {
      ...state,
      board: merged,
      score,
      lines,
      status: "over",
    };
  }
  return {
    ...state,
    board: newBoard,
    score,
    lines,
    piece: nextPiece,
    nextShape: randomShape(),
  };
}

function createInitialState(): GameState {
  const shape = randomShape();
  return {
    board: createEmptyBoard(),
    piece: createActivePiece(shape),
    nextShape: randomShape(),
    score: 0,
    lines: 0,
    status: "playing",
  };
}

function reducer(state: GameState, action: GameAction): GameState {
  if (state.status === "over" && action.type !== "RESET") {
    return state;
  }

  switch (action.type) {
    case "RESET":
      return createInitialState();
    case "TICK": {
      const moved = { ...state.piece, position: { ...state.piece.position, y: state.piece.position.y + 1 } };
      if (collides(state.board, moved, 0, 0)) {
        return lockPiece(state);
      }
      return { ...state, piece: moved };
    }
    case "MOVE": {
      const moved = {
        ...state.piece,
        position: {
          x: state.piece.position.x + action.dx,
          y: state.piece.position.y + action.dy,
        },
      };
      if (collides(state.board, moved, 0, 0)) {
        return state;
      }
      return { ...state, piece: moved };
    }
    case "ROTATE": {
      const rotated = rotate(state.piece);
      if (collides(state.board, rotated, 0, 0)) {
        return state;
      }
      return { ...state, piece: rotated };
    }
    case "DROP": {
      let moved = state.piece;
      while (!collides(state.board, moved, 0, 1)) {
        moved = { ...moved, position: { ...moved.position, y: moved.position.y + 1 } };
      }
      return lockPiece({ ...state, piece: moved });
    }
    default:
      return state;
  }
}

export function NotFoundTetris() {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);

  const handleKey = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        dispatch({ type: "MOVE", dx: -1, dy: 0 });
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        dispatch({ type: "MOVE", dx: 1, dy: 0 });
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        dispatch({ type: "MOVE", dx: 0, dy: 1 });
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        dispatch({ type: "ROTATE" });
      } else if (event.key === " ") {
        event.preventDefault();
        dispatch({ type: "DROP" });
      }
    },
    []
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  useEffect(() => {
    if (state.status === "over") return;
    const speed = Math.max(200, 800 - state.lines * 15);
    const id = window.setInterval(() => dispatch({ type: "TICK" }), speed);
    return () => window.clearInterval(id);
  }, [state.lines, state.status]);

  const ghostPiece = useMemo(() => {
    let ghost = state.piece;
    while (!collides(state.board, ghost, 0, 1)) {
      ghost = { ...ghost, position: { ...ghost.position, y: ghost.position.y + 1 } };
    }
    return ghost;
  }, [state.board, state.piece]);

  const boardWithPiece = useMemo(() => {
    const board = state.board.map((row) => [...row]);
    const matrix = getActiveMatrix(state.piece);
    matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (!value) return;
        const boardY = state.piece.position.y + y;
        const boardX = state.piece.position.x + x;
        if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
          board[boardY][boardX] = state.piece.shape.color;
        }
      });
    });
    return board;
  }, [state.board, state.piece]);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 rounded-3xl border border-white/10 bg-gradient-to-br from-[#05061a] via-[#050816] to-[#03040f] p-6 text-white shadow-[0_35px_120px_rgba(6,2,30,0.65)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-purple-300">Erro 404</p>
          <h1 className="text-3xl font-semibold">Oops! Essa rota caiu no vazio.</h1>
          <p className="text-sm text-zinc-400">
            Você encontrou um canto vazio do Postura SM. Retorne ao dashboard ou jogue algumas linhas.
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm text-zinc-400">
          <span>Score: <strong className="text-white">{state.score}</strong></span>
          <span>Linhas: <strong className="text-white">{state.lines}</strong></span>
          {state.status === "over" && (
            <span className="text-rose-300">Game over! Aperte reset e tente mais uma vez.</span>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,300px),1fr]">
        <div className="mx-auto w-full max-w-[220px] rounded-3xl border border-white/10 bg-black/30 p-3">
          <div
            className="grid gap-[1px] bg-black/20"
            style={{ gridTemplateColumns: `repeat(${BOARD_WIDTH}, minmax(0, 1fr))` }}
          >
            {boardWithPiece.map((row, y) =>
              row.map((cell, x) => {
                const ghostCell = (() => {
                  const matrix = getActiveMatrix(ghostPiece);
                  const relY = y - ghostPiece.position.y;
                  const relX = x - ghostPiece.position.x;
                  return matrix[relY]?.[relX];
                })();
                const isGhost =
                  ghostCell &&
                  !state.board[y][x] &&
                  !(state.piece.position.y === y && state.piece.position.x === x);
                return (
                  <div
                    key={`${y}-${x}`}
                    className={cn(
                      "aspect-square rounded-[4px] border border-black/20 bg-black/10",
                      cell &&
                        `bg-gradient-to-br ${cell} shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]`,
                      isGhost && "border-dashed border-white/20 bg-white/5"
                    )}
                  />
                );
              })
            )}
          </div>
        </div>

        <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-200 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.4em] text-purple-200">Controles</p>
          <ul className="space-y-2 text-zinc-300">
            <li>← → movimentam a peça</li>
            <li>↑ gira 90º</li>
            <li>↓ acelera a queda</li>
            <li>Space ativa o drop instantâneo</li>
          </ul>

          <p className="text-xs uppercase tracking-[0.4em] text-purple-200 pt-4">Ações</p>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={() => dispatch({ type: "RESET" })}>
              Reset mini game
            </Button>
            <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10">
              <Link href="/vulnerabilidades/insights">Voltar para o dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
