import React from 'react';
import { Home, Dumbbell, TrendingUp, Calculator, User } from 'lucide-react';

export type MainTab = 'home' | 'workout' | 'progress' | 'tools' | 'profile';

interface BottomNavProps {
  currentTab: MainTab;
  onTabChange: (tab: MainTab) => void;
  hasActiveSession?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
  hasActiveSession = false
}) => {
  const tabs = [
    { id: 'home' as MainTab, label: 'Home', icon: Home },
    { id: 'workout' as MainTab, label: 'Workout', icon: Dumbbell, hasBadge: hasActiveSession },
    { id: 'progress' as MainTab, label: 'Progress', icon: TrendingUp },
    { id: 'tools' as MainTab, label: 'Tools', icon: Calculator },
    { id: 'profile' as MainTab, label: 'Profile', icon: User }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0c0e14]/95 backdrop-blur-xl border-t border-slate-800/80 pb-safe">
      <div className="max-w-md mx-auto grid grid-cols-5 items-center h-16 px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative flex flex-col items-center justify-center py-1 min-h-[48px] rounded-xl transition-colors active:scale-95 text-center"
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive
                      ? 'text-amber-400 scale-110'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                />
                {tab.hasBadge && (
                  <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-emerald-400 animate-pulse ring-2 ring-[#0c0e14]" />
                )}
              </div>
              <span
                className={`text-[10px] font-semibold tracking-tight mt-1 transition-colors ${
                  isActive ? 'text-amber-400 font-bold' : 'text-slate-400'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
