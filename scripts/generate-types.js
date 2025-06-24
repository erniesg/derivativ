#!/usr/bin/env node

/**
 * Automatically generate TypeScript types from FastAPI OpenAPI schema
 * Run: npm run generate-types
 */

import fs from 'fs';
import https from 'https';

const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:8000';

async function generateTypes() {
  console.log('🔄 Fetching OpenAPI schema from backend...');
  
  try {
    // Fetch OpenAPI schema from FastAPI
    const response = await fetch(`${API_BASE_URL}/openapi.json`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Backend not available`);
    }
    
    const schema = await response.json();
    
    // Extract component schemas (Pydantic models)
    const components = schema.components?.schemas || {};
    
    let tsTypes = `// 🤖 AUTO-GENERATED from backend Pydantic models
// DO NOT EDIT - Run 'npm run generate-types' to update
// Source: ${API_BASE_URL}/openapi.json

`;

    // Generate TypeScript interfaces from JSON Schema
    for (const [name, definition] of Object.entries(components)) {
      if (definition.type === 'object' && definition.properties) {
        tsTypes += generateInterface(name, definition);
      } else if (definition.enum) {
        tsTypes += generateEnum(name, definition);
      }
    }

    // Add TopicName enum (always needed by frontend, not in backend OpenAPI)
    tsTypes += `
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

// Utility types for API integration
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type GenerationState = 'idle' | 'loading' | 'success' | 'error';
`;

    // Write to file
    fs.writeFileSync('./src/types/api.ts', tsTypes);
    console.log('✅ Generated TypeScript types: src/types/api.ts');
    
  } catch (error) {
    console.warn('⚠️ Backend not available:', error.message);
    console.log('📁 Using fallback types...');
    
    // Generate fallback types when backend is not available
    const fallbackTypes = generateFallbackTypes();
    fs.writeFileSync('./src/types/api.ts', fallbackTypes);
    console.log('✅ Generated fallback TypeScript types: src/types/api.ts');
  }
}

function generateInterface(name, definition) {
  const properties = definition.properties || {};
  const required = definition.required || [];
  
  let interfaceStr = `export interface ${name} {\n`;
  
  for (const [propName, propDef] of Object.entries(properties)) {
    const isRequired = required.includes(propName);
    const optional = isRequired ? '' : '?';
    const tsType = jsonSchemaToTypeScript(propDef);
    
    interfaceStr += `  ${propName}${optional}: ${tsType};\n`;
  }
  
  interfaceStr += '}\n\n';
  return interfaceStr;
}

function generateEnum(name, definition) {
  let enumStr = `export enum ${name} {\n`;
  
  for (const value of definition.enum) {
    const key = value.toUpperCase().replace(/[^A-Z0-9]/g, '_');
    enumStr += `  ${key} = '${value}',\n`;
  }
  
  enumStr += '}\n\n';
  return enumStr;
}

function jsonSchemaToTypeScript(schema) {
  if (schema.type === 'string') {
    return schema.enum ? `'${schema.enum.join("' | '")}'` : 'string';
  }
  if (schema.type === 'number' || schema.type === 'integer') return 'number';
  if (schema.type === 'boolean') return 'boolean';
  if (schema.type === 'array') {
    const itemType = jsonSchemaToTypeScript(schema.items);
    return `${itemType}[]`;
  }
  if (schema.type === 'object') return 'Record<string, any>';
  if (schema.$ref) {
    return schema.$ref.split('/').pop(); // Extract type name from $ref
  }
  return 'any';
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateTypes();
}

function generateFallbackTypes() {
  return `// 🔄 FALLBACK TYPES - Backend not available during build
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
`;
}

export { generateTypes };