(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", {
    variants: {
        variant: {
            default: "bg-primary text-primary-foreground hover:bg-primary/90",
            destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
            outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
            secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
            link: "text-primary underline-offset-4 hover:underline"
        },
        size: {
            default: "h-9 px-4 py-2 has-[>svg]:px-3",
            sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
            lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
            icon: "size-9",
            "icon-sm": "size-8",
            "icon-lg": "size-10"
        }
    },
    defaultVariants: {
        variant: "default",
        size: "default"
    }
});
function Button({ className, variant, size, asChild = false, ...props }) {
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Slot"] : "button";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        "data-slot": "button",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
            variant,
            size,
            className
        })),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/button.tsx",
        lineNumber: 52,
        columnNumber: 5
    }, this);
}
_c = Button;
;
var _c;
__turbopack_context__.k.register(_c, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/errors/not-found-tetris.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NotFoundTetris",
    ()=>NotFoundTetris
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 18;
const START_X = Math.floor(BOARD_WIDTH / 2) - 2;
const TETROMINOES = [
    {
        name: "I",
        color: "from-cyan-400 to-cyan-300 text-[#032027]",
        rotations: [
            [
                [
                    0,
                    0,
                    0,
                    0
                ],
                [
                    1,
                    1,
                    1,
                    1
                ],
                [
                    0,
                    0,
                    0,
                    0
                ],
                [
                    0,
                    0,
                    0,
                    0
                ]
            ],
            [
                [
                    0,
                    0,
                    1,
                    0
                ],
                [
                    0,
                    0,
                    1,
                    0
                ],
                [
                    0,
                    0,
                    1,
                    0
                ],
                [
                    0,
                    0,
                    1,
                    0
                ]
            ]
        ]
    },
    {
        name: "J",
        color: "from-indigo-400 to-indigo-500 text-white",
        rotations: [
            [
                [
                    1,
                    0,
                    0
                ],
                [
                    1,
                    1,
                    1
                ],
                [
                    0,
                    0,
                    0
                ]
            ],
            [
                [
                    0,
                    1,
                    1
                ],
                [
                    0,
                    1,
                    0
                ],
                [
                    0,
                    1,
                    0
                ]
            ],
            [
                [
                    0,
                    0,
                    0
                ],
                [
                    1,
                    1,
                    1
                ],
                [
                    0,
                    0,
                    1
                ]
            ],
            [
                [
                    0,
                    1,
                    0
                ],
                [
                    0,
                    1,
                    0
                ],
                [
                    1,
                    1,
                    0
                ]
            ]
        ]
    },
    {
        name: "L",
        color: "from-amber-400 to-orange-500 text-[#221002]",
        rotations: [
            [
                [
                    0,
                    0,
                    1
                ],
                [
                    1,
                    1,
                    1
                ],
                [
                    0,
                    0,
                    0
                ]
            ],
            [
                [
                    0,
                    1,
                    0
                ],
                [
                    0,
                    1,
                    0
                ],
                [
                    0,
                    1,
                    1
                ]
            ],
            [
                [
                    0,
                    0,
                    0
                ],
                [
                    1,
                    1,
                    1
                ],
                [
                    1,
                    0,
                    0
                ]
            ],
            [
                [
                    1,
                    1,
                    0
                ],
                [
                    0,
                    1,
                    0
                ],
                [
                    0,
                    1,
                    0
                ]
            ]
        ]
    },
    {
        name: "O",
        color: "from-yellow-300 to-yellow-400 text-[#201701]",
        rotations: [
            [
                [
                    1,
                    1
                ],
                [
                    1,
                    1
                ]
            ]
        ]
    },
    {
        name: "S",
        color: "from-emerald-400 to-emerald-500 text-[#031a11]",
        rotations: [
            [
                [
                    0,
                    1,
                    1
                ],
                [
                    1,
                    1,
                    0
                ],
                [
                    0,
                    0,
                    0
                ]
            ],
            [
                [
                    0,
                    1,
                    0
                ],
                [
                    0,
                    1,
                    1
                ],
                [
                    0,
                    0,
                    1
                ]
            ]
        ]
    },
    {
        name: "T",
        color: "from-purple-400 to-purple-500 text-white",
        rotations: [
            [
                [
                    0,
                    1,
                    0
                ],
                [
                    1,
                    1,
                    1
                ],
                [
                    0,
                    0,
                    0
                ]
            ],
            [
                [
                    0,
                    1,
                    0
                ],
                [
                    0,
                    1,
                    1
                ],
                [
                    0,
                    1,
                    0
                ]
            ],
            [
                [
                    0,
                    0,
                    0
                ],
                [
                    1,
                    1,
                    1
                ],
                [
                    0,
                    1,
                    0
                ]
            ],
            [
                [
                    0,
                    1,
                    0
                ],
                [
                    1,
                    1,
                    0
                ],
                [
                    0,
                    1,
                    0
                ]
            ]
        ]
    },
    {
        name: "Z",
        color: "from-rose-400 to-rose-500 text-white",
        rotations: [
            [
                [
                    1,
                    1,
                    0
                ],
                [
                    0,
                    1,
                    1
                ],
                [
                    0,
                    0,
                    0
                ]
            ],
            [
                [
                    0,
                    0,
                    1
                ],
                [
                    0,
                    1,
                    1
                ],
                [
                    0,
                    1,
                    0
                ]
            ]
        ]
    }
];
function createEmptyBoard() {
    return Array.from({
        length: BOARD_HEIGHT
    }, ()=>Array(BOARD_WIDTH).fill(null));
}
function randomShape() {
    return TETROMINOES[Math.floor(Math.random() * TETROMINOES.length)];
}
function createActivePiece(shape) {
    return {
        shape,
        rotationIndex: 0,
        position: {
            x: START_X,
            y: 0
        }
    };
}
function rotate(piece) {
    return {
        ...piece,
        rotationIndex: (piece.rotationIndex + 1) % piece.shape.rotations.length
    };
}
function getActiveMatrix(piece) {
    return piece.shape.rotations[piece.rotationIndex];
}
function collides(board, piece, offsetX, offsetY) {
    const matrix = getActiveMatrix(piece);
    for(let y = 0; y < matrix.length; y += 1){
        for(let x = 0; x < matrix[y].length; x += 1){
            if (!matrix[y][x]) continue;
            const newX = piece.position.x + x + offsetX;
            const newY = piece.position.y + y + offsetY;
            if (newX < 0 || newX >= BOARD_WIDTH || newY < 0 || newY >= BOARD_HEIGHT || board[newY]?.[newX]) {
                return true;
            }
        }
    }
    return false;
}
function mergePiece(board, piece) {
    const newBoard = board.map((row)=>[
            ...row
        ]);
    const matrix = getActiveMatrix(piece);
    matrix.forEach((row, y)=>{
        row.forEach((value, x)=>{
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
function clearLines(board) {
    const filtered = board.filter((row)=>row.some((cell)=>!cell));
    const cleared = BOARD_HEIGHT - filtered.length;
    const newBoard = [
        ...Array.from({
            length: cleared
        }, ()=>Array(BOARD_WIDTH).fill(null)),
        ...filtered
    ];
    return {
        newBoard,
        cleared
    };
}
function lockPiece(state) {
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
            status: "over"
        };
    }
    return {
        ...state,
        board: newBoard,
        score,
        lines,
        piece: nextPiece,
        nextShape: randomShape()
    };
}
function createInitialState() {
    const shape = randomShape();
    return {
        board: createEmptyBoard(),
        piece: createActivePiece(shape),
        nextShape: randomShape(),
        score: 0,
        lines: 0,
        status: "playing"
    };
}
function reducer(state, action) {
    if (state.status === "over" && action.type !== "RESET") {
        return state;
    }
    switch(action.type){
        case "RESET":
            return createInitialState();
        case "TICK":
            {
                const moved = {
                    ...state.piece,
                    position: {
                        ...state.piece.position,
                        y: state.piece.position.y + 1
                    }
                };
                if (collides(state.board, moved, 0, 0)) {
                    return lockPiece(state);
                }
                return {
                    ...state,
                    piece: moved
                };
            }
        case "MOVE":
            {
                const moved = {
                    ...state.piece,
                    position: {
                        x: state.piece.position.x + action.dx,
                        y: state.piece.position.y + action.dy
                    }
                };
                if (collides(state.board, moved, 0, 0)) {
                    return state;
                }
                return {
                    ...state,
                    piece: moved
                };
            }
        case "ROTATE":
            {
                const rotated = rotate(state.piece);
                if (collides(state.board, rotated, 0, 0)) {
                    return state;
                }
                return {
                    ...state,
                    piece: rotated
                };
            }
        case "DROP":
            {
                let moved = state.piece;
                while(!collides(state.board, moved, 0, 1)){
                    moved = {
                        ...moved,
                        position: {
                            ...moved.position,
                            y: moved.position.y + 1
                        }
                    };
                }
                return lockPiece({
                    ...state,
                    piece: moved
                });
            }
        default:
            return state;
    }
}
function NotFoundTetris() {
    _s();
    const [state, dispatch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReducer"])(reducer, undefined, createInitialState);
    const handleKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "NotFoundTetris.useCallback[handleKey]": (event)=>{
            if (event.key === "ArrowLeft") {
                event.preventDefault();
                dispatch({
                    type: "MOVE",
                    dx: -1,
                    dy: 0
                });
            } else if (event.key === "ArrowRight") {
                event.preventDefault();
                dispatch({
                    type: "MOVE",
                    dx: 1,
                    dy: 0
                });
            } else if (event.key === "ArrowDown") {
                event.preventDefault();
                dispatch({
                    type: "MOVE",
                    dx: 0,
                    dy: 1
                });
            } else if (event.key === "ArrowUp") {
                event.preventDefault();
                dispatch({
                    type: "ROTATE"
                });
            } else if (event.key === " ") {
                event.preventDefault();
                dispatch({
                    type: "DROP"
                });
            }
        }
    }["NotFoundTetris.useCallback[handleKey]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "NotFoundTetris.useEffect": ()=>{
            window.addEventListener("keydown", handleKey);
            return ({
                "NotFoundTetris.useEffect": ()=>window.removeEventListener("keydown", handleKey)
            })["NotFoundTetris.useEffect"];
        }
    }["NotFoundTetris.useEffect"], [
        handleKey
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "NotFoundTetris.useEffect": ()=>{
            if (state.status === "over") return;
            const speed = Math.max(200, 800 - state.lines * 15);
            const id = window.setInterval({
                "NotFoundTetris.useEffect.id": ()=>dispatch({
                        type: "TICK"
                    })
            }["NotFoundTetris.useEffect.id"], speed);
            return ({
                "NotFoundTetris.useEffect": ()=>window.clearInterval(id)
            })["NotFoundTetris.useEffect"];
        }
    }["NotFoundTetris.useEffect"], [
        state.lines,
        state.status
    ]);
    const ghostPiece = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "NotFoundTetris.useMemo[ghostPiece]": ()=>{
            let ghost = state.piece;
            while(!collides(state.board, ghost, 0, 1)){
                ghost = {
                    ...ghost,
                    position: {
                        ...ghost.position,
                        y: ghost.position.y + 1
                    }
                };
            }
            return ghost;
        }
    }["NotFoundTetris.useMemo[ghostPiece]"], [
        state.board,
        state.piece
    ]);
    const boardWithPiece = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "NotFoundTetris.useMemo[boardWithPiece]": ()=>{
            const board = state.board.map({
                "NotFoundTetris.useMemo[boardWithPiece].board": (row)=>[
                        ...row
                    ]
            }["NotFoundTetris.useMemo[boardWithPiece].board"]);
            const matrix = getActiveMatrix(state.piece);
            matrix.forEach({
                "NotFoundTetris.useMemo[boardWithPiece]": (row, y)=>{
                    row.forEach({
                        "NotFoundTetris.useMemo[boardWithPiece]": (value, x)=>{
                            if (!value) return;
                            const boardY = state.piece.position.y + y;
                            const boardX = state.piece.position.x + x;
                            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
                                board[boardY][boardX] = state.piece.shape.color;
                            }
                        }
                    }["NotFoundTetris.useMemo[boardWithPiece]"]);
                }
            }["NotFoundTetris.useMemo[boardWithPiece]"]);
            return board;
        }
    }["NotFoundTetris.useMemo[boardWithPiece]"], [
        state.board,
        state.piece
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "mx-auto flex w-full max-w-4xl flex-col gap-6 rounded-3xl border border-white/10 bg-gradient-to-br from-[#05061a] via-[#050816] to-[#03040f] p-6 text-white shadow-[0_35px_120px_rgba(6,2,30,0.65)]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs uppercase tracking-[0.4em] text-purple-300",
                                children: "Erro 404"
                            }, void 0, false, {
                                fileName: "[project]/components/errors/not-found-tetris.tsx",
                                lineNumber: 406,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-3xl font-semibold",
                                children: "Oops! Essa rota caiu no vazio."
                            }, void 0, false, {
                                fileName: "[project]/components/errors/not-found-tetris.tsx",
                                lineNumber: 407,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-zinc-400",
                                children: "Você encontrou um canto vazio do Postura SM. Retorne ao dashboard ou jogue algumas linhas."
                            }, void 0, false, {
                                fileName: "[project]/components/errors/not-found-tetris.tsx",
                                lineNumber: 408,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/errors/not-found-tetris.tsx",
                        lineNumber: 405,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-2 text-sm text-zinc-400",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    "Score: ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        className: "text-white",
                                        children: state.score
                                    }, void 0, false, {
                                        fileName: "[project]/components/errors/not-found-tetris.tsx",
                                        lineNumber: 413,
                                        columnNumber: 24
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/errors/not-found-tetris.tsx",
                                lineNumber: 413,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    "Linhas: ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        className: "text-white",
                                        children: state.lines
                                    }, void 0, false, {
                                        fileName: "[project]/components/errors/not-found-tetris.tsx",
                                        lineNumber: 414,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/errors/not-found-tetris.tsx",
                                lineNumber: 414,
                                columnNumber: 11
                            }, this),
                            state.status === "over" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-rose-300",
                                children: "Game over! Aperte reset e tente mais uma vez."
                            }, void 0, false, {
                                fileName: "[project]/components/errors/not-found-tetris.tsx",
                                lineNumber: 416,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/errors/not-found-tetris.tsx",
                        lineNumber: 412,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/errors/not-found-tetris.tsx",
                lineNumber: 404,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid gap-6 lg:grid-cols-[minmax(0,300px),1fr]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mx-auto w-full max-w-[220px] rounded-3xl border border-white/10 bg-black/30 p-3",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid gap-[1px] bg-black/20",
                            style: {
                                gridTemplateColumns: `repeat(${BOARD_WIDTH}, minmax(0, 1fr))`
                            },
                            children: boardWithPiece.map((row, y)=>row.map((cell, x)=>{
                                    const ghostCell = (()=>{
                                        const matrix = getActiveMatrix(ghostPiece);
                                        const relY = y - ghostPiece.position.y;
                                        const relX = x - ghostPiece.position.x;
                                        return matrix[relY]?.[relX];
                                    })();
                                    const isGhost = ghostCell && !state.board[y][x] && !(state.piece.position.y === y && state.piece.position.x === x);
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("aspect-square rounded-[4px] border border-black/20 bg-black/10", cell && `bg-gradient-to-br ${cell} shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]`, isGhost && "border-dashed border-white/20 bg-white/5")
                                    }, `${y}-${x}`, false, {
                                        fileName: "[project]/components/errors/not-found-tetris.tsx",
                                        lineNumber: 440,
                                        columnNumber: 19
                                    }, this);
                                }))
                        }, void 0, false, {
                            fileName: "[project]/components/errors/not-found-tetris.tsx",
                            lineNumber: 423,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/errors/not-found-tetris.tsx",
                        lineNumber: 422,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-4 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-200 backdrop-blur",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs uppercase tracking-[0.4em] text-purple-200",
                                children: "Controles"
                            }, void 0, false, {
                                fileName: "[project]/components/errors/not-found-tetris.tsx",
                                lineNumber: 456,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: "space-y-2 text-zinc-300",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: "← → movimentam a peça"
                                    }, void 0, false, {
                                        fileName: "[project]/components/errors/not-found-tetris.tsx",
                                        lineNumber: 458,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: "↑ gira 90º"
                                    }, void 0, false, {
                                        fileName: "[project]/components/errors/not-found-tetris.tsx",
                                        lineNumber: 459,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: "↓ acelera a queda"
                                    }, void 0, false, {
                                        fileName: "[project]/components/errors/not-found-tetris.tsx",
                                        lineNumber: 460,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: "Space ativa o drop instantâneo"
                                    }, void 0, false, {
                                        fileName: "[project]/components/errors/not-found-tetris.tsx",
                                        lineNumber: 461,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/errors/not-found-tetris.tsx",
                                lineNumber: 457,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs uppercase tracking-[0.4em] text-purple-200 pt-4",
                                children: "Ações"
                            }, void 0, false, {
                                fileName: "[project]/components/errors/not-found-tetris.tsx",
                                lineNumber: 464,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-wrap gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "secondary",
                                        onClick: ()=>dispatch({
                                                type: "RESET"
                                            }),
                                        children: "Reset mini game"
                                    }, void 0, false, {
                                        fileName: "[project]/components/errors/not-found-tetris.tsx",
                                        lineNumber: 466,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        asChild: true,
                                        variant: "outline",
                                        className: "border-white/30 text-white hover:bg-white/10",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/vulnerabilidades/insights",
                                            children: "Voltar para o dashboard"
                                        }, void 0, false, {
                                            fileName: "[project]/components/errors/not-found-tetris.tsx",
                                            lineNumber: 470,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/errors/not-found-tetris.tsx",
                                        lineNumber: 469,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/errors/not-found-tetris.tsx",
                                lineNumber: 465,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/errors/not-found-tetris.tsx",
                        lineNumber: 455,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/errors/not-found-tetris.tsx",
                lineNumber: 421,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/errors/not-found-tetris.tsx",
        lineNumber: 403,
        columnNumber: 5
    }, this);
}
_s(NotFoundTetris, "99Dz7SJeS+9wh3nGrkfjzMvJj3U=");
_c = NotFoundTetris;
var _c;
__turbopack_context__.k.register(_c, "NotFoundTetris");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_4894bff1._.js.map