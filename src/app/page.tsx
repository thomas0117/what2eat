"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import type { BracketSize } from "@/lib/types";
import { clearGameState } from "@/lib/storage";

const bracketOptions: BracketSize[] = [16, 32, 64];

export default function HomePage() {
  const router = useRouter();
  const [bracketSize, setBracketSize] = useState<BracketSize>(16);

  const handleStart = () => {
    clearGameState();
    router.push(`/game?bracketSize=${bracketSize}`);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <main className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 py-16 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-400">
          Food Tournament
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
          吃什麼 2選1
        </h1>
        <p className="mt-4 max-w-xl text-base text-zinc-300 sm:text-lg">
          選出你的今晚天菜，從 16、32、64 強一路淘汰到冠軍。
        </p>

        <div className="mt-10 w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900/60 p-8">
          <h2 className="text-base font-semibold text-zinc-200">賽制選擇</h2>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {bracketOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setBracketSize(option)}
                className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition-colors ${
                  bracketSize === option
                    ? "border-white bg-white text-zinc-950"
                    : "border-zinc-700 bg-zinc-900 text-zinc-200 hover:border-zinc-500"
                }`}
              >
                {option} 強
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={handleStart}
            className="mt-6 w-full rounded-2xl bg-emerald-400 px-5 py-3 text-base font-semibold text-zinc-950 transition hover:bg-emerald-300"
          >
            開始
          </button>
        </div>
      </main>
    </div>
  );
}
