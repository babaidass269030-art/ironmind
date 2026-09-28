import React, { useState } from 'react';
import { Dumbbell, ShieldCheck, ArrowRight, Target, Flame } from 'lucide-react';
import { FitnessGoal, UserProfile } from '../../types';
import { StorageService } from '../../services/storage';

interface OnboardingScreenProps {
  onComplete: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState('');
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');
  const [goal, setGoal] = useState<FitnessGoal>('build_muscle');
  const [weight, setWeight] = useState('75');
  const [height, setHeight] = useState('178');
  const [weeklyTarget, setWeeklyTarget] = useState(4);

  const goals: { id: FitnessGoal; label: string; desc: string; icon: string }[] = [
    { id: 'build_muscle', label: 'Build Muscle', desc: 'Hypertrophy & progressive overload', icon: '💪' },
    { id: 'get_stronger', label: 'Gain Raw Strength', desc: 'Heavier compound 1RM lifts', icon: '⚡' },
    { id: 'lose_fat', label: 'Lose Fat & Tone', desc: 'High density conditioning & deficit', icon: '🔥' },
    { id: 'improve_fitness', label: 'Athletic Conditioning', desc: 'Overall stamina & work capacity', icon: '🏃' },
    { id: 'maintain', label: 'Maintain & Refine', desc: 'Sustain current physique & habits', icon: '⚖️' },
    { id: 'general_health', label: 'General Vitality', desc: 'Joint health, posture & longevity', icon: '🛡️' }
  ];

  const handleFinish = () => {
    const numWeight = parseFloat(weight) || 75;
    const numHeight = parseFloat(height) || 178;

    // Convert to metric internally if user entered imperial
    const weightKg = unitSystem === 'imperial' ? Math.round(numWeight / 2.20462) : numWeight;
    const heightCm = unitSystem === 'imperial' ? Math.round(numHeight * 2.54) : numHeight;

    const profile: UserProfile = {
      id: 'user_main',
      name: name.trim() || 'Athlete',
      age: 26,
      heightCm,
      weightKg,
      unitSystem,
      goal,
      weeklyWorkoutTarget: weeklyTarget,
      defaultRestSeconds: 90,
      soundEnabled: true,
      vibrationEnabled: true,
      theme: 'dark',
      hasCompletedOnboarding: true,
      createdAt: new Date().toISOString()
    };

    StorageService.saveProfile(profile);

    // Save initial weight log to body measurements
    StorageService.saveBodyMeasurement({
      id: `measurement_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      weightKg,
      notes: 'Initial profile weight'
    });

    onComplete();
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col justify-between p-6 max-w-md mx-auto">
      {step === 1 ? (
        <div className="flex-1 flex flex-col justify-between pt-6 pb-4">
          <div>
            {/* Athletic Brand Logo */}
            <div className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Dumbbell className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-extrabold font-display tracking-tight text-white block">
                  IRONMIND
                </span>
                <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase block">
                  Personal Fitness Companion
                </span>
              </div>
            </div>

            <h1 className="text-3xl font-extrabold font-display tracking-tight text-white leading-tight mb-3">
              Forged in discipline.<br />
              <span className="text-amber-400">Built for progress.</span>
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              Track sets, crush personal records, master recovery intervals, and watch your strength curve climb session after session.
            </p>

            {/* Privacy Guarantee Card */}
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 mb-6">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-200">100% Local & Private</h4>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    Your workout logs, PRs, and body data stay exclusively on this device. No account creation, no trackers, no subscription walls.
                  </p>
                </div>
              </div>
            </div>

            {/* Basic setup */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Your Name or Nickname (Optional)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex"
                  className="w-full h-12 px-4 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 transition"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Preferred Units
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setUnitSystem('metric')}
                    className={`py-2 text-xs font-bold rounded-lg transition ${
                      unitSystem === 'metric'
                        ? 'bg-amber-500 text-black shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Metric (kg / cm)
                  </button>
                  <button
                    type="button"
                    onClick={() => setUnitSystem('imperial')}
                    className={`py-2 text-xs font-bold rounded-lg transition ${
                      unitSystem === 'imperial'
                        ? 'bg-amber-500 text-black shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Imperial (lb / in)
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setStep(2)}
            className="w-full mt-8 h-13 rounded-2xl bg-amber-500 text-black font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:bg-amber-400 active:scale-98 transition"
          >
            <span>Continue Setup</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-between pt-4 pb-4">
          <div>
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setStep(1)}
                className="text-xs text-slate-400 hover:text-white font-medium"
              >
                ← Back
              </button>
              <span className="text-xs font-semibold text-amber-400">Step 2 of 2</span>
            </div>

            <h2 className="text-2xl font-bold font-display text-white mb-1">
              Select Primary Goal
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              We personalize your dashboard and progression targets based on your focus.
            </p>

            {/* Goal list */}
            <div className="grid grid-cols-2 gap-2 mb-6">
              {goals.map((g) => {
                const isSelected = goal === g.id;
                return (
                  <button
                    key={g.id}
                    onClick={() => setGoal(g.id)}
                    className={`p-3 rounded-xl border text-left transition relative flex flex-col justify-between min-h-[90px] ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500/50 text-white shadow-sm shadow-amber-500/10'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-xl mb-1">{g.icon}</span>
                    <div>
                      <h4 className="text-xs font-bold">{g.label}</h4>
                      <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{g.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Physical baseline */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-1">
                  Current Weight ({unitSystem === 'metric' ? 'kg' : 'lb'})
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-sm focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-1">
                  Height ({unitSystem === 'metric' ? 'cm' : 'in'})
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-sm focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Weekly Target */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                  Weekly Training Target
                </label>
                <span className="text-xs font-bold font-mono text-amber-400">
                  {weeklyTarget} days / week
                </span>
              </div>
              <div className="grid grid-cols-5 gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800">
                {[2, 3, 4, 5, 6].map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setWeeklyTarget(days)}
                    className={`py-2 text-xs font-bold font-mono rounded-lg transition ${
                      weeklyTarget === days
                        ? 'bg-amber-500 text-black'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {days}d
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleFinish}
            className="w-full mt-6 h-13 rounded-2xl bg-amber-500 text-black font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:bg-amber-400 active:scale-98 transition"
          >
            <span>Start Training with IRONMIND</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
