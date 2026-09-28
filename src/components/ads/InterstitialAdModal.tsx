import React, { useState, useEffect } from 'react';
import { X, ExternalLink, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { AD_CONFIG } from '../../config/adConfig';

interface InterstitialAdModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InterstitialAdModal: React.FC<InterstitialAdModalProps> = ({
  isOpen,
  onClose
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(3);
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setSecondsRemaining(3);
    setCanSkip(false);

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanSkip(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen || !AD_CONFIG.enabled) {
    return null;
  }

  const isUnity = AD_CONFIG.activeProvider === 'unity';
  const isAdMob = AD_CONFIG.activeProvider === 'admob';

  const providerName = isUnity
    ? 'Unity Ads'
    : isAdMob
    ? 'Google AdMob'
    : 'Start.io';

  const placementId = isUnity
    ? AD_CONFIG.unity.interstitialPlacementId
    : isAdMob
    ? AD_CONFIG.admob.interstitialAdUnitId
    : AD_CONFIG.startio.interstitialPlacementId;

  const gameOrAppId = isUnity
    ? AD_CONFIG.unity.gameId
    : isAdMob
    ? AD_CONFIG.admob.appId
    : AD_CONFIG.startio.appId;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in">
      <div className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#151824] via-[#10121a] to-[#0a0c10] border border-slate-700/80 p-6 flex flex-col justify-between shadow-2xl text-slate-100 overflow-hidden min-h-[460px]">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-mono font-bold text-[9px] uppercase tracking-wider">
              {providerName} Interstitial
            </span>
          </div>

          {canSkip ? (
            <button
              onClick={onClose}
              className="flex items-center gap-1 px-3 py-1 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold hover:bg-slate-700 active:scale-95 transition"
            >
              <span>Close Ad</span>
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-xs font-mono"
            >
              <span>Skip in {secondsRemaining}s</span>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            </button>
          )}
        </div>

        {/* Ad Unit & Placement ID metadata */}
        <div className="py-2 text-[10px] text-slate-400 font-mono flex items-center justify-between" title={placementId}>
          <span>Game ID: <strong className="text-white">{gameOrAppId}</strong></span>
          <span>Placement: <strong className="text-amber-400">{placementId}</strong></span>
        </div>

        {/* Ad Creative / Visual Sponsor Mockup */}
        <div className="my-auto py-4 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-black mb-4 shadow-xl shadow-amber-500/20">
            <Zap className="w-10 h-10 fill-black stroke-black" />
          </div>

          <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 mb-1">
            Official Nutrition Partner
          </span>

          <h3 className="text-xl font-black font-display text-white leading-tight mb-2">
            APEX HYDRATION & RECOVERY
          </h3>

          <p className="text-xs text-slate-300 leading-relaxed max-w-xs mb-4">
            Zero sugar, premium electrolyte complex for maximum intra-workout endurance and rapid post-training muscular recovery.
          </p>

          <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono mb-4">
            <span>✓ 1000mg Electrolytes</span>
            <span>·</span>
            <span>✓ BCAA 2:1:1</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-amber-500 text-black font-extrabold text-xs shadow-lg shadow-amber-500/20 hover:bg-amber-400 active:scale-95 transition flex items-center justify-center gap-1.5"
          >
            <span>Learn More & Claim Offer</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Footer guidance note */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
          <span>Configured in <code className="text-slate-400">/src/config/adConfig.ts</code></span>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white underline"
          >
            Skip to Summary
          </button>
        </div>
      </div>
    </div>
  );
};
