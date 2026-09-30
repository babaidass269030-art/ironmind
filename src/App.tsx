import React, { useState, useEffect, useCallback } from 'react';
import {
  UserProfile,
  WorkoutTemplate,
  WorkoutSession,
  PersonalRecord,
  BodyMeasurementLog,
  RoutineSchedule,
  Achievement,
  Exercise
} from './types';
import { StorageService } from './services/storage';
import { BottomNav, MainTab } from './components/common/BottomNav';
import { HomeScreen } from './components/screens/HomeScreen';
import { WorkoutScreen } from './components/screens/WorkoutScreen';
import { LiveWorkoutScreen } from './components/screens/LiveWorkoutScreen';
import { WorkoutSummaryScreen } from './components/screens/WorkoutSummaryScreen';
import { WorkoutBuilderScreen } from './components/screens/WorkoutBuilderScreen';
import { ExerciseLibraryScreen } from './components/screens/ExerciseLibraryScreen';
import { ProgressScreen } from './components/screens/ProgressScreen';
import { ToolsScreen } from './components/screens/ToolsScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { OnboardingScreen } from './components/screens/OnboardingScreen';
import { SplashScreen } from './components/common/SplashScreen';
import { InterstitialAdModal } from './components/ads/InterstitialAdModal';
import { AdBanner } from './components/ads/AdBanner';

type AppView =
  | 'main'
  | 'live_workout'
  | 'workout_summary'
  | 'workout_builder'
  | 'exercise_library';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [profile, setProfile] = useState<UserProfile>(StorageService.getProfile());
  const [currentTab, setCurrentTab] = useState<MainTab>('home');
  const [currentView, setCurrentView] = useState<AppView>('main');

  // Core Data State
  const [templates, setTemplates] = useState<WorkoutTemplate[]>(StorageService.getTemplates());
  const [sessions, setSessions] = useState<WorkoutSession[]>(StorageService.getSessions());
  const [prs, setPRs] = useState<PersonalRecord[]>(StorageService.getPersonalRecords());
  const [measurements, setMeasurements] = useState<BodyMeasurementLog[]>(
    StorageService.getBodyMeasurements()
  );
  const [routines, setRoutines] = useState<RoutineSchedule[]>(StorageService.getRoutines());
  const [achievements, setAchievements] = useState<Achievement[]>(
    StorageService.getAchievements()
  );
  const [allExercises, setAllExercises] = useState<Exercise[]>(
    StorageService.getAllExercises()
  );
  const [favorites, setFavorites] = useState<string[]>(StorageService.getFavorites());

  // Active workout session
  const [activeSession, setActiveSession] = useState<WorkoutSession | null>(
    StorageService.getActiveSession()
  );

  // Summary session (just completed)
  const [summarySession, setSummarySession] = useState<WorkoutSession | null>(null);
  const [previousSessionForSummary, setPreviousSessionForSummary] =
    useState<WorkoutSession | null>(null);

  // Interstitial Ad on Finish Workout
  const [showInterstitialAd, setShowInterstitialAd] = useState(false);
  const [pendingSummaryData, setPendingSummaryData] = useState<{
    completed: WorkoutSession;
    prior: WorkoutSession | null;
  } | null>(null);

  // Workout Builder editing template
  const [editingTemplate, setEditingTemplate] = useState<WorkoutTemplate | null>(null);

  // Exercise Library picker callback
  const [exercisePickerCallback, setExercisePickerCallback] = useState<
    ((exercise: Exercise) => void) | null
  >(null);

  // Refresh all state from localStorage
  const refreshAllData = useCallback(() => {
    setProfile(StorageService.getProfile());
    setTemplates(StorageService.getTemplates());
    setSessions(StorageService.getSessions());
    setPRs(StorageService.getPersonalRecords());
    setMeasurements(StorageService.getBodyMeasurements());
    setRoutines(StorageService.getRoutines());
    setAchievements(StorageService.getAchievements());
    setAllExercises(StorageService.getAllExercises());
    setFavorites(StorageService.getFavorites());
    setActiveSession(StorageService.getActiveSession());
  }, []);

  // Listen for storage changes if multi-tab
  useEffect(() => {
    const handleStorageChange = () => refreshAllData();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [refreshAllData]);

  // Start workout action
  const handleStartWorkout = (template?: WorkoutTemplate) => {
    let newSession: WorkoutSession;

    if (template) {
      newSession = {
        id: `session_${Date.now()}`,
        templateId: template.id,
        name: template.name,
        startedAt: new Date().toISOString(),
        durationSeconds: 0,
        totalVolumeKg: 0,
        totalSetsCompleted: 0,
        prsAchieved: [],
        isCompleted: false,
        exercises: template.exercises.map((templateEx, idx) => ({
          id: `session_ex_${Date.now()}_${idx}`,
          exerciseId: templateEx.exerciseId,
          targetRestSeconds: templateEx.restSeconds || profile.defaultRestSeconds || 90,
          sets: Array.from({ length: templateEx.defaultSets || 3 }).map((_, sIdx) => ({
            id: `set_${Date.now()}_${idx}_${sIdx}`,
            setNumber: sIdx + 1,
            type: 'normal',
            targetReps: parseInt(templateEx.defaultReps) || 8,
            targetWeight: 60,
            completedReps: parseInt(templateEx.defaultReps) || 8,
            completedWeight: 60,
            isCompleted: false
          }))
        }))
      };
    } else {
      // Empty Workout
      newSession = {
        id: `session_${Date.now()}`,
        name: 'Quick Workout',
        startedAt: new Date().toISOString(),
        durationSeconds: 0,
        totalVolumeKg: 0,
        totalSetsCompleted: 0,
        prsAchieved: [],
        isCompleted: false,
        exercises: [
          {
            id: `session_ex_${Date.now()}_0`,
            exerciseId: 'bench-press',
            targetRestSeconds: profile.defaultRestSeconds || 90,
            sets: [
              {
                id: `set_${Date.now()}_0_1`,
                setNumber: 1,
                type: 'normal',
                targetReps: 8,
                targetWeight: 60,
                completedReps: 8,
                completedWeight: 60,
                isCompleted: false
              },
              {
                id: `set_${Date.now()}_0_2`,
                setNumber: 2,
                type: 'normal',
                targetReps: 8,
                targetWeight: 60,
                completedReps: 8,
                completedWeight: 60,
                isCompleted: false
              },
              {
                id: `set_${Date.now()}_0_3`,
                setNumber: 3,
                type: 'normal',
                targetReps: 8,
                targetWeight: 60,
                completedReps: 8,
                completedWeight: 60,
                isCompleted: false
              }
            ]
          }
        ]
      };
    }

    StorageService.saveActiveSession(newSession);
    setActiveSession(newSession);
    setCurrentView('live_workout');
  };

  // Resume active workout
  const handleResumeActiveSession = () => {
    if (activeSession) {
      setCurrentView('live_workout');
    }
  };

  // Repeat previous workout session
  const handleRepeatSession = (prevSession: WorkoutSession) => {
    const newSession: WorkoutSession = {
      id: `session_${Date.now()}`,
      templateId: prevSession.templateId,
      name: prevSession.name,
      startedAt: new Date().toISOString(),
      durationSeconds: 0,
      totalVolumeKg: 0,
      totalSetsCompleted: 0,
      prsAchieved: [],
      isCompleted: false,
      exercises: prevSession.exercises.map((ex, exIdx) => ({
        id: `session_ex_${Date.now()}_${exIdx}`,
        exerciseId: ex.exerciseId,
        notes: ex.notes,
        targetRestSeconds: ex.targetRestSeconds || profile.defaultRestSeconds || 90,
        sets: ex.sets.map((set, sIdx) => ({
          id: `set_${Date.now()}_${exIdx}_${sIdx}`,
          setNumber: set.setNumber,
          type: set.type || 'normal',
          targetReps: set.completedReps || set.targetReps || 8,
          targetWeight: set.completedWeight || set.targetWeight || 60,
          completedReps: set.completedReps || set.targetReps || 8,
          completedWeight: set.completedWeight || set.targetWeight || 60,
          isCompleted: false
        }))
      }))
    };

    StorageService.saveActiveSession(newSession);
    setActiveSession(newSession);
    setCurrentView('live_workout');
  };

  // Finish Workout -> Interstitial Ad -> Show Summary
  const handleFinishWorkout = (completedSession: WorkoutSession) => {
    const prior = sessions
      .filter((s) => s.isCompleted && s.id !== completedSession.id)
      .find((s) => s.templateId === completedSession.templateId || s.name === completedSession.name);

    setPendingSummaryData({ completed: completedSession, prior: prior || null });
    setActiveSession(null);
    refreshAllData();
    setShowInterstitialAd(true);
  };

  const handleCloseInterstitialAd = () => {
    setShowInterstitialAd(false);
    if (pendingSummaryData) {
      setSummarySession(pendingSummaryData.completed);
      setPreviousSessionForSummary(pendingSummaryData.prior);
      setPendingSummaryData(null);
      setCurrentView('workout_summary');
    }
  };

  // Cancel workout
  const handleCancelWorkout = () => {
    setActiveSession(null);
    setCurrentView('main');
  };

  // Open Exercise Picker
  const handleOpenExercisePicker = (onSelect: (exercise: Exercise) => void) => {
    setExercisePickerCallback(() => onSelect);
    setCurrentView('exercise_library');
  };

  // 2-Second Splash Screen on App Open
  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} durationMs={2000} />;
  }

  // Interstitial Ad on Finish Workout
  if (showInterstitialAd) {
    return (
      <InterstitialAdModal
        isOpen={showInterstitialAd}
        onClose={handleCloseInterstitialAd}
      />
    );
  }

  // If first-time user
  if (!profile.hasCompletedOnboarding) {
    return <OnboardingScreen onComplete={refreshAllData} />;
  }

  // ACTIVE VIEWS
  if (currentView === 'live_workout' && activeSession) {
    return (
      <LiveWorkoutScreen
        session={activeSession}
        allExercises={allExercises}
        allSessions={sessions}
        profile={profile}
        onFinishWorkout={handleFinishWorkout}
        onCancelWorkout={handleCancelWorkout}
        onOpenExerciseLibrary={handleOpenExercisePicker}
      />
    );
  }

  if (currentView === 'workout_summary' && summarySession) {
    return (
      <WorkoutSummaryScreen
        session={summarySession}
        previousSession={previousSessionForSummary}
        profile={profile}
        allExercises={allExercises}
        onDone={() => {
          setSummarySession(null);
          setCurrentView('main');
          setCurrentTab('home');
        }}
        onViewProgress={() => {
          setSummarySession(null);
          setCurrentView('main');
          setCurrentTab('progress');
        }}
      />
    );
  }

  if (currentView === 'workout_builder') {
    return (
      <WorkoutBuilderScreen
        initialTemplate={editingTemplate}
        allExercises={allExercises}
        onSave={() => {
          setEditingTemplate(null);
          refreshAllData();
          setCurrentView('main');
        }}
        onCancel={() => {
          setEditingTemplate(null);
          setCurrentView('main');
        }}
        onOpenExercisePicker={handleOpenExercisePicker}
      />
    );
  }

  if (currentView === 'exercise_library') {
    return (
      <ExerciseLibraryScreen
        allExercises={allExercises}
        favorites={favorites}
        profile={profile}
        onClose={() => {
          setExercisePickerCallback(null);
          if (activeSession) {
            setCurrentView('live_workout');
          } else if (editingTemplate !== null) {
            setCurrentView('workout_builder');
          } else {
            setCurrentView('main');
          }
        }}
        onSelectExercise={
          exercisePickerCallback
            ? (ex) => {
                exercisePickerCallback(ex);
                setExercisePickerCallback(null);
                if (activeSession) {
                  setCurrentView('live_workout');
                } else {
                  setCurrentView('workout_builder');
                }
              }
            : undefined
        }
        onRefreshData={refreshAllData}
      />
    );
  }

  // MAIN TAB SCREENS
  const activeRoutine = routines.find((r) => r.isActive) || routines[0];

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col justify-between selection:bg-amber-500 selection:text-black">
      {/* স্ক্রিনের কনটেন্ট যাতে ব্যানারের পেছনে না লুকায়, তার জন্য pb-36 দেওয়া হয়েছে */}
      <main className="flex-1 w-full pb-36">
        {currentTab === 'home' && (
          <HomeScreen
            profile={profile}
            templates={templates}
            sessions={sessions}
            prs={prs}
            measurements={measurements}
            allExercises={allExercises}
            activeRoutine={activeRoutine}
            activeSession={activeSession}
            onStartWorkout={handleStartWorkout}
            onRepeatSession={handleRepeatSession}
            onResumeActiveSession={handleResumeActiveSession}
            onNavigateToWorkoutTab={() => setCurrentTab('workout')}
            onNavigateToProgressTab={() => setCurrentTab('progress')}
            onNavigateToToolsTab={() => setCurrentTab('tools')}
            onRefreshData={refreshAllData}
          />
        )}

        {currentTab === 'workout' && (
          <WorkoutScreen
            templates={templates}
            sessions={sessions}
            routines={routines}
            activeRoutine={activeRoutine}
            allExercises={allExercises}
            profile={profile}
            onStartWorkout={handleStartWorkout}
            onCreateWorkout={() => {
              setEditingTemplate(null);
              setCurrentView('workout_builder');
            }}
            onEditWorkout={(template) => {
              setEditingTemplate(template);
              setCurrentView('workout_builder');
            }}
            onOpenExerciseLibrary={() => {
              setExercisePickerCallback(null);
              setCurrentView('exercise_library');
            }}
            onRefreshData={refreshAllData}
          />
        )}

        {currentTab === 'progress' && (
          <ProgressScreen
            profile={profile}
            sessions={sessions}
            prs={prs}
            measurements={measurements}
            achievements={achievements}
            allExercises={allExercises}
            onRefreshData={refreshAllData}
          />
        )}

        {currentTab === 'tools' && <ToolsScreen profile={profile} />}

        {currentTab === 'profile' && (
          <ProfileScreen
            profile={profile}
            onRefreshData={refreshAllData}
            onResetApp={() => {
              refreshAllData();
              setCurrentTab('home');
            }}
          />
        )}
      </main>

      {/* PERSISTENT FIXED BANNER AD (সব স্ক্রিনের নিচে ভেসে থাকবে) */}
      <div className="fixed bottom-16 left-0 right-0 z-40 w-full bg-[#090a0f]">
        <AdBanner />
      </div>

      {/* ATHLETIC BOTTOM NAVIGATION */}
      <BottomNav
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
        hasActiveSession={!!activeSession}
      />
    </div>
   );
}
