// 🔄 FALLBACK TYPES - Backend not available during build
// These types ensure the app builds successfully when backend is offline
// Source: Static fallback definitions

export enum CalculatorPolicy {
  ALLOWED = 'allowed',
  NOT_ALLOWED = 'not_allowed',
  VARIES_BY_QUESTION = 'varies_by_question',
}

export enum CognitiveLevel {
  RECALL = 'Recall',
  PROCEDURALFLUENCY = 'ProceduralFluency',
  CONCEPTUALUNDERSTANDING = 'ConceptualUnderstanding',
  APPLICATION = 'Application',
  PROBLEMSOLVING = 'ProblemSolving',
  ANALYSIS = 'Analysis',
}

export enum CommandWord {
  CALCULATE = 'Calculate',
  CONSTRUCT = 'Construct',
  DETERMINE = 'Determine',
  DESCRIBE = 'Describe',
  EXPLAIN = 'Explain',
  FIND = 'Find',
  GIVE = 'Give',
  PLOT = 'Plot',
  SHOW__THAT_ = 'Show (that)',
  SKETCH = 'Sketch',
  STATE = 'State',
  WORK_OUT = 'Work out',
  WRITE = 'Write',
  WRITE_DOWN = 'Write down',
  SOLVE = 'Solve',
}

export enum DetailLevel {
  MINIMAL = 'minimal',
  MEDIUM = 'medium',
  COMPREHENSIVE = 'comprehensive',
  GUIDED = 'guided',
}

export enum DocumentType {
  WORKSHEET = 'worksheet',
  NOTES = 'notes',
  TEXTBOOK = 'textbook',
  SLIDES = 'slides',
}

export enum Tier {
  CORE = 'Core',
  EXTENDED = 'Extended',
}

export enum TopicName {
  NUMBER = 'Number',
  ALGEBRA_AND_GRAPHS = 'Algebra and graphs',
  COORDINATE_GEOMETRY = 'Coordinate geometry',
  GEOMETRY = 'Geometry',
  MENSURATION = 'Mensuration',
  TRIGONOMETRY = 'Trigonometry',
  TRANSFORMATIONS_AND_VECTORS = 'Transformations and vectors',
  PROBABILITY = 'Probability',
  STATISTICS = 'Statistics',
}

export interface DocumentGenerationRequest {
  document_type: DocumentType;
  detail_level: DetailLevel;
  title: string;
  topic: string;
  tier?: Tier;
  grade_level?: number;
  subject_content_refs?: string[];
  question_references?: any[];
  auto_include_questions?: boolean;
  max_questions?: number;
  template_id?: string;
  custom_sections?: string[];
  exclude_content_types?: string[];
  custom_instructions?: string;
  personalization_context?: Record<string, any>;
  include_answers?: boolean;
  include_working?: boolean;
  include_mark_schemes?: boolean;
}

export interface DocumentGenerationResult {
  success: boolean;
  document?: any;
  error_message?: string;
  processing_time: number;
  questions_processed?: number;
  sections_generated?: number;
  customizations_applied?: number;
  personalization_success?: boolean;
  agent_results?: Record<string, any>[];
  reasoning_steps?: Record<string, any>[];
}

export interface ContentSection {
  section_id?: string;
  title: string;
  content_type: string;
  content_data?: Record<string, any>;
  order_index: number;
  subsections?: ContentSection[];
}

// Utility types for API integration
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type GenerationState = 'idle' | 'loading' | 'success' | 'error';
