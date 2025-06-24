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

    // Add utility types
    tsTypes += `
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
    console.error('❌ Failed to generate types:', error.message);
    process.exit(1);
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

export { generateTypes };