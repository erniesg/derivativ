import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TopicsPerformance {
  currentGrade: number;
  topicName: string;
  totalAttempts: number;
  trend: string;
  wmaGrade: number;
}

interface AssessmentData {
  averageScore: number;
  recentQuizzes: any[];
  strongestTopics: any[];
  totalQuizzes: number;
  weakestTopics: any[];
  topicsPerformance: TopicsPerformance[];
}

interface AssessmentContextType {
  assessmentData: AssessmentData | null;
  setAssessmentData: (data: AssessmentData) => void;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export const AssessmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);

  return (
    <AssessmentContext.Provider value={{
      assessmentData,
      setAssessmentData,
    }}>
      {children}
    </AssessmentContext.Provider>
  );
};

export const useAssessment = () => {
  const context = useContext(AssessmentContext);
  if (context === undefined) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
};