"use client";

import { useState } from "react";
import { useDragonTowerStore } from "@/app/_store/dragonTowerStore";
import { useCommonStore } from "@/app/_store/commonStore";

export default function Sidebar() {
  const [mode, setMode] = useState<"Manual" | "Auto">("Manual");

  const {
    startGame,
    startAuto,
    stopAuto,
    autoPlay,
    isGameActive,
    betAmount,
    autoSettings,
    setBetAmount,
    setAutoSettings,
    difficulty,
    setDifficulty,
    cashOut,
    currentWinnings,
    selectedTiles,
  } = useDragonTowerStore();

  const { balance, setBalance } = useCommonStore();

  const handleStartGame = () => {
    if (betAmount > 0 && betAmount <= balance && !isGameActive) {
      setBalance(balance - betAmount);
      startGame();
    }
  };

  const handleCashOut = () => {
    if (isGameActive && selectedTiles.length > 0) {
      cashOut();
    }
  };

  const handleAutoPlay = () => {
    if (!autoPlay && betAmount > 0 && betAmount <= balance) {
      startAuto();
    } else {
      stopAuto();
    }
  };

  return (
    <div className="p-4 space-y-4 text-sm text-white bg-[#1e2a36] h-full">
      <div className="flex bg-[#0f1923] p-1 rounded-full">
        {["Manual", "Auto"].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m as "Manual" | "Auto")}
            className={`flex-1 py-2 rounded-full text-sm font-semibold transition ${
              mode === m
                ? "bg-[#1f2f3d] text-white"
                : "text-gray-400 hover:bg-[#1a2733]"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="space-y-1">
        <label className="text-gray-400">
          Bet Amount{" "}
          <span className="float-right text-xs">
            ${(betAmount).toFixed(2)}
          </span>
        </label>
        <div className="flex bg-[#0f1923] rounded-md overflow-hidden items-center">
          <input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(parseFloat(e.target.value))}
            className="flex-1 px-3 py-2 bg-transparent text-white outline-none"
          />
          <div className="px-2">
            <img
              src="/assets/dragonTower/bitcoin.svg"
              alt="btc"
              className="w-4 h-4"
            />
          </div>
          <button
            onClick={() => setBetAmount(betAmount / 2)}
            className="px-2 py-2 text-xs text-gray-300 hover:text-white"
          >
            ½
          </button>
          <button
            onClick={() => setBetAmount(betAmount * 2)}
            className="px-2 py-2 text-xs text-gray-300 hover:text-white"
          >
            2×
          </button>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-gray-400">Difficulty</label>
        <select
          value={difficulty}
          onChange={(e) =>
            setDifficulty(e.target.value as "easy" | "medium" | "hard")
          }
          className="w-full px-3 py-2 bg-[#0f1923] text-white rounded-md outline-none"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      {mode === "Manual" && (
        <button
          onClick={isGameActive && selectedTiles.length > 0 ? handleCashOut : handleStartGame}
          disabled={isGameActive && selectedTiles.length === 0}
          className={`w-full py-3 rounded-md text-black font-semibold mt-4
            ${isGameActive && selectedTiles.length > 0
              ? "bg-yellow-500 hover:bg-yellow-600"
              : isGameActive
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
            }`}
        >
          {isGameActive && selectedTiles.length > 0 ? `Cashout $${currentWinnings.toFixed(2)}` : "Bet"}
        </button>
      )}

      {mode === "Auto" && (
        <>
          <div className="space-y-1">
            <label className="text-gray-400">Number of Bets</label>
            <input
              type="number"
              value={999} 
              className="w-full px-3 py-2 bg-[#0f1923] text-white rounded-md outline-none"
              readOnly
            />
          </div>

          <div className="space-y-1">
            <label className="text-gray-400">
              Stop on Profit{" "}
              <span className="float-right text-xs">
                ${(autoSettings.stopProfit * 1000).toFixed(2)}
              </span>
            </label>
            <div className="flex bg-[#0f1923] rounded-md overflow-hidden items-center">
              <input
                type="number"
                value={autoSettings.stopProfit}
                onChange={(e) =>
                  setAutoSettings({ stopProfit: parseFloat(e.target.value) })
                }
                className="flex-1 px-3 py-2 bg-transparent text-white outline-none"
              />
              <div className="px-2">
                <img
                  src="/assets/dragonTower/bitcoin.svg"
                  alt="btc"
                  className="w-4 h-4"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-gray-400">
              Stop on Loss{" "}
              <span className="float-right text-xs">
                ${(autoSettings.stopLoss * 1000).toFixed(2)}
              </span>
            </label>
            <div className="flex bg-[#0f1923] rounded-md overflow-hidden items-center">
              <input
                type="number"
                value={autoSettings.stopLoss}
                onChange={(e) =>
                  setAutoSettings({ stopLoss: parseFloat(e.target.value) })
                }
                className="flex-1 px-3 py-2 bg-transparent text-white outline-none"
              />
              <div className="px-2">
                <img
                  src="/assets/dragonTower/bitcoin.svg"
                  alt="btc"
                  className="w-4 h-4"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleAutoPlay}
            className="w-full py-3 mt-4 bg-green-500 hover:bg-green-600 rounded-md text-black font-semibold"
          >
            {autoPlay ? "Stop Autobet" : "Start Autobet"}
          </button>
        </>
      )}
    </div>
  );
}