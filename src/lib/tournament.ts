import type { BracketSize, GameState, Option } from "./types";

const mulberry32 = (seed: number) => {
  let t = seed;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), t | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
};

export const shuffleWithSeed = <T,>(items: T[], seed: number): T[] => {
  const array = [...items];
  const random = mulberry32(seed);
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const createInitialState = (
  options: Option[],
  bracketSize: BracketSize,
  seed: number,
): GameState => {
  const shuffled = shuffleWithSeed(options, seed);
  const picked = shuffled.slice(0, bracketSize);
  return {
    seed,
    bracketSize,
    total: bracketSize,
    queueIds: picked.map((option) => option.id),
    winnersIds: [],
    currentPairIndex: 0,
    round: 1,
  };
};

export const advanceGameState = (
  state: GameState,
  winnerId: string,
): { state: GameState; championId?: string } => {
  const queueIds = [...state.queueIds];
  const winnersIds = [...state.winnersIds, winnerId];
  queueIds.splice(0, 2);

  const updatedState: GameState = {
    ...state,
    queueIds,
    winnersIds,
    currentPairIndex: state.currentPairIndex + 1,
  };

  if (queueIds.length === 0) {
    if (winnersIds.length === 1) {
      return {
        state: { ...updatedState, championId: winnersIds[0] },
        championId: winnersIds[0],
      };
    }
    return {
      state: {
        ...state,
        queueIds: winnersIds,
        winnersIds: [],
        currentPairIndex: 0,
        round: state.round + 1,
      },
    };
  }

  return { state: updatedState };
};
