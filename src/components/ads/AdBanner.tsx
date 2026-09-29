import React, { useState } from 'react';
import { ExternalLink, X } from 'lucide-react';
import { adConfig } from '../../config/adConfig';

export const AdBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="w-full px-4 py-2 bg-[#0e121a]/95 border-t border-slate-800 backdrop-blur-md">
      <div className="max-w-md mx-auto flex items-center justify-between gap-3 p-2.5 rounded-xl bg-[#161c28] border border-amber-500/20 shadow-md">
        
        {/* Left Branding / Icon */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold text-xs shrink-0">
            Ad
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-semibold text-white truncate">IRON GEAR · Pro Lifting Straps</h4>
            <p className="text-[11px] text-slate-400 truncate">Max grip security on heavy pulls</p>
          </div>
        </div>

        {/* Right CTA & Close */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => window.open('https://unity.com', '_blank')}
            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center gap-1 shadow transition-colors"
          >
            <span>Get</span>
            <ExternalLink className="w-3 h-3" />
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
