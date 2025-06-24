// 🤖 AUTO-GENERATED from backend Pydantic models
// DO NOT EDIT - Run 'npm run generate-types' to update
// Source: http://localhost:8000/openapi.json

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

export interface ContentSection {
  section_id?: string;
  title: string;
  content_type: string;
  content_data?: Record<string, any>;
  order_index: number;
  subsections?: ContentSection[];
}

export enum DetailLevel {
  MINIMAL = 'minimal',
  MEDIUM = 'medium',
  COMPREHENSIVE = 'comprehensive',
  GUIDED = 'guided',
}

export interface DocumentGenerationRequest {
  document_type: DocumentType;
  detail_level: DetailLevel;
  title: string;
  topic: string;
  tier?: Tier;
  grade_level?: any;
  subject_content_refs?: SubjectContentReference[];
  question_references?: QuestionReference[];
  auto_include_questions?: boolean;
  max_questions?: number;
  template_id?: any;
  custom_sections?: string[];
  exclude_content_types?: string[];
  custom_instructions?: any;
  personalization_context?: Record<string, any>;
  include_answers?: boolean;
  include_working?: boolean;
  include_mark_schemes?: boolean;
}

export interface DocumentGenerationResult {
  success: boolean;
  document?: any;
  error_message?: any;
  processing_time: number;
  questions_processed?: number;
  sections_generated?: number;
  customizations_applied?: number;
  personalization_success?: boolean;
  agent_results?: Record<string, any>[];
  reasoning_steps?: Record<string, any>[];
}

export interface DocumentTemplate {
  template_id?: string;
  name: string;
  document_type: DocumentType;
  supported_detail_levels?: DetailLevel[];
  structure_patterns: Record<string, any>;
  content_rules?: Record<string, any>;
}

export enum DocumentType {
  WORKSHEET = 'worksheet',
  NOTES = 'notes',
  TEXTBOOK = 'textbook',
  SLIDES = 'slides',
}

export enum ExportFormat {
  HTML = 'html',
  PDF = 'pdf',
  DOCX = 'docx',
  MARKDOWN = 'markdown',
  LATEX = 'latex',
  PPTX = 'pptx',
}

export interface ExportRequest {
  document_id: string;
  format: ExportFormat;
  include_metadata?: boolean;
  custom_styling?: any;
  export_personalization?: any;
}

export interface ExportResult {
  success: boolean;
  file_path?: any;
  file_size?: any;
  error_message?: any;
  export_time: number;
  applied_personalizations?: string[];
}

export interface GeneratedDocument {
  document_id?: string;
  title: string;
  document_type: DocumentType;
  detail_level: DetailLevel;
  generated_at: string;
  template_used: string;
  generation_request: DocumentGenerationRequest;
  sections: ContentSection[];
  total_questions?: number;
  estimated_duration?: any;
  questions_used?: string[];
  syllabus_coverage?: SubjectContentReference[];
  applied_customizations?: Record<string, any>;
  content_html?: any;
  content_latex?: any;
  content_markdown?: any;
}

export interface GenerationRequest {
  topic: string;
  tier?: Tier;
  grade_level?: any;
  marks?: number;
  count?: number;
  calculator_policy?: CalculatorPolicy;
  subject_content_refs?: any;
  command_word?: any;
  cognitive_level?: any;
  include_diagrams?: boolean;
  llm_model?: LLMModel;
  temperature?: number;
  max_retries?: number;
}

export interface GenerationResponse {
  session_id: string;
  questions: Record<string, any>[];
  status: string;
  agent_results: Record<string, any>[];
}

export enum GenerationStatus {
  CANDIDATE = 'candidate',
  HUMAN_REVIEWED_ACCEPTED = 'human_reviewed_accepted',
  HUMAN_REVIEWED_REJECTED = 'human_reviewed_rejected',
  LLM_REVIEWED_NEEDS_HUMAN = 'llm_reviewed_needs_human',
  AUTO_REJECTED = 'auto_rejected',
}

export interface HTTPValidationError {
  detail?: ValidationError[];
}

export enum LLMModel {
  GPT_4O = 'gpt-4o',
  GPT_4O_MINI = 'gpt-4o-mini',
  CLAUDE_3_5_SONNET_20241022 = 'claude-3-5-sonnet-20241022',
  CLAUDE_3_5_HAIKU_20241022 = 'claude-3-5-haiku-20241022',
  GEMINI_PRO = 'gemini-pro',
  GEMINI_1_5_FLASH = 'gemini-1.5-flash',
}

export interface QuestionListResponse {
  questions: Record<string, any>[];
  pagination: Record<string, any>;
}

export interface QuestionReference {
  question_id: string;
  include_solution?: boolean;
  include_marking?: boolean;
  context_note?: any;
  order_index: number;
}

export interface SessionListResponse {
  sessions: Record<string, any>[];
  pagination: Record<string, any>;
}

export enum SubjectContentReference {
  C1_1 = 'C1.1',
  C1_2 = 'C1.2',
  C1_3 = 'C1.3',
  C1_4 = 'C1.4',
  C1_5 = 'C1.5',
  C1_6 = 'C1.6',
  C1_7 = 'C1.7',
  C1_8 = 'C1.8',
  C1_9 = 'C1.9',
  C1_10 = 'C1.10',
  C1_11 = 'C1.11',
  C1_12 = 'C1.12',
  C1_13 = 'C1.13',
  C1_14 = 'C1.14',
  C1_15 = 'C1.15',
  C1_16 = 'C1.16',
  C2_1 = 'C2.1',
  C2_2 = 'C2.2',
  C2_4 = 'C2.4',
  C2_5 = 'C2.5',
  C2_6 = 'C2.6',
  C2_7 = 'C2.7',
  C2_9 = 'C2.9',
  C2_10 = 'C2.10',
  C2_11 = 'C2.11',
  C3_1 = 'C3.1',
  C3_2 = 'C3.2',
  C3_3 = 'C3.3',
  C3_5 = 'C3.5',
  C3_6 = 'C3.6',
  C4_1 = 'C4.1',
  C4_2 = 'C4.2',
  C4_3 = 'C4.3',
  C4_4 = 'C4.4',
  C4_5 = 'C4.5',
  C4_6 = 'C4.6',
  C4_7 = 'C4.7',
  C5_1 = 'C5.1',
  C5_2 = 'C5.2',
  C5_3 = 'C5.3',
  C5_4 = 'C5.4',
  C5_5 = 'C5.5',
  C6_1 = 'C6.1',
  C6_2 = 'C6.2',
  C7_1 = 'C7.1',
  C8_1 = 'C8.1',
  C8_2 = 'C8.2',
  C8_3 = 'C8.3',
  C9_1 = 'C9.1',
  C9_2 = 'C9.2',
  C9_3 = 'C9.3',
  C9_4 = 'C9.4',
  C9_5 = 'C9.5',
  E1_1 = 'E1.1',
  E1_2 = 'E1.2',
  E1_3 = 'E1.3',
  E1_4 = 'E1.4',
  E1_5 = 'E1.5',
  E1_6 = 'E1.6',
  E1_7 = 'E1.7',
  E1_8 = 'E1.8',
  E1_9 = 'E1.9',
  E1_10 = 'E1.10',
  E1_11 = 'E1.11',
  E1_12 = 'E1.12',
  E1_13 = 'E1.13',
  E1_14 = 'E1.14',
  E1_15 = 'E1.15',
  E1_16 = 'E1.16',
  E1_17 = 'E1.17',
  E1_18 = 'E1.18',
  E2_1 = 'E2.1',
  E2_2 = 'E2.2',
  E2_3 = 'E2.3',
  E2_4 = 'E2.4',
  E2_5 = 'E2.5',
  E2_6 = 'E2.6',
  E2_7 = 'E2.7',
  E2_8 = 'E2.8',
  E2_9 = 'E2.9',
  E2_10 = 'E2.10',
  E2_11 = 'E2.11',
  E2_12 = 'E2.12',
  E2_13 = 'E2.13',
  E3_1 = 'E3.1',
  E3_2 = 'E3.2',
  E3_3 = 'E3.3',
  E3_4 = 'E3.4',
  E3_5 = 'E3.5',
  E3_6 = 'E3.6',
  E3_7 = 'E3.7',
  E4_1 = 'E4.1',
  E4_2 = 'E4.2',
  E4_3 = 'E4.3',
  E4_4 = 'E4.4',
  E4_5 = 'E4.5',
  E4_6 = 'E4.6',
  E4_7 = 'E4.7',
  E4_8 = 'E4.8',
  E5_1 = 'E5.1',
  E5_2 = 'E5.2',
  E5_3 = 'E5.3',
  E5_4 = 'E5.4',
  E5_5 = 'E5.5',
  E6_1 = 'E6.1',
  E6_2 = 'E6.2',
  E6_3 = 'E6.3',
  E6_4 = 'E6.4',
  E6_5 = 'E6.5',
  E6_6 = 'E6.6',
  E7_1 = 'E7.1',
  E7_2 = 'E7.2',
  E7_3 = 'E7.3',
  E7_4 = 'E7.4',
  E8_1 = 'E8.1',
  E8_2 = 'E8.2',
  E8_3 = 'E8.3',
  E8_4 = 'E8.4',
  E9_1 = 'E9.1',
  E9_2 = 'E9.2',
  E9_3 = 'E9.3',
  E9_4 = 'E9.4',
  E9_5 = 'E9.5',
  E9_6 = 'E9.6',
  E9_7 = 'E9.7',
}

export enum Tier {
  CORE = 'Core',
  EXTENDED = 'Extended',
}

export interface ValidationError {
  loc: any[];
  msg: string;
  type: string;
}


// Utility types for API integration
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type GenerationState = 'idle' | 'loading' | 'success' | 'error';
