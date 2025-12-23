export type BracketSize = 16 | 32 | 64;

export type Option = {
  id: string;
  title: string;
  image: string;
};

export type GameState = {
  seed: number;
  bracketSize: BracketSize;
  total: number;
  queueIds: string[];
  winnersIds: string[];
  currentPairIndex: number;
  round: number;
  championId?: string;
};
