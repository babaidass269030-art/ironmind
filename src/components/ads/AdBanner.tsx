import React, { useState } from 'react';
import { ExternalLink, X, Info } from 'lucide-react';
import { AD_CONFIG } from '../../config/adConfig';

interface AdBannerProps {
  placement?: string;
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  placement = 'tools_bottom',
  className = ''
}) => {
  const [dismissed, setDismissed] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  if (!AD_CONFIG.enabled || dismissed) {
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
    ? AD_CONFIG.unity.bannerPlacementId
    : isAdMob
    ? AD_CONFIG.admob.bannerAdUnitId
    : AD_CONFIG.startio.bannerPlacementId;

  const gameOrAppId = isUnity
    ? AD_CONFIG.unity.gameId
    : isAdMob
    ? AD_CONFIG.admob.appId
    : AD_CONFIG.startio.appId;

  return (
    <div className={`w-full mt-4 mb-2 ${className}`}>
      {/* Banner Container - standard 320x50 / adaptive mobile container */}
      <div className="relative rounded-2xl bg-gradient-to-r from-[#12151e] via-[#161a26] to-[#12151e] border border-slate-800/90 p-3 shadow-md overflow-hidden">
        {/* Top bar with Network badge & IDs */}
        <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/70 mb-2">
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono font-bold text-[9px] uppercase tracking-wider">
              {providerName}
            </span>
            <span className="text-[10px] text-slate-400 font-mono truncate max-w-[170px]" title={placementId}>
              Placement: {placementId}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="p-1 text-slate-500 hover:text-slate-300"
              title="Ad Placement Info"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="p-1 text-slate-500 hover:text-slate-300"
              title="Close Ad Placeholder"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Ad Content / Creative */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex-shrink-0 flex items-center justify-center text-amber-400 font-bold text-xs font-mono">
              IG
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-white truncate">
                IRON GEAR · Pro Lifting Straps
              </h4>
              <p className="text-[10px] text-slate-400 truncate">
                Max grip security on heavy pulls. Use code IRONMIND for 20% off.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="flex-shrink-0 px-2.5 py-1.5 rounded-lg bg-amber-500 text-black font-bold text-[10px] flex items-center gap-1 shadow hover:bg-amber-400 active:scale-95 transition"
          >
            <span>Learn More</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        {/* Info drawer explaining Unity Ads configuration */}
        {showInfo && (
          <div className="mt-2.5 pt-2 border-t border-slate-800 text-[10px] text-slate-400 leading-normal bg-black/40 -mx-3 -mb-3 p-2.5">
            <span className="font-bold text-amber-400 block mb-0.5">Unity Ads Configuration:</span>
            <div className="font-mono text-slate-300 space-y-0.5">
              <p>Game ID (Android): <span className="text-white">{gameOrAppId}</span></p>
              <p>Placement ID: <span className="text-white">{placementId}</span></p>
            </div>
            <p className="mt-1 text-slate-400">
              Managed via <code className="text-slate-200">/src/config/adConfig.ts</code>. Ready for native Unity Ads SDK wrapper.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
