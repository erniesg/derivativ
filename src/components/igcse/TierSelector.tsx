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
      
      {/* Two button tier selector */}
      <div className="flex bg-gray-100 rounded-lg p-1 w-full">
        {TIER_OPTIONS.map((tier) => {
          const isSelected = tier.id === selectedTier;
          
          return (
            <button
              key={tier.id}
              onClick={() => onTierChange(tier.id)}
              className={`
                flex-1 flex items-center justify-center space-x-3 px-6 py-4 rounded-md transition-all duration-200
                ${isSelected 
                  ? tier.color === 'blue' 
                    ? 'bg-blue-500 text-white shadow-md' 
                    : 'bg-purple-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }
              `}
            >
              <span className="text-2xl">{tier.icon}</span>
              <div className="text-left">
                <div className="font-semibold">{tier.name}</div>
                <div className={`text-sm ${
                  isSelected ? 'text-white/80' : 'text-gray-500'
                }`}>
                  {tier.syllabusRange}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Tier Details - Hover tooltip style */}
      {showDescription && selectedTierInfo && (
        <div className={`border rounded-lg p-3 text-sm ${
          selectedTierInfo.color === 'blue' 
            ? 'bg-blue-50 border-blue-200 text-blue-800' 
            : 'bg-purple-50 border-purple-200 text-purple-800'
        }`}>
          <p>{selectedTierInfo.description}</p>
        </div>
      )}
    </div>
  );
};

export default TierSelector;