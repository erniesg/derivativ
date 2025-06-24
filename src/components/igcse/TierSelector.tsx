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
      
      {showDescription && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="text-sm text-blue-700">
              <p className="font-medium">Choose your tier level</p>
              <p className="mt-1">Core tier covers essential skills, while Extended includes all Core content plus advanced topics for higher grades.</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TIER_OPTIONS.map((tier) => {
          const isSelected = selectedTier === tier.id;
          const colorClasses = {
            blue: {
              selected: 'border-blue-500 bg-blue-50 text-blue-900',
              unselected: 'border-gray-200 bg-white text-gray-700 hover:border-blue-300'
            },
            purple: {
              selected: 'border-purple-500 bg-purple-50 text-purple-900',
              unselected: 'border-gray-200 bg-white text-gray-700 hover:border-purple-300'
            }
          };
          
          return (
            <button
              key={tier.id}
              onClick={() => onTierChange(tier.id)}
              className={`
                p-6 rounded-lg border-2 text-left transition-all duration-200
                ${isSelected 
                  ? colorClasses[tier.color].selected
                  : colorClasses[tier.color].unselected
                }
                cursor-pointer hover:shadow-sm
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${tier.color}-500
              `}
            >
              <div className="flex items-start space-x-4">
                <span className="text-3xl" role="img" aria-label={tier.name}>
                  {tier.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-lg">
                      {tier.name}
                    </h4>
                    {isSelected && (
                      <svg className="w-5 h-5 text-current" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <p className="text-sm mb-3">
                    {tier.description}
                  </p>
                  <div className="flex items-center text-xs text-gray-500">
                    <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                      {tier.syllabusRange}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Tier Comparison</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="font-medium text-blue-700 mb-1">Core Tier</div>
            <ul className="text-gray-600 space-y-1">
              <li>• Foundation mathematics</li>
              <li>• Grade targets: C-E (4-1)</li>
              <li>• Essential exam preparation</li>
            </ul>
          </div>
          <div>
            <div className="font-medium text-purple-700 mb-1">Extended Tier</div>
            <ul className="text-gray-600 space-y-1">
              <li>• Advanced mathematics</li>
              <li>• Grade targets: A*-C (9-4)</li>
              <li>• Higher education preparation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TierSelector;