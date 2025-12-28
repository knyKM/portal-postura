"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

type Player = {
  x: number;
  y: number;
  dir: number;
};

type Target = {
  id: string;
  x: number;
  y: number;
  alive: boolean;
};

type Stats = {
  shots: number;
  hits: number;
  message: string;
};

const MAP_WIDTH = 12;
const MAP_HEIGHT = 12;
const FOV = Math.PI / 3;
const MAX_DISTANCE = 18;

const LEVEL_MAP: number[][] = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const INITIAL_TARGETS: Target[] = [
  { id: "Drone-A", x: 5.5, y: 2.5, alive: true },
  { id: "Drone-B", x: 9.5, y: 8.5, alive: true },
  { id: "Drone-C", x: 2.5, y: 8.5, alive: true },
  { id: "Drone-D", x: 8.5, y: 4.5, alive: true },
];

function cloneTargets() {
  return INITIAL_TARGETS.map((target) => ({ ...target }));
}

function clampAngle(angle: number) {
  return Math.atan2(Math.sin(angle), Math.cos(angle));
}

function isWall(x: number, y: number) {
  const mapX = Math.floor(x);
  const mapY = Math.floor(y);
  if (mapX < 0 || mapX >= MAP_WIDTH || mapY < 0 || mapY >= MAP_HEIGHT) {
    return true;
  }
  return LEVEL_MAP[mapY][mapX] !== 0;
}

function lineOfSight(px: number, py: number, tx: number, ty: number) {
  const steps = 48;
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const ix = px + (tx - px) * t;
    const iy = py + (ty - py) * t;
    if (isWall(ix, iy)) {
      return false;
    }
  }
  return true;
}

function DoomLabContent() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerRef = useRef<Player>({ x: 3.5, y: 3.5, dir: 0 });
  const keysRef = useRef<Record<string, boolean>>({});
  const targetsRef = useRef<Target[]>(cloneTargets());
  const lastTimeRef = useRef<number | null>(null);

  const [stats, setStats] = useState<Stats>({
    shots: 0,
    hits: 0,
    message: "Localize e neutralize os drones vermelhos.",
  });
  const [remaining, setRemaining] = useState(targetsRef.current.length);

  const resetGame = useCallback(() => {
    playerRef.current = { x: 3.5, y: 3.5, dir: 0 };
    targetsRef.current = cloneTargets();
    setStats({
      shots: 0,
      hits: 0,
      message: "Localize e neutralize os drones vermelhos.",
    });
    setRemaining(targetsRef.current.length);
  }, []);

  const handleShoot = useCallback(() => {
    const player = playerRef.current;
    const targets = targetsRef.current;
    let hitId: string | null = null;

    for (const target of targets) {
      if (!target.alive) continue;
      const dx = target.x - player.x;
      const dy = target.y - player.y;
      const distance = Math.hypot(dx, dy);
      const angleTo = Math.atan2(dy, dx);
      const angleDiff = clampAngle(angleTo - player.dir);

      if (
        distance < 12 &&
        Math.abs(angleDiff) < 0.25 &&
        lineOfSight(player.x, player.y, target.x, target.y)
      ) {
        target.alive = false;
        hitId = target.id;
        break;
      }
    }

    const aliveLeft = targets.filter((t) => t.alive).length;
    let message = "Disparo sem alvo. Ajuste sua mira.";
    if (hitId) {
      message =
        aliveLeft === 0
          ? "Base segura! Todos os drones foram neutralizados."
          : `🟢 ${hitId} neutralizado!`;
    }

    setStats((prev) => ({
      shots: prev.shots + 1,
      hits: hitId ? prev.hits + 1 : prev.hits,
      message,
    }));

    if (hitId) {
      setRemaining(aliveLeft);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      keysRef.current[event.key.toLowerCase()] = true;
      if (
        event.code === "Space" ||
        event.key === " "
      ) {
        event.preventDefault();
        handleShoot();
      }
    };
    const handleKeyUp = (event: KeyboardEvent) => {
      keysRef.current[event.key.toLowerCase()] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleShoot]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const updatePlayer = (dt: number) => {
      const player = playerRef.current;
      const keys = keysRef.current;
      const moveSpeed = 3.5;
      const turnSpeed = 2.5;

      if (keys["arrowleft"] || keys["q"]) {
        player.dir = clampAngle(player.dir - turnSpeed * dt);
      }
      if (keys["arrowright"] || keys["e"]) {
        player.dir = clampAngle(player.dir + turnSpeed * dt);
      }

      let moveX = 0;
      let moveY = 0;

      if (keys["w"] || keys["arrowup"]) {
        moveX += Math.cos(player.dir) * moveSpeed * dt;
        moveY += Math.sin(player.dir) * moveSpeed * dt;
      }
      if (keys["s"] || keys["arrowdown"]) {
        moveX -= Math.cos(player.dir) * moveSpeed * dt;
        moveY -= Math.sin(player.dir) * moveSpeed * dt;
      }
      if (keys["a"]) {
        moveX -= Math.sin(player.dir) * moveSpeed * dt;
        moveY += Math.cos(player.dir) * moveSpeed * dt;
      }
      if (keys["d"]) {
        moveX += Math.sin(player.dir) * moveSpeed * dt;
        moveY -= Math.cos(player.dir) * moveSpeed * dt;
      }

      const nextX = player.x + moveX;
      const nextY = player.y + moveY;

      if (!isWall(nextX, player.y)) {
        player.x = nextX;
      }
      if (!isWall(player.x, nextY)) {
        player.y = nextY;
      }
    };

    const renderScene = () => {
      const width = canvas.width;
      const height = canvas.height;
      const player = playerRef.current;
      const targets = targetsRef.current;
      ctx.fillStyle = "#050816";
      ctx.fillRect(0, 0, width, height / 2);
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, height / 2, width, height / 2);

      const numRays = Math.floor(width / 2);
      const columnWidth = width / numRays;
      const depthBuffer = new Array(numRays).fill(MAX_DISTANCE);

      for (let column = 0; column < numRays; column += 1) {
        const screenX = column / numRays - 0.5;
        const rayAngle = player.dir + screenX * FOV;

        let distance = 0;
        let hitValue = 0;
        let hit = false;

        let rayX = player.x;
        let rayY = player.y;
        const stepSize = 0.02;

        while (!hit && distance < MAX_DISTANCE) {
          rayX += Math.cos(rayAngle) * stepSize;
          rayY += Math.sin(rayAngle) * stepSize;
          distance += stepSize;

          if (isWall(rayX, rayY)) {
            hit = true;
            hitValue = LEVEL_MAP[Math.floor(rayY)][Math.floor(rayX)];
          }
        }

        const corrected = distance * Math.cos(rayAngle - player.dir);
        depthBuffer[column] = corrected;
        const wallHeight = Math.min(height, (height / corrected) * 1.5);
        const top = height / 2 - wallHeight / 2;

        const shade = Math.max(0, 1 - corrected / MAX_DISTANCE);
        const baseColor =
          hitValue === 1
            ? `rgba(99,102,241,${0.45 + shade * 0.45})`
            : `rgba(248,113,113,${0.5 + shade * 0.4})`;

        ctx.fillStyle = baseColor;
        ctx.fillRect(column * columnWidth, top, columnWidth + 1, wallHeight);
      }

      const sortedTargets = [...targets].sort((a, b) => {
        const da = Math.hypot(a.x - player.x, a.y - player.y);
        const db = Math.hypot(b.x - player.x, b.y - player.y);
        return db - da;
      });

      sortedTargets.forEach((target) => {
        if (!target.alive) return;
        const dx = target.x - player.x;
        const dy = target.y - player.y;
        const distance = Math.hypot(dx, dy);
        const angleTo = Math.atan2(dy, dx);
        const angleDiff = clampAngle(angleTo - player.dir);

        if (Math.abs(angleDiff) > FOV / 2 + 0.2) return;
        const spriteScreenX = width / 2 - (angleDiff / (FOV / 2)) * (width / 2);
        const spriteSize = Math.min(height, (height / distance) * 0.9);
        const top = height / 2 - spriteSize / 2;
        const depthIndex = Math.floor(spriteScreenX / columnWidth);

        if (
          depthIndex >= 0 &&
          depthIndex < depthBuffer.length &&
          depthBuffer[depthIndex] > distance
        ) {
          const gradient = ctx.createLinearGradient(
            spriteScreenX - spriteSize / 2,
            top,
            spriteScreenX + spriteSize / 2,
            top + spriteSize
          );
          gradient.addColorStop(0, "rgba(248,113,113,0.2)");
          gradient.addColorStop(0.5, "rgba(248,113,113,0.95)");
          gradient.addColorStop(1, "rgba(248,113,113,0.2)");
          ctx.fillStyle = gradient;
          ctx.fillRect(
            spriteScreenX - spriteSize / 2,
            top,
            spriteSize,
            spriteSize
          );
        }
      });

      // crosshair
      ctx.strokeStyle = "rgba(255,255,255,0.7)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 12, height / 2);
      ctx.lineTo(width / 2 + 12, height / 2);
      ctx.moveTo(width / 2, height / 2 - 12);
      ctx.lineTo(width / 2, height / 2 + 12);
      ctx.stroke();

      // minimap
      const mapScale = 10;
      ctx.save();
      ctx.translate(16, 16);
      ctx.fillStyle = "rgba(5,8,22,0.8)";
      ctx.fillRect(0, 0, MAP_WIDTH * mapScale, MAP_HEIGHT * mapScale);

      for (let y = 0; y < MAP_HEIGHT; y += 1) {
        for (let x = 0; x < MAP_WIDTH; x += 1) {
          if (LEVEL_MAP[y][x] !== 0) {
            ctx.fillStyle =
              LEVEL_MAP[y][x] === 1 ? "#312e81" : "rgba(239,68,68,0.8)";
            ctx.fillRect(x * mapScale, y * mapScale, mapScale, mapScale);
          }
        }
      }

      ctx.fillStyle = "#10b981";
      ctx.beginPath();
      ctx.arc(
        player.x * mapScale,
        player.y * mapScale,
        3,
        0,
        Math.PI * 2
      );
      ctx.fill();

      ctx.strokeStyle = "#10b981";
      ctx.beginPath();
      ctx.moveTo(player.x * mapScale, player.y * mapScale);
      ctx.lineTo(
        player.x * mapScale + Math.cos(player.dir) * 10,
        player.y * mapScale + Math.sin(player.dir) * 10
      );
      ctx.stroke();

      targets.forEach((target) => {
        if (!target.alive) return;
        ctx.fillStyle = "#f87171";
        ctx.fillRect(
          target.x * mapScale - 2,
          target.y * mapScale - 2,
          4,
          4
        );
      });
      ctx.restore();
    };

    const loop = (time: number) => {
      if (lastTimeRef.current == null) {
        lastTimeRef.current = time;
      }
      const delta = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      updatePlayer(delta);
      renderScene();

      animationFrame = requestAnimationFrame(loop);
    };

    let animationFrame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const accuracy =
    stats.shots === 0 ? 0 : Math.round((stats.hits / stats.shots) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050816] via-[#02030f] to-black px-4 py-10 text-zinc-100">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <Card className="border border-zinc-800 bg-[#070917]/80 backdrop-blur">
          <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.5em] text-zinc-500">
                Simulador interno
              </p>
              <CardTitle className="text-3xl font-semibold">
                Doom Lab – Postura Security
              </CardTitle>
              <p className="text-sm text-zinc-400">
                Use W/A/S/D para mover, ←/→ para rotacionar e Espaço para disparar.
              </p>
            </div>
            <Button
              onClick={resetGame}
              variant="outline"
              className="flex items-center gap-2 rounded-2xl border-zinc-700 text-xs text-zinc-200 hover:bg-zinc-800"
            >
              <RotateCcw className="h-4 w-4" />
              Reiniciar simulação
            </Button>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm text-zinc-400 md:grid-cols-3">
            <div className="rounded-2xl border border-dashed border-zinc-700 px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">
                Drones restantes
              </p>
              <p className="text-2xl font-semibold text-rose-400">{remaining}</p>
            </div>
            <div className="rounded-2xl border border-dashed border-zinc-700 px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">
                Precisão
              </p>
              <p className="text-2xl font-semibold text-emerald-400">
                {accuracy}%
              </p>
            </div>
            <div className="rounded-2xl border border-dashed border-zinc-700 px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">
                Status
              </p>
              <p className="text-sm font-medium text-zinc-200">{stats.message}</p>
            </div>
          </CardContent>
        </Card>

        <div className="rounded-3xl border border-zinc-900 bg-[#030410] p-3 shadow-[0_20px_70px_rgba(15,15,50,0.65)]">
          <canvas
            ref={canvasRef}
            className="h-[460px] w-full rounded-2xl bg-black"
          />
        </div>

        <Card className="border border-zinc-800 bg-[#050816]/80">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Controles rápidos
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm text-zinc-400 md:grid-cols-2">
            <div className="rounded-2xl border border-dashed border-zinc-700 px-4 py-3">
              <p className="font-semibold text-zinc-200">Movimentação</p>
              <p>W/A/S/D para deslocar, ← → ou Q/E para girar.</p>
            </div>
            <div className="rounded-2xl border border-dashed border-zinc-700 px-4 py-3">
              <p className="font-semibold text-zinc-200">Neutralização</p>
              <p>Use Espaço para disparar. Alinhe o alvo à mira.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function DoomLab() {
  const router = useRouter();
  const [checkingSession, setCheckingSession] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

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

  return <DoomLabContent />;
}
