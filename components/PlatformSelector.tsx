import React from 'react';
import { PLATFORM_CONFIGS } from '../constants';
import { Platform } from '../types';

interface PlatformSelectorProps {
  selected: Platform;
  onChange: (p: Platform) => void;
}

const PlatformSelector: React.FC<PlatformSelectorProps> = ({ selected, onChange }) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {PLATFORM_CONFIGS.map((config) => {
        const isSelected = selected === config.id;
        const Icon = config.icon;
        return (
          <button
            key={config.id}
            onClick={() => onChange(config.id)}
            className={`
              relative p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-start gap-2 text-left group
              ${isSelected 
                ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500/20' 
                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'}
            `}
          >
            <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary-500 text-white' : 'bg-slate-100 text-slate-500 group-hover:text-slate-700'}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <span className={`block font-bold text-sm ${isSelected ? 'text-primary-700' : 'text-slate-700'}`}>
                {config.name}
              </span>
              <span className="text-xs text-slate-400">{config.ratioLabel}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default PlatformSelector;