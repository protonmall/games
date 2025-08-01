'use client';

import { useSnakeStore } from '@/app/_store/snakeStore';
import { useEffect, useState } from 'react';

export default function Sidebar() {
  const {
    handleRollOrStart,
    cashOut,
    status,
    totalMultiplier,
    difficulty,
    setDifficulty,
    rollDice,
    currentTile,

    isManualMode,
    toggleMode,
    betAmount,
    setBetAmount,
    numberOfBets,
    setNumberOfBets,
    stopOnProfit,
    setStopOnProfit,
    stopOnLoss,
    setStopOnLoss,
    autoPlay,
    startAutobet,
    stopAutobet,
    instantPlay,
    toggleInstantPlay,
  } = useSnakeStore();

  const [betAmountInput, setBetAmountInput] = useState(betAmount.toFixed(8));
  const [numberOfBetsInput, setNumberOfBetsInput] = useState(String(numberOfBets));
  const [stopOnProfitInput, setStopOnProfitInput] = useState(String(stopOnProfit));
  const [stopOnLossInput, setStopOnLossInput] = useState(String(stopOnLoss));

  useEffect(() => {
    setBetAmountInput(betAmount.toFixed(8));
  }, [betAmount]);

  useEffect(() => {
    setNumberOfBetsInput(String(numberOfBets));
  }, [numberOfBets]);

  useEffect(() => {
    setStopOnProfitInput(String(stopOnProfit));
  }, [stopOnProfit]);

  useEffect(() => {
    setStopOnLossInput(String(stopOnLoss));
  }, [stopOnLoss]);


  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoPlay && status === 'idle' && numberOfBets > 0) {
      interval = setTimeout(() => {
        rollDice();
        setNumberOfBets(numberOfBets - 1);
      }, instantPlay ? 100 : 1000);
    } else if (autoPlay && numberOfBets === 0) {
      stopAutobet();
    }
    return () => clearTimeout(interval);
  }, [autoPlay, status, instantPlay, rollDice, numberOfBets, setNumberOfBets, stopAutobet]);


  const rollButtonText = (status === 'lost' || status === 'won' || (status === 'idle' && totalMultiplier === 1 && currentTile === 0))
    ? 'Start'
    : 'Roll';

  const isRollButtonDisabled = status === 'rolling';

  const handleBetAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBetAmountInput(value);
    const parsed = parseFloat(value);
    if (!isNaN(parsed)) {
      setBetAmount(parsed);
    }
  };

  const handleHalfBet = () => {
    setBetAmount(betAmount / 2);
  };

  const handleDoubleBet = () => {
    setBetAmount(betAmount * 2);
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (value: number) => void, localSetter: (value: string) => void) => {
    const value = e.target.value;
    localSetter(value);
    const parsed = parseInt(value, 10);
    if (!isNaN(parsed)) {
      setter(parsed);
    }
  };

  const handleStopAmountChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (value: number) => void, localSetter: (value: string) => void) => {
    const value = e.target.value;
    localSetter(value);
    const parsed = parseFloat(value);
    if (!isNaN(parsed)) {
      setter(parsed);
    }
  };


  return (
    <div className="flex flex-col gap-4 text-white">

      <div className="flex bg-[#1a2b3c] rounded-md p-1 mb-4">
        <button
          onClick={() => toggleMode()}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-colors duration-200
            ${isManualMode ? 'bg-[#2f4553] text-white shadow-md' : 'text-gray-400 hover:bg-[#213743]'}
          `}
        >
          Manual
        </button>
        <button
          onClick={() => toggleMode()}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-colors duration-200
            ${!isManualMode ? 'bg-[#2f4553] text-white shadow-md' : 'text-gray-400 hover:bg-[#213743]'}
          `}
        >
          Auto
        </button>
      </div>

      <div className="flex flex-col gap-2 mb-4">
        <div className="flex justify-between items-center text-sm text-gray-400">
          <span>Bet Amount</span>
          <span>${betAmount.toFixed(2)}</span>
        </div>
        <div className="flex items-center bg-[#1a2b3c] rounded-md overflow-hidden">
          <input
            type="number"
            step="0.00000001"
            value={betAmountInput}
            onChange={handleBetAmountChange}
            className="flex-1 p-2 bg-transparent outline-none text-white text-sm"
          />
          <span className="px-2 text-yellow-500">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 inline-block align-middle">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.728 15.617c-.38.76-1.14.95-1.71.57l-1.63-1.02c-.57-.38-.95-.76-.95-1.33v-3.04c0-.57.38-1.14.95-1.52l1.63-1.02c.57-.38 1.33-.19 1.71.57.38.76.19 1.52-.38 1.9l-1.24.76v.19c.19.19.38.38.38.76v.19c.19.19.38.38.38.76v.19c.19.19.38.38.38.76v.19c.19.19.38.38.38.76zm-5.728 2.095c-.38.76-1.14.95-1.71.57l-1.63-1.02c-.57-.38-.95-.76-.95-1.33v-3.04c0-.57.38-1.14.95-1.52l1.63-1.02c.57-.38 1.33-.19 1.71.57.38.76.19 1.52-.38 1.9l-1.24.76v.19c.19.19.38.38.38.76v.19c.19.19.38.38.38.76v.19c.19.19.38.38.38.76v.19c.19.19.38.38.38.76z"/>
            </svg>
          </span>
          <button onClick={handleHalfBet} className="px-3 py-2 bg-[#2f4553] hover:bg-[#3a5a6b] text-sm border-l border-[#213743]">1/2</button>
          <button onClick={handleDoubleBet} className="px-3 py-2 bg-[#2f4553] hover:bg-[#3a5a6b] text-sm border-l border-[#213743]">2x</button>
        </div>
      </div>

      <div className="flex flex-col gap-2 mb-4">
        <label className="text-sm text-gray-400">Difficulty</label>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as any)}
          className="w-full bg-[#1a2b3c] p-2 rounded-md outline-none border border-[#213743] text-white"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      {isManualMode ? (
        <>
          <button
            onClick={handleRollOrStart}
            disabled={isRollButtonDisabled}
            className="
              bg-green-600 hover:bg-green-700 rounded p-3 text-white font-bold text-lg
              active:translate-y-[4px] active:shadow-none transition-all duration-150 ease-in-out
            "
            style={{ boxShadow: isRollButtonDisabled ? 'none' : '0 4px 0 rgba(0, 0, 0, 0.4)' }}
          >
            {rollButtonText}
          </button>
        </>
      ) : (
        <>
          <div className="flex flex-col gap-1 mb-2">
            <div className="flex justify-between items-center text-xs text-gray-400">
              <span>Number of Bets</span>
              <span>{numberOfBets}</span>
            </div>
            <input
              type="number"
              value={numberOfBetsInput}
              onChange={(e) => handleNumberInputChange(e, setNumberOfBets, setNumberOfBetsInput)}
              className="w-full bg-[#1a2b3c] py-1 px-2 rounded-md outline-none border border-[#213743] text-white text-sm"
            />
          </div>

          <div className="flex flex-col gap-1 mb-2">
            <div className="flex justify-between items-center text-xs text-gray-400">
              <span>Stop on Profit</span>
              <span>${stopOnProfit.toFixed(2)}</span>
            </div>
            <input
              type="number"
              step="0.01"
              value={stopOnProfitInput}
              onChange={(e) => handleStopAmountChange(e, setStopOnProfit, setStopOnProfitInput)}
              className="w-full bg-[#1a2b3c] py-1 px-2 rounded-md outline-none border border-[#213743] text-white text-sm"
            />
          </div>

          <div className="flex flex-col gap-1 mb-2">
            <div className="flex justify-between items-center text-xs text-gray-400">
              <span>Stop on Loss</span>
              <span>${stopOnLoss.toFixed(2)}</span>
            </div>
            <input
              type="number"
              step="0.01"
              value={stopOnLossInput}
              onChange={(e) => handleStopAmountChange(e, setStopOnLoss, setStopOnLossInput)}
              className="w-full bg-[#1a2b3c] py-1 px-2 rounded-md outline-none border border-[#213743] text-white text-sm"
            />
          </div>

          <button
            onClick={autoPlay ? stopAutobet : startAutobet}
            className={`
              ${autoPlay ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
              rounded p-3 text-white font-bold text-lg
              active:translate-y-[4px] active:shadow-none transition-all duration-150 ease-in-out
            `}
            style={{ boxShadow: '0 4px 0 rgba(0, 0, 0, 0.4)' }}
          >
            {autoPlay ? 'Stop Autobet' : 'Start Autobet'}
          </button>
        </>
      )}

      <button
        onClick={cashOut}
        className="bg-green-600 hover:bg-green-700 rounded p-2 text-sm
                   active:translate-y-[4px] active:shadow-none transition-all duration-150 ease-in-out"
        style={{ boxShadow: '0 4px 0 rgba(0, 0, 0, 0.4)' }}
        disabled={status !== 'idle' || totalMultiplier === 1 || autoPlay}
      >
        Cash Out
      </button>

     
    </div>
  );
}