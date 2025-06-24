import React from 'react';
import { TopicName } from '../../types/api';

interface TopicInfo {
  id: TopicName;
  name: string;
  description: string;
  coreCode: string;
  extendedCode: string;
  icon: string;
}

const IGCSE_TOPICS: TopicInfo[] = [
  {
    id: TopicName.NUMBER,
    name: 'Number',
    description: 'Types, operations, indices, standard form, ratios, percentages',
    coreCode: 'C1',
    extendedCode: 'E1',
    icon: '🔢'
  },
  {
    id: TopicName.ALGEBRA_AND_GRAPHS,
    name: 'Algebra & Graphs',
    description: 'Equations, inequalities, sequences, functions, differentiation',
    coreCode: 'C2',
    extendedCode: 'E2',
    icon: '📈'
  },
  {
    id: TopicName.COORDINATE_GEOMETRY,
    name: 'Coordinate Geometry',
    description: 'Coordinates, linear graphs, gradients, perpendicular lines',
    coreCode: 'C3',
    extendedCode: 'E3',
    icon: '📊'
  },
  {
    id: TopicName.GEOMETRY,
    name: 'Geometry',
    description: 'Constructions, similarity, angles, circle theorems',
    coreCode: 'C4',
    extendedCode: 'E4',
    icon: '📐'
  },
  {
    id: TopicName.MENSURATION,
    name: 'Mensuration',
    description: 'Area, perimeter, surface area, volume, compound shapes',
    coreCode: 'C5',
    extendedCode: 'E5',
    icon: '📏'
  },
  {
    id: TopicName.TRIGONOMETRY,
    name: 'Trigonometry',
    description: 'Pythagoras, trigonometric functions, 3D problems',
    coreCode: 'C6',
    extendedCode: 'E6',
    icon: '📋'
  },
  {
    id: TopicName.TRANSFORMATIONS_AND_VECTORS,
    name: 'Transformations & Vectors',
    description: 'Transformations, vector operations, vector geometry',
    coreCode: 'C7',
    extendedCode: 'E7',
    icon: '🔄'
  },
  {
    id: TopicName.PROBABILITY,
    name: 'Probability',
    description: 'Basic probability, combined events, conditional probability',
    coreCode: 'C8',
    extendedCode: 'E8',
    icon: '🎲'
  },
  {
    id: TopicName.STATISTICS,
    name: 'Statistics',
    description: 'Data interpretation, averages, charts, scatter diagrams',
    coreCode: 'C9',
    extendedCode: 'E9',
    icon: '📈'
  }
];

interface TopicSelectorProps {
  selectedTopics: TopicName[];
  onTopicsChange: (topics: TopicName[]) => void;
  maxSelection?: number;
  className?: string;
}

const TopicSelector: React.FC<TopicSelectorProps> = ({
  selectedTopics,
  onTopicsChange,
  maxSelection,
  className = ''
}) => {
  const handleTopicToggle = (topicId: TopicName) => {
    if (selectedTopics.includes(topicId)) {
      // Remove topic
      onTopicsChange(selectedTopics.filter(id => id !== topicId));
    } else {
      // Add topic (check max selection)
      if (maxSelection && selectedTopics.length >= maxSelection) {
        return; // Don't add if at max
      }
      onTopicsChange([...selectedTopics, topicId]);
    }
  };

  const isSelected = (topicId: TopicName) => selectedTopics.includes(topicId);
  const isDisabled = (topicId: TopicName) => 
    !isSelected(topicId) && maxSelection && selectedTopics.length >= maxSelection;

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          IGCSE Mathematics Topics
        </h3>
        <div className="text-sm text-gray-500">
          {selectedTopics.length} topic{selectedTopics.length !== 1 ? 's' : ''} selected
          {maxSelection && ` (max ${maxSelection})`}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {IGCSE_TOPICS.map((topic) => {
          const selected = isSelected(topic.id);
          const disabled = isDisabled(topic.id);
          
          return (
            <button
              key={topic.id}
              onClick={() => handleTopicToggle(topic.id)}
              disabled={disabled}
              className={`
                p-4 rounded-lg border-2 text-left transition-all duration-200
                ${selected 
                  ? 'border-green-500 bg-green-50 text-green-900' 
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }
                ${disabled 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'cursor-pointer hover:shadow-sm'
                }
                focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50
              `}
            >
              <div className="flex items-start space-x-3">
                <span className="text-2xl" role="img" aria-label={topic.name}>
                  {topic.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm truncate">
                      {topic.name}
                    </h4>
                    <span className="text-xs font-mono text-gray-400 ml-2">
                      {topic.coreCode}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {topic.description}
                  </p>
                </div>
              </div>
              
              {selected && (
                <div className="mt-2 flex items-center text-green-600">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs font-medium">Selected</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
      
      {selectedTopics.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="text-sm">Select topics to generate materials for</p>
        </div>
      )}
    </div>
  );
};

export default TopicSelector;