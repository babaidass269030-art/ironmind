import React, { useState, useEffect } from 'react';
import {
  Calculator,
  Disc,
  Scale,
  Flame,
  ArrowRightLeft,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';
import { UserProfile } from '../../types';
import {
  PlateCalculator,
  BMICalculator,
  CalorieEstimator,
  ActivityLevel,
  WarmupCalculator
} from '../../utils/calculators';
import { UnitConverter } from '../../utils/unitConverter';
import { SoundEffects } from '../../services/audioFeedback';
import { AdBanner } from '../ads/AdBanner';

interface ToolsScreenProps {
  profile: UserProfile;
}

export const ToolsScreen: React.FC<ToolsScreenProps> = ({ profile }) => {
  const [activeTool, setActiveTool] = useState<'plate' | 'bmi' | 'calorie' | 'converter' | 'timer'>('plate');

  // --- 1. PLATE CALCULATOR STATE ---
  const [barWeight, setBarWeight] = useState(profile.unitSystem === 'imperial' ? 45 : 20);
  const [targetWeight, setTargetWeight] = useState(profile.unitSystem === 'imperial' ? 225 : 100);
  const availablePlates =
    profile.unitSystem === 'imperial'
      ? [45, 35, 25, 10, 5, 2.5]
      : [25, 20, 15, 10, 5, 2.5, 1.25];

  const plateResult = PlateCalculator.calculatePlates(targetWeight, barWeight, availablePlates);

  // --- 2. BMI CALCULATOR STATE ---
  const [bmiHeight, setBmiHeight] = useState(profile.heightCm.toString());
  const [bmiWeight, setBmiWeight] = useState(profile.weightKg.toString());
  const bmiResult = BMICalculator.calculate(parseFloat(bmiHeight) || 0, parseFloat(bmiWeight) || 0);

  // --- 3. CALORIE & TDEE STATE ---
  const [calAge, setCalAge] = useState((profile.age || 26).toString());
  const [calGender, setCalGender] = useState<'male' | 'female'>('male');
  const [calHeight, setCalHeight] = useState(profile.heightCm.toString());
  const [calWeight, setCalWeight] = useState(profile.weightKg.toString());
  const [calActivity, setCalActivity] = useState<ActivityLevel>('moderately_active');
  const [calGoal, setCalGoal] = useState<'gain' | 'lose' | 'maintain'>('maintain');

  const calorieResult = CalorieEstimator.estimate(
    parseFloat(calWeight) || 75,
    parseFloat(calHeight) || 178,
    parseInt(calAge) || 26,
    calGender,
    calActivity,
    calGoal
  );

  // --- 4. CONVERTER STATE ---
  const [convKg, setConvKg] = useState('100');
  const [convLb, setConvLb] = useState(UnitConverter.kgToLb(100).toString());
  const [convCm, setConvCm] = useState('180');
  const [convFt, setConvFt] = useState('5');
  const [convIn, setConvIn] = useState('11');

  const handleKgChange = (val: string) => {
    setConvKg(val);
    const num = parseFloat(val);
    setConvLb(isNaN(num) ? '' : UnitConverter.kgToLb(num).toString());
  };

  const handleLbChange = (val: string) => {
    setConvLb(val);
    const num = parseFloat(val);
    setConvKg(isNaN(num) ? '' : UnitConverter.lbToKg(num).toString());
  };

  const handleCmChange = (val: string) => {
    setConvCm(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      const { feet, inches } = UnitConverter.cmToFeetAndInches(num);
      setConvFt(feet.toString());
      setConvIn(inches.toString());
    }
  };

  const handleFtInChange = (feetStr: string, inStr: string) => {
    setConvFt(feetStr);
    setConvIn(inStr);
    const f = parseInt(feetStr) || 0;
    const i = parseFloat(inStr) || 0;
    setConvCm(UnitConverter.feetAndInchesToCm(f, i).toString());
  };

  // --- 5. STOPWATCH STATE ---
  const [stopwatchSeconds, setStopwatchSeconds] = useState(0);
  const [stopwatchRunning, setStopwatchRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (stopwatchRunning) {
      interval = setInterval(() => {
        setStopwatchSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [stopwatchRunning]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 pb-28 pt-4 px-4 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-widest block">
            Gym Utilities
          </span>
          <h1 className="text-2xl font-extrabold font-display tracking-tight text-white mt-0.5">
            Gym Calculators
          </h1>
        </div>
      </div>

      {/* Tool Selector Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-4 no-scrollbar">
        {[
          { id: 'plate', label: 'Plate Calc', icon: Disc },
          { id: 'bmi', label: 'BMI', icon: Scale },
          { id: 'calorie', label: 'TDEE & Macros', icon: Flame },
          { id: 'converter', label: 'Unit Converter', icon: ArrowRightLeft },
          { id: 'timer', label: 'Stopwatch', icon: Timer }
        ].map((tool) => {
          const Icon = tool.icon;
          const isSelected = activeTool === tool.id;

          return (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id as typeof activeTool)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
                isSelected
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tool.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. PLATE CALCULATOR */}
      {activeTool === 'plate' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="rounded-3xl bg-[#11131a] border border-slate-800/80 p-5">
            <h3 className="text-sm font-bold text-white mb-3">Barbell Plate Loader</h3>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase block mb-1">
                  Target Weight ({profile.unitSystem === 'imperial' ? 'lb' : 'kg'})
                </label>
                <input
                  type="number"
                  step="2.5"
                  value={targetWeight}
                  onChange={(e) => setTargetWeight(parseFloat(e.target.value) || 0)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono font-bold text-base focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase block mb-1">
                  Bar Weight ({profile.unitSystem === 'imperial' ? 'lb' : 'kg'})
                </label>
                <select
                  value={barWeight}
                  onChange={(e) => setBarWeight(parseFloat(e.target.value))}
                  className="w-full h-11 px-3 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-sm focus:outline-none focus:border-amber-500"
                >
                  {profile.unitSystem === 'imperial' ? (
                    <>
                      <option value={45}>45 lb (Standard Olympic)</option>
                      <option value={35}>35 lb (Women's Bar)</option>
                      <option value={25}>25 lb (EZ-Curl)</option>
                    </>
                  ) : (
                    <>
                      <option value={20}>20 kg (Standard Olympic)</option>
                      <option value={15}>15 kg (Women's Bar)</option>
                      <option value={10}>10 kg (EZ-Curl)</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            {/* Quick target weight buttons */}
            <div className="flex items-center gap-1.5 mb-5 flex-wrap">
              {(profile.unitSystem === 'imperial'
                ? [135, 185, 225, 275, 315]
                : [60, 80, 100, 120, 140]
              ).map((w) => (
                <button
                  key={w}
                  onClick={() => setTargetWeight(w)}
                  className={`px-2.5 py-1 text-xs font-mono font-bold rounded-lg border transition ${
                    targetWeight === w
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {w} {profile.unitSystem === 'imperial' ? 'lb' : 'kg'}
                </button>
              ))}
            </div>

            {/* Loading per side summary */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 mb-4 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Load Each Side
              </span>
              <p className="text-3xl font-extrabold font-mono text-amber-400 mt-1">
                {plateResult.weightPerSide}{' '}
                <span className="text-base text-slate-400">
                  {profile.unitSystem === 'imperial' ? 'lb' : 'kg'}
                </span>
              </p>
              {!plateResult.exactMatch && (
                <span className="text-[11px] text-amber-300 mt-1 block">
                  Remainder: {plateResult.remainder} {profile.unitSystem === 'imperial' ? 'lb' : 'kg'} total
                </span>
              )}
            </div>

            {/* Plates breakdown list */}
            <div>
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-2">
                Plates Needed Per Side
              </span>
              <div className="space-y-1.5">
                {plateResult.platesPerSide.map((p, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono"
                  >
                    <span className="text-slate-200 font-bold">
                      {p.weight} {profile.unitSystem === 'imperial' ? 'lb' : 'kg'} plate
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold">
                      × {p.count}
                    </span>
                  </div>
                ))}

                {plateResult.platesPerSide.length === 0 && (
                  <p className="text-xs text-slate-500 italic py-2">
                    Target weight is equal to or less than the empty barbell.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. BMI CALCULATOR */}
      {activeTool === 'bmi' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="rounded-3xl bg-[#11131a] border border-slate-800/80 p-5">
            <h3 className="text-sm font-bold text-white mb-3">Body Mass Index Calculator</h3>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase block mb-1">
                  Height (cm)
                </label>
                <input
                  type="number"
                  value={bmiHeight}
                  onChange={(e) => setBmiHeight(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-base focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase block mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={bmiWeight}
                  onChange={(e) => setBmiWeight(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-base focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 text-center mb-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Calculated BMI
              </span>
              <p className="text-4xl font-black font-mono text-white mt-1">
                {bmiResult.bmi}
              </p>
              <span className={`text-xs font-bold mt-1 block ${bmiResult.categoryColor}`}>
                {bmiResult.category}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 leading-relaxed">
              <span className="font-semibold text-slate-200 block mb-1">Screening Disclaimer:</span>
              BMI is a general screening formula based on height and weight. It does not distinguish between lean skeletal muscle mass and adipose fat tissue. Strength athletes often place in overweight or obese categories while maintaining low body fat.
            </div>
          </div>
        </div>
      )}

      {/* 3. CALORIE & TDEE ESTIMATOR */}
      {activeTool === 'calorie' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="rounded-3xl bg-[#11131a] border border-slate-800/80 p-5">
            <h3 className="text-sm font-bold text-white mb-3">TDEE & Macro Target Estimator</h3>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase block mb-1">
                  Gender
                </label>
                <div className="grid grid-cols-2 gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setCalGender('male')}
                    className={`py-1.5 text-xs font-bold rounded-lg transition ${
                      calGender === 'male' ? 'bg-amber-500 text-black' : 'text-slate-400'
                    }`}
                  >
                    Male
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalGender('female')}
                    className={`py-1.5 text-xs font-bold rounded-lg transition ${
                      calGender === 'female' ? 'bg-amber-500 text-black' : 'text-slate-400'
                    }`}
                  >
                    Female
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase block mb-1">
                  Age
                </label>
                <input
                  type="number"
                  value={calAge}
                  onChange={(e) => setCalAge(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-sm"
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="text-[10px] font-semibold text-slate-400 uppercase block mb-1">
                Activity Level
              </label>
              <select
                value={calActivity}
                onChange={(e) => setCalActivity(e.target.value as ActivityLevel)}
                className="w-full h-10 px-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              >
                <option value="sedentary">Sedentary (Desk job, little exercise)</option>
                <option value="lightly_active">Lightly Active (1-3 days gym)</option>
                <option value="moderately_active">Moderately Active (3-5 days lifting)</option>
                <option value="very_active">Very Active (6-7 days hard training)</option>
                <option value="extra_active">Extra Active (Twice daily training)</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="text-[10px] font-semibold text-slate-400 uppercase block mb-1">
                Training Goal
              </label>
              <div className="grid grid-cols-3 gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800 text-center">
                <button
                  type="button"
                  onClick={() => setCalGoal('gain')}
                  className={`py-1.5 text-xs font-bold rounded-lg transition ${
                    calGoal === 'gain' ? 'bg-amber-500 text-black' : 'text-slate-400'
                  }`}
                >
                  Muscle Gain
                </button>
                <button
                  type="button"
                  onClick={() => setCalGoal('maintain')}
                  className={`py-1.5 text-xs font-bold rounded-lg transition ${
                    calGoal === 'maintain' ? 'bg-amber-500 text-black' : 'text-slate-400'
                  }`}
                >
                  Maintain
                </button>
                <button
                  type="button"
                  onClick={() => setCalGoal('lose')}
                  className={`py-1.5 text-xs font-bold rounded-lg transition ${
                    calGoal === 'lose' ? 'bg-amber-500 text-black' : 'text-slate-400'
                  }`}
                >
                  Fat Loss
                </button>
              </div>
            </div>

            {/* Results */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 mb-4">
              <div className="grid grid-cols-2 gap-3 text-center pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">BMR (Resting)</span>
                  <span className="text-lg font-bold font-mono text-white">
                    {calorieResult.bmr.toLocaleString()} kcal
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">TDEE (Maintenance)</span>
                  <span className="text-lg font-bold font-mono text-amber-400">
                    {calorieResult.tdee.toLocaleString()} kcal
                  </span>
                </div>
              </div>

              {/* Macros Breakdown */}
              <div className="grid grid-cols-3 gap-2 pt-3 text-center">
                <div className="p-2 rounded-xl bg-slate-800/80">
                  <span className="text-[10px] text-slate-400 block uppercase">Protein</span>
                  <span className="text-sm font-bold font-mono text-emerald-400">
                    {calorieResult.proteinGrams}g
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-slate-800/80">
                  <span className="text-[10px] text-slate-400 block uppercase">Carbs</span>
                  <span className="text-sm font-bold font-mono text-amber-400">
                    {calorieResult.carbsGrams}g
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-slate-800/80">
                  <span className="text-[10px] text-slate-400 block uppercase">Fats</span>
                  <span className="text-sm font-bold font-mono text-rose-400">
                    {calorieResult.fatGrams}g
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. UNIT CONVERTER */}
      {activeTool === 'converter' && (
        <div className="space-y-4 animate-in fade-in">
          {/* Weight Converter */}
          <div className="rounded-3xl bg-[#11131a] border border-slate-800/80 p-5">
            <h3 className="text-sm font-bold text-white mb-3">Weight Converter (KG ↔ LB)</h3>
            <div className="grid grid-cols-2 gap-3 items-center">
              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase block mb-1">
                  Kilograms (KG)
                </label>
                <input
                  type="number"
                  value={convKg}
                  onChange={(e) => handleKgChange(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-base focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase block mb-1">
                  Pounds (LB)
                </label>
                <input
                  type="number"
                  value={convLb}
                  onChange={(e) => handleLbChange(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-base focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Height Converter */}
          <div className="rounded-3xl bg-[#11131a] border border-slate-800/80 p-5">
            <h3 className="text-sm font-bold text-white mb-3">Height Converter (CM ↔ FT / IN)</h3>
            <div className="grid grid-cols-2 gap-3 items-center">
              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase block mb-1">
                  Centimeters (CM)
                </label>
                <input
                  type="number"
                  value={convCm}
                  onChange={(e) => handleCmChange(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-base focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase block mb-1">
                    Feet
                  </label>
                  <input
                    type="number"
                    value={convFt}
                    onChange={(e) => handleFtInChange(e.target.value, convIn)}
                    className="w-full h-11 px-2 text-center rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-base focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase block mb-1">
                    Inches
                  </label>
                  <input
                    type="number"
                    value={convIn}
                    onChange={(e) => handleFtInChange(convFt, e.target.value)}
                    className="w-full h-11 px-2 text-center rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-base focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. STOPWATCH & GENERAL WORKOUT TIMER */}
      {activeTool === 'timer' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="rounded-3xl bg-[#11131a] border border-slate-800/80 p-6 flex flex-col items-center text-center">
            <span className="text-[11px] font-extrabold text-amber-400 uppercase tracking-widest mb-4">
              General Workout Stopwatch
            </span>

            <div className="my-6">
              <span className="text-6xl font-black font-mono tracking-tight text-white">
                {formatTimer(stopwatchSeconds)}
              </span>
            </div>

            <div className="flex items-center gap-3 w-full max-w-xs mb-6">
              <button
                onClick={() => setStopwatchRunning(!stopwatchRunning)}
                className={`flex-1 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition active:scale-95 ${
                  stopwatchRunning
                    ? 'bg-rose-500 text-white shadow-rose-500/20 hover:bg-rose-400'
                    : 'bg-amber-500 text-black shadow-amber-500/20 hover:bg-amber-400'
                }`}
              >
                {stopwatchRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-black" />}
                <span>{stopwatchRunning ? 'Pause' : 'Start'}</span>
              </button>

              <button
                onClick={() => {
                  setStopwatchRunning(false);
                  setStopwatchSeconds(0);
                  setLaps([]);
                }}
                className="py-3.5 px-4 rounded-2xl bg-slate-800 border border-slate-700 text-slate-300 font-bold hover:bg-slate-700 active:scale-95 transition"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {stopwatchRunning && (
              <button
                onClick={() => setLaps((prev) => [stopwatchSeconds, ...prev])}
                className="text-xs font-semibold text-amber-400 hover:underline mb-4"
              >
                + Mark Lap Time
              </button>
            )}

            {laps.length > 0 && (
              <div className="w-full text-left space-y-1 pt-4 border-t border-slate-800">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-2">
                  Laps Recorded
                </span>
                {laps.map((lapSec, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-xs py-1 px-2.5 rounded-lg bg-slate-900/60 font-mono"
                  >
                    <span className="text-slate-400">Lap {laps.length - i}</span>
                    <span className="font-bold text-slate-200">{formatTimer(lapSec)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      
    )}
    </div>
  );
};
