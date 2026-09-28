import React, { useState } from 'react';
import {
  TrendingUp,
  Award,
  Trophy,
  Scale,
  Calendar,
  Plus,
  Flame,
  Lightbulb,
  ChevronRight,
  Trash2,
  Dumbbell,
  Clock,
  Sparkles
} from 'lucide-react';
import {
  UserProfile,
  WorkoutSession,
  PersonalRecord,
  BodyMeasurementLog,
  Achievement,
  Exercise
} from '../../types';
import { SimpleLineChart, SimpleBarChart, ChartDataPoint } from '../common/SimpleChart';
import { UnitConverter } from '../../utils/unitConverter';
import { BMICalculator } from '../../utils/calculators';
import { StorageService } from '../../services/storage';

interface ProgressScreenProps {
  profile: UserProfile;
  sessions: WorkoutSession[];
  prs: PersonalRecord[];
  measurements: BodyMeasurementLog[];
  achievements: Achievement[];
  allExercises: Exercise[];
  onRefreshData: () => void;
}

export const ProgressScreen: React.FC<ProgressScreenProps> = ({
  profile,
  sessions,
  prs,
  measurements,
  achievements,
  allExercises,
  onRefreshData
}) => {
  const [activeTab, setActiveTab] = useState<'strength' | 'body' | 'insights' | 'achievements'>('strength');
  const [selectedPRExerciseId, setSelectedPRExerciseId] = useState<string>('bench-press');
  const [showLogMeasurementModal, setShowLogMeasurementModal] = useState(false);

  // New Measurement form state
  const [logWeight, setLogWeight] = useState(
    profile.unitSystem === 'imperial'
      ? UnitConverter.kgToLb(profile.weightKg).toString()
      : profile.weightKg.toString()
  );
  const [logWaist, setLogWaist] = useState('');
  const [logChest, setLogChest] = useState('');
  const [logArms, setLogArms] = useState('');
  const [logBodyFat, setLogBodyFat] = useState('');

  const completedSessions = sessions.filter((s) => s.isCompleted);

  // Prepare Weight Trend Data for Chart
  const weightChartData: ChartDataPoint[] = [...measurements]
    .reverse()
    .map((m) => {
      const val = profile.unitSystem === 'imperial' ? UnitConverter.kgToLb(m.weightKg) : m.weightKg;
      const d = new Date(m.date);
      const label = `${d.getMonth() + 1}/${d.getDate()}`;
      return { label, value: val, dateStr: m.date };
    });

  // Prepare 1RM Trend Data for selected exercise
  // Find sessions that have this exercise and get highest 1RM per session
  const prChartData: ChartDataPoint[] = completedSessions
    .filter((s) => s.exercises.some((e) => e.exerciseId === selectedPRExerciseId))
    .map((s) => {
      const ex = s.exercises.find((e) => e.exerciseId === selectedPRExerciseId);
      let max1RM = 0;
      ex?.sets.forEach((set) => {
        if (set.isCompleted && set.completedWeight > 0) {
          const est =
            set.completedReps > 1
              ? set.completedWeight * (1 + set.completedReps / 30)
              : set.completedWeight;
          if (est > max1RM) max1RM = est;
        }
      });
      const d = new Date(s.completedAt || s.startedAt);
      const label = `${d.getMonth() + 1}/${d.getDate()}`;
      const finalVal =
        profile.unitSystem === 'imperial'
          ? UnitConverter.kgToLb(max1RM)
          : Math.round(max1RM * 10) / 10;
      return { label, value: finalVal };
    })
    .filter((p) => p.value > 0);

  // Weekly consistency data (last 7 weeks or past 7 days)
  const last7DaysData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
    // Count sessions
    const count = completedSessions.filter((s) => {
      const d = new Date(s.completedAt || s.startedAt);
      return (d.getDay() + 6) % 7 === idx;
    }).length;

    return { label: day, count };
  });

  // BMI Result
  const bmiResult = BMICalculator.calculate(profile.heightCm, profile.weightKg);

  // SMART INSIGHTS ENGINE (Requirement #32: purely local, no fake stats)
  const generateInsights = (): string[] => {
    const insights: string[] = [];

    if (completedSessions.length === 0) {
      insights.push('Log your first workout to unlock training volume and progression insights.');
      return insights;
    }

    // 1. Total Workouts
    insights.push(`You have logged ${completedSessions.length} total workout sessions.`);

    // 2. Average Duration
    const totalSec = completedSessions.reduce((acc, s) => acc + s.durationSeconds, 0);
    const avgMin = Math.round(totalSec / completedSessions.length / 60);
    if (avgMin > 0) {
      insights.push(`Your average training session duration is ${avgMin} minutes.`);
    }

    // 3. Strongest Training Day (most active)
    const dayCounts = [0, 0, 0, 0, 0, 0, 0];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    completedSessions.forEach((s) => {
      const d = new Date(s.completedAt || s.startedAt);
      dayCounts[d.getDay()]++;
    });
    const maxDayCount = Math.max(...dayCounts);
    if (maxDayCount > 0) {
      const strongestDayIndex = dayCounts.indexOf(maxDayCount);
      insights.push(
        `Your most consistent training day is ${dayNames[strongestDayIndex]} (${maxDayCount} workouts).`
      );
    }

    // 4. Bench Press / Squat PR insights
    const benchPR = prs.find((p) => p.exerciseId === 'bench-press');
    if (benchPR) {
      insights.push(
        `Bench Press estimated 1RM record stands at ${UnitConverter.formatWeight(
          benchPR.estimatedOneRepMaxKg,
          profile.unitSystem
        )}.`
      );
    }

    // 5. Muscle recency check (e.g. Legs or Chest)
    const lastLegWorkout = completedSessions.find((s) =>
      s.exercises.some((e) => {
        const ex = allExercises.find((x) => x.id === e.exerciseId);
        return ex?.category === 'legs';
      })
    );
    if (lastLegWorkout) {
      const diffDays = Math.floor(
        (Date.now() - new Date(lastLegWorkout.completedAt || lastLegWorkout.startedAt).getTime()) /
          (1000 * 60 * 60 * 24)
      );
      if (diffDays >= 7) {
        insights.push(`You have not trained legs for ${diffDays} days. Consider scheduling a lower body session.`);
      } else {
        insights.push(`Leg training is on track (last trained ${diffDays === 0 ? 'today' : `${diffDays}d ago`}).`);
      }
    }

    return insights;
  };

  const handleSaveMeasurement = () => {
    const parsedWeight = parseFloat(logWeight);
    if (!parsedWeight || parsedWeight <= 0) return;

    const weightKg =
      profile.unitSystem === 'imperial' ? UnitConverter.lbToKg(parsedWeight) : parsedWeight;

    const newLog: BodyMeasurementLog = {
      id: `measurement_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      weightKg,
      waistCm: logWaist ? parseFloat(logWaist) : null,
      chestCm: logChest ? parseFloat(logChest) : null,
      armsCm: logArms ? parseFloat(logArms) : null,
      bodyFatPercentage: logBodyFat ? parseFloat(logBodyFat) : null
    };

    StorageService.saveBodyMeasurement(newLog);
    setShowLogMeasurementModal(false);
    onRefreshData();
  };

  const handleDeleteMeasurement = (id: string) => {
    StorageService.deleteBodyMeasurement(id);
    onRefreshData();
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 pb-28 pt-4 px-4 max-w-md mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-widest block">
            Analytics & Metrics
          </span>
          <h1 className="text-2xl font-extrabold font-display tracking-tight text-white mt-0.5">
            Progress Tracking
          </h1>
        </div>
      </div>

      {/* Subtabs Segmented Bar */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-slate-900/90 rounded-2xl border border-slate-800 mb-5 text-center">
        <button
          onClick={() => setActiveTab('strength')}
          className={`py-2 text-xs font-bold rounded-xl transition ${
            activeTab === 'strength'
              ? 'bg-amber-500 text-black shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Strength
        </button>
        <button
          onClick={() => setActiveTab('body')}
          className={`py-2 text-xs font-bold rounded-xl transition ${
            activeTab === 'body'
              ? 'bg-amber-500 text-black shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Body
        </button>
        <button
          onClick={() => setActiveTab('insights')}
          className={`py-2 text-xs font-bold rounded-xl transition ${
            activeTab === 'insights'
              ? 'bg-amber-500 text-black shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Insights
        </button>
        <button
          onClick={() => setActiveTab('achievements')}
          className={`py-2 text-xs font-bold rounded-xl transition ${
            activeTab === 'achievements'
              ? 'bg-amber-500 text-black shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Badges
        </button>
      </div>

      {/* TAB 1: STRENGTH PROGRESS & PRs */}
      {activeTab === 'strength' && (
        <div className="space-y-4">
          {/* PR Selector & Curve */}
          <div className="rounded-3xl bg-[#11131a] border border-slate-800/80 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Trophy className="w-4 h-4" />
                Estimated 1RM Strength Curve
              </span>
            </div>

            {/* Exercise Selector */}
            <select
              value={selectedPRExerciseId}
              onChange={(e) => setSelectedPRExerciseId(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-white mb-4 focus:outline-none focus:border-amber-500"
            >
              <option value="bench-press">Barbell Bench Press</option>
              <option value="barbell-squat">Barbell Back Squat</option>
              <option value="deadlift">Barbell Conventional Deadlift</option>
              <option value="overhead-press">Overhead Barbell Press</option>
              <option value="barbell-row">Bent Over Barbell Row</option>
              {allExercises
                .filter(
                  (ex) =>
                    !['bench-press', 'barbell-squat', 'deadlift', 'overhead-press', 'barbell-row'].includes(
                      ex.id
                    )
                )
                .map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.name}
                  </option>
                ))}
            </select>

            <SimpleLineChart
              data={prChartData}
              unit={profile.unitSystem === 'imperial' ? 'lb 1RM' : 'kg 1RM'}
              lineColor="#f59e0b"
              height={170}
              emptyMessage="Complete sets for this exercise to generate strength curve"
            />
          </div>

          {/* ALL PERSONAL RECORDS CARDS */}
          <div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
              Personal Records ({prs.length})
            </h3>

            <div className="grid grid-cols-2 gap-2.5">
              {prs.map((pr) => (
                <div
                  key={pr.id}
                  onClick={() => setSelectedPRExerciseId(pr.exerciseId)}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer ${
                    selectedPRExerciseId === pr.exerciseId
                      ? 'bg-amber-500/10 border-amber-500/50 shadow-sm'
                      : 'bg-[#11131a] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider line-clamp-1">
                    {pr.exerciseName}
                  </span>
                  <p className="text-lg font-bold font-mono text-white mt-0.5">
                    {UnitConverter.formatWeight(pr.maxWeightKg, profile.unitSystem)}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1 font-mono">
                    <span>
                      Est. 1RM: {UnitConverter.formatWeight(pr.estimatedOneRepMaxKg, profile.unitSystem)}
                    </span>
                  </div>
                </div>
              ))}

              {prs.length === 0 && (
                <div className="col-span-2 py-8 text-center rounded-2xl bg-slate-900/30 border border-slate-800 p-4">
                  <Trophy className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">
                    No personal records logged yet. Finish sets in any workout session to establish your PRs!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BODY COMPOSITION & MEASUREMENTS */}
      {activeTab === 'body' && (
        <div className="space-y-4">
          {/* Weight Trend Chart */}
          <div className="rounded-3xl bg-[#11131a] border border-slate-800/80 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Scale className="w-4 h-4" />
                Body Weight History
              </span>
              <button
                onClick={() => setShowLogMeasurementModal(true)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold hover:bg-amber-500/25"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log Entry</span>
              </button>
            </div>

            <SimpleLineChart
              data={weightChartData}
              unit={profile.unitSystem === 'imperial' ? 'lb' : 'kg'}
              lineColor="#10b981"
              height={170}
              emptyMessage="No weight history recorded yet"
            />
          </div>

          {/* BMI & Screening Card */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-200">Body Mass Index (BMI)</span>
              <span className={`text-xs font-bold ${bmiResult.categoryColor}`}>
                {bmiResult.category}
              </span>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-extrabold font-mono text-white">
                {bmiResult.bmi}
              </span>
              <span className="text-xs text-slate-400">
                Healthy range: {bmiResult.healthyRangeText}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 leading-tight">
              BMI is a general screening indicator. Muscle mass can elevate BMI scores for strength athletes.
            </p>
          </div>

          {/* Measurements History List */}
          <div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
              Logged Entries ({measurements.length})
            </h3>
            <div className="space-y-2">
              {measurements.map((m) => (
                <div
                  key={m.id}
                  className="rounded-2xl bg-[#11131a] border border-slate-800 p-3.5 flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-bold font-mono text-white">
                      {UnitConverter.formatWeight(m.weightKg, profile.unitSystem)}
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      {m.date} {m.bodyFatPercentage ? `· ${m.bodyFatPercentage}% BF` : ''}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeleteMeasurement(m.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {measurements.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-6">No measurements logged.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SMART LOCAL INSIGHTS (REQUIREMENT #32) */}
      {activeTab === 'insights' && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-amber-500/10 border border-amber-500/25 p-4 flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-bold text-slate-100">Local Training Intelligence</h3>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                Derived directly from your stored workout sessions and frequency patterns.
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {generateInsights().map((insight, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-[#11131a] border border-slate-800 p-4 flex items-start gap-3"
              >
                <span className="w-6 h-6 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-xs text-slate-200 leading-relaxed">{insight}</p>
              </div>
            ))}
          </div>

          {/* Consistency bars */}
          <div className="rounded-2xl bg-[#11131a] border border-slate-800 p-4">
            <span className="text-xs font-bold text-slate-200 block mb-2">
              Weekly Distribution (Day Frequency)
            </span>
            <SimpleBarChart data={last7DaysData} targetCount={1} />
          </div>
        </div>
      )}

      {/* TAB 4: ACHIEVEMENTS & MILESTONES (REQUIREMENT #45) */}
      {activeTab === 'achievements' && (
        <div className="space-y-3">
          {achievements.map((ach) => {
            const isUnlocked = ach.isUnlocked;
            const pct = Math.min(Math.round((ach.currentValue / ach.targetValue) * 100), 100);

            return (
              <div
                key={ach.id}
                className={`rounded-2xl border p-4 transition ${
                  isUnlocked
                    ? 'bg-amber-500/10 border-amber-500/40 shadow-sm'
                    : 'bg-[#11131a] border-slate-800 opacity-80'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl flex-shrink-0 p-2 rounded-xl bg-slate-900 border border-slate-800">
                    {ach.badge}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white">{ach.title}</h4>
                      {isUnlocked && (
                        <span className="text-[10px] font-extrabold uppercase text-amber-400">
                          Unlocked
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{ach.description}</p>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-slate-800 rounded-full mt-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isUnlocked ? 'bg-amber-500' : 'bg-slate-600'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mt-1">
                      <span>
                        {ach.currentValue.toLocaleString()} / {ach.targetValue.toLocaleString()}{' '}
                        {ach.unit}
                      </span>
                      <span>{pct}%</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* LOG BODY MEASUREMENT MODAL */}
      {showLogMeasurementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-[#11131a] border border-slate-800 p-6 text-slate-100 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">Log Body Metrics</h3>
            <p className="text-xs text-slate-400 mb-4">
              Track your physical transformation over time.
            </p>

            <div className="space-y-3 mb-5">
              <div>
                <label className="text-[10px] font-semibold text-slate-300 uppercase block mb-1">
                  Weight ({profile.unitSystem === 'imperial' ? 'lb' : 'kg'}) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={logWeight}
                  onChange={(e) => setLogWeight(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-semibold text-slate-300 uppercase block mb-1">
                    Waist (cm)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={logWaist}
                    onChange={(e) => setLogWaist(e.target.value)}
                    placeholder="e.g. 82"
                    className="w-full h-10 px-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-300 uppercase block mb-1">
                    Chest (cm)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={logChest}
                    onChange={(e) => setLogChest(e.target.value)}
                    placeholder="e.g. 102"
                    className="w-full h-10 px-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-semibold text-slate-300 uppercase block mb-1">
                    Arms (cm)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={logArms}
                    onChange={(e) => setLogArms(e.target.value)}
                    placeholder="e.g. 38"
                    className="w-full h-10 px-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-300 uppercase block mb-1">
                    Body Fat %
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={logBodyFat}
                    onChange={(e) => setLogBodyFat(e.target.value)}
                    placeholder="e.g. 14.5"
                    className="w-full h-10 px-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowLogMeasurementModal(false)}
                className="py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveMeasurement}
                className="py-2.5 rounded-xl bg-amber-500 text-black text-xs font-bold hover:bg-amber-400"
              >
                Save Metrics
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
