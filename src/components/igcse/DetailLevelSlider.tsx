import React from 'react';
import { DetailLevel } from '../../types/api';

interface DetailLevelInfo {
  value: DetailLevel;
  label: string;
  description: string;
  estimatedTime: string;
  icon: string;
  features: string[];
}

const DETAIL_LEVELS: DetailLevelInfo[] = [
  {
    value: DetailLevel.MINIMAL,
    label: 'Minimal',
    description: 'Key points only, quick overview',
    estimatedTime: '5-10 min',
    icon: '⚡',
    features: ['Essential concepts', 'Brief explanations', 'Key formulas']
  },
  {
    value: DetailLevel.MEDIUM,
    label: 'Medium',
    description: 'Moderate detail with examples',
    estimatedTime: '15-25 min',
    icon: '⚖️',
    features: ['Detailed explanations', 'Worked examples', 'Practice questions']
  },
  {
    value: DetailLevel.COMPREHENSIVE,
    label: 'Comprehensive',
    description: 'Full detail with solutions and extensions',
    estimatedTime: '35+ min',
    icon: '📚',
    features: ['Complete coverage', 'Multiple examples', 'Detailed solutions', 'Additional context']
  },
  {
    value: DetailLevel.GUIDED,
    label: 'Guided',
    description: 'Step-by-step guidance with scaffolding',
    estimatedTime: '20-30 min',
    icon: '🎯',
    features: ['Step-by-step approach', 'Learning scaffolding', 'Progressive difficulty']
  }
];

interface DetailLevelSliderProps {
  selectedLevel: DetailLevel;
  onLevelChange: (level: DetailLevel) => void;
  className?: string;
  showDescription?: boolean;
}

const DetailLevelSlider: React.FC<DetailLevelSliderProps> = ({
  selectedLevel,
  onLevelChange,
  className = '',
  showDescription = true
}) => {
  const selectedIndex = DETAIL_LEVELS.findIndex(level => level.value === selectedLevel);
  const selectedLevelInfo = DETAIL_LEVELS[selectedIndex];

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Detail Level
        </h3>
        <div className="text-sm text-gray-500">
          {selectedLevelInfo.label} • {selectedLevelInfo.estimatedTime}
        </div>
      </div>

      {/* Visual Slider */}
      <div className="relative">
        <div className="flex justify-between items-center mb-4">
          {DETAIL_LEVELS.map((level, index) => {
            const isSelected = level.value === selectedLevel;
            const isPassed = index <= selectedIndex;
            
            return (
              <button
                key={`level-${level.value}-${index}`}
                type="button"
                onClick={() => onLevelChange(level.value)}
                className={`
                  relative flex flex-col items-center space-y-2 transition-all duration-200
                  ${isSelected ? 'transform scale-110' : 'hover:scale-105'}
                `}
              >
                {/* Icon Circle */}
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center text-lg transition-all duration-200
                  ${isSelected 
                    ? 'bg-green-500 text-white shadow-lg' 
                    : isPassed 
                      ? 'bg-green-100 text-green-700 border-2 border-green-300'
                      : 'bg-gray-100 text-gray-400 border-2 border-gray-200 hover:border-gray-300'
                  }
                `}>
                  {level.icon}
                </div>
                
                {/* Label */}
                <span className={`
                  text-xs font-medium transition-colors duration-200
                  ${isSelected 
                    ? 'text-green-600' 
                    : isPassed 
                      ? 'text-green-500'
                      : 'text-gray-500'
                  }
                `}>
                  {level.label}
                </span>
              </button>
            );
          })}
        </div>
        
        {/* Progress Bar */}
        <div className="absolute top-6 left-6 right-6 h-0.5 bg-gray-200 -z-10">
          <div 
            className="h-full bg-green-500 transition-all duration-300"
            style={{ width: `${(selectedIndex / (DETAIL_LEVELS.length - 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Selected Level Details */}
      {showDescription && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <span className="text-2xl">{selectedLevelInfo.icon}</span>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-green-900">
                  {selectedLevelInfo.label} Detail Level
                </h4>
                <span className="text-sm font-medium text-green-700 bg-green-100 px-2 py-1 rounded">
                  {selectedLevelInfo.estimatedTime}
                </span>
              </div>
              <p className="text-green-800 text-sm mb-3">
                {selectedLevelInfo.description}
              </p>
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-green-900">What's included:</h5>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-1">
                  {selectedLevelInfo.features.map((feature, index) => (
                    <li key={index} className="text-sm text-green-700 flex items-center">
                      <svg className="w-3 h-3 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DetailLevelSlider;