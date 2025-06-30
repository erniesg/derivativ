import React, { useState } from 'react';
import { 
  DocumentGenerationResult, 
  GenerationState 
} from '../types/api';
import RichMaterialGenerator from '../components/igcse/RichMaterialGenerator';

const TeacherGenerationPage: React.FC = () => {
  // Handler for rich material generation
  const handleRichMaterialGenerated = (result: DocumentGenerationResult) => {
    console.log('Material generated:', result);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Generate IGCSE Math Materials</h1>
              <p className="text-lg text-gray-600 mt-2">
                Create worksheets, notes, and assessments tailored to Cambridge IGCSE Mathematics curriculum
              </p>
            </div>
            
          </div>
        </div>

        <div className="w-full">
          <RichMaterialGenerator
            onMaterialGenerated={handleRichMaterialGenerated}
            showValidation={true}
          />
        </div>

      </div>
    </div>
  );
};

export default TeacherGenerationPage;