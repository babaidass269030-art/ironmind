import React, { useState } from 'react';
import {
  User,
  Settings,
  Target,
  Download,
  Upload,
  Trash2,
  ShieldCheck,
  Info,
  Volume2,
  VolumeX,
  Vibrate,
  Smartphone,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { UserProfile, FitnessGoal, AppDataBackup } from '../../types';
import { StorageService } from '../../services/storage';
import { UnitConverter } from '../../utils/unitConverter';
import { PWAInstallButton } from '../common/PWAInstallButton';
import { AD_CONFIG } from '../../config/adConfig';

interface ProfileScreenProps {
  profile: UserProfile;
  onRefreshData: () => void;
  onResetApp: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  profile,
  onRefreshData,
  onResetApp
}) => {
  const [name, setName] = useState(profile.name);
  const [goal, setGoal] = useState<FitnessGoal>(profile.goal);
  const [weeklyTarget, setWeeklyTarget] = useState(profile.weeklyWorkoutTarget);
  const [defaultRest, setDefaultRest] = useState(profile.defaultRestSeconds);
  const [soundEnabled, setSoundEnabled] = useState(profile.soundEnabled);
  const [vibrationEnabled, setVibrationEnabled] = useState(profile.vibrationEnabled);
  const [unitSystem, setUnitSystem] = useState(profile.unitSystem);

  // Modals
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetConfirmInput, setResetConfirmInput] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleSaveProfileChanges = () => {
    const updated: UserProfile = {
      ...profile,
      name: name.trim() || 'Athlete',
      goal,
      weeklyWorkoutTarget: weeklyTarget,
      defaultRestSeconds: defaultRest,
      soundEnabled,
      vibrationEnabled,
      unitSystem
    };
    StorageService.saveProfile(updated);
    onRefreshData();
  };

  const handleExportBackup = () => {
    const jsonString = StorageService.exportBackupData();
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ironmind_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = StorageService.importBackupData(content);
      if (res.success) {
        setImportStatus('Backup successfully restored!');
        onRefreshData();
      } else {
        setImportStatus(res.message);
      }
      setTimeout(() => setImportStatus(null), 4000);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleExecuteReset = () => {
    if (resetConfirmInput.toUpperCase() === 'RESET') {
      StorageService.resetAllData();
      setShowResetModal(false);
      onResetApp();
    }
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 pb-28 pt-4 px-4 max-w-md mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-widest block">
            Athlete Profile
          </span>
          <h1 className="text-2xl font-extrabold font-display tracking-tight text-white mt-0.5">
            Settings & Data
          </h1>
        </div>
      </div>

      {/* PWA In-App Install Banner (Section 66 & pwa-integration skill) */}
      <div className="mb-5">
        <PWAInstallButton />
      </div>

      {/* ATHLETE IDENTITY CARD */}
      <div className="rounded-3xl bg-[#11131a] border border-slate-800/80 p-5 mb-5 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-lg font-display">
            {profile.name ? profile.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="flex-1">
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Athlete Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={handleSaveProfileChanges}
              className="w-full bg-transparent font-bold text-white text-base focus:outline-none focus:border-b focus:border-amber-400"
            />
          </div>
        </div>

        {/* Primary Goal Selector */}
        <div className="mb-4">
          <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
            Fitness Goal
          </label>
          <select
            value={goal}
            onChange={(e) => {
              setGoal(e.target.value as FitnessGoal);
              const updated = { ...profile, goal: e.target.value as FitnessGoal };
              StorageService.saveProfile(updated);
              onRefreshData();
            }}
            className="w-full h-11 px-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-white focus:outline-none focus:border-amber-500"
          >
            <option value="build_muscle">Build Muscle (Hypertrophy)</option>
            <option value="get_stronger">Gain Raw Strength</option>
            <option value="lose_fat">Lose Fat & Tone</option>
            <option value="improve_fitness">Athletic Stamina</option>
            <option value="maintain">Maintain Current Physique</option>
            <option value="general_health">General Health & Longevity</option>
          </select>
        </div>

        {/* Unit Preference & Weekly Target */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800/80">
          <div>
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Unit System
            </label>
            <div className="grid grid-cols-2 gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setUnitSystem('metric');
                  StorageService.saveProfile({ ...profile, unitSystem: 'metric' });
                  onRefreshData();
                }}
                className={`py-1.5 text-xs font-bold rounded-lg transition ${
                  unitSystem === 'metric' ? 'bg-amber-500 text-black' : 'text-slate-400'
                }`}
              >
                kg
              </button>
              <button
                type="button"
                onClick={() => {
                  setUnitSystem('imperial');
                  StorageService.saveProfile({ ...profile, unitSystem: 'imperial' });
                  onRefreshData();
                }}
                className={`py-1.5 text-xs font-bold rounded-lg transition ${
                  unitSystem === 'imperial' ? 'bg-amber-500 text-black' : 'text-slate-400'
                }`}
              >
                lb
              </button>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Weekly Target
            </label>
            <select
              value={weeklyTarget}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setWeeklyTarget(val);
                StorageService.saveProfile({ ...profile, weeklyWorkoutTarget: val });
                onRefreshData();
              }}
              className="w-full h-9 px-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-white font-mono"
            >
              {[2, 3, 4, 5, 6].map((d) => (
                <option key={d} value={d}>
                  {d} days / week
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* WORKOUT & AUDIO PREFERENCES */}
      <div className="rounded-2xl bg-[#11131a] border border-slate-800/80 p-4 mb-5 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Preferences & Feedback
        </h3>

        {/* Default Rest Timer */}
        <div className="flex items-center justify-between py-1">
          <div>
            <span className="text-xs font-semibold text-white block">Default Rest Timer</span>
            <span className="text-[10px] text-slate-400">Triggered after completing a set</span>
          </div>
          <select
            value={defaultRest}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              setDefaultRest(val);
              StorageService.saveProfile({ ...profile, defaultRestSeconds: val });
              onRefreshData();
            }}
            className="h-8 px-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-amber-400"
          >
            <option value={45}>45 sec</option>
            <option value={60}>60 sec</option>
            <option value={90}>90 sec</option>
            <option value={120}>120 sec</option>
            <option value={180}>180 sec</option>
          </select>
        </div>

        {/* Sound Effects Toggle */}
        <div className="flex items-center justify-between py-1 border-t border-slate-800/60 pt-2">
          <div className="flex items-center gap-2">
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-amber-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
            <div>
              <span className="text-xs font-semibold text-white block">Workout Sound Cues</span>
              <span className="text-[10px] text-slate-400">Crisp synthesized beeps & PR chime</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              StorageService.saveProfile({ ...profile, soundEnabled: next });
              onRefreshData();
            }}
            className={`w-11 h-6 rounded-full transition relative ${
              soundEnabled ? 'bg-amber-500' : 'bg-slate-800'
            }`}
          >
            <span
              className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                soundEnabled ? 'right-1' : 'left-1'
              }`}
            />
          </button>
        </div>

        {/* Vibration Toggle */}
        <div className="flex items-center justify-between py-1 border-t border-slate-800/60 pt-2">
          <div className="flex items-center gap-2">
            <Vibrate className="w-4 h-4 text-amber-400" />
            <div>
              <span className="text-xs font-semibold text-white block">Haptic Vibration</span>
              <span className="text-[10px] text-slate-400">Tactile pulses on set completion</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              const next = !vibrationEnabled;
              setVibrationEnabled(next);
              StorageService.saveProfile({ ...profile, vibrationEnabled: next });
              onRefreshData();
            }}
            className={`w-11 h-6 rounded-full transition relative ${
              vibrationEnabled ? 'bg-amber-500' : 'bg-slate-800'
            }`}
          >
            <span
              className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                vibrationEnabled ? 'right-1' : 'left-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* DATA BACKUP & RESTORE (SECTION 36 & 68) */}
      <div className="rounded-2xl bg-[#11131a] border border-slate-800/80 p-4 mb-5 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Data Management & Backup
        </h3>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Because your fitness data lives 100% locally on your phone, download a JSON backup anytime to safeguard your records or transfer to another device.
        </p>

        {importStatus && (
          <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-xs font-semibold text-amber-300">
            {importStatus}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleExportBackup}
            className="py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-slate-800 active:scale-95 transition"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Export Backup</span>
          </button>

          <label className="py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-slate-800 active:scale-95 transition cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-amber-400" />
            <span>Import Backup</span>
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleImportBackup}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* PRIVACY, ABOUT, RESET LINKS */}
      <div className="rounded-2xl bg-[#11131a] border border-slate-800/80 divide-y divide-slate-800/80 mb-5 text-xs">
        <button
          onClick={() => setShowPrivacyModal(true)}
          className="w-full py-3.5 px-4 flex items-center justify-between text-left hover:bg-slate-900/50"
        >
          <div className="flex items-center gap-2 text-slate-200 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Privacy & Local Storage</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>

        <button
          onClick={() => setShowAboutModal(true)}
          className="w-full py-3.5 px-4 flex items-center justify-between text-left hover:bg-slate-900/50"
        >
          <div className="flex items-center gap-2 text-slate-200 font-semibold">
            <Info className="w-4 h-4 text-amber-400" />
            <span>About IRONMIND</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>

        <button
          onClick={() => setShowResetModal(true)}
          className="w-full py-3.5 px-4 flex items-center justify-between text-left hover:bg-slate-900/50 text-rose-400 font-semibold"
        >
          <div className="flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-rose-400" />
            <span>Reset All Local Data</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>
      </div>

      {/* AD NETWORK PLACEHOLDER & CONFIGURATION (UNITY ADS) */}
      <div className="p-4 rounded-2xl bg-[#11131a] border border-slate-800/80 mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Ad Network Integration
          </span>
          <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 font-mono text-[10px] font-bold uppercase">
            Unity Ads Active
          </span>
        </div>
        <p className="text-xs text-slate-300 mb-3">
          Unity Ads is configured as the active ad provider. Game ID (Android): <code className="text-amber-400 font-mono">800382946</code>.
        </p>
        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-500 block text-[9px]">TOOLS BANNER</span>
            <span className="text-slate-300 truncate block font-bold text-white" title={AD_CONFIG.unity.bannerPlacementId}>
              {AD_CONFIG.unity.bannerPlacementId}
            </span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-500 block text-[9px]">FINISH INTERSTITIAL</span>
            <span className="text-slate-300 truncate block font-bold text-amber-400" title={AD_CONFIG.unity.interstitialPlacementId}>
              {AD_CONFIG.unity.interstitialPlacementId}
            </span>
          </div>
        </div>
      </div>

      {/* PRIVACY MODAL (SECTION 50) */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-[#11131a] border border-slate-800 p-6 text-slate-100 shadow-2xl max-h-[85vh] flex flex-col justify-between">
            <div className="overflow-y-auto pr-1">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Local Privacy Guarantee
                </h3>
                <button
                  onClick={() => setShowPrivacyModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                <p>
                  <strong>Your fitness data is stored locally on this device.</strong>
                </p>
                <p>
                  IRONMIND is designed with a strict local-first architecture. We do not operate user databases, backend telemetry servers, or account tracking scripts.
                </p>
                <p>
                  All workout sets, body measurements, personal records, and routines reside inside your browser’s local storage. This means:
                </p>
                <ul className="list-disc pl-4 space-y-1 text-slate-400">
                  <li>No account creation or password required.</li>
                  <li>Works 100% offline without any network connectivity.</li>
                  <li>No third-party trackers or health data sharing.</li>
                </ul>
                <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                  Tip: Regularly use the "Export Backup" button to save your records as an offline JSON file.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowPrivacyModal(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold"
            >
              Understood
            </button>
          </div>
        </div>
      )}

      {/* ABOUT MODAL (SECTION 51) */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-[#11131a] border border-slate-800 p-6 text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-400" />
                About IRONMIND
              </h3>
              <button
                onClick={() => setShowAboutModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed mb-6">
              <div className="flex items-center gap-2">
                <span className="font-bold text-amber-400">IRONMIND</span>
                <span className="font-mono text-slate-500 text-[10px]">v1.0.0 (Production)</span>
              </div>
              <p>
                Engineered for serious lifters who demand clean, rapid set tracking, progressive overload calculation, and zero cloud friction inside the gym.
              </p>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-[11px]">
                <p><strong>Architecture:</strong> Local-first React PWA</p>
                <p><strong>Formulas:</strong> Epley 1RM, Mifflin-St Jeor TDEE</p>
                <p><strong>Audio:</strong> Web Audio API Synthesis</p>
              </div>
            </div>

            <button
              onClick={() => setShowAboutModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* DANGEROUS RESET ALL DATA MODAL (SECTION 37) */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-[#11131a] border border-rose-500/50 p-6 text-slate-100 shadow-2xl">
            <h3 className="text-base font-bold text-rose-400 mb-2">Delete All Local Data?</h3>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              This will permanently delete your workout history, PRs, body measurements, routines, and profile from this device.
            </p>
            <p className="text-[11px] text-slate-400 mb-4">
              To confirm, type <strong className="text-white font-mono">RESET</strong> below:
            </p>

            <input
              type="text"
              value={resetConfirmInput}
              onChange={(e) => setResetConfirmInput(e.target.value)}
              placeholder="RESET"
              className="w-full h-11 px-3 rounded-xl bg-slate-900 border border-rose-500/40 text-center font-mono font-bold text-sm text-white mb-5 uppercase"
            />

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setShowResetModal(false);
                  setResetConfirmInput('');
                }}
                className="py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteReset}
                disabled={resetConfirmInput.toUpperCase() !== 'RESET'}
                className="py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-500 disabled:opacity-40 transition"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
