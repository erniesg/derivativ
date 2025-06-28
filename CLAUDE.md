# derivativ/ Frontend - CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with the derivativ frontend repository.

## Repository Overview

derivativ/ is the React TypeScript frontend for the Derivativ AI educational platform, serving as the primary user interface for teachers and students to interact with the Cambridge IGCSE Mathematics AI system.

## Latest Integration Status (2025-06-28)

### ✅ **Recently Added Features**
- **Authentication System**: Supabase integration with social login (Discord, GitHub, Twitter)
- **TldrawWorkArea**: Interactive drawing canvas for mathematical work
- **AuthGuard**: Protected routes with role-based access
- **DownloadManager**: Advanced material download and format selection
- **Enhanced Navigation**: User-aware navigation with authentication state

### 📊 **Current Live Deployment Status: 90% Ready**

#### **What's Working Live** ✅
- **Document Generation**: Full teacher workflow with real backend API
- **Authentication**: Supabase social login functional
- **API Integration**: Live connection to derivativ.ai backend
- **Material Export**: PDF/DOCX downloads working
- **Drawing Canvas**: Interactive TldrawWorkArea for mathematical work

#### **What's Mocked/Demo** 🎭  
- **Practice Questions**: Hardcoded questions in `src/pages/Practice.tsx` (lines 23-47)
- **Assessment Quiz**: Static questions in `src/pages/Assessment.tsx` (lines 25-71)
- **Student Progress**: Mock scoring system not connected to backend

#### **Critical Integration Gaps**

**1. Practice Page Real Question Integration** (1-2 days)
- **Current**: Uses hardcoded questions array
- **Needed**: Connect to `GET /api/questions` from derivativ.ai
- **Impact**: Students can practice with real AI-generated questions
- **Files to modify**: `src/pages/Practice.tsx`, `src/services/api.ts`

**2. Assessment Real-time Connection** (1-2 days)
- **Current**: Static quiz questions  
- **Needed**: Dynamic question loading from backend
- **Impact**: Personalized assessments based on AI generation

**3. Real-time Generation Progress** (2-3 days)
- **Current**: API calls without live updates
- **Needed**: WebSocket integration for live agent progress
- **Impact**: Teachers see multi-agent reasoning in real-time

### 🔧 **Technical Architecture**

#### **Frontend Stack**
- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** for responsive design
- **React Router DOM v6** for navigation
- **Supabase** for authentication and data
- **Tldraw** for interactive drawing canvas

#### **Component Structure**
```
src/
├── components/
│   ├── auth/           # Authentication components (LIVE)
│   ├── igcse/         # Cambridge IGCSE specific components (LIVE)
│   └── TldrawWorkArea.tsx  # Interactive drawing canvas (LIVE)
├── contexts/          # React state management (LIVE)
├── pages/             # Application routes (MIXED: some live, some mocked)
├── services/          # API integration layer (PARTIAL: document gen live, questions mocked)
└── types/            # TypeScript definitions (LIVE)
```

#### **API Integration Status**
```typescript
// LIVE: Document generation
POST /api/documents/generate ✅ Working

// LIVE: User authentication  
Supabase Auth ✅ Working

// MISSING: Question management
GET /api/questions ❌ Not connected to frontend
POST /api/questions/generate ❌ Not exposed in UI
GET /api/questions/search ❌ No search interface

// MISSING: Real-time updates
WebSocket connections ❌ No live progress updates
```

### 🎯 **Integration with derivativ.ai Backend**

#### **Working Integrations** ✅
- **Document Generation**: `src/services/api.ts` → `/api/documents/generate`
- **File Downloads**: Material download manager working
- **Error Handling**: API error states properly handled
- **Loading States**: User feedback during generation

#### **Missing Integrations** ❌
- **Question Fetching**: No connection to question generation API
- **Real-time Progress**: No WebSocket for multi-agent updates  
- **Question Search**: No interface for browsing generated questions
- **Bulk Operations**: No multi-document generation UI

### 📋 **Next Steps for Full Live Integration**

#### **Phase 1: Connect Practice to Real Questions** (Day 1-2)
```typescript
// Replace hardcoded questions in Practice.tsx with:
const fetchQuestions = async () => {
  const response = await fetch(`${API_BASE}/api/questions?topic=algebra&count=5`);
  return response.json();
};
```

#### **Phase 2: Add Question Management UI** (Day 3-4)
- Create QuestionBrowser component
- Add search and filtering interface
- Implement question selection for practice sessions

#### **Phase 3: Real-time Features** (Day 5-7)
- WebSocket integration for live generation progress
- Real-time agent reasoning display
- Live collaboration features

### 🛠️ **Development Workflow**

#### **Current Commands**
```bash
# Development server
npm run dev

# Production build  
npm run build

# Type checking
npm run generate-types

# Linting
npm run lint
```

#### **Environment Setup**
```bash
# Required for live integration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=http://localhost:8000  # derivativ.ai backend
```

### 🧪 **Testing Live Integration**

#### **Current Working Flow**
```bash
# 1. Start backend
cd ../derivativ.ai && uvicorn src.api.main:app --reload

# 2. Start frontend  
npm run dev

# 3. Test document generation
# Navigate to http://localhost:5173 → Teacher Dashboard → Generate Material
```

#### **Test Results**
- ✅ Teacher document generation workflow
- ✅ User authentication and navigation
- ✅ Material download and export
- 🎭 Practice questions (using mock data)
- 🎭 Assessment system (using mock data)

### 🎯 **Success Metrics**

#### **Current Achievement**
- **Document Generation**: ✅ 100% functional
- **Authentication**: ✅ 100% functional  
- **API Integration**: ✅ 80% complete
- **Student Experience**: 🎭 40% (using mock data)

#### **Full Integration Target**
- **Question Practice**: Real backend questions
- **Assessment System**: Dynamic question loading
- **Real-time Updates**: Live generation progress
- **Question Management**: Browse and select questions

### 🔗 **Integration Dependencies**

#### **Backend APIs Required** (from derivativ.ai)
- `GET /api/questions` - List generated questions
- `GET /api/questions/{id}` - Get specific question
- `POST /api/questions/generate` - Generate new questions
- `WebSocket /ws/generation` - Real-time progress updates

#### **Data Models Needed**
```typescript
interface Question {
  id: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  answer: string;
  hints: string[];
  created_at: string;
  quality_score: number;
}
```

### 📝 **Integration Summary**

**Current State**: Solid foundation with working document generation and authentication
**Live Features**: 90% of teacher workflow, authentication, API integration
**Mock Features**: Student practice and assessment systems  
**Time to Full Integration**: 3-5 days for complete live question integration
**Critical Blocker**: Frontend needs connection to backend question APIs

The frontend is production-ready for document generation workflows. The main gap is connecting the student practice and assessment features to the live backend question generation system instead of using hardcoded mock data.