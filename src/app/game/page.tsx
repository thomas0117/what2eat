import { Suspense } from "react";

import GameClient from "./GameClient";

export default function GamePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
          <p className="text-sm text-zinc-300">準備對戰中...</p>
        </div>
      }
    >
      <GameClient />
    </Suspense>
  );
}
