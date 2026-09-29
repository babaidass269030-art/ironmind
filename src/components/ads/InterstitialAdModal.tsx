import React from 'react';
import { X, ExternalLink, Zap } from 'lucide-react';
import { adConfig } from '../../config/adConfig';

interface InterstitialAdModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InterstitialAdModal: React.FC<InterstitialAdModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm rounded-2xl bg-[#131722] border border-amber-500/20 p-6 shadow-2xl overflow-hidden text-center">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full bg-slate-800/60"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Ad Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-semibold mb-4">
          <Zap className="w-3.5 h-3.5" />
          <span>Sponsored</span>
        </div>

        {/* Graphic Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/20 mb-4">
          <Zap className="w-8 h-8 text-black" />
        </div>

        {/* Ad Title & Desc */}
        <h3 className="text-xl font-bold text-white mb-2">APEX HYDRATION & RECOVERY</h3>
        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
          Zero sugar, premium electrolyte complex for maximum intra-workout endurance and rapid post-training recovery.
        </p>

        {/* CTA Button */}
        <button
          onClick={onClose}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-transform"
        >
          <span>Claim Special Offer</span>
          <ExternalLink className="w-4 h-4" />
        </button>

        {/* Skip button */}
        <button
          onClick={onClose}
          className="mt-3 text-xs text-slate-500 hover:text-slate-400"
        >
          Skip and continue
        </button>
      </div>
    </div>
  );
};
