"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { eatOptions } from "@/lib/options.eat";
import { loadGameState, saveGameState } from "@/lib/storage";
import { advanceGameState, createInitialState } from "@/lib/tournament";
import type { BracketSize, GameState } from "@/lib/types";

const isBracketSize = (value: number): value is BracketSize =>
  value === 16 || value === 32 || value === 64;

const getRoundLabel = (roundSize: number) => {
  if (roundSize === 2) return "決賽";
  if (roundSize === 4) return "4強";
  if (roundSize === 8) return "8強";
  if (roundSize === 16) return "16強";
  if (roundSize === 32) return "32強";
  if (roundSize === 64) return "64強";
  return `${roundSize}強`;
};

export default function GamePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const optionMap = useMemo(() => {
    return new Map(eatOptions.map((option) => [option.id, option]));
  }, []);

  useEffect(() => {
    const saved = loadGameState();
    if (saved) {
      setGameState(saved);
      setIsLoading(false);
      return;
    }

    const bracketValue = Number(searchParams.get("bracketSize"));
    if (!isBracketSize(bracketValue)) {
      router.replace("/");
      return;
    }

    const seed = Math.floor(Math.random() * 1_000_000_000);
    const initialState = createInitialState(eatOptions, bracketValue, seed);
    saveGameState(initialState);
    setGameState(initialState);
    setIsLoading(false);
  }, [router, searchParams]);

  useEffect(() => {
    if (gameState) {
      saveGameState(gameState);
    }
  }, [gameState]);

  if (isLoading || !gameState) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        <p className="text-sm text-zinc-300">準備對戰中...</p>
      </div>
    );
  }

  const leftId = gameState.queueIds[0];
  const rightId = gameState.queueIds[1];
  const leftOption = leftId ? optionMap.get(leftId) : undefined;
  const rightOption = rightId ? optionMap.get(rightId) : undefined;

  if (!leftOption || !rightOption) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        <p className="text-sm text-zinc-300">載入對戰資料中...</p>
      </div>
    );
  }

  const totalRemaining = gameState.queueIds.length + gameState.winnersIds.length;
  const roundSize = gameState.queueIds.length + gameState.currentPairIndex * 2;
  const matchTotal = Math.max(roundSize / 2, 1);
  const matchIndex = Math.min(gameState.currentPairIndex + 1, matchTotal);

  const handlePick = (winnerId: string) => {
    const { state, championId } = advanceGameState(gameState, winnerId);
    saveGameState(state);
    setGameState(state);
    if (championId) {
      router.push("/result");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-6">
          <div>
            <p className="text-sm font-semibold text-zinc-400">{getRoundLabel(roundSize)}</p>
            <h1 className="mt-2 text-2xl font-semibold">吃什麼 2選1</h1>
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-zinc-300">
            <div>
              <p className="text-xs text-zinc-500">本輪進度</p>
              <p className="mt-1 font-semibold">第 {matchIndex} 場 / {matchTotal} 場</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500">總體剩餘</p>
              <p className="mt-1 font-semibold">({totalRemaining}/{gameState.total})</p>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {[leftOption, rightOption].map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => handlePick(option.id)}
              className="group relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 text-left transition hover:border-emerald-400"
            >
              <div className="relative h-72 w-full sm:h-80 lg:h-[28rem]">
                <Image
                  src={option.image}
                  alt={option.title}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
              <div className="p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Pick</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">{option.title}</h2>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
