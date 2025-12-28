module.exports = [
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-ssr] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
}),
"[project]/components/ui/button.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-slot/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", {
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
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Slot"] : "button";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        "data-slot": "button",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
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
;
}),
"[project]/components/ui/input.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Input",
    ()=>Input
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
;
;
function Input({ className, type, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
        type: type,
        "data-slot": "input",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]", "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/input.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
;
}),
"[project]/components/ui/tooltip.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Tooltip",
    ()=>Tooltip,
    "TooltipContent",
    ()=>TooltipContent,
    "TooltipProvider",
    ()=>TooltipProvider,
    "TooltipTrigger",
    ()=>TooltipTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tooltip$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-tooltip/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
function TooltipProvider({ delayDuration = 0, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tooltip$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Provider"], {
        "data-slot": "tooltip-provider",
        delayDuration: delayDuration,
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/tooltip.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
function Tooltip({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(TooltipProvider, {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tooltip$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Root"], {
            "data-slot": "tooltip",
            ...props
        }, void 0, false, {
            fileName: "[project]/components/ui/tooltip.tsx",
            lineNumber: 26,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/ui/tooltip.tsx",
        lineNumber: 25,
        columnNumber: 5
    }, this);
}
function TooltipTrigger({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tooltip$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Trigger"], {
        "data-slot": "tooltip-trigger",
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/tooltip.tsx",
        lineNumber: 34,
        columnNumber: 10
    }, this);
}
function TooltipContent({ className, sideOffset = 0, children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tooltip$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Portal"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tooltip$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Content"], {
            "data-slot": "tooltip-content",
            sideOffset: sideOffset,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("bg-foreground text-background animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance", className),
            ...props,
            children: [
                children,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tooltip$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Arrow"], {
                    className: "bg-foreground fill-foreground z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]"
                }, void 0, false, {
                    fileName: "[project]/components/ui/tooltip.tsx",
                    lineNumber: 55,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/ui/tooltip.tsx",
            lineNumber: 45,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/ui/tooltip.tsx",
        lineNumber: 44,
        columnNumber: 5
    }, this);
}
;
}),
"[project]/components/layout/sidebar.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Sidebar",
    ()=>Sidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/input.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/tooltip.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-left.js [app-ssr] (ecmascript) <export default as ChevronLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-ssr] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/layout-dashboard.js [app-ssr] (ecmascript) <export default as LayoutDashboard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$terminal$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Terminal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/terminal.js [app-ssr] (ecmascript) <export default as Terminal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.js [app-ssr] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sun.js [app-ssr] (ecmascript) <export default as Sun>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/moon.js [app-ssr] (ecmascript) <export default as Moon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-ssr] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-ssr] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$workflow$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Workflow$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/workflow.js [app-ssr] (ecmascript) <export default as Workflow>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardCheck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clipboard-check.js [app-ssr] (ecmascript) <export default as ClipboardCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$history$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__History$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/history.js [app-ssr] (ecmascript) <export default as History>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$kanban$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__KanbanSquare$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/square-kanban.js [app-ssr] (ecmascript) <export default as KanbanSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/activity.js [app-ssr] (ecmascript) <export default as Activity>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-ssr] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$blocks$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Blocks$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/blocks.js [app-ssr] (ecmascript) <export default as Blocks>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$notebook$2d$pen$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__NotebookPen$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/notebook-pen.js [app-ssr] (ecmascript) <export default as NotebookPen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$theme$2f$theme$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/theme/theme-provider.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
;
;
;
const navItems = [
    {
        label: "Dashboard",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__["LayoutDashboard"],
        href: "/vulnerabilidades/insights"
    },
    {
        label: "Ações",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$workflow$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Workflow$3e$__["Workflow"],
        href: "/acoes"
    },
    {
        label: "Playbooks",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$blocks$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Blocks$3e$__["Blocks"],
        href: "/playbooks"
    },
    {
        label: "Ferramentas",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$terminal$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Terminal$3e$__["Terminal"],
        href: "/ferramentas"
    },
    {
        label: "Auditoria",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"],
        href: "/auditoria"
    },
    {
        label: "Sugestões",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"],
        href: "/sugestoes",
        requiresAdmin: true
    },
    {
        label: "Kanban",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$kanban$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__KanbanSquare$3e$__["KanbanSquare"],
        href: "/kanban"
    },
    {
        label: "Fila de Aprovações",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardCheck$3e$__["ClipboardCheck"],
        href: "/fila-aprovacoes",
        requiresAdmin: true
    },
    {
        label: "Usuários",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"],
        href: "/usuarios"
    },
    {
        label: "Changelog",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$history$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__History$3e$__["History"],
        href: "/changelog"
    },
    {
        label: "Manual",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$notebook$2d$pen$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__NotebookPen$3e$__["NotebookPen"],
        href: "/changelog/manual"
    },
    {
        label: "Configurações",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"],
        href: "/configuracoes"
    }
];
function Sidebar({ isCollapsed, onToggle }) {
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const { theme, toggleTheme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$theme$2f$theme$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTheme"])();
    const isDark = theme === "dark";
    const [isAdmin, setIsAdmin] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) return false;
        //TURBOPACK unreachable
        ;
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) return undefined;
        //TURBOPACK unreachable
        ;
        function handleStorage(event) {
            if (event.key && event.key !== "postura_user") return;
            try {
                const value = event.newValue ?? window.localStorage.getItem("postura_user");
                if (!value) {
                    setIsAdmin(false);
                    return;
                }
                const parsed = JSON.parse(value);
                setIsAdmin(parsed?.role === "admin");
            } catch  {
                setIsAdmin(false);
            }
        }
    }, []);
    const mainItems = navItems.filter((i)=>i.label !== "Configurações" && i.label !== "Changelog" && i.label !== "Manual" && (!i.requiresAdmin || isAdmin));
    const settingsItem = navItems.find((i)=>i.label === "Configurações");
    const changelogItem = navItems.find((i)=>i.label === "Changelog");
    const manualItem = navItems.find((i)=>i.label === "Manual");
    const visibleNavHrefs = [
        ...mainItems.map((item)=>item.href),
        ...changelogItem ? [
            changelogItem.href
        ] : [],
        ...manualItem ? [
            manualItem.href
        ] : [],
        ...settingsItem ? [
            settingsItem.href
        ] : []
    ];
    function isRouteActive(href) {
        if (pathname === href) {
            return true;
        }
        if (!pathname.startsWith(href + "/")) {
            return false;
        }
        const hasMoreSpecificMatch = visibleNavHrefs.some((otherHref)=>otherHref !== href && pathname.startsWith(otherHref) && otherHref.length > href.length);
        return !hasMoreSpecificMatch;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TooltipProvider"], {
        delayDuration: 0,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex h-screen flex-col border-r transition-[width,background-color,border-color] duration-300", isDark ? "border-zinc-800 bg-[#050814]" : "border-zinc-200 bg-slate-50", isCollapsed ? "w-[80px]" : "w-64"),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between p-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative h-8 w-8",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        src: "/logo_vivo_sem_fundo.png",
                                        alt: "Postura",
                                        fill: true,
                                        className: "object-contain",
                                        sizes: "32px"
                                    }, void 0, false, {
                                        fileName: "[project]/components/layout/sidebar.tsx",
                                        lineNumber: 164,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/layout/sidebar.tsx",
                                    lineNumber: 163,
                                    columnNumber: 13
                                }, this),
                                !isCollapsed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-lg font-bold tracking-tight", isDark ? "text-zinc-100" : "text-slate-900"),
                                    children: "Postura SM"
                                }, void 0, false, {
                                    fileName: "[project]/components/layout/sidebar.tsx",
                                    lineNumber: 173,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/layout/sidebar.tsx",
                            lineNumber: 162,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Tooltip"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TooltipTrigger"], {
                                    asChild: true,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "ghost",
                                        size: "icon",
                                        onClick: onToggle,
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("h-8 w-8 rounded-lg border bg-transparent", isDark ? "border-zinc-800 hover:bg-[#0b1020]" : "border-slate-200 hover:bg-slate-100"),
                                        children: isCollapsed ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/components/layout/sidebar.tsx",
                                            lineNumber: 198,
                                            columnNumber: 19
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/components/layout/sidebar.tsx",
                                            lineNumber: 200,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/layout/sidebar.tsx",
                                        lineNumber: 186,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/layout/sidebar.tsx",
                                    lineNumber: 185,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TooltipContent"], {
                                    side: "right",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: isCollapsed ? "Expandir menu" : "Recolher menu"
                                    }, void 0, false, {
                                        fileName: "[project]/components/layout/sidebar.tsx",
                                        lineNumber: 205,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/layout/sidebar.tsx",
                                    lineNumber: 204,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/layout/sidebar.tsx",
                            lineNumber: 184,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/layout/sidebar.tsx",
                    lineNumber: 161,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("mb-2 border-b", isDark ? "border-zinc-800" : "border-slate-200")
                }, void 0, false, {
                    fileName: "[project]/components/layout/sidebar.tsx",
                    lineNumber: 210,
                    columnNumber: 9
                }, this),
                !isCollapsed ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "px-3 pb-3",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex items-center gap-2 rounded-xl border px-3", isDark ? "border-zinc-800 bg-[#050816]" : "border-slate-200 bg-white"),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                className: "h-4 w-4 text-zinc-500"
                            }, void 0, false, {
                                fileName: "[project]/components/layout/sidebar.tsx",
                                lineNumber: 228,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                                placeholder: "Buscar...",
                                className: "h-9 border-none bg-transparent p-0 text-sm shadow-none outline-none focus-visible:ring-0"
                            }, void 0, false, {
                                fileName: "[project]/components/layout/sidebar.tsx",
                                lineNumber: 229,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/layout/sidebar.tsx",
                        lineNumber: 220,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/layout/sidebar.tsx",
                    lineNumber: 219,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-center pb-2",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Tooltip"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TooltipTrigger"], {
                                asChild: true,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "ghost",
                                    size: "icon",
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("h-9 w-9 rounded-xl", isDark ? "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"),
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/components/layout/sidebar.tsx",
                                        lineNumber: 249,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/layout/sidebar.tsx",
                                    lineNumber: 239,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/layout/sidebar.tsx",
                                lineNumber: 238,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TooltipContent"], {
                                side: "right",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: "Buscar"
                                }, void 0, false, {
                                    fileName: "[project]/components/layout/sidebar.tsx",
                                    lineNumber: 253,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/layout/sidebar.tsx",
                                lineNumber: 252,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/layout/sidebar.tsx",
                        lineNumber: 237,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/layout/sidebar.tsx",
                    lineNumber: 236,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                    className: "flex-1 space-y-1 px-2",
                    children: mainItems.map((item)=>{
                        const Icon = item.icon;
                        const isActive = isRouteActive(item.href);
                        if (!isCollapsed) {
                            const button = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                variant: isActive ? "secondary" : "ghost",
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("group flex w-full items-center justify-start gap-3 rounded-xl px-3 py-2 text-sm font-medium tracking-tight transition-all duration-150", isActive ? "bg-gradient-to-r from-purple-600/90 to-indigo-600/90 text-white shadow-md" : isDark ? "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/components/layout/sidebar.tsx",
                                        lineNumber: 279,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: item.label
                                    }, void 0, false, {
                                        fileName: "[project]/components/layout/sidebar.tsx",
                                        lineNumber: 280,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, item.href, true, {
                                fileName: "[project]/components/layout/sidebar.tsx",
                                lineNumber: 267,
                                columnNumber: 17
                            }, this);
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: item.href,
                                children: button
                            }, item.href, false, {
                                fileName: "[project]/components/layout/sidebar.tsx",
                                lineNumber: 285,
                                columnNumber: 17
                            }, this);
                        }
                        const collapsedButton = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                            variant: isActive ? "secondary" : "ghost",
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex h-10 w-10 items-center justify-center rounded-2xl transition-all duration-150", isActive ? "bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-md" : isDark ? "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"),
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                className: "h-4 w-4"
                            }, void 0, false, {
                                fileName: "[project]/components/layout/sidebar.tsx",
                                lineNumber: 304,
                                columnNumber: 17
                            }, this)
                        }, item.href, false, {
                            fileName: "[project]/components/layout/sidebar.tsx",
                            lineNumber: 292,
                            columnNumber: 15
                        }, this);
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Tooltip"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TooltipTrigger"], {
                                    asChild: true,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        href: item.href,
                                        className: "flex justify-center py-1",
                                        children: collapsedButton
                                    }, void 0, false, {
                                        fileName: "[project]/components/layout/sidebar.tsx",
                                        lineNumber: 311,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/layout/sidebar.tsx",
                                    lineNumber: 310,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TooltipContent"], {
                                    side: "right",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: item.label
                                    }, void 0, false, {
                                        fileName: "[project]/components/layout/sidebar.tsx",
                                        lineNumber: 316,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/layout/sidebar.tsx",
                                    lineNumber: 315,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, item.href, true, {
                            fileName: "[project]/components/layout/sidebar.tsx",
                            lineNumber: 309,
                            columnNumber: 15
                        }, this);
                    })
                }, void 0, false, {
                    fileName: "[project]/components/layout/sidebar.tsx",
                    lineNumber: 260,
                    columnNumber: 9
                }, this),
                (settingsItem || changelogItem || manualItem) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "px-2 pb-2 space-y-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("mb-2 border-t", isDark ? "border-zinc-800" : "border-slate-200")
                        }, void 0, false, {
                            fileName: "[project]/components/layout/sidebar.tsx",
                            lineNumber: 326,
                            columnNumber: 13
                        }, this),
                        [
                            changelogItem,
                            manualItem,
                            settingsItem
                        ].filter(Boolean).map((item)=>{
                            if (!item) return null;
                            const isActive = isRouteActive(item.href);
                            const ButtonContent = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: isActive ? "secondary" : "ghost",
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex w-full items-center justify-start gap-3 rounded-xl px-3 py-2 text-sm font-medium tracking-tight transition-all duration-150", isActive ? "bg-gradient-to-r from-purple-600/90 to-indigo-600/90 text-white shadow-md" : isDark ? "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(item.icon, {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/components/layout/sidebar.tsx",
                                            lineNumber: 349,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: item.label
                                        }, void 0, false, {
                                            fileName: "[project]/components/layout/sidebar.tsx",
                                            lineNumber: 350,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/layout/sidebar.tsx",
                                    lineNumber: 338,
                                    columnNumber: 19
                                }, this);
                            if (!isCollapsed) {
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: item.href,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ButtonContent, {}, void 0, false, {
                                        fileName: "[project]/components/layout/sidebar.tsx",
                                        lineNumber: 357,
                                        columnNumber: 23
                                    }, this)
                                }, item.href, false, {
                                    fileName: "[project]/components/layout/sidebar.tsx",
                                    lineNumber: 356,
                                    columnNumber: 21
                                }, this);
                            }
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Tooltip"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TooltipTrigger"], {
                                        asChild: true,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            href: item.href,
                                            className: "flex justify-center py-1",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                variant: isActive ? "secondary" : "ghost",
                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex h-10 w-10 items-center justify-center rounded-2xl transition-all duration-150", isActive ? "bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-md" : isDark ? "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"),
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(item.icon, {
                                                    className: "h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/layout/sidebar.tsx",
                                                    lineNumber: 380,
                                                    columnNumber: 27
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/layout/sidebar.tsx",
                                                lineNumber: 369,
                                                columnNumber: 25
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/layout/sidebar.tsx",
                                            lineNumber: 365,
                                            columnNumber: 23
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/layout/sidebar.tsx",
                                        lineNumber: 364,
                                        columnNumber: 21
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TooltipContent"], {
                                        side: "right",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: item.label
                                        }, void 0, false, {
                                            fileName: "[project]/components/layout/sidebar.tsx",
                                            lineNumber: 385,
                                            columnNumber: 23
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/layout/sidebar.tsx",
                                        lineNumber: 384,
                                        columnNumber: 21
                                    }, this)
                                ]
                            }, item.href, true, {
                                fileName: "[project]/components/layout/sidebar.tsx",
                                lineNumber: 363,
                                columnNumber: 19
                            }, this);
                        })
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/layout/sidebar.tsx",
                    lineNumber: 325,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("border-t px-3 py-3 text-[11px]", isDark ? "border-zinc-800 text-zinc-500" : "border-slate-200 text-slate-500"),
                    children: !isCollapsed ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("font-medium", isDark ? "text-zinc-400" : "text-slate-700"),
                                        children: "Postura Security Management"
                                    }, void 0, false, {
                                        fileName: "[project]/components/layout/sidebar.tsx",
                                        lineNumber: 405,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "v1.4.0"
                                    }, void 0, false, {
                                        fileName: "[project]/components/layout/sidebar.tsx",
                                        lineNumber: 413,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/layout/sidebar.tsx",
                                lineNumber: 404,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: toggleTheme,
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex h-8 w-8 items-center justify-center rounded-full border text-xs transition-all duration-200", isDark ? "border-zinc-700 bg-[#050816] text-zinc-100 hover:bg-zinc-900" : "border-slate-300 bg-white text-yellow-400 hover:bg-slate-100"),
                                children: isDark ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__["Moon"], {
                                    className: "h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/components/layout/sidebar.tsx",
                                    lineNumber: 427,
                                    columnNumber: 19
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"], {
                                    className: "h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/components/layout/sidebar.tsx",
                                    lineNumber: 429,
                                    columnNumber: 19
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/layout/sidebar.tsx",
                                lineNumber: 417,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/layout/sidebar.tsx",
                        lineNumber: 403,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col items-center gap-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[10px] font-medium",
                                children: "Postura SM"
                            }, void 0, false, {
                                fileName: "[project]/components/layout/sidebar.tsx",
                                lineNumber: 435,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: toggleTheme,
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex h-7 w-7 items-center justify-center rounded-full border text-[10px] transition-all duration-200", isDark ? "border-zinc-700 bg-[#050816] text-zinc-100 hover:bg-zinc-900" : "border-slate-300 bg-white text-yellow-400 hover:bg-slate-100"),
                                children: isDark ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__["Moon"], {
                                    className: "h-3 w-3"
                                }, void 0, false, {
                                    fileName: "[project]/components/layout/sidebar.tsx",
                                    lineNumber: 446,
                                    columnNumber: 19
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"], {
                                    className: "h-3 w-3"
                                }, void 0, false, {
                                    fileName: "[project]/components/layout/sidebar.tsx",
                                    lineNumber: 448,
                                    columnNumber: 19
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/layout/sidebar.tsx",
                                lineNumber: 436,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[9px]",
                                children: "v1.4.0"
                            }, void 0, false, {
                                fileName: "[project]/components/layout/sidebar.tsx",
                                lineNumber: 451,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/layout/sidebar.tsx",
                        lineNumber: 434,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/layout/sidebar.tsx",
                    lineNumber: 394,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/layout/sidebar.tsx",
            lineNumber: 153,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/layout/sidebar.tsx",
        lineNumber: 152,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/ui/badge.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Badge",
    ()=>Badge,
    "badgeVariants",
    ()=>badgeVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
const badgeVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2", {
    variants: {
        variant: {
            default: "border-transparent bg-zinc-900 text-zinc-50 hover:bg-zinc-900/90 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/80",
            secondary: "border-transparent bg-zinc-100 text-zinc-800 hover:bg-zinc-100/80 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-800/80",
            outline: "border-zinc-200 bg-transparent text-zinc-800 dark:border-zinc-800 dark:text-zinc-100",
            success: "border-transparent bg-emerald-600/15 text-emerald-500 dark:bg-emerald-500/15 dark:text-emerald-300",
            warning: "border-transparent bg-amber-500/15 text-amber-500 dark:bg-amber-500/20 dark:text-amber-300",
            critical: "border-transparent bg-rose-600/15 text-rose-500 dark:bg-rose-500/20 dark:text-rose-300"
        }
    },
    defaultVariants: {
        variant: "default"
    }
});
function Badge({ className, variant, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(badgeVariants({
            variant
        }), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/badge.tsx",
        lineNumber: 38,
        columnNumber: 5
    }, this);
}
;
}),
"[project]/components/layout/dashboard-shell.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DashboardShell",
    ()=>DashboardShell
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$sidebar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/layout/sidebar.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$theme$2f$theme$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/theme/theme-provider.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bell.js [app-ssr] (ecmascript) <export default as Bell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/badge.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
;
;
function DashboardShell({ children, pageTitle = "Dashboard", pageSubtitle = "Visão Geral de Vulnerabilidades" }) {
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [checkingAuth, setCheckingAuth] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [isCollapsed, setIsCollapsed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showNotifications, setShowNotifications] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [notifications, setNotifications] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [notificationsLoading, setNotificationsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [notificationsError, setNotificationsError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [unreadCount, setUnreadCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [clearingNotifications, setClearingNotifications] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { theme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$theme$2f$theme$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTheme"])();
    const isDark = theme === "dark";
    // Guarda de autenticação
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        try {
            const raw = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : null;
            if ("TURBOPACK compile-time truthy", 1) {
                router.replace("/login");
                setCheckingAuth(false);
                return;
            }
            //TURBOPACK unreachable
            ;
            const parsed = undefined;
        } catch  {
            localStorage.removeItem("postura_user");
            router.replace("/login");
            setCheckingAuth(false);
        }
    }, [
        router
    ]);
    // Sidebar começa colapsada em telas pequenas
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (("TURBOPACK compile-time value", "undefined") !== "undefined" && window.innerWidth < 768) //TURBOPACK unreachable
        ;
    }, []);
    const fetchNotifications = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (silent = false, ignoreState)=>{
        if (!user) return;
        if (!silent) {
            setNotificationsLoading(true);
            setNotificationsError(null);
        }
        try {
            const response = await fetch("/api/notifications");
            const data = await response.json().catch(()=>null);
            if (!response.ok) {
                throw new Error(data?.error || "Não foi possível carregar notificações.");
            }
            if (ignoreState?.current) return;
            setNotifications(data?.notifications ?? []);
            setUnreadCount(data?.unreadCount ?? 0);
        } catch (err) {
            if (ignoreState?.current) return;
            setNotificationsError(err instanceof Error ? err.message : "Falha ao carregar notificações.");
        } finally{
            if (ignoreState?.current) return;
            if (!silent) {
                setNotificationsLoading(false);
            }
        }
    }, [
        user
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!user) return;
        const ignoreState = {
            current: false
        };
        fetchNotifications(false, ignoreState);
        const interval = setInterval(()=>{
            fetchNotifications(true, ignoreState);
        }, 45000);
        return ()=>{
            ignoreState.current = true;
            clearInterval(interval);
        };
    }, [
        user,
        fetchNotifications
    ]);
    const markAllNotificationsAsRead = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        if (!user) return;
        try {
            const response = await fetch("/api/notifications", {
                method: "PATCH"
            });
            if (!response.ok) {
                const data = await response.json().catch(()=>null);
                throw new Error(data?.error || "Não foi possível marcar como lidas.");
            }
            const readTimestamp = new Date().toISOString();
            setNotifications((prev)=>prev.map((notification)=>({
                        ...notification,
                        is_read: true,
                        read_at: notification.read_at ?? readTimestamp
                    })));
            setUnreadCount(0);
        } catch (err) {
            setNotificationsError(err instanceof Error ? err.message : "Falha ao atualizar status das notificações.");
        }
    }, [
        user
    ]);
    function handleNotificationsToggle() {
        const next = !showNotifications;
        setShowNotifications(next);
        if (next && unreadCount > 0) {
            markAllNotificationsAsRead();
        }
    }
    async function handleClearNotifications() {
        if (clearingNotifications) return;
        setNotificationsError(null);
        setClearingNotifications(true);
        try {
            const response = await fetch("/api/notifications", {
                method: "DELETE"
            });
            if (!response.ok) {
                const data = await response.json().catch(()=>null);
                throw new Error(data?.error || "Não foi possível limpar notificações.");
            }
            setNotifications([]);
            setUnreadCount(0);
        } catch (err) {
            setNotificationsError(err instanceof Error ? err.message : "Falha ao limpar notificações.");
        } finally{
            setClearingNotifications(false);
        }
    }
    function getNotificationMeta(type) {
        if (type.includes("action")) {
            return {
                label: "Fluxo de ações",
                accent: "from-purple-500/40 via-indigo-500/20 to-sky-500/10",
                badgeClass: "text-purple-200 border-purple-400/40 bg-purple-500/10"
            };
        }
        if (type.includes("audit") || type.includes("job")) {
            return {
                label: "Auditoria",
                accent: "from-emerald-500/30 via-teal-500/10 to-cyan-500/10",
                badgeClass: "text-emerald-200 border-emerald-400/40 bg-emerald-500/10"
            };
        }
        return {
            label: "Sistema",
            accent: "from-zinc-500/20 via-slate-500/10 to-gray-500/5",
            badgeClass: "text-zinc-200 border-white/10 bg-white/5"
        };
    }
    if (checkingAuth || !user) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex h-screen w-full", isDark ? "bg-[#050816] text-zinc-100" : "bg-slate-100 text-slate-900"),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$sidebar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Sidebar"], {
                isCollapsed: isCollapsed,
                onToggle: ()=>setIsCollapsed((prev)=>!prev)
            }, void 0, false, {
                fileName: "[project]/components/layout/dashboard-shell.tsx",
                lineNumber: 229,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-1 flex-col overflow-hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("relative z-50 flex h-16 items-center justify-between border-b px-4 md:px-6 backdrop-blur", isDark ? "border-zinc-800 bg-[#050816]/90" : "border-slate-200 bg-white/80"),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[10px] md:text-xs uppercase tracking-[0.25em] text-zinc-500",
                                        children: pageSubtitle
                                    }, void 0, false, {
                                        fileName: "[project]/components/layout/dashboard-shell.tsx",
                                        lineNumber: 244,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "text-lg md:text-xl font-semibold",
                                        children: pageTitle
                                    }, void 0, false, {
                                        fileName: "[project]/components/layout/dashboard-shell.tsx",
                                        lineNumber: 247,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/layout/dashboard-shell.tsx",
                                lineNumber: 243,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 md:gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleNotificationsToggle,
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("relative flex h-9 w-9 items-center justify-center rounded-full border text-xs transition-colors", isDark ? "border-zinc-700 bg-[#050816] text-zinc-200 hover:bg-zinc-900" : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"], {
                                                className: "h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/components/layout/dashboard-shell.tsx",
                                                lineNumber: 261,
                                                columnNumber: 15
                                            }, this),
                                            unreadCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500"
                                            }, void 0, false, {
                                                fileName: "[project]/components/layout/dashboard-shell.tsx",
                                                lineNumber: 263,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/layout/dashboard-shell.tsx",
                                        lineNumber: 252,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "hidden flex-col items-end sm:flex",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm font-medium",
                                                children: user.name
                                            }, void 0, false, {
                                                fileName: "[project]/components/layout/dashboard-shell.tsx",
                                                lineNumber: 269,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs opacity-70",
                                                children: user.email
                                            }, void 0, false, {
                                                fileName: "[project]/components/layout/dashboard-shell.tsx",
                                                lineNumber: 270,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/layout/dashboard-shell.tsx",
                                        lineNumber: 268,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative h-8 w-8 md:h-9 md:w-9 overflow-hidden rounded-full border",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            src: user.avatar || "/logo_vivo_sem_fundo.png",
                                            alt: "Avatar do usuário",
                                            fill: true,
                                            className: "object-contain"
                                        }, void 0, false, {
                                            fileName: "[project]/components/layout/dashboard-shell.tsx",
                                            lineNumber: 274,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/layout/dashboard-shell.tsx",
                                        lineNumber: 273,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/layout/dashboard-shell.tsx",
                                lineNumber: 250,
                                columnNumber: 11
                            }, this),
                            showNotifications && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("absolute right-4 top-16 z-50 w-96 overflow-hidden rounded-3xl border p-4 shadow-2xl backdrop-blur", isDark ? "border-zinc-800/80 bg-gradient-to-b from-[#0b0f24]/95 via-[#070a19]/95 to-[#050611]/95" : "border-slate-200 bg-gradient-to-b from-white via-slate-50 to-white"),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute inset-0 pointer-events-none",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "absolute -top-8 right-0 h-32 w-32 rounded-full bg-purple-500/20 blur-3xl"
                                            }, void 0, false, {
                                                fileName: "[project]/components/layout/dashboard-shell.tsx",
                                                lineNumber: 295,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "absolute -bottom-10 left-0 h-32 w-32 rounded-full bg-sky-500/10 blur-3xl"
                                            }, void 0, false, {
                                                fileName: "[project]/components/layout/dashboard-shell.tsx",
                                                lineNumber: 296,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/layout/dashboard-shell.tsx",
                                        lineNumber: 294,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative mb-4 flex flex-col gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                                            variant: "outline",
                                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-[10px] uppercase tracking-[0.3em]", isDark ? "border-white/10 bg-white/5 text-purple-200" : "border-purple-200 bg-purple-50 text-purple-700"),
                                                            children: "Central de alertas"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/layout/dashboard-shell.tsx",
                                                            lineNumber: 301,
                                                            columnNumber: 21
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/layout/dashboard-shell.tsx",
                                                        lineNumber: 300,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex flex-col items-end gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-[10px] text-zinc-500",
                                                                children: "Atualiza automaticamente"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/layout/dashboard-shell.tsx",
                                                                lineNumber: 314,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex gap-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "button",
                                                                        onClick: ()=>fetchNotifications(false),
                                                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("rounded-full px-3 py-1 text-[11px] font-semibold transition", isDark ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-900/30" : "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md"),
                                                                        children: "Atualizar"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/layout/dashboard-shell.tsx",
                                                                        lineNumber: 318,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "button",
                                                                        onClick: handleClearNotifications,
                                                                        disabled: clearingNotifications,
                                                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("rounded-full px-3 py-1 text-[11px] font-semibold transition", clearingNotifications ? "cursor-not-allowed opacity-60" : isDark ? "border border-white/20 text-zinc-200 hover:bg-white/10" : "border border-slate-200 text-slate-600 hover:bg-slate-100"),
                                                                        children: "Limpar"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/layout/dashboard-shell.tsx",
                                                                        lineNumber: 330,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/layout/dashboard-shell.tsx",
                                                                lineNumber: 317,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/layout/dashboard-shell.tsx",
                                                        lineNumber: 313,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/layout/dashboard-shell.tsx",
                                                lineNumber: 299,
                                                columnNumber: 17
                                            }, this),
                                            notificationsError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "rounded-2xl border border-rose-500/40 bg-rose-500/15 px-3 py-2 text-xs text-rose-100",
                                                children: notificationsError
                                            }, void 0, false, {
                                                fileName: "[project]/components/layout/dashboard-shell.tsx",
                                                lineNumber: 349,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/layout/dashboard-shell.tsx",
                                        lineNumber: 298,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative max-h-80 space-y-3 overflow-y-auto text-xs pr-1",
                                        children: notificationsLoading && notifications.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[11px] text-zinc-500",
                                            children: "Carregando notificações..."
                                        }, void 0, false, {
                                            fileName: "[project]/components/layout/dashboard-shell.tsx",
                                            lineNumber: 357,
                                            columnNumber: 19
                                        }, this) : notifications.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[11px] text-zinc-500",
                                            children: "Nenhuma notificação recente."
                                        }, void 0, false, {
                                            fileName: "[project]/components/layout/dashboard-shell.tsx",
                                            lineNumber: 361,
                                            columnNumber: 19
                                        }, this) : notifications.map((notification)=>(()=>{
                                                const actionLink = notification.type === "action_request_received" && notification.payload && typeof notification.payload.requestId === "number" ? `/fila-aprovacoes#request-${notification.payload.requestId}` : null;
                                                const meta = getNotificationMeta(notification.type);
                                                const content = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center justify-between",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-[10px] uppercase tracking-[0.25em] text-zinc-500",
                                                                    children: new Date(notification.created_at).toLocaleString("pt-BR", {
                                                                        timeZone: "America/Sao_Paulo"
                                                                    })
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/layout/dashboard-shell.tsx",
                                                                    lineNumber: 377,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                                                    variant: "outline",
                                                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-[10px]", meta.badgeClass, notification.is_read && (isDark ? "border-zinc-700/60 text-zinc-400" : "border-slate-200 text-slate-500")),
                                                                    children: meta.label
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/layout/dashboard-shell.tsx",
                                                                    lineNumber: 383,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/layout/dashboard-shell.tsx",
                                                            lineNumber: 376,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-sm font-semibold", isDark ? "text-zinc-100" : "text-slate-900"),
                                                            children: notification.title
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/layout/dashboard-shell.tsx",
                                                            lineNumber: 397,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-[11px] text-zinc-400",
                                                            children: notification.message
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/layout/dashboard-shell.tsx",
                                                            lineNumber: 405,
                                                            columnNumber: 27
                                                        }, this),
                                                        actionLink && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-[10px] font-semibold text-purple-300 underline",
                                                            children: "Abrir solicitação"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/layout/dashboard-shell.tsx",
                                                            lineNumber: 409,
                                                            columnNumber: 29
                                                        }, this)
                                                    ]
                                                }, void 0, true);
                                                const baseClasses = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("relative block overflow-hidden rounded-2xl border px-4 py-3 transition", notification.is_read ? isDark ? "border-zinc-800/70 bg-zinc-900/40" : "border-slate-200 bg-white/70" : isDark ? "border-white/10 bg-white/5" : "border-purple-200 bg-purple-50/80", "hover:border-purple-400/60 hover:shadow-lg");
                                                const card = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("pointer-events-none absolute inset-0 opacity-50", `bg-gradient-to-r ${meta.accent}`)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/layout/dashboard-shell.tsx",
                                                            lineNumber: 428,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "relative",
                                                            children: content
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/layout/dashboard-shell.tsx",
                                                            lineNumber: 434,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true);
                                                return actionLink ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    href: actionLink,
                                                    className: baseClasses,
                                                    children: card
                                                }, notification.id, false, {
                                                    fileName: "[project]/components/layout/dashboard-shell.tsx",
                                                    lineNumber: 438,
                                                    columnNumber: 25
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: baseClasses,
                                                    children: card
                                                }, notification.id, false, {
                                                    fileName: "[project]/components/layout/dashboard-shell.tsx",
                                                    lineNumber: 442,
                                                    columnNumber: 25
                                                }, this);
                                            })())
                                    }, void 0, false, {
                                        fileName: "[project]/components/layout/dashboard-shell.tsx",
                                        lineNumber: 355,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/layout/dashboard-shell.tsx",
                                lineNumber: 286,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/layout/dashboard-shell.tsx",
                        lineNumber: 235,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex-1 overflow-auto px-4 py-4 md:px-6 md:py-6", isDark ? "bg-gradient-to-b from-[#050816] via-[#050816] to-[#02010d]" : "bg-gradient-to-b from-slate-100 via-slate-100 to-slate-200"),
                        children: children
                    }, void 0, false, {
                        fileName: "[project]/components/layout/dashboard-shell.tsx",
                        lineNumber: 454,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/layout/dashboard-shell.tsx",
                lineNumber: 234,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/layout/dashboard-shell.tsx",
        lineNumber: 221,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/ui/card.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Card",
    ()=>Card,
    "CardAction",
    ()=>CardAction,
    "CardContent",
    ()=>CardContent,
    "CardDescription",
    ()=>CardDescription,
    "CardFooter",
    ()=>CardFooter,
    "CardHeader",
    ()=>CardHeader,
    "CardTitle",
    ()=>CardTitle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
;
;
function Card({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
function CardHeader({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-header",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 20,
        columnNumber: 5
    }, this);
}
function CardTitle({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-title",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("leading-none font-semibold", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
}
function CardDescription({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-description",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-muted-foreground text-sm", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 43,
        columnNumber: 5
    }, this);
}
function CardAction({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-action",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 53,
        columnNumber: 5
    }, this);
}
function CardContent({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-content",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("px-6", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 66,
        columnNumber: 5
    }, this);
}
function CardFooter({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-footer",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex items-center px-6 [.border-t]:pt-6", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 76,
        columnNumber: 5
    }, this);
}
;
}),
"[project]/components/ui/textarea.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Textarea",
    ()=>Textarea
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
const Textarea = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex min-h-[80px] w-full rounded-2xl border border-zinc-800 bg-[#050816] px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 disabled:cursor-not-allowed disabled:opacity-50", className),
        ref: ref,
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/textarea.tsx",
        lineNumber: 11,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
Textarea.displayName = "Textarea";
;
}),
"[project]/components/ui/scroll-area.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ScrollArea",
    ()=>ScrollArea,
    "ScrollBar",
    ()=>ScrollBar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$scroll$2d$area$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-scroll-area/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
function ScrollArea({ className, children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$scroll$2d$area$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Root"], {
        "data-slot": "scroll-area",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("relative", className),
        ...props,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$scroll$2d$area$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Viewport"], {
                "data-slot": "scroll-area-viewport",
                className: "focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1",
                children: children
            }, void 0, false, {
                fileName: "[project]/components/ui/scroll-area.tsx",
                lineNumber: 19,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ScrollBar, {}, void 0, false, {
                fileName: "[project]/components/ui/scroll-area.tsx",
                lineNumber: 25,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$scroll$2d$area$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Corner"], {}, void 0, false, {
                fileName: "[project]/components/ui/scroll-area.tsx",
                lineNumber: 26,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/scroll-area.tsx",
        lineNumber: 14,
        columnNumber: 5
    }, this);
}
function ScrollBar({ className, orientation = "vertical", ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$scroll$2d$area$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ScrollAreaScrollbar"], {
        "data-slot": "scroll-area-scrollbar",
        orientation: orientation,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex touch-none p-px transition-colors select-none", orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent", orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent", className),
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$scroll$2d$area$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ScrollAreaThumb"], {
            "data-slot": "scroll-area-thumb",
            className: "bg-border relative flex-1 rounded-full"
        }, void 0, false, {
            fileName: "[project]/components/ui/scroll-area.tsx",
            lineNumber: 50,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/ui/scroll-area.tsx",
        lineNumber: 37,
        columnNumber: 5
    }, this);
}
;
}),
"[project]/data/jira-fields.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v(JSON.parse("[{\"id\":\"customfield_13100\",\"name\":\"Last seen (deep security)\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[13100]\",\"Last seen (deep security)\"],\"schema\":{\"type\":\"date\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:datepicker\",\"customId\":13100}},{\"id\":\"customfield_13102\",\"name\":\"Tipo de Mitigação\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[13102]\",\"Tipo de Mitigação\"],\"schema\":{\"type\":\"option\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:radiobuttons\",\"customId\":13102}},{\"id\":\"customfield_13101\",\"name\":\"Agents\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"Agents\",\"cf[13101]\"],\"schema\":{\"type\":\"array\",\"items\":\"option\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:multicheckboxes\",\"customId\":13101}},{\"id\":\"resolution\",\"name\":\"Resolution\",\"custom\":false,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"resolution\"],\"schema\":{\"type\":\"resolution\",\"system\":\"resolution\"}},{\"id\":\"customfield_10630\",\"name\":\"Information\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10630]\",\"Information\"],\"schema\":{\"type\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:textarea\",\"customId\":10630}},{\"id\":\"customfield_12800\",\"name\":\"Marcado para propagação\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[12800]\",\"Marcado para propagação\"],\"schema\":{\"type\":\"option\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:radiobuttons\",\"customId\":12800}},{\"id\":\"customfield_10622\",\"name\":\"Risk prioritization\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10622]\",\"Risk prioritization\"],\"schema\":{\"type\":\"option\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:select\",\"customId\":10622}},{\"id\":\"customfield_10623\",\"name\":\"OWASP Top 10\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10623]\",\"OWASP Top 10\"],\"schema\":{\"type\":\"option\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:select\",\"customId\":10623}},{\"id\":\"customfield_12801\",\"name\":\"Marcado para propagação em\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[12801]\",\"Marcado para propagação em\"],\"schema\":{\"type\":\"datetime\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:datetime\",\"customId\":12801}},{\"id\":\"customfield_10624\",\"name\":\"OWASP Top 10 Mobile\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10624]\",\"OWASP Top 10 Mobile\"],\"schema\":{\"type\":\"option\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:select\",\"customId\":10624}},{\"id\":\"customfield_10628\",\"name\":\"References\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10628]\",\"References\"],\"schema\":{\"type\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:textarea\",\"customId\":10628}},{\"id\":\"lastViewed\",\"name\":\"Last Viewed\",\"custom\":false,\"orderable\":false,\"navigable\":true,\"searchable\":false,\"clauseNames\":[\"lastViewed\"],\"schema\":{\"type\":\"datetime\",\"system\":\"lastViewed\"}},{\"id\":\"customfield_12000\",\"name\":\"Vul. ID TEMP\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[12000]\",\"Vul. ID TEMP\"],\"schema\":{\"type\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:textfield\",\"customId\":12000}},{\"id\":\"labels\",\"name\":\"Labels\",\"custom\":false,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"labels\"],\"schema\":{\"type\":\"array\",\"items\":\"string\",\"system\":\"labels\"}},{\"id\":\"customfield_10610\",\"name\":\"Asset\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"Asset\",\"cf[10610]\"],\"schema\":{\"type\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:textfield\",\"customId\":10610}},{\"id\":\"customfield_11700\",\"name\":\"Asset_LB\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"Asset_LB\",\"cf[11700]\"],\"schema\":{\"type\":\"array\",\"items\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:labels\",\"customId\":11700}},{\"id\":\"customfield_10611\",\"name\":\"Scan Zone\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10611]\",\"Scan Zone\"],\"schema\":{\"type\":\"option\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:select\",\"customId\":10611}},{\"id\":\"customfield_11702\",\"name\":\"Área Proprietária Ativo Diretor_LB\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[11702]\",\"Área Proprietária Ativo Diretor_LB\"],\"schema\":{\"type\":\"array\",\"items\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:labels\",\"customId\":11702}},{\"id\":\"customfield_11701\",\"name\":\"Sistema_LB\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[11701]\",\"Sistema_LB\"],\"schema\":{\"type\":\"array\",\"items\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:labels\",\"customId\":11701}},{\"id\":\"aggregatetimeoriginalestimate\",\"name\":\"Σ Original Estimate\",\"custom\":false,\"orderable\":false,\"navigable\":true,\"searchable\":false,\"clauseNames\":[],\"schema\":{\"type\":\"number\",\"system\":\"aggregatetimeoriginalestimate\"}},{\"id\":\"customfield_10614\",\"name\":\"Target\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10614]\",\"Target\"],\"schema\":{\"type\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:textfield\",\"customId\":10614}},{\"id\":\"customfield_11704\",\"name\":\"Área Proprietária Ativo Ponto Focal_LB\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[11704]\",\"Área Proprietária Ativo Ponto Focal_LB\"],\"schema\":{\"type\":\"array\",\"items\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:labels\",\"customId\":11704}},{\"id\":\"customfield_11703\",\"name\":\"Área Proprietária Ativo Gerente Sr_LB\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[11703]\",\"Área Proprietária Ativo Gerente Sr_LB\"],\"schema\":{\"type\":\"array\",\"items\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:labels\",\"customId\":11703}},{\"id\":\"customfield_11706\",\"name\":\"Área Solucionadora Responsável Gerente Sr_LB\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[11706]\",\"Área Solucionadora Responsável Gerente Sr_LB\"],\"schema\":{\"type\":\"array\",\"items\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:labels\",\"customId\":11706}},{\"id\":\"customfield_11705\",\"name\":\"Área Solucionadora Responsável Diretor_LB\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[11705]\",\"Área Solucionadora Responsável Diretor_LB\"],\"schema\":{\"type\":\"array\",\"items\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:labels\",\"customId\":11705}},{\"id\":\"customfield_10619\",\"name\":\"VA status\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10619]\",\"VA status\"],\"schema\":{\"type\":\"option\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:select\",\"customId\":10619}},{\"id\":\"customfield_11707\",\"name\":\"Área Solucionadora Responsável Ponto Focal_LB\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[11707]\",\"Área Solucionadora Responsável Ponto Focal_LB\"],\"schema\":{\"type\":\"array\",\"items\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:labels\",\"customId\":11707}},{\"id\":\"issuelinks\",\"name\":\"Linked Issues\",\"custom\":false,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[],\"schema\":{\"type\":\"array\",\"items\":\"issuelinks\",\"system\":\"issuelinks\"}},{\"id\":\"assignee\",\"name\":\"Assignee\",\"custom\":false,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"assignee\"],\"schema\":{\"type\":\"user\",\"system\":\"assignee\"}},{\"id\":\"components\",\"name\":\"Component/s\",\"custom\":false,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"component\"],\"schema\":{\"type\":\"array\",\"items\":\"component\",\"system\":\"components\"}},{\"id\":\"customfield_13201\",\"name\":\"Responsável de Desenvolvimento\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[13201]\",\"Responsável de Desenvolvimento\"],\"schema\":{\"type\":\"array\",\"items\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:labels\",\"customId\":13201}},{\"id\":\"customfield_13200\",\"name\":\"Owner de Desenvolvimento\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[13200]\",\"Owner de Desenvolvimento\"],\"schema\":{\"type\":\"array\",\"items\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:labels\",\"customId\":13200}},{\"id\":\"customfield_13203\",\"name\":\"Responsável de Operação\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[13203]\",\"Responsável de Operação\"],\"schema\":{\"type\":\"array\",\"items\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:labels\",\"customId\":13203}},{\"id\":\"customfield_13202\",\"name\":\"Owner de Operação\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[13202]\",\"Owner de Operação\"],\"schema\":{\"type\":\"array\",\"items\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:labels\",\"customId\":13202}},{\"id\":\"customfield_13205\",\"name\":\"Owner de Sustentação\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[13205]\",\"Owner de Sustentação\"],\"schema\":{\"type\":\"array\",\"items\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:labels\",\"customId\":13205}},{\"id\":\"customfield_13204\",\"name\":\"Responsável de Sustentação\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[13204]\",\"Responsável de Sustentação\"],\"schema\":{\"type\":\"array\",\"items\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:labels\",\"customId\":13204}},{\"id\":\"customfield_10720\",\"name\":\"Contagem Reabertura\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10720]\",\"Contagem Reabertura\"],\"schema\":{\"type\":\"number\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:float\",\"customId\":10720}},{\"id\":\"customfield_10721\",\"name\":\"Data Sincronização\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10721]\",\"Data Sincronização\"],\"schema\":{\"type\":\"date\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:datepicker\",\"customId\":10721}},{\"id\":\"customfield_10722\",\"name\":\"NetBios Name\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10722]\",\"NetBios Name\"],\"schema\":{\"type\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:textfield\",\"customId\":10722}},{\"id\":\"customfield_12901\",\"name\":\"Total Vulnerabilidades (Ativo)\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[12901]\",\"Total Vulnerabilidades (Ativo)\"],\"schema\":{\"type\":\"number\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:float\",\"customId\":12901}},{\"id\":\"customfield_10723\",\"name\":\"DNS Name\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10723]\",\"DNS Name\"],\"schema\":{\"type\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:textfield\",\"customId\":10723}},{\"id\":\"customfield_12900\",\"name\":\"Total Criticas (Ativo)\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[12900]\",\"Total Criticas (Ativo)\"],\"schema\":{\"type\":\"number\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:float\",\"customId\":12900}},{\"id\":\"customfield_10724\",\"name\":\"CPE\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10724]\",\"CPE\"],\"schema\":{\"type\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:textarea\",\"customId\":10724}},{\"id\":\"customfield_10603\",\"name\":\"Sistema PSD\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10603]\",\"Sistema PSD\"],\"schema\":{\"type\":\"option\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:select\",\"customId\":10603}},{\"id\":\"customfield_10607\",\"name\":\"Port\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10607]\",\"Port\"],\"schema\":{\"type\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:textfield\",\"customId\":10607}},{\"id\":\"customfield_10608\",\"name\":\"Ambiente\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"Ambiente\",\"cf[10608]\"],\"schema\":{\"type\":\"option\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:select\",\"customId\":10608}},{\"id\":\"customfield_10609\",\"name\":\"Template\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10609]\",\"Template\"],\"schema\":{\"type\":\"option\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:select\",\"customId\":10609}},{\"id\":\"subtasks\",\"name\":\"Sub-Tasks\",\"custom\":false,\"orderable\":false,\"navigable\":true,\"searchable\":false,\"clauseNames\":[\"subtasks\"],\"schema\":{\"type\":\"array\",\"items\":\"issuelinks\",\"system\":\"subtasks\"}},{\"id\":\"reporter\",\"name\":\"Reporter\",\"custom\":false,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"reporter\"],\"schema\":{\"type\":\"user\",\"system\":\"reporter\"}},{\"id\":\"customfield_12100\",\"name\":\"Joia Da Coroa - RT\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[12100]\",\"Joia Da Coroa - RT\"],\"schema\":{\"type\":\"option\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:select\",\"customId\":12100}},{\"id\":\"customfield_10710\",\"name\":\"Impacts Risk Vector Grade\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10710]\",\"Impacts Risk Vector Grade\"],\"schema\":{\"type\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:textfield\",\"customId\":10710}},{\"id\":\"customfield_10711\",\"name\":\"Asset Importance\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"Asset Importance\",\"cf[10711]\"],\"schema\":{\"type\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:textfield\",\"customId\":10711}},{\"id\":\"customfield_11801\",\"name\":\"Compliance Result\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[11801]\",\"Compliance Result\"],\"schema\":{\"type\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:textfield\",\"customId\":11801}},{\"id\":\"customfield_11800\",\"name\":\"Audit File\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"Audit File\",\"cf[11800]\"],\"schema\":{\"type\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:textfield\",\"customId\":11800}},{\"id\":\"customfield_10712\",\"name\":\"Remaining Lifetime (days)\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10712]\",\"Remaining Lifetime (days)\"],\"schema\":{\"type\":\"number\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:float\",\"customId\":10712}},{\"id\":\"customfield_10713\",\"name\":\"Finding Severity\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10713]\",\"Finding Severity\"],\"schema\":{\"type\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:textfield\",\"customId\":10713}},{\"id\":\"customfield_11803\",\"name\":\"SGBD\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[11803]\",\"SGBD\"],\"schema\":{\"type\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:textfield\",\"customId\":11803}},{\"id\":\"customfield_11802\",\"name\":\"Banco de dados?\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"Banco de dados?\",\"cf[11802]\"],\"schema\":{\"type\":\"option\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:radiobuttons\",\"customId\":11802}},{\"id\":\"customfield_11805\",\"name\":\"Compliance Check Id\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[11805]\",\"Compliance Check Id\"],\"schema\":{\"type\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:textfield\",\"customId\":11805}},{\"id\":\"customfield_11804\",\"name\":\"Hospedeiro\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[11804]\",\"Hospedeiro\"],\"schema\":{\"type\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:textfield\",\"customId\":11804}},{\"id\":\"progress\",\"name\":\"Progress\",\"custom\":false,\"orderable\":false,\"navigable\":true,\"searchable\":false,\"clauseNames\":[\"progress\"],\"schema\":{\"type\":\"progress\",\"system\":\"progress\"}},{\"id\":\"customfield_10718\",\"name\":\"ID BITSIGHT\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10718]\",\"ID BITSIGHT\"],\"schema\":{\"type\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:textfield\",\"customId\":10718}},{\"id\":\"votes\",\"name\":\"Votes\",\"custom\":false,\"orderable\":false,\"navigable\":true,\"searchable\":false,\"clauseNames\":[\"votes\"],\"schema\":{\"type\":\"votes\",\"system\":\"votes\"}},{\"id\":\"customfield_10719\",\"name\":\"Plugin Publication Date\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10719]\",\"Plugin Publication Date\"],\"schema\":{\"type\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:textfield\",\"customId\":10719}},{\"id\":\"worklog\",\"name\":\"Log Work\",\"custom\":false,\"orderable\":true,\"navigable\":false,\"searchable\":true,\"clauseNames\":[],\"schema\":{\"type\":\"array\",\"items\":\"worklog\",\"system\":\"worklog\"}},{\"id\":\"archivedby\",\"name\":\"Archiver\",\"custom\":false,\"orderable\":true,\"navigable\":false,\"searchable\":true,\"clauseNames\":[],\"schema\":{\"type\":\"user\",\"system\":\"archivedby\"}},{\"id\":\"issuetype\",\"name\":\"Issue Type\",\"custom\":false,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"issuetype\",\"type\"],\"schema\":{\"type\":\"issuetype\",\"system\":\"issuetype\"}},{\"id\":\"project\",\"name\":\"Project\",\"custom\":false,\"orderable\":false,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"project\"],\"schema\":{\"type\":\"project\",\"system\":\"project\"}},{\"id\":\"customfield_12205\",\"name\":\"Exploit\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[12205]\",\"Exploit\"],\"schema\":{\"type\":\"option\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:radiobuttons\",\"customId\":12205}},{\"id\":\"customfield_10821\",\"name\":\"Author\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"Author\",\"cf[10821]\"],\"schema\":{\"type\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:textfield\",\"customId\":10821}},{\"id\":\"customfield_10824\",\"name\":\"Exploit CISA\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10824]\",\"Exploit CISA\"],\"schema\":{\"type\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:textfield\",\"customId\":10824}},{\"id\":\"customfield_10703\",\"name\":\"Plugin ID Nessus\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10703]\",\"Plugin ID Nessus\"],\"schema\":{\"type\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:textfield\",\"customId\":10703}},{\"id\":\"resolutiondate\",\"name\":\"Resolved\",\"custom\":false,\"orderable\":false,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"resolutiondate\",\"resolved\"],\"schema\":{\"type\":\"datetime\",\"system\":\"resolutiondate\"}},{\"id\":\"customfield_10704\",\"name\":\"GC ID\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10704]\",\"GC ID\"],\"schema\":{\"type\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:textfield\",\"customId\":10704}},{\"id\":\"customfield_10706\",\"name\":\"Age\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"Age\",\"cf[10706]\"],\"schema\":{\"type\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:textfield\",\"customId\":10706}},{\"id\":\"customfield_10707\",\"name\":\"Last seen\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10707]\",\"Last seen\"],\"schema\":{\"type\":\"date\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:datepicker\",\"customId\":10707}},{\"id\":\"customfield_10829\",\"name\":\"Company Name\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10829]\",\"Company Name\"],\"schema\":{\"type\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:textarea\",\"customId\":10829}},{\"id\":\"customfield_10708\",\"name\":\"First Seen\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10708]\",\"First Seen\"],\"schema\":{\"type\":\"date\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:datepicker\",\"customId\":10708}},{\"id\":\"customfield_10709\",\"name\":\"Grade\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10709]\",\"Grade\"],\"schema\":{\"type\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:textfield\",\"customId\":10709}},{\"id\":\"watches\",\"name\":\"Watchers\",\"custom\":false,\"orderable\":false,\"navigable\":true,\"searchable\":false,\"clauseNames\":[\"watchers\"],\"schema\":{\"type\":\"watches\",\"system\":\"watches\"}},{\"id\":\"customfield_12200\",\"name\":\"Aplicação de Patch (BMC)\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"Aplicação de Patch (BMC)\",\"cf[12200]\"],\"schema\":{\"type\":\"option\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:select\",\"customId\":12200}},{\"id\":\"customfield_12202\",\"name\":\"State Aquiles\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[12202]\",\"State Aquiles\"],\"schema\":{\"type\":\"option\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:select\",\"customId\":12202}},{\"id\":\"customfield_12201\",\"name\":\"ID Aquiles\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[12201]\",\"ID Aquiles\"],\"schema\":{\"type\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:textfield\",\"customId\":12201}},{\"id\":\"customfield_12204\",\"name\":\"Reporter Aquiles\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[12204]\",\"Reporter Aquiles\"],\"schema\":{\"type\":\"array\",\"items\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:labels\",\"customId\":12204}},{\"id\":\"customfield_12203\",\"name\":\"Source\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[12203]\",\"Source\"],\"schema\":{\"type\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:textfield\",\"customId\":12203}},{\"id\":\"customfield_10811\",\"name\":\"Zero Day\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10811]\",\"Zero Day\"],\"schema\":{\"type\":\"option\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:radiobuttons\",\"customId\":10811}},{\"id\":\"customfield_11902\",\"name\":\"Plugin Name\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[11902]\",\"Plugin Name\"],\"schema\":{\"type\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:textfield\",\"customId\":11902}},{\"id\":\"customfield_10812\",\"name\":\"Problemas Relacionados\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10812]\",\"Problemas Relacionados\"],\"schema\":{\"type\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:textarea\",\"customId\":10812}},{\"id\":\"customfield_10814\",\"name\":\"Vulnerability Status\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10814]\",\"Vulnerability Status\"],\"schema\":{\"type\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:textarea\",\"customId\":10814}},{\"id\":\"customfield_11903\",\"name\":\"Bitsight Company\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"Bitsight Company\",\"cf[11903]\"],\"schema\":{\"type\":\"option\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:radiobuttons\",\"customId\":11903}},{\"id\":\"customfield_10816\",\"name\":\"Failure Type\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10816]\",\"Failure Type\"],\"schema\":{\"type\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:textarea\",\"customId\":10816}},{\"id\":\"customfield_10818\",\"name\":\"Conviso VID\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10818]\",\"Conviso VID\"],\"schema\":{\"type\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:textfield\",\"customId\":10818}},{\"id\":\"updated\",\"name\":\"Updated\",\"custom\":false,\"orderable\":false,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"updated\",\"updatedDate\"],\"schema\":{\"type\":\"datetime\",\"system\":\"updated\"}},{\"id\":\"timeoriginalestimate\",\"name\":\"Original Estimate\",\"custom\":false,\"orderable\":false,\"navigable\":true,\"searchable\":false,\"clauseNames\":[\"originalEstimate\",\"timeoriginalestimate\"],\"schema\":{\"type\":\"number\",\"system\":\"timeoriginalestimate\"}},{\"id\":\"description\",\"name\":\"Description\",\"custom\":false,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"description\"],\"schema\":{\"type\":\"string\",\"system\":\"description\"}},{\"id\":\"customfield_13400\",\"name\":\"Subtype\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[13400]\",\"Subtype\"],\"schema\":{\"type\":\"option\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:select\",\"customId\":13400}},{\"id\":\"timetracking\",\"name\":\"Time Tracking\",\"custom\":false,\"orderable\":true,\"navigable\":false,\"searchable\":true,\"clauseNames\":[],\"schema\":{\"type\":\"timetracking\",\"system\":\"timetracking\"}},{\"id\":\"customfield_10800\",\"name\":\"CWE\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10800]\",\"CWE\"],\"schema\":{\"type\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:textarea\",\"customId\":10800}},{\"id\":\"customfield_10801\",\"name\":\"Path\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10801]\",\"Path\"],\"schema\":{\"type\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:textarea\",\"customId\":10801}},{\"id\":\"customfield_10802\",\"name\":\"status_da_tentativa\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10802]\",\"status_da_tentativa\"],\"schema\":{\"type\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:textfield\",\"customId\":10802}},{\"id\":\"customfield_10803\",\"name\":\"Vulnerabilities Hits\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10803]\",\"Vulnerabilities Hits\"],\"schema\":{\"type\":\"number\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:float\",\"customId\":10803}},{\"id\":\"customfield_10804\",\"name\":\"Novelty\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10804]\",\"Novelty\"],\"schema\":{\"type\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:textarea\",\"customId\":10804}},{\"id\":\"customfield_10805\",\"name\":\"url_burp\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10805]\",\"url_burp\"],\"schema\":{\"type\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:textfield\",\"customId\":10805}},{\"id\":\"customfield_10808\",\"name\":\"Vendor\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10808]\",\"Vendor\"],\"schema\":{\"type\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:textfield\",\"customId\":10808}},{\"id\":\"summary\",\"name\":\"Summary\",\"custom\":false,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"summary\"],\"schema\":{\"type\":\"string\",\"system\":\"summary\"}},{\"id\":\"customfield_10000\",\"name\":\"Development\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10000]\",\"Development\"],\"schema\":{\"type\":\"any\",\"custom\":\"com.atlassian.jira.plugins.jira-development-integration-plugin:devsummary\",\"customId\":10000}},{\"id\":\"customfield_12301\",\"name\":\"Owner de Negócio\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[12301]\",\"Owner de Negócio\"],\"schema\":{\"type\":\"array\",\"items\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:labels\",\"customId\":12301}},{\"id\":\"customfield_12300\",\"name\":\"Joias da Coroa\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[12300]\",\"Joias da Coroa\"],\"schema\":{\"type\":\"option\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:select\",\"customId\":12300}},{\"id\":\"customfield_12302\",\"name\":\"Responsável de Negócio\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[12302]\",\"Responsável de Negócio\"],\"schema\":{\"type\":\"array\",\"items\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:labels\",\"customId\":12302}},{\"id\":\"environment\",\"name\":\"Environment\",\"custom\":false,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"environment\"],\"schema\":{\"type\":\"string\",\"system\":\"environment\"}},{\"id\":\"duedate\",\"name\":\"Due Date\",\"custom\":false,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"due\",\"duedate\"],\"schema\":{\"type\":\"date\",\"system\":\"duedate\"}},{\"id\":\"comment\",\"name\":\"Comment\",\"custom\":false,\"orderable\":true,\"navigable\":false,\"searchable\":true,\"clauseNames\":[\"comment\"],\"schema\":{\"type\":\"comments-page\",\"system\":\"comment\"}},{\"id\":\"fixVersions\",\"name\":\"Fix Version/s\",\"custom\":false,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"fixVersion\"],\"schema\":{\"type\":\"array\",\"items\":\"version\",\"system\":\"fixVersions\"}},{\"id\":\"customfield_10110\",\"name\":\"Original story points\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10110]\",\"Original story points\"],\"schema\":{\"type\":\"number\",\"custom\":\"com.atlassian.jpo:jpo-custom-field-original-story-points\",\"customId\":10110}},{\"id\":\"customfield_11200\",\"name\":\"Categoria\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"Categoria\",\"cf[11200]\"],\"schema\":{\"type\":\"option\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:select\",\"customId\":11200}},{\"id\":\"customfield_10111\",\"name\":\"Team\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10111]\",\"Team\"],\"schema\":{\"type\":\"any\",\"custom\":\"com.atlassian.teams:rm-teams-custom-field-team\",\"customId\":10111}},{\"id\":\"customfield_13500\",\"name\":\"Tipo de Consumo\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[13500]\",\"Tipo de Consumo\"],\"schema\":{\"type\":\"option\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:select\",\"customId\":13500}},{\"id\":\"customfield_10104\",\"name\":\"Epic Name\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10104]\",\"Epic Name\"],\"schema\":{\"type\":\"string\",\"custom\":\"com.pyxis.greenhopper.jira:gh-epic-label\",\"customId\":10104}},{\"id\":\"customfield_10105\",\"name\":\"Epic Colour\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10105]\",\"Epic Colour\"],\"schema\":{\"type\":\"string\",\"custom\":\"com.pyxis.greenhopper.jira:gh-epic-color\",\"customId\":10105}},{\"id\":\"customfield_10107\",\"name\":\"Parent Link\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10107]\",\"Parent Link\"],\"schema\":{\"type\":\"any\",\"custom\":\"com.atlassian.jpo:jpo-custom-field-parent\",\"customId\":10107}},{\"id\":\"customfield_10108\",\"name\":\"Target start\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10108]\",\"Target start\"],\"schema\":{\"type\":\"date\",\"custom\":\"com.atlassian.jpo:jpo-custom-field-baseline-start\",\"customId\":10108}},{\"id\":\"customfield_10109\",\"name\":\"Target end\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10109]\",\"Target end\"],\"schema\":{\"type\":\"date\",\"custom\":\"com.atlassian.jpo:jpo-custom-field-baseline-end\",\"customId\":10109}},{\"id\":\"customfield_10902\",\"name\":\"Hermes_ID\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10902]\",\"Hermes_ID\"],\"schema\":{\"type\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:textfield\",\"customId\":10902}},{\"id\":\"priority\",\"name\":\"Priority\",\"custom\":false,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"priority\"],\"schema\":{\"type\":\"priority\",\"system\":\"priority\"}},{\"id\":\"customfield_10100\",\"name\":\"Rank\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10100]\",\"Rank\"],\"schema\":{\"type\":\"any\",\"custom\":\"com.pyxis.greenhopper.jira:gh-lexo-rank\",\"customId\":10100}},{\"id\":\"customfield_10101\",\"name\":\"Sprint\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10101]\",\"Sprint\"],\"schema\":{\"type\":\"array\",\"items\":\"string\",\"custom\":\"com.pyxis.greenhopper.jira:gh-sprint\",\"customId\":10101}},{\"id\":\"customfield_10102\",\"name\":\"Epic Link\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10102]\",\"Epic Link\"],\"schema\":{\"type\":\"any\",\"custom\":\"com.pyxis.greenhopper.jira:gh-epic-link\",\"customId\":10102}},{\"id\":\"customfield_10103\",\"name\":\"Epic Status\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10103]\",\"Epic Status\"],\"schema\":{\"type\":\"option\",\"custom\":\"com.pyxis.greenhopper.jira:gh-epic-status\",\"customId\":10103}},{\"id\":\"timeestimate\",\"name\":\"Remaining Estimate\",\"custom\":false,\"orderable\":false,\"navigable\":true,\"searchable\":false,\"clauseNames\":[\"remainingEstimate\",\"timeestimate\"],\"schema\":{\"type\":\"number\",\"system\":\"timeestimate\"}},{\"id\":\"versions\",\"name\":\"Affects Version/s\",\"custom\":false,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"affectedVersion\"],\"schema\":{\"type\":\"array\",\"items\":\"version\",\"system\":\"versions\"}},{\"id\":\"status\",\"name\":\"Status\",\"custom\":false,\"orderable\":false,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"status\"],\"schema\":{\"type\":\"status\",\"system\":\"status\"}},{\"id\":\"issuekey\",\"name\":\"Key\",\"custom\":false,\"orderable\":false,\"navigable\":true,\"searchable\":false,\"clauseNames\":[\"id\",\"issue\",\"issuekey\",\"key\"]},{\"id\":\"customfield_11300\",\"name\":\"Sigla Gov App\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[11300]\",\"Sigla Gov App\"],\"schema\":{\"type\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:textfield\",\"customId\":11300}},{\"id\":\"archiveddate\",\"name\":\"Archived\",\"custom\":false,\"orderable\":true,\"navigable\":false,\"searchable\":true,\"clauseNames\":[],\"schema\":{\"type\":\"datetime\",\"system\":\"archiveddate\"}},{\"id\":\"customfield_13600\",\"name\":\"ID Tenable WAS\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[13600]\",\"ID Tenable WAS\"],\"schema\":{\"type\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:textfield\",\"customId\":13600}},{\"id\":\"aggregatetimeestimate\",\"name\":\"Σ Remaining Estimate\",\"custom\":false,\"orderable\":false,\"navigable\":true,\"searchable\":false,\"clauseNames\":[],\"schema\":{\"type\":\"number\",\"system\":\"aggregatetimeestimate\"}},{\"id\":\"creator\",\"name\":\"Creator\",\"custom\":false,\"orderable\":false,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"creator\"],\"schema\":{\"type\":\"user\",\"system\":\"creator\"}},{\"id\":\"customfield_10681\",\"name\":\"CVE(s)\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10681]\",\"CVE(s)\"],\"schema\":{\"type\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:textarea\",\"customId\":10681}},{\"id\":\"aggregateprogress\",\"name\":\"Σ Progress\",\"custom\":false,\"orderable\":false,\"navigable\":true,\"searchable\":false,\"clauseNames\":[],\"schema\":{\"type\":\"progress\",\"system\":\"aggregateprogress\"}},{\"id\":\"customfield_10684\",\"name\":\"Vulnerability Priority Risk (VPR)\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10684]\",\"Vulnerability Priority Risk (VPR)\"],\"schema\":{\"type\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:textfield\",\"customId\":10684}},{\"id\":\"customfield_10200\",\"name\":\"issueFunction\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10200]\",\"issueFunction\"],\"schema\":{\"type\":\"any\",\"custom\":\"com.onresolve.jira.groovy.groovyrunner:jqlFunctionsCustomFieldType\",\"customId\":10200}},{\"id\":\"customfield_12500\",\"name\":\"Audit File\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"Audit File\",\"cf[12500]\"],\"schema\":{\"type\":\"array\",\"items\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:labels\",\"customId\":12500}},{\"id\":\"customfield_10313\",\"name\":\"Total Vulnerabilidades\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10313]\",\"Total Vulnerabilidades\"],\"schema\":{\"type\":\"any\",\"custom\":\"com.onresolve.jira.groovy.groovyrunner:scripted-field\",\"customId\":10313}},{\"id\":\"customfield_10314\",\"name\":\"Critical\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10314]\",\"Critical\"],\"schema\":{\"type\":\"any\",\"custom\":\"com.onresolve.jira.groovy.groovyrunner:scripted-field\",\"customId\":10314}},{\"id\":\"customfield_13701\",\"name\":\"Propagação mais recente\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[13701]\",\"Propagação mais recente\"],\"schema\":{\"type\":\"datetime\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:datetime\",\"customId\":13701}},{\"id\":\"customfield_10315\",\"name\":\"High\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10315]\",\"High\"],\"schema\":{\"type\":\"any\",\"custom\":\"com.onresolve.jira.groovy.groovyrunner:scripted-field\",\"customId\":10315}},{\"id\":\"customfield_10316\",\"name\":\"Medium\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10316]\",\"Medium\"],\"schema\":{\"type\":\"any\",\"custom\":\"com.onresolve.jira.groovy.groovyrunner:scripted-field\",\"customId\":10316}},{\"id\":\"customfield_10679\",\"name\":\"Score CVSS\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10679]\",\"Score CVSS\"],\"schema\":{\"type\":\"number\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:float\",\"customId\":10679}},{\"id\":\"customfield_13703\",\"name\":\"Story Points\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[13703]\",\"Story Points\"],\"schema\":{\"type\":\"number\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:float\",\"customId\":13703}},{\"id\":\"timespent\",\"name\":\"Time Spent\",\"custom\":false,\"orderable\":false,\"navigable\":true,\"searchable\":false,\"clauseNames\":[\"timespent\"],\"schema\":{\"type\":\"number\",\"system\":\"timespent\"}},{\"id\":\"customfield_10671\",\"name\":\"Categoria do Sistema\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"Categoria do Sistema\",\"cf[10671]\"],\"schema\":{\"type\":\"option\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:select\",\"customId\":10671}},{\"id\":\"aggregatetimespent\",\"name\":\"Σ Time Spent\",\"custom\":false,\"orderable\":false,\"navigable\":true,\"searchable\":false,\"clauseNames\":[],\"schema\":{\"type\":\"number\",\"system\":\"aggregatetimespent\"}},{\"id\":\"customfield_10672\",\"name\":\"Prioridade Gvul\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10672]\",\"Prioridade Gvul\"],\"schema\":{\"type\":\"option\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:select\",\"customId\":10672}},{\"id\":\"customfield_10310\",\"name\":\"burp_id\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"burp_id\",\"cf[10310]\"],\"schema\":{\"type\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:textfield\",\"customId\":10310}},{\"id\":\"customfield_10674\",\"name\":\"Expoitable\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10674]\",\"Expoitable\"],\"schema\":{\"type\":\"array\",\"items\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:labels\",\"customId\":10674}},{\"id\":\"customfield_13700\",\"name\":\"Falha na última propagação\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[13700]\",\"Falha na última propagação\"],\"schema\":{\"type\":\"option\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:radiobuttons\",\"customId\":13700}},{\"id\":\"customfield_11400\",\"name\":\"Migrado_LB\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[11400]\",\"Migrado_LB\"],\"schema\":{\"type\":\"array\",\"items\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:labels\",\"customId\":11400}},{\"id\":\"customfield_10312\",\"name\":\"Tipo de dados Vivo\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10312]\",\"Tipo de dados Vivo\"],\"schema\":{\"type\":\"array\",\"items\":\"option\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:multicheckboxes\",\"customId\":10312}},{\"id\":\"customfield_12602\",\"name\":\"Chamado Riscos\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[12602]\",\"Chamado Riscos\"],\"schema\":{\"type\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:textfield\",\"customId\":12602}},{\"id\":\"customfield_10302\",\"name\":\"Data Fim Projeto\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10302]\",\"Data Fim Projeto\"],\"schema\":{\"type\":\"date\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:datepicker\",\"customId\":10302}},{\"id\":\"customfield_12601\",\"name\":\"Total Criticas (Sistema)\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[12601]\",\"Total Criticas (Sistema)\"],\"schema\":{\"type\":\"any\",\"custom\":\"com.onresolve.jira.groovy.groovyrunner:scripted-field\",\"customId\":12601}},{\"id\":\"customfield_10304\",\"name\":\"Mes\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10304]\",\"Mes\"],\"schema\":{\"type\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:textfield\",\"customId\":10304}},{\"id\":\"customfield_10305\",\"name\":\"URL\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10305]\",\"URL\"],\"schema\":{\"type\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:textarea\",\"customId\":10305}},{\"id\":\"customfield_10306\",\"name\":\"REQ/INC\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10306]\",\"REQ/INC\"],\"schema\":{\"type\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:textfield\",\"customId\":10306}},{\"id\":\"customfield_10307\",\"name\":\"Tecnologia\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10307]\",\"Tecnologia\"],\"schema\":{\"type\":\"option\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:select\",\"customId\":10307}},{\"id\":\"customfield_10308\",\"name\":\"Scan ID\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10308]\",\"Scan ID\"],\"schema\":{\"type\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:textfield\",\"customId\":10308}},{\"id\":\"customfield_10309\",\"name\":\"Status Scan\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10309]\",\"Status Scan\"],\"schema\":{\"type\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:textfield\",\"customId\":10309}},{\"id\":\"workratio\",\"name\":\"Work Ratio\",\"custom\":false,\"orderable\":false,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"workratio\"],\"schema\":{\"type\":\"number\",\"system\":\"workratio\"}},{\"id\":\"thumbnail\",\"name\":\"Images\",\"custom\":false,\"orderable\":false,\"navigable\":true,\"searchable\":false,\"clauseNames\":[]},{\"id\":\"created\",\"name\":\"Created\",\"custom\":false,\"orderable\":false,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"created\",\"createdDate\"],\"schema\":{\"type\":\"datetime\",\"system\":\"created\"}},{\"id\":\"customfield_13010\",\"name\":\"Complexidade de Ataque\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[13010]\",\"Complexidade de Ataque\"],\"schema\":{\"type\":\"option\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:select\",\"customId\":13010}},{\"id\":\"customfield_10420\",\"name\":\"SOX\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10420]\",\"SOX\"],\"schema\":{\"type\":\"option\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:radiobuttons\",\"customId\":10420}},{\"id\":\"customfield_10421\",\"name\":\"Consultoria\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10421]\",\"Consultoria\"],\"schema\":{\"type\":\"option\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:select\",\"customId\":10421}},{\"id\":\"customfield_12600\",\"name\":\"Total Vulnerabilidades (Sistema)\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[12600]\",\"Total Vulnerabilidades (Sistema)\"],\"schema\":{\"type\":\"any\",\"custom\":\"com.onresolve.jira.groovy.groovyrunner:scripted-field\",\"customId\":12600}},{\"id\":\"customfield_10300\",\"name\":\"Vul. Title\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10300]\",\"Vul. Title\"],\"schema\":{\"type\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:textfield\",\"customId\":10300}},{\"id\":\"customfield_10663\",\"name\":\"Área Solucionadora Responsável VP\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10663]\",\"Área Solucionadora Responsável VP\"],\"schema\":{\"type\":\"option\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:select\",\"customId\":10663}},{\"id\":\"customfield_10422\",\"name\":\"Base Origem\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"Base Origem\",\"cf[10422]\"],\"schema\":{\"type\":\"option\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:select\",\"customId\":10422}},{\"id\":\"customfield_10301\",\"name\":\"Data Início Projeto\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10301]\",\"Data Início Projeto\"],\"schema\":{\"type\":\"date\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:datepicker\",\"customId\":10301}},{\"id\":\"customfield_10412\",\"name\":\"Nome\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10412]\",\"Nome\"],\"schema\":{\"type\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:textfield\",\"customId\":10412}},{\"id\":\"customfield_10654\",\"name\":\"Valor do Risco Básico\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10654]\",\"Valor do Risco Básico\"],\"schema\":{\"type\":\"option\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:select\",\"customId\":10654}},{\"id\":\"customfield_10655\",\"name\":\"Diretoria\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10655]\",\"Diretoria\"],\"schema\":{\"type\":\"option\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:select\",\"customId\":10655}},{\"id\":\"customfield_13008\",\"name\":\"EPSS\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[13008]\",\"EPSS\"],\"schema\":{\"type\":\"number\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:float\",\"customId\":13008}},{\"id\":\"customfield_13800\",\"name\":\"Justificativa de Aceitação do Risco\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[],\"schema\":{\"type\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:textarea\",\"customId\":13800}},{\"id\":\"customfield_10656\",\"name\":\"replanejada\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10656]\",\"replanejada\"],\"schema\":{\"type\":\"date\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:datepicker\",\"customId\":10656}},{\"id\":\"customfield_10415\",\"name\":\"Sistema Operacional\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10415]\",\"Sistema Operacional\"],\"schema\":{\"type\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:textfield\",\"customId\":10415}},{\"id\":\"customfield_10658\",\"name\":\"Agente Instalado\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"Agente Instalado\",\"cf[10658]\"],\"schema\":{\"type\":\"option\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:select\",\"customId\":10658}},{\"id\":\"customfield_10416\",\"name\":\"Versao OS\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10416]\",\"Versao OS\"],\"schema\":{\"type\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:textfield\",\"customId\":10416}},{\"id\":\"customfield_10417\",\"name\":\"Esteira de Teste\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10417]\",\"Esteira de Teste\"],\"schema\":{\"type\":\"option\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:select\",\"customId\":10417}},{\"id\":\"customfield_10659\",\"name\":\"Scan de Origem\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10659]\",\"Scan de Origem\"],\"schema\":{\"type\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:textarea\",\"customId\":10659}},{\"id\":\"customfield_10418\",\"name\":\"Ambiente de Teste\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"Ambiente de Teste\",\"cf[10418]\"],\"schema\":{\"type\":\"option\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:select\",\"customId\":10418}},{\"id\":\"customfield_13001\",\"name\":\"Privilégios Requeridos\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[13001]\",\"Privilégios Requeridos\"],\"schema\":{\"type\":\"option\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:select\",\"customId\":13001}},{\"id\":\"customfield_13000\",\"name\":\"Vetor de Ataque\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[13000]\",\"Vetor de Ataque\"],\"schema\":{\"type\":\"option\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:select\",\"customId\":13000}},{\"id\":\"customfield_10650\",\"name\":\"Impacto\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10650]\",\"Impacto\"],\"schema\":{\"type\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:textarea\",\"customId\":10650}},{\"id\":\"customfield_10651\",\"name\":\"OB Name\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10651]\",\"OB Name\"],\"schema\":{\"type\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:textfield\",\"customId\":10651}},{\"id\":\"customfield_13007\",\"name\":\"CVSS Temporal Score\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[13007]\",\"CVSS Temporal Score\"],\"schema\":{\"type\":\"number\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:float\",\"customId\":13007}},{\"id\":\"customfield_10410\",\"name\":\"Previsão término testes\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10410]\",\"Previsão término testes\"],\"schema\":{\"type\":\"date\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:datepicker\",\"customId\":10410}},{\"id\":\"customfield_10652\",\"name\":\"Responsável CSIRT\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10652]\",\"Responsável CSIRT\"],\"schema\":{\"type\":\"user\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:userpicker\",\"customId\":10652}},{\"id\":\"customfield_10653\",\"name\":\"Atualizar\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"Atualizar\",\"cf[10653]\"],\"schema\":{\"type\":\"option\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:radiobuttons\",\"customId\":10653}},{\"id\":\"customfield_13006\",\"name\":\"CVSSv4 Base Score\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[13006]\",\"CVSSv4 Base Score\"],\"schema\":{\"type\":\"number\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:float\",\"customId\":13006}},{\"id\":\"customfield_10411\",\"name\":\"Tipo de Teste\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10411]\",\"Tipo de Teste\"],\"schema\":{\"type\":\"option\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:select\",\"customId\":10411}},{\"id\":\"customfield_10401\",\"name\":\"Campo LGPD\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"Campo LGPD\",\"cf[10401]\"],\"schema\":{\"type\":\"array\",\"items\":\"option\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:multicheckboxes\",\"customId\":10401}},{\"id\":\"customfield_10644\",\"name\":\"Containment measure\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10644]\",\"Containment measure\"],\"schema\":{\"type\":\"option\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:select\",\"customId\":10644}},{\"id\":\"customfield_10402\",\"name\":\"Responsável Diretoria (Exclusivo CSIRT)\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10402]\",\"Responsável Diretoria (Exclusivo CSIRT)\"],\"schema\":{\"type\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:textfield\",\"customId\":10402}},{\"id\":\"security\",\"name\":\"Security Level\",\"custom\":false,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"level\"],\"schema\":{\"type\":\"securitylevel\",\"system\":\"security\"}},{\"id\":\"customfield_10645\",\"name\":\"CVSS\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10645]\",\"CVSS\"],\"schema\":{\"type\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:textfield\",\"customId\":10645}},{\"id\":\"customfield_10403\",\"name\":\"Responsável Gerência Sr (Exclusivo CSIRT)\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10403]\",\"Responsável Gerência Sr (Exclusivo CSIRT)\"],\"schema\":{\"type\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:textfield\",\"customId\":10403}},{\"id\":\"customfield_10646\",\"name\":\"Data Report\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10646]\",\"Data Report\"],\"schema\":{\"type\":\"date\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:datepicker\",\"customId\":10646}},{\"id\":\"customfield_10404\",\"name\":\"Responsável Ponto Focal (Exclusivo CSIRT)\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10404]\",\"Responsável Ponto Focal (Exclusivo CSIRT)\"],\"schema\":{\"type\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:textfield\",\"customId\":10404}},{\"id\":\"attachment\",\"name\":\"Attachment\",\"custom\":false,\"orderable\":true,\"navigable\":false,\"searchable\":true,\"clauseNames\":[\"attachments\"],\"schema\":{\"type\":\"array\",\"items\":\"attachment\",\"system\":\"attachment\"}},{\"id\":\"customfield_10405\",\"name\":\"Responsável arquitetura\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10405]\",\"Responsável arquitetura\"],\"schema\":{\"type\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:textfield\",\"customId\":10405}},{\"id\":\"customfield_10647\",\"name\":\"Área Negócio Responsável VP\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10647]\",\"Área Negócio Responsável VP\"],\"schema\":{\"type\":\"array\",\"items\":\"option\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:multicheckboxes\",\"customId\":10647}},{\"id\":\"customfield_10406\",\"name\":\"url\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10406]\",\"url\"],\"schema\":{\"type\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:url\",\"customId\":10406}},{\"id\":\"customfield_10649\",\"name\":\"Data Repasse VP\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10649]\",\"Data Repasse VP\"],\"schema\":{\"type\":\"date\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:datepicker\",\"customId\":10649}},{\"id\":\"customfield_10407\",\"name\":\"VP\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10407]\",\"VP\"],\"schema\":{\"type\":\"option\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:select\",\"customId\":10407}},{\"id\":\"customfield_10408\",\"name\":\"Tipo de ambiente\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10408]\",\"Tipo de ambiente\"],\"schema\":{\"type\":\"option\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:select\",\"customId\":10408}},{\"id\":\"customfield_10409\",\"name\":\"Exploração precisa de autenticação?\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10409]\",\"Exploração precisa de autenticação?\"],\"schema\":{\"type\":\"option\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:radiobuttons\",\"customId\":10409}},{\"id\":\"customfield_10400\",\"name\":\"Low\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10400]\",\"Low\"],\"schema\":{\"type\":\"any\",\"custom\":\"com.onresolve.jira.groovy.groovyrunner:scripted-field\",\"customId\":10400}},{\"id\":\"customfield_10642\",\"name\":\"Requesting area\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10642]\",\"Requesting area\"],\"schema\":{\"type\":\"option\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:select\",\"customId\":10642}},{\"id\":\"customfield_10632\",\"name\":\"Operation System\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10632]\",\"Operation System\"],\"schema\":{\"type\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:textarea\",\"customId\":10632}},{\"id\":\"customfield_11600\",\"name\":\"Vul. ID\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[11600]\",\"Vul. ID\"],\"schema\":{\"type\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:textfield\",\"customId\":11600}},{\"id\":\"customfield_10634\",\"name\":\"Domain\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10634]\",\"Domain\"],\"schema\":{\"type\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:textfield\",\"customId\":10634}},{\"id\":\"customfield_10637\",\"name\":\"Obsolescência\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10637]\",\"Obsolescência\"],\"schema\":{\"type\":\"array\",\"items\":\"option\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:multicheckboxes\",\"customId\":10637}},{\"id\":\"customfield_10638\",\"name\":\"Predio\",\"custom\":true,\"orderable\":true,\"navigable\":true,\"searchable\":true,\"clauseNames\":[\"cf[10638]\",\"Predio\"],\"schema\":{\"type\":\"string\",\"custom\":\"com.atlassian.jira.plugin.system.customfieldtypes:textfield\",\"customId\":10638}}]"));}),
"[project]/components/actions/action-form.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ActionForm",
    ()=>ActionForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/textarea.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/input.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$scroll$2d$area$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/scroll-area.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$theme$2f$theme$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/theme/theme-provider.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$jira$2d$fields$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/data/jira-fields.json (json)");
;
;
;
;
;
;
;
;
;
;
const initialFieldCatalog = __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$jira$2d$fields$2e$json__$28$json$29$__["default"];
function FieldBlock({ label, children, labelClassName }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-xs font-semibold", labelClassName),
                children: label
            }, void 0, false, {
                fileName: "[project]/components/actions/action-form.tsx",
                lineNumber: 75,
                columnNumber: 7
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/components/actions/action-form.tsx",
        lineNumber: 74,
        columnNumber: 5
    }, this);
}
function ActionForm(props) {
    const { theme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$theme$2f$theme$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTheme"])();
    const isDark = theme === "dark";
    const { selectedAction, filterMode, filterValue, projectValue, statusValue, assignee, comment, fields, issuesCount, isCheckingCount, isSubmitting, error, message, onFilterModeChange, onFilterValueChange, onProjectChange, onStatusChange, onAssigneeChange, onCommentChange, onFieldKeyChange, onFieldValueChange, onAddField, onRemoveField, onPrefillFieldKey, onSimulateCount, onSubmit, onImportIdsFromFile, uploadedFileName, projectOptions, csvTemplateUrl } = props;
    const isEscalate = selectedAction === "escalate";
    const isDelete = selectedAction === "delete";
    const hasManualEscalateFields = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>fields.some((field)=>field.key.trim() && field.value.trim()), [
        fields
    ]);
    const disableSubmit = isSubmitting || (selectedAction === null ? true : isEscalate ? !filterValue.trim() && !hasManualEscalateFields : !filterValue.trim());
    const [fieldCatalog, setFieldCatalog] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(initialFieldCatalog);
    const [fieldSearch, setFieldSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [fieldTypeFilter, setFieldTypeFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("all");
    const [copiedField, setCopiedField] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [catalogError, setCatalogError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const idsFileInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const catalogFileInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const fieldSuggestionsId = "jira-field-suggestions";
    const shouldShowFieldSuggestions = selectedAction === "fields" || isEscalate;
    const typeFilterOptions = [
        {
            id: "all",
            label: "Todos"
        },
        {
            id: "string",
            label: "Texto"
        },
        {
            id: "option",
            label: "Seleção"
        },
        {
            id: "array",
            label: "Lista"
        },
        {
            id: "date",
            label: "Data"
        },
        {
            id: "datetime",
            label: "Data/Hora"
        },
        {
            id: "number",
            label: "Número"
        },
        {
            id: "user",
            label: "Usuário"
        },
        {
            id: "other",
            label: "Outros"
        }
    ];
    function getFieldKind(field) {
        const rawType = field.schema?.type || field.schema?.system || field.schema?.custom || "other";
        const normalized = rawType.toLowerCase();
        if (normalized.includes("datetime")) return "datetime";
        if (normalized.includes("date")) return "date";
        if (normalized.includes("option") || normalized.includes("select") || normalized.includes("radio")) {
            return "option";
        }
        if (normalized.includes("array") || normalized.includes("labels") || normalized.includes("list")) {
            return "array";
        }
        if (normalized.includes("number") || normalized.includes("float") || normalized.includes("progress")) {
            return "number";
        }
        if (normalized.includes("user") || normalized.includes("assignee") || normalized.includes("reporter")) {
            return "user";
        }
        if (normalized.includes("text") || normalized.includes("string")) {
            return "string";
        }
        return "other";
    }
    const filteredFields = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const search = fieldSearch.trim().toLowerCase();
        return fieldCatalog.filter((field)=>{
            const matchesSearch = !search || [
                field.name,
                field.id,
                ...field.clauseNames ?? []
            ].some((value)=>value.toLowerCase().includes(search));
            const matchesType = fieldTypeFilter === "all" || getFieldKind(field) === fieldTypeFilter;
            return matchesSearch && matchesType;
        });
    }, [
        fieldCatalog,
        fieldSearch,
        fieldTypeFilter
    ]);
    const totalFields = fieldCatalog.length;
    const csvStats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (!isEscalate) {
            return {
                rowCount: 0,
                columns: []
            };
        }
        const trimmed = filterValue.trim();
        if (!trimmed) {
            return {
                rowCount: 0,
                columns: []
            };
        }
        const sanitized = trimmed.replace(/\r/g, "");
        const lines = sanitized.split("\n").map((line)=>line.trim()).filter(Boolean);
        if (!lines.length) {
            return {
                rowCount: 0,
                columns: []
            };
        }
        const header = lines[0].split(",").map((cell)=>cell.trim()).filter(Boolean);
        const rowCount = Math.max(lines.length - 1, 0);
        return {
            rowCount,
            columns: header.slice(0, 6)
        };
    }, [
        filterValue,
        isEscalate
    ]);
    const labelColor = isDark ? "text-zinc-400" : "text-slate-600";
    const subtleText = isDark ? "text-zinc-500" : "text-slate-500";
    const cardClasses = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("rounded-3xl border shadow-lg", isDark ? "border-white/5 bg-gradient-to-b from-[#080d1f] to-[#050713] text-zinc-100" : "border-slate-200 bg-white text-slate-800");
    const inputClasses = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("rounded-2xl border px-3 py-2 text-sm transition focus-visible:ring-2 focus-visible:ring-purple-500/40", isDark ? "border-zinc-700 bg-[#050818] text-zinc-100 placeholder:text-zinc-500" : "border-slate-300 bg-white text-slate-700 placeholder:text-slate-400");
    const textareaClasses = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("min-h-[120px] rounded-2xl border px-3 py-2 text-sm transition focus-visible:ring-2 focus-visible:ring-purple-500/40", isDark ? "border-zinc-700 bg-[#050818] text-zinc-100 placeholder:text-zinc-500" : "border-slate-300 bg-white text-slate-700 placeholder:text-slate-400");
    function handleDataFileChange(event) {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ()=>{
            const text = typeof reader.result === "string" ? reader.result : "";
            onImportIdsFromFile(text, file.name);
            if (idsFileInputRef.current) {
                idsFileInputRef.current.value = "";
            }
        };
        reader.readAsText(file);
    }
    function handleCatalogImport(event) {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ()=>{
            try {
                const text = typeof reader.result === "string" ? reader.result : "";
                const parsed = JSON.parse(text);
                if (!Array.isArray(parsed)) {
                    throw new Error("O arquivo deve conter um array de campos.");
                }
                const sanitized = parsed.filter((item)=>item && typeof item.id === "string" && typeof item.name === "string").map((item)=>({
                        id: item.id,
                        name: item.name,
                        custom: Boolean(item.custom),
                        clauseNames: Array.isArray(item.clauseNames) ? item.clauseNames : [],
                        schema: item.schema ?? {}
                    }));
                if (!sanitized.length) {
                    throw new Error("Nenhum campo válido foi encontrado no JSON.");
                }
                setFieldCatalog(sanitized);
                setFieldSearch("");
                setFieldTypeFilter("all");
                setCatalogError(null);
            } catch (err) {
                setCatalogError(err instanceof Error ? err.message : "Não foi possível interpretar o JSON de campos.");
            } finally{
                if (catalogFileInputRef.current) {
                    catalogFileInputRef.current.value = "";
                }
            }
        };
        reader.readAsText(file);
    }
    function handleCopyFieldId(fieldId) {
        if (typeof navigator !== "undefined" && navigator?.clipboard) {
            navigator.clipboard.writeText(fieldId).catch(()=>null);
        }
        setCopiedField(fieldId);
        setTimeout(()=>setCopiedField((current)=>current === fieldId ? null : current), 1500);
    }
    function renderDynamicFieldsBlock(hint, listId) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-3",
            children: [
                fields.map((field, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("rounded-2xl border p-4", isDark ? "border-zinc-800 bg-[#060818]/70" : "border-slate-200 bg-slate-50"),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex items-center justify-between text-xs font-semibold", labelColor),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            "Campo #",
                                            index + 1
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/actions/action-form.tsx",
                                        lineNumber: 341,
                                        columnNumber: 15
                                    }, this),
                                    fields.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>onRemoveField(index),
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-[11px] transition", isDark ? "text-rose-400 hover:text-rose-200" : "text-rose-600 hover:text-rose-400"),
                                        children: "Remover"
                                    }, void 0, false, {
                                        fileName: "[project]/components/actions/action-form.tsx",
                                        lineNumber: 343,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/actions/action-form.tsx",
                                lineNumber: 335,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-3 grid gap-3 md:grid-cols-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(FieldBlock, {
                                        label: "Campo a ser alterado",
                                        labelClassName: labelColor,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                                            className: inputClasses,
                                            placeholder: "Ex: customfield_12345",
                                            list: listId,
                                            value: field.key,
                                            onChange: (event)=>onFieldKeyChange(index, event.target.value)
                                        }, void 0, false, {
                                            fileName: "[project]/components/actions/action-form.tsx",
                                            lineNumber: 362,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/actions/action-form.tsx",
                                        lineNumber: 358,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(FieldBlock, {
                                        label: "Valor",
                                        labelClassName: labelColor,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                                            className: inputClasses,
                                            placeholder: "Novo valor",
                                            value: field.value,
                                            onChange: (event)=>onFieldValueChange(index, event.target.value)
                                        }, void 0, false, {
                                            fileName: "[project]/components/actions/action-form.tsx",
                                            lineNumber: 371,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/actions/action-form.tsx",
                                        lineNumber: 370,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/actions/action-form.tsx",
                                lineNumber: 357,
                                columnNumber: 13
                            }, this)
                        ]
                    }, `field-${index}`, true, {
                        fileName: "[project]/components/actions/action-form.tsx",
                        lineNumber: 326,
                        columnNumber: 11
                    }, this)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                    type: "button",
                    variant: "outline",
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("w-full rounded-2xl text-xs", isDark ? "border border-zinc-700 text-zinc-200" : "border border-slate-300 text-slate-700"),
                    onClick: onAddField,
                    children: "Adicionar campo"
                }, void 0, false, {
                    fileName: "[project]/components/actions/action-form.tsx",
                    lineNumber: 381,
                    columnNumber: 9
                }, this),
                hint && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-[11px]", subtleText),
                    children: hint
                }, void 0, false, {
                    fileName: "[project]/components/actions/action-form.tsx",
                    lineNumber: 394,
                    columnNumber: 18
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/actions/action-form.tsx",
            lineNumber: 324,
            columnNumber: 7
        }, this);
    }
    function renderActionFields() {
        switch(selectedAction){
            case "status":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(FieldBlock, {
                    label: "Novo status",
                    labelClassName: labelColor,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("rounded-2xl border", isDark ? "border-zinc-700 bg-[#050816]" : "border-slate-300 bg-white"),
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                value: statusValue,
                                onChange: (event)=>onStatusChange(event.target.value),
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("w-full rounded-2xl bg-transparent px-3 py-2 text-sm focus-visible:outline-none", isDark ? "text-zinc-100" : "text-slate-700"),
                                children: [
                                    "DONE",
                                    "Cancelado"
                                ].map((status)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: status,
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(isDark ? "bg-[#050816] text-white" : "bg-white text-slate-700"),
                                        children: status
                                    }, status, false, {
                                        fileName: "[project]/components/actions/action-form.tsx",
                                        lineNumber: 421,
                                        columnNumber: 19
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/actions/action-form.tsx",
                                lineNumber: 412,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/actions/action-form.tsx",
                            lineNumber: 404,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-[11px]", subtleText),
                            children: "Fluxo atual disponibiliza: DONE e Cancelado. Outras transições serão adicionadas após integração com Jira."
                        }, void 0, false, {
                            fileName: "[project]/components/actions/action-form.tsx",
                            lineNumber: 433,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/actions/action-form.tsx",
                    lineNumber: 403,
                    columnNumber: 11
                }, this);
            case "assignee":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(FieldBlock, {
                            label: "Novo responsável",
                            labelClassName: labelColor,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                                placeholder: "E-mail ou accountId",
                                value: assignee,
                                onChange: (event)=>onAssigneeChange(event.target.value),
                                className: inputClasses
                            }, void 0, false, {
                                fileName: "[project]/components/actions/action-form.tsx",
                                lineNumber: 442,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/actions/action-form.tsx",
                            lineNumber: 441,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-[11px]", subtleText),
                            children: "Quando integrado ao Jira, a automação verificará se o usuário tem permissão no projeto antes de aplicar."
                        }, void 0, false, {
                            fileName: "[project]/components/actions/action-form.tsx",
                            lineNumber: 449,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true);
            case "comment":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(FieldBlock, {
                            label: "Comentário",
                            labelClassName: labelColor,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Textarea"], {
                                className: textareaClasses,
                                placeholder: "Mensagem padrão a ser replicada nas issues selecionadas.",
                                value: comment,
                                onChange: (event)=>onCommentChange(event.target.value)
                            }, void 0, false, {
                                fileName: "[project]/components/actions/action-form.tsx",
                                lineNumber: 458,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/actions/action-form.tsx",
                            lineNumber: 457,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-[11px]", subtleText),
                            children: "Comentários serão gravados com a credencial técnica e marcados como automação."
                        }, void 0, false, {
                            fileName: "[project]/components/actions/action-form.tsx",
                            lineNumber: 465,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true);
            case "fields":
                return renderDynamicFieldsBlock(undefined, shouldShowFieldSuggestions ? fieldSuggestionsId : undefined);
            case "escalate":
                return renderDynamicFieldsBlock("Use os campos para definir valores padrão quando não houver CSV.", fieldSuggestionsId);
            case "delete":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("rounded-2xl border px-4 py-3 text-xs", isDark ? "border-rose-500/40 bg-rose-500/10 text-rose-100" : "border-rose-200 bg-rose-50 text-rose-700"),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm font-semibold uppercase tracking-[0.3em]",
                            children: "Atenção"
                        }, void 0, false, {
                            fileName: "[project]/components/actions/action-form.tsx",
                            lineNumber: 490,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-2 text-sm",
                            children: "A exclusão não possui rollback. Verifique os IDs antes de enviar e confirme que as issues podem ser removidas definitivamente."
                        }, void 0, false, {
                            fileName: "[project]/components/actions/action-form.tsx",
                            lineNumber: 493,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/actions/action-form.tsx",
                    lineNumber: 482,
                    columnNumber: 11
                }, this);
            default:
                return null;
        }
    }
    const filterBlock = isEscalate ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(FieldBlock, {
                label: "Projeto destino",
                labelClassName: labelColor,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("rounded-2xl border", isDark ? "border-zinc-700 bg-[#050816]" : "border-slate-300 bg-white"),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                            value: projectValue,
                            onChange: (event)=>onProjectChange(event.target.value),
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("w-full rounded-2xl bg-transparent px-3 py-2 text-sm focus-visible:outline-none", isDark ? "text-zinc-100" : "text-slate-700"),
                            children: projectOptions.map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: option.value,
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(isDark ? "bg-[#050816] text-white" : "bg-white text-slate-700"),
                                    children: option.label
                                }, option.value, false, {
                                    fileName: "[project]/components/actions/action-form.tsx",
                                    lineNumber: 522,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/components/actions/action-form.tsx",
                            lineNumber: 513,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/actions/action-form.tsx",
                        lineNumber: 507,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-[11px]", subtleText),
                        children: "Defina para qual projeto as issues escalonadas serão criadas."
                    }, void 0, false, {
                        fileName: "[project]/components/actions/action-form.tsx",
                        lineNumber: 534,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/actions/action-form.tsx",
                lineNumber: 506,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("rounded-2xl border px-4 py-3 text-xs", isDark ? "border-purple-500/30 bg-purple-500/5 text-purple-100" : "border-purple-200 bg-purple-50 text-purple-700"),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "font-semibold uppercase tracking-[0.3em]",
                        children: "Template CSV"
                    }, void 0, false, {
                        fileName: "[project]/components/actions/action-form.tsx",
                        lineNumber: 546,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("mt-1 text-[11px]", subtleText),
                        children: "Use o arquivo base para estruturar colunas de custom fields e valores."
                    }, void 0, false, {
                        fileName: "[project]/components/actions/action-form.tsx",
                        lineNumber: 547,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: csvTemplateUrl,
                        download: true,
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("mt-2 inline-flex items-center justify-center rounded-xl px-3 py-1 text-xs font-semibold", isDark ? "bg-white/10 text-white" : "bg-white text-purple-700 shadow"),
                        children: "Baixar template CSV"
                    }, void 0, false, {
                        fileName: "[project]/components/actions/action-form.tsx",
                        lineNumber: 550,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/actions/action-form.tsx",
                lineNumber: 538,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(FieldBlock, {
                label: "Cole ou revise o CSV",
                labelClassName: labelColor,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Textarea"], {
                        className: textareaClasses,
                        placeholder: "Ex: summary,description,customfield_12300\\nIssue crítica,Detalhes...",
                        value: filterValue,
                        onChange: (event)=>onFilterValueChange(event.target.value)
                    }, void 0, false, {
                        fileName: "[project]/components/actions/action-form.tsx",
                        lineNumber: 562,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-[11px]", subtleText),
                        children: "Cole o conteúdo do template diretamente aqui ou importe um arquivo abaixo. Você pode ajustar valores linha a linha."
                    }, void 0, false, {
                        fileName: "[project]/components/actions/action-form.tsx",
                        lineNumber: 568,
                        columnNumber: 9
                    }, this),
                    (csvStats.rowCount > 0 || csvStats.columns.length > 0 || uploadedFileName) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("mt-3 grid gap-2 rounded-2xl border px-3 py-2 text-[11px]", isDark ? "border-zinc-700 bg-black/30 text-zinc-200" : "border-slate-200 bg-slate-50 text-slate-700"),
                        children: [
                            uploadedFileName && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: [
                                    "Último arquivo importado: ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: uploadedFileName
                                    }, void 0, false, {
                                        fileName: "[project]/components/actions/action-form.tsx",
                                        lineNumber: 582,
                                        columnNumber: 43
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/actions/action-form.tsx",
                                lineNumber: 581,
                                columnNumber: 15
                            }, this),
                            csvStats.rowCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: [
                                    csvStats.rowCount,
                                    " registro",
                                    csvStats.rowCount === 1 ? "" : "s",
                                    " detectado",
                                    csvStats.rowCount === 1 ? "" : "s",
                                    " após o cabeçalho."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/actions/action-form.tsx",
                                lineNumber: 586,
                                columnNumber: 15
                            }, this),
                            csvStats.columns.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: [
                                    "Colunas identificadas: ",
                                    csvStats.columns.join(", "),
                                    csvStats.columns.length === 6 && "..."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/actions/action-form.tsx",
                                lineNumber: 591,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/actions/action-form.tsx",
                        lineNumber: 572,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/actions/action-form.tsx",
                lineNumber: 561,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(FieldBlock, {
                label: "Importar CSV (opcional)",
                labelClassName: labelColor,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("rounded-2xl border border-dashed p-4 text-center", isDark ? "border-emerald-400/40 bg-emerald-400/5" : "border-emerald-200 bg-emerald-50"),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex cursor-pointer flex-col items-center gap-2 text-xs font-semibold", isDark ? "text-emerald-200" : "text-emerald-700"),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "rounded-full border border-emerald-400/40 px-3 py-1",
                                    children: "Selecionar CSV"
                                }, void 0, false, {
                                    fileName: "[project]/components/actions/action-form.tsx",
                                    lineNumber: 614,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-[11px]", subtleText),
                                    children: "Aceitamos .csv com cabeçalho conforme o template (Sistema, customfield_...)."
                                }, void 0, false, {
                                    fileName: "[project]/components/actions/action-form.tsx",
                                    lineNumber: 617,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "file",
                                    accept: ".csv",
                                    className: "hidden",
                                    ref: idsFileInputRef,
                                    onChange: handleDataFileChange
                                }, void 0, false, {
                                    fileName: "[project]/components/actions/action-form.tsx",
                                    lineNumber: 620,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/actions/action-form.tsx",
                            lineNumber: 608,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/actions/action-form.tsx",
                        lineNumber: 600,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-[11px]", subtleText),
                        children: "Para poucos itens, utilize os campos personalizados manualmente ao lado."
                    }, void 0, false, {
                        fileName: "[project]/components/actions/action-form.tsx",
                        lineNumber: 629,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/actions/action-form.tsx",
                lineNumber: 599,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(FieldBlock, {
                label: "Catálogo de campos do Jira",
                labelClassName: labelColor,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("space-y-3 rounded-2xl border p-4", isDark ? "border-zinc-800 bg-[#060818]/70" : "border-slate-200 bg-slate-50"),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                            placeholder: "Buscar por nome, ID ou clauseName",
                            value: fieldSearch,
                            onChange: (event)=>setFieldSearch(event.target.value),
                            className: inputClasses
                        }, void 0, false, {
                            fileName: "[project]/components/actions/action-form.tsx",
                            lineNumber: 643,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-wrap items-center gap-2",
                            children: [
                                typeFilterOptions.map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>setFieldTypeFilter(option.id),
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("rounded-full px-3 py-1 text-[11px] font-semibold transition", fieldTypeFilter === option.id ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white" : isDark ? "border border-white/10 text-zinc-400" : "border border-slate-300 text-slate-500"),
                                        children: option.label
                                    }, option.id, false, {
                                        fileName: "[project]/components/actions/action-form.tsx",
                                        lineNumber: 651,
                                        columnNumber: 15
                                    }, this)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("ml-auto text-[11px]", subtleText),
                                    children: [
                                        filteredFields.length,
                                        " de ",
                                        totalFields,
                                        " campos catalogados"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/actions/action-form.tsx",
                                    lineNumber: 667,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/actions/action-form.tsx",
                            lineNumber: 649,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-wrap items-center gap-3 text-[11px]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1 font-semibold", isDark ? "border-zinc-700 text-zinc-200" : "border-slate-300 text-slate-700"),
                                    children: [
                                        "Importar JSON",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "file",
                                            accept: "application/json,.json",
                                            className: "hidden",
                                            ref: catalogFileInputRef,
                                            onChange: handleCatalogImport
                                        }, void 0, false, {
                                            fileName: "[project]/components/actions/action-form.tsx",
                                            lineNumber: 681,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/actions/action-form.tsx",
                                    lineNumber: 672,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-[11px]", subtleText),
                                    children: "Utilize o dump do endpoint /rest/api/3/field (como o JSON informado)."
                                }, void 0, false, {
                                    fileName: "[project]/components/actions/action-form.tsx",
                                    lineNumber: 689,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/actions/action-form.tsx",
                            lineNumber: 671,
                            columnNumber: 11
                        }, this),
                        catalogError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("rounded-xl border px-3 py-2 text-[11px]", isDark ? "border-rose-500/40 bg-rose-500/10 text-rose-200" : "border-rose-200 bg-rose-50 text-rose-600"),
                            children: catalogError
                        }, void 0, false, {
                            fileName: "[project]/components/actions/action-form.tsx",
                            lineNumber: 694,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("rounded-2xl border", isDark ? "border-zinc-800 bg-[#050713]" : "border-slate-200 bg-white"),
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$scroll$2d$area$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ScrollArea"], {
                                className: "h-[315px] w-full",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2 p-3",
                                    children: filteredFields.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-[11px]", subtleText),
                                        children: "Nenhum campo encontrado para esse filtro."
                                    }, void 0, false, {
                                        fileName: "[project]/components/actions/action-form.tsx",
                                        lineNumber: 714,
                                        columnNumber: 19
                                    }, this) : filteredFields.map((field)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("rounded-2xl border p-3 text-xs", isDark ? "border-zinc-800 bg-[#04050e]" : "border-slate-200 bg-slate-50"),
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-col gap-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-start justify-between gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-sm font-semibold", isDark ? "text-white" : "text-slate-800"),
                                                                        children: field.name
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/actions/action-form.tsx",
                                                                        lineNumber: 731,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-[11px]", subtleText),
                                                                        children: field.id
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/actions/action-form.tsx",
                                                                        lineNumber: 739,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    field.clauseNames?.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-[11px]", subtleText),
                                                                        children: [
                                                                            "Clause: ",
                                                                            field.clauseNames.slice(0, 3).join(", ")
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/actions/action-form.tsx",
                                                                        lineNumber: 743,
                                                                        columnNumber: 31
                                                                    }, this) : null
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/actions/action-form.tsx",
                                                                lineNumber: 730,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em]", field.custom ? isDark ? "bg-emerald-500/10 text-emerald-200" : "bg-emerald-50 text-emerald-700" : isDark ? "bg-blue-500/10 text-blue-200" : "bg-blue-50 text-blue-700"),
                                                                children: field.custom ? "Custom" : "Nativo"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/actions/action-form.tsx",
                                                                lineNumber: 748,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/actions/action-form.tsx",
                                                        lineNumber: 729,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mt-2 flex flex-wrap gap-2 text-[11px]",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("rounded-full px-2 py-0.5", isDark ? "bg-white/5 text-zinc-300" : "bg-white text-slate-600"),
                                                                children: getFieldKind(field)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/actions/action-form.tsx",
                                                                lineNumber: 764,
                                                                columnNumber: 27
                                                            }, this),
                                                            field.schema?.type && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("rounded-full px-2 py-0.5", isDark ? "bg-white/5 text-zinc-400" : "bg-white text-slate-500"),
                                                                children: [
                                                                    "tipo: ",
                                                                    field.schema.type
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/actions/action-form.tsx",
                                                                lineNumber: 775,
                                                                columnNumber: 29
                                                            }, this),
                                                            field.schema?.custom && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("rounded-full px-2 py-0.5", isDark ? "bg-white/5 text-zinc-400" : "bg-white text-slate-500"),
                                                                children: field.schema.custom
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/actions/action-form.tsx",
                                                                lineNumber: 787,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/actions/action-form.tsx",
                                                        lineNumber: 763,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mt-3 flex flex-wrap gap-2 text-[11px]",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                onClick: ()=>handleCopyFieldId(field.id),
                                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("rounded-full border px-3 py-1 font-semibold transition", isDark ? "border-zinc-700 text-zinc-200 hover:border-zinc-500" : "border-slate-300 text-slate-700 hover:border-slate-500"),
                                                                children: copiedField === field.id ? "Copiado!" : "Copiar ID"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/actions/action-form.tsx",
                                                                lineNumber: 800,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                onClick: ()=>onPrefillFieldKey(field.id),
                                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("rounded-full border px-3 py-1 font-semibold transition", isDark ? "border-emerald-500/50 text-emerald-200 hover:border-emerald-400" : "border-emerald-300 text-emerald-700 hover:border-emerald-500"),
                                                                children: "Adicionar ao formulário"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/actions/action-form.tsx",
                                                                lineNumber: 812,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/actions/action-form.tsx",
                                                        lineNumber: 799,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/actions/action-form.tsx",
                                                lineNumber: 728,
                                                columnNumber: 23
                                            }, this)
                                        }, field.id, false, {
                                            fileName: "[project]/components/actions/action-form.tsx",
                                            lineNumber: 719,
                                            columnNumber: 21
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/components/actions/action-form.tsx",
                                    lineNumber: 712,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/actions/action-form.tsx",
                                lineNumber: 711,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/actions/action-form.tsx",
                            lineNumber: 705,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-[11px]", subtleText),
                            children: "O campo selecionado já aparece como sugestão no formulário ao lado (lista automática)."
                        }, void 0, false, {
                            fileName: "[project]/components/actions/action-form.tsx",
                            lineNumber: 832,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/actions/action-form.tsx",
                    lineNumber: 637,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/actions/action-form.tsx",
                lineNumber: 633,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/actions/action-form.tsx",
        lineNumber: 505,
        columnNumber: 5
    }, this) : isDelete ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(FieldBlock, {
        label: "IDs das issues para exclusão",
        labelClassName: labelColor,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Textarea"], {
                className: textareaClasses,
                placeholder: "ISSUE-1, ISSUE-2, ISSUE-3",
                value: filterValue,
                onChange: (event)=>onFilterValueChange(event.target.value)
            }, void 0, false, {
                fileName: "[project]/components/actions/action-form.tsx",
                lineNumber: 843,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-[11px]", subtleText),
                children: "Liste apenas IDs válidos do Jira separados por vírgula ou quebra de linha. Esta ação removerá definitivamente os registros."
            }, void 0, false, {
                fileName: "[project]/components/actions/action-form.tsx",
                lineNumber: 849,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/actions/action-form.tsx",
        lineNumber: 839,
        columnNumber: 5
    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(FieldBlock, {
        label: "Conjunto de issues",
        labelClassName: labelColor,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                        type: "button",
                        variant: "ghost",
                        onClick: ()=>onFilterModeChange("jql"),
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex-1 rounded-2xl text-xs", filterMode === "jql" ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg" : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("border bg-transparent", isDark ? "border-zinc-700 text-zinc-300" : "border-slate-300 text-slate-600")),
                        children: "JQL"
                    }, void 0, false, {
                        fileName: "[project]/components/actions/action-form.tsx",
                        lineNumber: 857,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                        type: "button",
                        variant: "ghost",
                        onClick: ()=>onFilterModeChange("ids"),
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex-1 rounded-2xl text-xs", filterMode === "ids" ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg" : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("border bg-transparent", isDark ? "border-zinc-700 text-zinc-300" : "border-slate-300 text-slate-600")),
                        children: "IDs"
                    }, void 0, false, {
                        fileName: "[project]/components/actions/action-form.tsx",
                        lineNumber: 875,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/actions/action-form.tsx",
                lineNumber: 856,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Textarea"], {
                className: textareaClasses,
                placeholder: filterMode === "jql" ? 'Ex: project = POSTURA AND status in ("To Do","In Progress")' : "ISSUE-1, ISSUE-2, ISSUE-3",
                value: filterValue,
                onChange: (event)=>onFilterValueChange(event.target.value)
            }, void 0, false, {
                fileName: "[project]/components/actions/action-form.tsx",
                lineNumber: 894,
                columnNumber: 7
            }, this),
            filterMode === "jql" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-2 flex flex-wrap items-center gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                        type: "button",
                        variant: "outline",
                        size: "sm",
                        className: "rounded-2xl text-xs",
                        disabled: isCheckingCount || !filterValue.trim(),
                        onClick: onSimulateCount,
                        children: isCheckingCount ? "Consultando..." : "Estimar quantidade"
                    }, void 0, false, {
                        fileName: "[project]/components/actions/action-form.tsx",
                        lineNumber: 906,
                        columnNumber: 11
                    }, this),
                    issuesCount !== null && !isCheckingCount && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-xs", subtleText),
                        children: [
                            issuesCount,
                            " issues serão impactadas (simulado)"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/actions/action-form.tsx",
                        lineNumber: 917,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/actions/action-form.tsx",
                lineNumber: 905,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-[11px]", subtleText),
                children: filterMode === "jql" ? "Adicione uma consulta JQL completa para selecionar as issues." : "Informe os IDs separados por vírgula ou quebra de linha."
            }, void 0, false, {
                fileName: "[project]/components/actions/action-form.tsx",
                lineNumber: 923,
                columnNumber: 7
            }, this),
            filterMode === "ids" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("mt-2 rounded-2xl border border-dashed p-3", isDark ? "border-purple-500/40 bg-purple-500/5" : "border-purple-200 bg-purple-50"),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex cursor-pointer flex-col items-center gap-2 text-xs", isDark ? "text-purple-200" : "text-purple-700"),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "rounded-full border border-purple-400/40 px-3 py-1",
                                children: "Anexar arquivo com IDs"
                            }, void 0, false, {
                                fileName: "[project]/components/actions/action-form.tsx",
                                lineNumber: 943,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-[11px]", subtleText),
                                children: "Aceitamos .txt ou .csv com um ID por linha."
                            }, void 0, false, {
                                fileName: "[project]/components/actions/action-form.tsx",
                                lineNumber: 946,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "file",
                                accept: ".txt,.csv",
                                className: "hidden",
                                ref: idsFileInputRef,
                                onChange: handleDataFileChange
                            }, void 0, false, {
                                fileName: "[project]/components/actions/action-form.tsx",
                                lineNumber: 949,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/actions/action-form.tsx",
                        lineNumber: 937,
                        columnNumber: 11
                    }, this),
                    uploadedFileName && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("mt-2 text-[11px]", subtleText),
                        children: [
                            "Arquivo enviado: ",
                            uploadedFileName
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/actions/action-form.tsx",
                        lineNumber: 958,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/actions/action-form.tsx",
                lineNumber: 929,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/actions/action-form.tsx",
        lineNumber: 855,
        columnNumber: 5
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
        className: cardClasses,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardHeader"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardTitle"], {
                        className: "text-base font-semibold",
                        children: "Parâmetros da ação selecionada"
                    }, void 0, false, {
                        fileName: "[project]/components/actions/action-form.tsx",
                        lineNumber: 970,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardDescription"], {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-sm", subtleText),
                        children: isEscalate ? "Escolha o projeto destino, campos personalizados e (se necessário) envie o CSV de template." : "Informe filtros de issues e detalhes necessários para executar a automação."
                    }, void 0, false, {
                        fileName: "[project]/components/actions/action-form.tsx",
                        lineNumber: 973,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/actions/action-form.tsx",
                lineNumber: 969,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
                className: "space-y-4",
                children: [
                    error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("rounded-2xl border px-4 py-3 text-sm", isDark ? "border-rose-500/50 bg-rose-500/10 text-rose-100" : "border-rose-200 bg-rose-50 text-rose-700"),
                        children: error
                    }, void 0, false, {
                        fileName: "[project]/components/actions/action-form.tsx",
                        lineNumber: 981,
                        columnNumber: 11
                    }, this),
                    message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("rounded-2xl border px-4 py-3 text-sm", isDark ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-100" : "border-emerald-200 bg-emerald-50 text-emerald-700"),
                        children: message
                    }, void 0, false, {
                        fileName: "[project]/components/actions/action-form.tsx",
                        lineNumber: 993,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid gap-4 md:grid-cols-2",
                        children: [
                            filterBlock,
                            renderActionFields()
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/actions/action-form.tsx",
                        lineNumber: 1005,
                        columnNumber: 9
                    }, this),
                    shouldShowFieldSuggestions && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("datalist", {
                        id: fieldSuggestionsId,
                        children: fieldCatalog.map((field)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: field.id,
                                label: field.name
                            }, field.id, false, {
                                fileName: "[project]/components/actions/action-form.tsx",
                                lineNumber: 1013,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/components/actions/action-form.tsx",
                        lineNumber: 1011,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex flex-col gap-3 rounded-2xl border border-dashed px-4 py-4 text-sm md:flex-row md:items-center md:justify-between", isDark ? "border-zinc-700 text-zinc-400" : "border-slate-300 text-slate-600"),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(subtleText),
                                children: "Toda ação registrada será encaminhada para aprovação do administrador antes da execução."
                            }, void 0, false, {
                                fileName: "[project]/components/actions/action-form.tsx",
                                lineNumber: 1026,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                type: "button",
                                className: "rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-sm font-semibold text-white shadow-lg disabled:opacity-60",
                                disabled: disableSubmit,
                                onClick: onSubmit,
                                children: isSubmitting ? "Registrando..." : "Enviar para aprovação"
                            }, void 0, false, {
                                fileName: "[project]/components/actions/action-form.tsx",
                                lineNumber: 1029,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/actions/action-form.tsx",
                        lineNumber: 1018,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/actions/action-form.tsx",
                lineNumber: 979,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/actions/action-form.tsx",
        lineNumber: 968,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/(authenticated)/acoes/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AcoesPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$dashboard$2d$shell$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/layout/dashboard-shell.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$actions$2f$action$2d$form$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/actions/action-form.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$theme$2f$theme$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/theme/theme-provider.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$workflow$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Workflow$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/workflow.js [app-ssr] (ecmascript) <export default as Workflow>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$repeat$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Repeat$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/repeat.js [app-ssr] (ecmascript) <export default as Repeat>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__UserCheck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user-check.js [app-ssr] (ecmascript) <export default as UserCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-square.js [app-ssr] (ecmascript) <export default as MessageSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$list$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardList$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clipboard-list.js [app-ssr] (ecmascript) <export default as ClipboardList>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$upload$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__UploadCloud$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/cloud-upload.js [app-ssr] (ecmascript) <export default as UploadCloud>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-ssr] (ecmascript) <export default as Trash2>");
"use client";
;
;
;
;
;
;
;
;
;
const actionOptions = [
    {
        id: "status",
        title: "Alterar status",
        description: "Atualize o status de várias issues ao mesmo tempo.",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$repeat$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Repeat$3e$__["Repeat"]
    },
    {
        id: "assignee",
        title: "Mudar responsável",
        description: "Reatribua para outro analista ou squad.",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__UserCheck$3e$__["UserCheck"]
    },
    {
        id: "comment",
        title: "Adicionar comentário",
        description: "Envie uma mensagem padrão para todas as issues selecionadas.",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__["MessageSquare"]
    },
    {
        id: "fields",
        title: "Atualizar campos",
        description: "Modifique campos personalizados como prioridades ou versões.",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$list$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardList$3e$__["ClipboardList"]
    },
    {
        id: "escalate",
        title: "Subir issue",
        description: "Encaminhe issues críticas para triagem imediata.",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$upload$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__UploadCloud$3e$__["UploadCloud"]
    },
    {
        id: "delete",
        title: "Deletar issue",
        description: "Exclua registros específicos de forma definitiva.",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"]
    }
];
const projectOptions = [
    {
        value: "ASSETN",
        label: "ASSETN - Ativos"
    },
    {
        value: "CPE",
        label: "CPE - Catálogo de CPEs"
    },
    {
        value: "OPENCVE",
        label: "OPENCVE - CVEs Emergenciais"
    }
];
const statusOptions = [
    "DONE",
    "Cancelado"
];
const actionLabelMap = actionOptions.reduce((acc, action)=>{
    acc[action.id] = action.title;
    return acc;
}, {});
function AcoesPage() {
    const { theme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$theme$2f$theme$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTheme"])();
    const isDark = theme === "dark";
    const [selectedAction, setSelectedAction] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("status");
    const [filterMode, setFilterMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("jql");
    const [filterValue, setFilterValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [statusValue, setStatusValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(statusOptions[0]);
    const [assignee, setAssignee] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [comment, setComment] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [fields, setFields] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([
        {
            key: "",
            value: ""
        }
    ]);
    const [idsFileName, setIdsFileName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [projectKey, setProjectKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(projectOptions[0].value);
    const [isSubmitting, setIsSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [issuesCount, setIssuesCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isCheckingCount, setIsCheckingCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [myRequests, setMyRequests] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoadingRequests, setIsLoadingRequests] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [requestsError, setRequestsError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [requestsRefreshKey, setRequestsRefreshKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [historyCollapsed, setHistoryCollapsed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const cardClasses = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("rounded-3xl border", isDark ? "border-zinc-800 bg-[#050816]/80" : "border-slate-200 bg-white");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let active = true;
        setIsLoadingRequests(true);
        setRequestsError(null);
        fetch("/api/actions/requests?scope=self&limit=25").then(async (res)=>{
            const data = await res.json().catch(()=>null);
            if (!active) {
                return;
            }
            if (!res.ok) {
                throw new Error(data?.error || "Não foi possível carregar suas solicitações.");
            }
            setMyRequests(data?.requests ?? []);
            setIsLoadingRequests(false);
        }).catch((err)=>{
            if (!active) {
                return;
            }
            setRequestsError(err instanceof Error ? err.message : "Não foi possível carregar suas solicitações.");
            setIsLoadingRequests(false);
        });
        return ()=>{
            active = false;
        };
    }, [
        requestsRefreshKey
    ]);
    function handleFilterModeChange(mode) {
        if (selectedAction === "delete" && mode === "jql") {
            return;
        }
        setFilterMode(mode);
        setFilterValue("");
        setIssuesCount(null);
        if (mode !== "ids") {
            setIdsFileName(null);
        }
    }
    async function handleSubmit() {
        if (!selectedAction) {
            setError("Selecione uma ação antes de continuar.");
            return;
        }
        const isEscalate = selectedAction === "escalate";
        if (!isEscalate && !filterValue.trim()) {
            setError("Informe a JQL ou os IDs antes de enviar.");
            return;
        }
        if (selectedAction === "assignee" && !assignee.trim()) {
            setError("Informe o novo responsável.");
            return;
        }
        if (selectedAction === "comment" && !comment.trim()) {
            setError("Digite o comentário que será replicado.");
            return;
        }
        const normalizedFields = fields.map((field)=>({
                key: field.key.trim(),
                value: field.value.trim()
            }));
        if (selectedAction === "fields") {
            const hasEmptyFields = normalizedFields.some((field)=>!field.key || !field.value);
            if (hasEmptyFields) {
                setError("Preencha todos os campos e valores antes de continuar.");
                return;
            }
        }
        const cleanedFields = selectedAction === "fields" || isEscalate ? normalizedFields.filter((field)=>field.key && field.value) : [];
        if (isEscalate) {
            const csvData = filterValue.trim();
            if (!projectKey) {
                setError("Selecione o projeto destino antes de continuar.");
                return;
            }
            if (!csvData && cleanedFields.length === 0) {
                setError("Envie o CSV de template ou preencha ao menos um campo manualmente.");
                return;
            }
        }
        setIsSubmitting(true);
        setMessage(null);
        setError(null);
        try {
            const response = await fetch("/api/actions/requests", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    actionType: selectedAction,
                    filterMode: isEscalate ? "project" : filterMode,
                    filterValue: isEscalate ? projectKey : filterValue.trim(),
                    requestedStatus: selectedAction === "status" ? statusValue : undefined,
                    assignee: selectedAction === "assignee" ? assignee.trim() : undefined,
                    comment: selectedAction === "comment" ? comment.trim() : undefined,
                    fields: selectedAction === "fields" || isEscalate ? cleanedFields : undefined,
                    projectKey: isEscalate ? projectKey : undefined,
                    csvData: isEscalate ? filterValue.trim() || undefined : undefined,
                    csvFileName: isEscalate ? idsFileName ?? undefined : undefined
                })
            });
            const data = await response.json().catch(()=>null);
            if (!response.ok) {
                throw new Error(data?.error || "Falha ao registrar a ação.");
            }
            setMessage("Solicitação enviada para aprovação do administrador. Você será notificado após a revisão.");
            setFilterValue("");
            setIssuesCount(null);
            setAssignee("");
            setComment("");
            setFields([
                {
                    key: "",
                    value: ""
                }
            ]);
            setIdsFileName(null);
            triggerRequestsRefresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Não foi possível enviar a ação.");
        } finally{
            setIsSubmitting(false);
        }
    }
    async function handleSimulateCount() {
        if (filterMode !== "jql") return;
        if (!filterValue.trim()) {
            setError("Escreva uma JQL antes de estimar a quantidade.");
            return;
        }
        setError(null);
        setMessage(null);
        setIsCheckingCount(true);
        await new Promise((resolve)=>setTimeout(resolve, 700));
        const fakeNumber = 42 + Math.floor(Math.random() * 80);
        setIssuesCount(fakeNumber);
        setIsCheckingCount(false);
    }
    function triggerRequestsRefresh() {
        setRequestsRefreshKey((prev)=>prev + 1);
    }
    function handleImportIdsFromFile(content, fileName) {
        if (selectedAction === "escalate") {
            setFilterValue(content.trim());
            setIdsFileName(fileName);
            return;
        }
        setFilterMode("ids");
        setFilterValue(content.trim());
        setIdsFileName(fileName);
        setIssuesCount(null);
    }
    function handlePrefillFieldKey(fieldKey) {
        setFields((prev)=>{
            const targetIndex = prev.findIndex((field)=>!field.key.trim());
            if (targetIndex !== -1) {
                return prev.map((field, index)=>index === targetIndex ? {
                        ...field,
                        key: fieldKey
                    } : field);
            }
            return [
                ...prev,
                {
                    key: fieldKey,
                    value: ""
                }
            ];
        });
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (selectedAction === "delete") {
            setFilterMode("ids");
        }
    }, [
        selectedAction
    ]);
    function getStatusInfo(status) {
        switch(status){
            case "approved":
                return {
                    label: "Aprovado",
                    className: isDark ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300" : "border-emerald-200 bg-emerald-50 text-emerald-700"
                };
            case "declined":
                return {
                    label: "Declinado",
                    className: isDark ? "border-rose-500/50 bg-rose-500/10 text-rose-300" : "border-rose-200 bg-rose-50 text-rose-700"
                };
            default:
                return {
                    label: "Pendente",
                    className: isDark ? "border-amber-500/40 bg-amber-500/10 text-amber-200" : "border-amber-200 bg-amber-50 text-amber-700"
                };
        }
    }
    function getActionSummary(request) {
        switch(request.action_type){
            case "status":
                return `Alterar status para ${request.requested_status ?? "-"}.`;
            case "assignee":
                return request.payload?.assignee ? `Mudar responsável para ${request.payload.assignee}.` : "Mudar responsável.";
            case "comment":
                {
                    const commentText = request.payload?.comment ?? "";
                    if (!commentText) {
                        return "Adicionar comentário padronizado.";
                    }
                    const preview = commentText.length > 80 ? `${commentText.slice(0, 80).trim()}...` : commentText;
                    return `Adicionar comentário: "${preview}"`;
                }
            case "fields":
                {
                    const total = request.payload?.fields?.length ?? 0;
                    return total ? `Atualizar ${total} campo${total > 1 ? "s" : ""} personalizado${total > 1 ? "s" : ""}.` : "Atualizar campos personalizados.";
                }
            case "escalate":
                {
                    const project = request.payload?.projectKey ?? request.filter_value ?? "-";
                    const total = request.payload?.fields?.length ?? 0;
                    const csvInfo = request.payload?.csvFileName ? ` com CSV (${request.payload.csvFileName})` : request.payload?.csvData ? " com CSV anexado" : "";
                    return total ? `Subir issue para ${project} atualizando ${total} campo${total > 1 ? "s" : ""}${csvInfo}.` : `Subir issue para ${project}${csvInfo}.`;
                }
            case "delete":
                {
                    const total = request.payload?.fields?.length ?? 0;
                    const warning = total > 0 ? `Remover issues e apagar ${total} campo${total > 1 ? "s" : ""} antes da exclusão.` : "Exclusão permanente das issues informadas.";
                    return warning;
                }
            default:
                return actionLabelMap[request.action_type] ?? request.action_type;
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$dashboard$2d$shell$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DashboardShell"], {
        pageTitle: "Ações em Massa",
        pageSubtitle: "Automação de incidentes e integrações Jira",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex w-full flex-col gap-6 px-4 lg:px-10",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("relative overflow-hidden rounded-3xl border px-6 py-6", isDark ? "border-white/5 bg-gradient-to-br from-[#090f1f] to-[#05060f] text-zinc-100" : "border-slate-200 bg-white text-slate-800"),
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-3 md:flex-row md:items-center md:justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-xl",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$workflow$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Workflow$3e$__["Workflow"], {
                                            className: "h-6 w-6"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(authenticated)/acoes/page.tsx",
                                            lineNumber: 425,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/(authenticated)/acoes/page.tsx",
                                        lineNumber: 424,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs uppercase tracking-[0.3em] text-purple-300",
                                                children: "Automação Jira"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(authenticated)/acoes/page.tsx",
                                                lineNumber: 428,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "text-2xl font-semibold",
                                                children: "Gerencie ações em lote"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(authenticated)/acoes/page.tsx",
                                                lineNumber: 431,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-zinc-400",
                                                children: "Centralize solicitações complexas em uma única fila com auditoria."
                                            }, void 0, false, {
                                                fileName: "[project]/app/(authenticated)/acoes/page.tsx",
                                                lineNumber: 432,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(authenticated)/acoes/page.tsx",
                                        lineNumber: 427,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(authenticated)/acoes/page.tsx",
                                lineNumber: 423,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("rounded-2xl border px-4 py-3 text-xs", isDark ? "border-purple-500/30 bg-purple-500/5 text-purple-200" : "border-purple-200 bg-purple-50 text-purple-700"),
                                children: "Ambiente de teste · Jira Cloud"
                            }, void 0, false, {
                                fileName: "[project]/app/(authenticated)/acoes/page.tsx",
                                lineNumber: 437,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(authenticated)/acoes/page.tsx",
                        lineNumber: 422,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/(authenticated)/acoes/page.tsx",
                    lineNumber: 414,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-xs uppercase tracking-[0.3em] text-purple-400",
                            children: "Selecione uma ação"
                        }, void 0, false, {
                            fileName: "[project]/app/(authenticated)/acoes/page.tsx",
                            lineNumber: 451,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
                            children: actionOptions.map((action)=>{
                                const Icon = action.icon;
                                const active = selectedAction === action.id;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>setSelectedAction(action.id),
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex w-full flex-col gap-3 rounded-[22px] border px-4 py-4 text-left transition-all", active ? "border-purple-500 bg-gradient-to-br from-purple-600/40 to-indigo-600/40 text-white shadow-lg shadow-purple-900/20" : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("hover:border-purple-400/60 hover:bg-purple-500/5", isDark ? "border-white/5 bg-transparent text-zinc-300" : "border-slate-200 bg-white text-slate-600")),
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-col items-center gap-2 text-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex h-10 w-10 items-center justify-center rounded-2xl border", active ? "border-white/20 bg-white/10 text-white" : isDark ? "border-white/10 text-zinc-400" : "border-slate-200 text-slate-500"),
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                                    className: "h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(authenticated)/acoes/page.tsx",
                                                    lineNumber: 486,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/(authenticated)/acoes/page.tsx",
                                                lineNumber: 476,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-xs font-semibold tracking-wide", active ? "text-white" : isDark ? "text-zinc-100" : "text-slate-800"),
                                                children: action.title
                                            }, void 0, false, {
                                                fileName: "[project]/app/(authenticated)/acoes/page.tsx",
                                                lineNumber: 488,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(authenticated)/acoes/page.tsx",
                                        lineNumber: 475,
                                        columnNumber: 19
                                    }, this)
                                }, action.id, false, {
                                    fileName: "[project]/app/(authenticated)/acoes/page.tsx",
                                    lineNumber: 459,
                                    columnNumber: 17
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/app/(authenticated)/acoes/page.tsx",
                            lineNumber: 454,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(authenticated)/acoes/page.tsx",
                    lineNumber: 450,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$actions$2f$action$2d$form$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ActionForm"], {
                    selectedAction: selectedAction,
                    filterMode: filterMode,
                    filterValue: filterValue,
                    projectValue: projectKey,
                    statusValue: statusValue,
                    assignee: assignee,
                    comment: comment,
                    fields: fields,
                    issuesCount: issuesCount,
                    isCheckingCount: isCheckingCount,
                    isSubmitting: isSubmitting,
                    error: error,
                    message: message,
                    onFilterModeChange: handleFilterModeChange,
                    onFilterValueChange: (value)=>{
                        setFilterValue(value);
                        setIssuesCount(null);
                    },
                    onProjectChange: (value)=>setProjectKey(value),
                    onStatusChange: (value)=>setStatusValue(value),
                    onAssigneeChange: (value)=>setAssignee(value),
                    onCommentChange: (value)=>setComment(value),
                    onFieldKeyChange: (index, value)=>setFields((prev)=>prev.map((field, fieldIndex)=>fieldIndex === index ? {
                                    ...field,
                                    key: value
                                } : field)),
                    onFieldValueChange: (index, value)=>setFields((prev)=>prev.map((field, fieldIndex)=>fieldIndex === index ? {
                                    ...field,
                                    value
                                } : field)),
                    onAddField: ()=>setFields((prev)=>[
                                ...prev,
                                {
                                    key: "",
                                    value: ""
                                }
                            ]),
                    onRemoveField: (index)=>setFields((prev)=>prev.length === 1 ? prev : prev.filter((_, fieldIndex)=>fieldIndex !== index)),
                    onPrefillFieldKey: handlePrefillFieldKey,
                    onSimulateCount: handleSimulateCount,
                    onSubmit: handleSubmit,
                    onImportIdsFromFile: handleImportIdsFromFile,
                    uploadedFileName: idsFileName,
                    projectOptions: projectOptions,
                    csvTemplateUrl: "/templates/escalate-template.csv"
                }, void 0, false, {
                    fileName: "[project]/app/(authenticated)/acoes/page.tsx",
                    lineNumber: 507,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                    className: cardClasses,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardHeader"], {
                            className: "flex flex-row items-start justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardTitle"], {
                                            className: "text-lg",
                                            children: "Minhas solicitações recentes"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(authenticated)/acoes/page.tsx",
                                            lineNumber: 566,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardDescription"], {
                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-sm", isDark ? "text-zinc-500" : "text-slate-500"),
                                            children: "Acompanhe o status e os motivos registrados pelo administrador."
                                        }, void 0, false, {
                                            fileName: "[project]/app/(authenticated)/acoes/page.tsx",
                                            lineNumber: 567,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(authenticated)/acoes/page.tsx",
                                    lineNumber: 565,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                            type: "button",
                                            variant: "ghost",
                                            size: "sm",
                                            className: "rounded-xl text-xs text-zinc-400 hover:text-zinc-100",
                                            onClick: ()=>setHistoryCollapsed((prev)=>!prev),
                                            children: historyCollapsed ? "Expandir" : "Recolher"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(authenticated)/acoes/page.tsx",
                                            lineNumber: 574,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                            type: "button",
                                            variant: "outline",
                                            size: "sm",
                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("rounded-xl text-xs", isDark ? "border border-zinc-700 text-zinc-200" : "border border-slate-300 text-slate-700"),
                                            onClick: triggerRequestsRefresh,
                                            disabled: isLoadingRequests,
                                            children: isLoadingRequests ? "Atualizando..." : "Atualizar"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(authenticated)/acoes/page.tsx",
                                            lineNumber: 583,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(authenticated)/acoes/page.tsx",
                                    lineNumber: 573,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(authenticated)/acoes/page.tsx",
                            lineNumber: 564,
                            columnNumber: 11
                        }, this),
                        !historyCollapsed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("space-y-4 text-sm", isDark ? "text-zinc-300" : "text-slate-600"),
                            children: [
                                requestsError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("rounded-2xl border px-4 py-3 text-xs", isDark ? "border-rose-500/50 bg-rose-500/10 text-rose-100" : "border-rose-200 bg-rose-50 text-rose-700"),
                                    children: requestsError
                                }, void 0, false, {
                                    fileName: "[project]/app/(authenticated)/acoes/page.tsx",
                                    lineNumber: 608,
                                    columnNumber: 17
                                }, this),
                                isLoadingRequests ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-xs", isDark ? "text-zinc-500" : "text-slate-500"),
                                    children: "Carregando suas solicitações..."
                                }, void 0, false, {
                                    fileName: "[project]/app/(authenticated)/acoes/page.tsx",
                                    lineNumber: 620,
                                    columnNumber: 17
                                }, this) : myRequests.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-xs", isDark ? "text-zinc-500" : "text-slate-500"),
                                    children: "Você ainda não enviou solicitações de ação. Use o formulário acima para registrar a primeira."
                                }, void 0, false, {
                                    fileName: "[project]/app/(authenticated)/acoes/page.tsx",
                                    lineNumber: 626,
                                    columnNumber: 17
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2.5",
                                    children: myRequests.map((request)=>{
                                        const statusInfo = getStatusInfo(request.status);
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("rounded-2xl border px-3 py-3 text-sm", isDark ? "border-zinc-700 text-zinc-300" : "border-slate-200 bg-white text-slate-600"),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-col gap-2 md:flex-row md:items-center md:justify-between",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-base font-semibold", isDark ? "text-white" : "text-slate-800"),
                                                                    children: actionLabelMap[request.action_type] ?? request.action_type
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/(authenticated)/acoes/page.tsx",
                                                                    lineNumber: 647,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-xs", isDark ? "text-zinc-500" : "text-slate-500"),
                                                                    children: [
                                                                        "#",
                                                                        request.id,
                                                                        " ·",
                                                                        " ",
                                                                        new Date(request.created_at).toLocaleString("pt-BR", {
                                                                            timeZone: "America/Sao_Paulo"
                                                                        })
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/(authenticated)/acoes/page.tsx",
                                                                    lineNumber: 655,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/(authenticated)/acoes/page.tsx",
                                                            lineNumber: 646,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("rounded-full border px-3 py-1 text-xs uppercase tracking-[0.2em]", statusInfo.className),
                                                            children: statusInfo.label
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(authenticated)/acoes/page.tsx",
                                                            lineNumber: 667,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(authenticated)/acoes/page.tsx",
                                                    lineNumber: 645,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("mt-2 rounded-2xl border border-dashed px-3 py-2 text-xs", isDark ? "border-zinc-700/70 text-zinc-400" : "border-slate-200 text-slate-500"),
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("font-semibold", isDark ? "text-zinc-200" : "text-slate-700"),
                                                            children: getActionSummary(request)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(authenticated)/acoes/page.tsx",
                                                            lineNumber: 684,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "mt-1 text-[11px] uppercase tracking-[0.3em]",
                                                            children: [
                                                                "Conjunto (",
                                                                request.filter_mode.toUpperCase(),
                                                                ")"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/(authenticated)/acoes/page.tsx",
                                                            lineNumber: 692,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                                            className: "mt-1 whitespace-pre-wrap text-[11px]",
                                                            children: request.filter_value
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(authenticated)/acoes/page.tsx",
                                                            lineNumber: 695,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(authenticated)/acoes/page.tsx",
                                                    lineNumber: 676,
                                                    columnNumber: 25
                                                }, this),
                                                request.status === "pending" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("mt-2 text-xs", isDark ? "text-zinc-500" : "text-slate-500"),
                                                    children: "Aguardando aprovação de um administrador."
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(authenticated)/acoes/page.tsx",
                                                    lineNumber: 700,
                                                    columnNumber: 27
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("mt-2 rounded-2xl border px-3 py-2 text-xs", request.status === "approved" ? isDark ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-100" : "border-emerald-200 bg-emerald-50 text-emerald-700" : isDark ? "border-rose-500/40 bg-rose-500/10 text-rose-100" : "border-rose-200 bg-rose-50 text-rose-700"),
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "font-semibold",
                                                            children: "Motivo registrado"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(authenticated)/acoes/page.tsx",
                                                            lineNumber: 721,
                                                            columnNumber: 29
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "mt-1 whitespace-pre-wrap text-[12px] leading-relaxed",
                                                            children: request.audit_notes ?? "Sem observações registradas."
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(authenticated)/acoes/page.tsx",
                                                            lineNumber: 722,
                                                            columnNumber: 29
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(authenticated)/acoes/page.tsx",
                                                    lineNumber: 709,
                                                    columnNumber: 27
                                                }, this)
                                            ]
                                        }, request.id, true, {
                                            fileName: "[project]/app/(authenticated)/acoes/page.tsx",
                                            lineNumber: 636,
                                            columnNumber: 23
                                        }, this);
                                    })
                                }, void 0, false, {
                                    fileName: "[project]/app/(authenticated)/acoes/page.tsx",
                                    lineNumber: 632,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(authenticated)/acoes/page.tsx",
                            lineNumber: 601,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(authenticated)/acoes/page.tsx",
                    lineNumber: 563,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/(authenticated)/acoes/page.tsx",
            lineNumber: 413,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/(authenticated)/acoes/page.tsx",
        lineNumber: 409,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__5bc3d17b._.js.map