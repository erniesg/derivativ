import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TopicScore {
  topic: string;
  score: number;
  attempts: number;
  recentPerformance: number[];
  difficulty: 'easy' | 'medium' | 'hard';
}

interface AssessmentData {
  userId: string;
  topicScores: TopicScore[];
  overallLevel: number;
  recommendedTopics: string[];
  lastAssessment: Date;
}

interface AssessmentContextType {
  assessmentData: AssessmentData | null;
  setAssessmentData: (data: AssessmentData) => void;
  updateTopicScore: (topic: string, score: number, difficulty: 'easy' | 'medium' | 'hard') => void;
  getAdaptiveQuestions: (topic?: string) => { easyRatio: number; mediumRatio: number; hardRatio: number; adaptedFor: string };
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export const AssessmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);

  const updateTopicScore = (topic: string, score: number, difficulty: 'easy' | 'medium' | 'hard') => {
    if (!assessmentData) return;

    const updatedScores = assessmentData.topicScores.map(topicScore => {
      if (topicScore.topic === topic) {
        const newRecentPerformance = [...topicScore.recentPerformance, score].slice(-5);
        const weightedScore = calculateSMAScore(newRecentPerformance, difficulty);
        
        return {
          ...topicScore,
          score: weightedScore,
          attempts: topicScore.attempts + 1,
          recentPerformance: newRecentPerformance,
        };
      }
      return topicScore;
    });

    setAssessmentData({
      ...assessmentData,
      topicScores: updatedScores,
      lastAssessment: new Date(),
    });
  };

  const calculateSMAScore = (performances: number[], difficulty: 'easy' | 'medium' | 'hard') => {
    const difficultyWeights = { easy: 1, medium: 1.5, hard: 2 };
    const timeWeights = performances.map((_, index) => Math.pow(1.2, index));
    
    const weightedSum = performances.reduce((sum, perf, index) => 
      sum + (perf * timeWeights[index] * difficultyWeights[difficulty]), 0);
    const totalWeight = timeWeights.reduce((sum, weight) => sum + weight, 0) * difficultyWeights[difficulty];
    
    return Math.round((weightedSum / totalWeight) * 10) / 10;
  };

  const getAdaptiveQuestions = (topic?: string) => {
    if (!assessmentData) return { easyRatio: 0.5, mediumRatio: 0.3, hardRatio: 0.2, adaptedFor: 'unknown' };
    
    const topicData = topic ? 
      assessmentData.topicScores.find(t => t.topic === topic) : 
      assessmentData.topicScores[0];
    
    if (!topicData) return { easyRatio: 0.5, mediumRatio: 0.3, hardRatio: 0.2, adaptedFor: 'unknown' };

    const score = topicData.score;
    let easyRatio = 0.5, mediumRatio = 0.3, hardRatio = 0.2;
    
    if (score < 4) {
      easyRatio = 0.7; mediumRatio = 0.25; hardRatio = 0.05;
    } else if (score < 7) {
      easyRatio = 0.4; mediumRatio = 0.4; hardRatio = 0.2;
    } else {
      easyRatio = 0.2; mediumRatio = 0.3; hardRatio = 0.5;
    }

    return { easyRatio, mediumRatio, hardRatio, adaptedFor: topicData.topic };
  };

  return (
    <AssessmentContext.Provider value={{
      assessmentData,
      setAssessmentData,
      updateTopicScore,
      getAdaptiveQuestions
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