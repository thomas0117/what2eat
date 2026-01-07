"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { eatOptions } from "@/lib/options.eat";
import { clearGameState, loadGameState } from "@/lib/storage";
import type { Option } from "@/lib/types";

export default function ResultPage() {
  const router = useRouter();
  const [champion, setChampion] = useState<Option | null>(null);

  const optionMap = useMemo(() => {
    return new Map(eatOptions.map((option) => [option.id, option]));
  }, []);

  useEffect(() => {
    const saved = loadGameState();
    const championId = saved?.championId;
    if (!championId) {
      router.replace("/");
      return;
    }
    setChampion(optionMap.get(championId) ?? null);
  }, [optionMap, router]);

  const handleRestart = () => {
    clearGameState();
    router.push("/");
  };

  if (!champion) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        <p className="text-sm text-zinc-300">準備結果中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-400">
          冠軍出爐
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          今晚就吃這個！
        </h1>
        <div className="mt-10 w-full overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900">
          <div className="relative h-80 w-full sm:h-96">
            <Image
              src={champion.image}
              alt={champion.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 600px"
              priority
            />
          </div>
          <div className="p-6">
            <h2 className="text-2xl font-semibold">{champion.title}</h2>
          </div>
        </div>
        <button
          type="button"
          onClick={handleRestart}
          className="mt-8 rounded-2xl bg-emerald-400 px-6 py-3 text-base font-semibold text-zinc-950 transition hover:bg-emerald-300"
        >
          再玩一次
        </button>
      </main>
    </div>
  );
}
