import React, { useState } from 'react';
import { 
  DocumentGenerationRequest, 
  DocumentType, 
  DetailLevel, 
  Tier, 
  TopicName,
  GenerationState 
} from '../../types/api';
import TopicSelector from './TopicSelector';
import TierSelector from './TierSelector';
import DetailLevelSlider from './DetailLevelSlider';

interface GenerationFormProps {
  onGenerate: (request: DocumentGenerationRequest) => Promise<void>;
  generationState: GenerationState;
  className?: string;
}

interface FormState {
  title: string;
  documentType: DocumentType;
  selectedTopics: TopicName[];
  selectedTier: Tier;
  detailLevel: DetailLevel;
  maxQuestions: number;
  includeAnswers: boolean;
  includeWorking: boolean;
  useDatabase: boolean;
}

const DOCUMENT_TYPE_OPTIONS = [
  {
    value: DocumentType.WORKSHEET,
    label: 'Worksheet',
    description: 'Practice problems with exercises',
    icon: '📝'
  },
  {
    value: DocumentType.NOTES,
    label: 'Study Notes',
    description: 'Explanatory content with theory',
    icon: '📚'
  },
  {
    value: DocumentType.TEXTBOOK,
    label: 'Mini Textbook',
    description: 'Comprehensive learning material',
    icon: '📖'
  },
  {
    value: DocumentType.SLIDES,
    label: 'Presentation',
    description: 'Teaching slides and visuals',
    icon: '🎨'
  }
];

const GenerationForm: React.FC<GenerationFormProps> = ({
  onGenerate,
  generationState,
  className = ''
}) => {
  const [formState, setFormState] = useState<FormState>({
    title: '',
    documentType: DocumentType.WORKSHEET,
    selectedTopics: [],
    selectedTier: Tier.CORE,
    detailLevel: DetailLevel.MEDIUM,
    maxQuestions: 5,
    includeAnswers: true,
    includeWorking: true,
    useDatabase: true
  });

  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [userInitiatedGeneration, setUserInitiatedGeneration] = useState(false);

  const validateForm = (): boolean => {
    const errors: string[] = [];
    
    if (formState.selectedTopics.length === 0) {
      errors.push('Please select at least one topic');
    }
    
    if (!formState.title.trim()) {
      errors.push('Please enter a title for your material');
    }
    
    if (formState.maxQuestions < 1 || formState.maxQuestions > 20) {
      errors.push('Number of questions must be between 1 and 20');
    }
    
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Safety check: Only allow generation if user explicitly clicked the generate button
    if (!userInitiatedGeneration) {
      console.warn('🚫 Generation blocked: User did not explicitly click generate button');
      return;
    }
    
    console.log('✅ Generation allowed: User explicitly clicked generate button');
    
    if (!validateForm()) {
      setUserInitiatedGeneration(false); // Reset flag if validation fails
      return;
    }

    const request: DocumentGenerationRequest = {
      document_type: formState.documentType,
      detail_level: formState.detailLevel,
      title: formState.title,
      topic: formState.selectedTopics.join(', '),
      tier: formState.selectedTier,
      grade_level: formState.selectedTier === Tier.CORE ? "7-9" : "9-10", // Convert to string format expected by backend
      auto_include_questions: true,
      max_questions: formState.maxQuestions,
      include_answers: formState.includeAnswers,
      include_working: formState.includeWorking,
      custom_sections: [],
      exclude_content_types: [],
      use_database: formState.useDatabase
    };

    try {
      await onGenerate(request);
    } finally {
      setUserInitiatedGeneration(false); // Reset flag after generation attempt
    }
  };

  const updateFormState = (updates: Partial<FormState>) => {
    setFormState(prev => ({ ...prev, ...updates }));
    setValidationErrors([]); // Clear errors when user makes changes
  };

  const isGenerating = generationState === 'loading';

  return (
    <form onSubmit={handleSubmit} className={`space-y-8 ${className}`}>

      {/* Document Title */}
      <div className="space-y-2">
        <label htmlFor="title" className="block text-lg font-semibold text-gray-900">
          Document Title
        </label>
        <input
          id="title"
          type="text"
          value={formState.title}
          onChange={(e) => updateFormState({ title: e.target.value })}
          placeholder="e.g., IGCSE Algebra Practice Sheet"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          disabled={isGenerating}
        />
      </div>

      {/* Document Type Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Document Type</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {DOCUMENT_TYPE_OPTIONS.map((option) => {
            const isSelected = formState.documentType === option.value;
            
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => updateFormState({ documentType: option.value })}
                className={`
                  p-4 rounded-lg border-2 text-left transition-all duration-200
                  ${isSelected 
                    ? 'border-green-500 bg-green-50 text-green-900' 
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }
                  focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50
                `}
              >
                <div className="text-2xl mb-2">{option.icon}</div>
                <div className="font-medium text-sm">{option.label}</div>
                <div className="text-xs text-gray-500 mt-1">{option.description}</div>
              </button>
            );
          })}
        </div>
      </div>


      {/* Topic Selection */}
      <TopicSelector
        selectedTopics={formState.selectedTopics}
        onTopicsChange={(topics) => updateFormState({ selectedTopics: topics })}
        maxSelection={3}
      />

      {/* Tier Selection */}
      <TierSelector
        selectedTier={formState.selectedTier}
        onTierChange={(tier) => updateFormState({ selectedTier: tier })}
      />

      {/* Detail Level */}
      <DetailLevelSlider
        selectedLevel={formState.detailLevel}
        onLevelChange={(level) => updateFormState({ detailLevel: level })}
      />

      {/* Advanced Options */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="maxQuestions" className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Questions
            </label>
            <input
              id="maxQuestions"
              type="number"
              min="1"
              max="20"
              value={formState.maxQuestions}
              onChange={(e) => updateFormState({ maxQuestions: parseInt(e.target.value) || 5 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              disabled={isGenerating}
            />
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                id="includeAnswers"
                type="checkbox"
                checked={formState.includeAnswers}
                onChange={(e) => updateFormState({ includeAnswers: e.target.checked })}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                disabled={isGenerating}
              />
              <label htmlFor="includeAnswers" className="ml-2 text-sm text-gray-700">
                Include answers
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="includeWorking"
                type="checkbox"
                checked={formState.includeWorking}
                onChange={(e) => updateFormState({ includeWorking: e.target.checked })}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                disabled={isGenerating}
              />
              <label htmlFor="includeWorking" className="ml-2 text-sm text-gray-700">
                Include step-by-step working
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-red-400 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-red-800">Please fix the following:</h4>
              <ul className="mt-1 text-sm text-red-700 list-disc list-inside">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Generate Button */}
      <div className="flex justify-center">
        <button
          type="submit"
          disabled={isGenerating}
          onClick={() => {
            console.log('🎯 User clicked generate button');
            setUserInitiatedGeneration(true);
          }}
          className={`
            px-12 py-4 rounded-xl font-semibold text-white transition-all duration-200 shadow-lg
            ${isGenerating
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transform hover:scale-105'
            }
          `}
        >
          {isGenerating ? (
            <div className="flex items-center space-x-3">
              <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Generating...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="text-lg">Generate</span>
            </div>
          )}
        </button>
      </div>
    </form>
  );
};

export default GenerationForm;