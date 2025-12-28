"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Target = {
  id: number;
  angle: number;
  distance: number;
  speed: number;
  color: string;
};

const FIELD_OF_VIEW = Math.PI / 3;
const MAX_DISTANCE = 30;

function randomColor() {
  const palette = ["#f97316", "#22d3ee", "#facc15", "#ef4444", "#c084fc"];
  return palette[Math.floor(Math.random() * palette.length)];
}

function createTarget(index: number): Target {
  return {
    id: index + Date.now(),
    angle: (Math.random() - 0.5) * FIELD_OF_VIEW * 1.5,
    distance: 10 + Math.random() * 15,
    speed: 4 + Math.random() * 2,
    color: randomColor(),
  };
}

export function KrunkerLab() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [health, setHealth] = useState(100);
  const [pointerLocked, setPointerLocked] = useState(false);
  const [status, setStatus] = useState("Clique para travar o mouse e entrar na arena.");

  const playerRef = useRef({
    yaw: 0,
    recoil: 0,
  });

  const targetsRef = useRef<Target[]>(Array.from({ length: 5 }, (_, i) => createTarget(i)));
  const lastTimeRef = useRef<number | null>(null);

  const handlePointerLockChange = useCallback(() => {
    const locked = document.pointerLockElement === canvasRef.current;
    setPointerLocked(locked);
    setStatus(locked ? "Derrote os drones neon!" : "Clique novamente para voltar ao modo FPS.");
  }, []);

  const shoot = useCallback(() => {
    playerRef.current.recoil = 0.25;
    const player = playerRef.current;
    const targets = targetsRef.current;
    let hit = false;

    for (const target of targets) {
      const angleDiff = Math.abs(target.angle - player.yaw);
      if (angleDiff < 0.12) {
        hit = true;
        target.distance = MAX_DISTANCE;
        target.angle = (Math.random() - 0.5) * FIELD_OF_VIEW * 1.5;
        target.color = randomColor();
        setScore((prev) => prev + 100 + streak * 20);
        setStreak((prev) => prev + 1);
        break;
      }
    }

    if (!hit) {
      setStreak(0);
      setScore((prev) => Math.max(0, prev - 25));
    }
  }, [streak]);

  const handleClick = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!pointerLocked) {
      canvas.requestPointerLock();
      return;
    }
    shoot();
  }, [pointerLocked, shoot]);

  useEffect(() => {
    document.addEventListener("pointerlockchange", handlePointerLockChange);
    return () => {
      document.removeEventListener("pointerlockchange", handlePointerLockChange);
    };
  }, [handlePointerLockChange]);

  useEffect(() => {
    function handleMouseMove(event: MouseEvent) {
      if (!pointerLocked) return;
      const sensitivity = 0.0025;
      playerRef.current.yaw += event.movementX * sensitivity;
      const limit = FIELD_OF_VIEW;
      if (playerRef.current.yaw > limit) playerRef.current.yaw = limit;
      if (playerRef.current.yaw < -limit) playerRef.current.yaw = -limit;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.code === "Space" || event.code === "Enter") {
        event.preventDefault();
        shoot();
      }
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [pointerLocked, shoot]);

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

    const render = (time: number) => {
      if (lastTimeRef.current == null) lastTimeRef.current = time;
      const delta = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      ctx.fillStyle = "#050816";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "rgba(255,255,255,0.05)";
      for (let i = 0; i < canvas.height; i += 12) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      const player = playerRef.current;
      player.recoil = Math.max(0, player.recoil - delta);

      targetsRef.current.forEach((target) => {
        target.distance -= target.speed * delta;
        if (target.distance < 1) {
          setHealth((prev) => Math.max(0, prev - 10));
          setStreak(0);
          target.distance = MAX_DISTANCE;
          target.angle = (Math.random() - 0.5) * FIELD_OF_VIEW * 1.5;
        }

        const width = canvas.width;
        const height = canvas.height;
        const screenX = width / 2 + (target.angle - player.yaw) * (width / FIELD_OF_VIEW);
        const size = Math.max(10, (1200 / target.distance) * 0.5);

        const gradient = ctx.createRadialGradient(screenX, height / 2, size * 0.2, screenX, height / 2, size);
        gradient.addColorStop(0, `${target.color}AA`);
        gradient.addColorStop(1, `${target.color}22`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(screenX, height / 2, size, 0, Math.PI * 2);
        ctx.fill();
      });

      const width = canvas.width;
      const height = canvas.height;
      ctx.strokeStyle = "#ffffffaa";
      ctx.lineWidth = 2 + player.recoil * 4;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 15, height / 2);
      ctx.lineTo(width / 2 + 15, height / 2);
      ctx.moveTo(width / 2, height / 2 - 15);
      ctx.lineTo(width / 2, height / 2 + 15);
      ctx.stroke();

      requestAnimationFrame(render);
    };

    const id = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    if (health <= 0) {
      setStatus("Você foi eliminado! Atualize a página para reiniciar.");
    }
  }, [health]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050816] via-[#02030f] to-black px-4 py-8 text-zinc-100">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <Card className="border border-zinc-800 bg-[#050816]/80">
          <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.5em] text-zinc-500">Simulador interno</p>
              <CardTitle className="text-3xl font-semibold">Krunker Lab – Postura Security</CardTitle>
              <p className="text-sm text-zinc-400">
                Clique no centro da arena para travar o mouse, use o mouse para mirar e Espaço para disparar.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center text-xs text-zinc-400">
              <div className="rounded-2xl border border-dashed border-zinc-700 px-4 py-2">
                <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">Score</p>
                <p className="text-xl font-semibold text-white">{score}</p>
              </div>
              <div className="rounded-2xl border border-dashed border-zinc-700 px-4 py-2">
                <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">Streak</p>
                <p className="text-xl font-semibold text-white">{streak}</p>
              </div>
              <div className="rounded-2xl border border-dashed border-zinc-700 px-4 py-2">
                <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">Energia</p>
                <p className="text-xl font-semibold text-white">{health}%</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="relative rounded-3xl border border-zinc-800 bg-[#03040f] p-3 shadow-[0_40px_80px_rgba(5,5,15,0.8)]">
          <canvas
            ref={canvasRef}
            onClick={handleClick}
            className="h-[520px] w-full rounded-2xl bg-black"
          />
          {!pointerLocked && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-2xl bg-black/60 text-center text-sm text-zinc-200">
              <div>
                <p className="text-base font-semibold">Clique na arena para travar o mouse</p>
                <p className="text-xs text-zinc-400">{status}</p>
              </div>
            </div>
          )}
        </div>

        <Card className="border border-zinc-800 bg-[#050816]/80">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Instruções rápidas</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm text-zinc-400 md:grid-cols-3">
            <div className="rounded-2xl border border-dashed border-zinc-700 px-4 py-3">
              <p className="font-semibold text-zinc-100">Pointer lock</p>
              <p>
                Clique dentro da arena para travar o mouse e ter mira contínua, como no Krunker original.
              </p>
            </div>
            <div className="rounded-2xl border border-dashed border-zinc-700 px-4 py-3">
              <p className="font-semibold text-zinc-100">Disparos</p>
              <p>
                Clique ou pressione Espaço/Enter para atirar. Mirar bem concede combos e pontuação extra.
              </p>
            </div>
            <div className="rounded-2xl border border-dashed border-zinc-700 px-4 py-3">
              <p className="font-semibold text-zinc-100">Objetivo</p>
              <p>
                Abata os drones neon antes que alcancem sua posição. Se a energia chegar a zero, reinicie a página.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
