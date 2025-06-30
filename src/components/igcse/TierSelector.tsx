import React from 'react';
import { Tier } from '../../types/api';

interface TierInfo {
  id: Tier;
  name: string;
  description: string;
  syllabusRange: string;
  icon: string;
  color: string;
}

const TIER_OPTIONS: TierInfo[] = [
  {
    id: Tier.CORE,
    name: 'Core',
    description: 'Fundamental concepts covering essential mathematics skills',
    syllabusRange: 'C1.1 - C9.5',
    icon: '🎯',
    color: 'blue'
  },
  {
    id: Tier.EXTENDED,
    name: 'Extended',
    description: 'Advanced concepts including all Core content plus additional topics',
    syllabusRange: 'E1.1 - E9.7 (includes all Core)',
    icon: '🚀',
    color: 'purple'
  }
];

interface TierSelectorProps {
  selectedTier: Tier;
  onTierChange: (tier: Tier) => void;
  className?: string;
  showDescription?: boolean;
}

const TierSelector: React.FC<TierSelectorProps> = ({
  selectedTier,
  onTierChange,
  className = '',
  showDescription = true
}) => {
  const selectedTierInfo = TIER_OPTIONS.find(tier => tier.id === selectedTier);
  const selectedIndex = TIER_OPTIONS.findIndex(tier => tier.id === selectedTier);

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Cambridge IGCSE Tier
        </h3>
        <div className="text-sm text-gray-500">
          {selectedTier} tier selected
        </div>
      </div>
      
      {/* Slider-style tier selector */}
      <div className="relative">
        <div className="flex justify-between items-center mb-4">
          {TIER_OPTIONS.map((tier, index) => {
            const isSelected = tier.id === selectedTier;
            const isPassed = index <= selectedIndex;
            
            return (
              <button
                key={`tier-${tier.id}-${index}`}
                onClick={() => onTierChange(tier.id)}
                className={`
                  relative flex flex-col items-center space-y-2 transition-all duration-200
                  ${isSelected ? 'transform scale-110' : 'hover:scale-105'}
                `}
              >
                {/* Icon Circle */}
                <div className={`
                  w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all duration-200
                  ${isSelected 
                    ? tier.color === 'blue' ? 'bg-blue-500 text-white shadow-lg' : 'bg-purple-500 text-white shadow-lg'
                    : isPassed 
                      ? tier.color === 'blue' ? 'bg-blue-100 text-blue-700 border-2 border-blue-300' : 'bg-purple-100 text-purple-700 border-2 border-purple-300'
                      : 'bg-gray-100 text-gray-400 border-2 border-gray-200 hover:border-gray-300'
                  }
                `}>
                  {tier.icon}
                </div>
                
                {/* Label */}
                <span className={`
                  text-sm font-medium transition-colors duration-200
                  ${isSelected 
                    ? tier.color === 'blue' ? 'text-blue-600' : 'text-purple-600'
                    : isPassed 
                      ? tier.color === 'blue' ? 'text-blue-500' : 'text-purple-500'
                      : 'text-gray-500'
                  }
                `}>
                  {tier.name}
                </span>
              </button>
            );
          })}
        </div>
        
        {/* Progress Bar */}
        <div className="absolute top-8 left-8 right-8 h-1 bg-gray-200 -z-10 rounded-full">
          <div 
            className={`h-full transition-all duration-300 rounded-full ${
              selectedTier === Tier.CORE ? 'bg-blue-500' : 'bg-purple-500'
            }`}
            style={{ width: `${(selectedIndex / (TIER_OPTIONS.length - 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Selected Tier Details */}
      {showDescription && selectedTierInfo && (
        <div className={`border rounded-lg p-4 ${
          selectedTierInfo.color === 'blue' 
            ? 'bg-blue-50 border-blue-200' 
            : 'bg-purple-50 border-purple-200'
        }`}>
          <div className="flex items-start space-x-3">
            <span className="text-3xl">{selectedTierInfo.icon}</span>
            <div className="flex-1">
              <h4 className={`font-semibold text-lg mb-2 ${
                selectedTierInfo.color === 'blue' ? 'text-blue-900' : 'text-purple-900'
              }`}>
                {selectedTierInfo.name} Tier
              </h4>
              <p className={`text-sm mb-3 ${
                selectedTierInfo.color === 'blue' ? 'text-blue-800' : 'text-purple-800'
              }`}>
                {selectedTierInfo.description}
              </p>
              <div className="flex items-center text-xs">
                <span className={`font-mono px-2 py-1 rounded ${
                  selectedTierInfo.color === 'blue' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-purple-100 text-purple-700'
                }`}>
                  {selectedTierInfo.syllabusRange}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TierSelector;