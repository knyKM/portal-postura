import { NotFoundTetris } from "@/components/errors/not-found-tetris";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#01010a] via-[#040519] to-[#06030d] px-4 py-10 text-white">
      <NotFoundTetris />
    </div>
  );
}
