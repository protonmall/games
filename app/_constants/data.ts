export interface GameResult {
  gameName: string | React.ReactNode; // Updated to allow ReactNode
  result: string;
  amount: number;
  finalBalance: number | React.ReactNode; // Updated to allow ReactNode
}

export const gameHistory: GameResult[] = [];

export const addGameResult = (
  gameName: React.ReactNode | string,
  result: string,
  amount: number,
  finalBalance: React.ReactNode | number
): GameResult => {
  if (typeof amount !== "number" || isNaN(amount)) {
    throw new Error("Amount isn't a valid number");
  }

  if (gameHistory.length >= 5) {
    gameHistory.shift();
  }

  const newResult: GameResult = {
    gameName,
    result,
    amount: Number(amount.toFixed(2)),
    finalBalance,
  };

  gameHistory.push(newResult);
  return newResult;
};


export const GRID_NUMBERS = Array.from({ length: 40 }, (_, i) => i + 1);
export const MATCH_LABELS = Array.from({ length: 10 }, (_, i) => `x${i + 1}`);
