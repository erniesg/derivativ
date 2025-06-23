# Derivativ AI - Frontend

**React TypeScript frontend** for the Derivativ AI Cambridge IGCSE Mathematics platform.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# Opens at http://localhost:5173

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎯 Features

### ✅ **Teacher Dashboard**
- **Material Generation**: Create worksheets, notes, and assessments
- **Topic Selection**: Multi-select from 8 mathematics topics
- **Detail Level Control**: 1-10 scale slider for content depth
- **Target Level**: IGCSE, A-Level, IB, SAT support
- **Real-time Feedback**: Success/error alerts with processing times

### ✅ **Modern UI/UX**
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Professional Styling**: Clean, educational-focused interface
- **Interactive Elements**: Hover states, transitions, loading indicators
- **Accessibility**: Semantic HTML and proper ARIA labels

### ✅ **API Integration**
- **FastAPI Backend**: Full integration with Python backend
- **Error Handling**: Comprehensive error messaging
- **Type Safety**: TypeScript interfaces for all data structures
- **Request Mapping**: Frontend UI values → Backend API format

## 🏗️ Architecture

```
src/
├── components/          # Reusable UI components
│   ├── Footer.tsx      # Site footer
│   ├── Layout.tsx      # Page layout wrapper
│   └── Navigation.tsx  # Main navigation
├── contexts/           # React state management
│   ├── AssessmentContext.tsx
│   └── UserContext.tsx
├── pages/              # Application pages
│   ├── About.tsx
│   ├── Assessment.tsx
│   ├── Dashboard.tsx
│   ├── LandingPage.tsx
│   ├── Learn.tsx
│   ├── Practice.tsx
│   └── TeacherDashboard.tsx  # Main teacher interface
├── App.tsx            # Root component
└── main.tsx          # Application entry point
```

## 🔧 Technology Stack

- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Full type safety across the application
- **Vite**: Fast development server and build tool
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **Lucide React**: Modern icon library

## 📱 Pages Overview

### **Teacher Dashboard** (`/teacher`)
- **Primary Interface**: Main teacher workflow for material generation
- **API Integration**: Direct connection to backend document generation
- **Form Validation**: Client-side validation with user feedback
- **Material History**: Display of recently generated materials

### **Landing Page** (`/`)
- **Product Overview**: Introduction to Derivativ AI platform
- **Feature Highlights**: Key benefits for teachers and students
- **Call-to-Action**: Direct navigation to Teacher Dashboard

### **Other Pages**
- **About** (`/about`): Platform information and team details
- **Dashboard** (`/dashboard`): Student progress tracking (future)
- **Learn** (`/learn`): Educational content browser
- **Practice** (`/practice`): Interactive problem solving
- **Assessment** (`/assessment`): Student assessment interface

## 🔌 Backend Integration

### API Endpoints Used
```typescript
// Document Generation
POST http://localhost:8000/api/documents/generate
{
  document_type: 'worksheet' | 'notes',
  detail_level: 'minimal' | 'medium' | 'comprehensive',
  title: string,
  topic: string,
  tier: 'core',
  grade_level: number,
  auto_include_questions: boolean,
  max_questions: number,
  custom_instructions?: string,
  include_answers: boolean,
  include_working: boolean
}
```

### Data Flow
1. **User Input**: Teacher selects options in UI
2. **Data Mapping**: Frontend values → Backend API format
3. **API Call**: POST request to document generation endpoint
4. **Response Handling**: Success/error feedback to user
5. **UI Update**: Display results or error messages

## 🎨 Styling Guidelines

### **Color Palette**
- **Primary**: Green (#059669) - Success, generate buttons
- **Secondary**: Blue (#2563eb) - Info, navigation
- **Accent**: Purple (#7c3aed) - Highlights, stats
- **Neutral**: Gray scale for text and backgrounds

### **Typography**
- **Headings**: Bold, clear hierarchy
- **Body Text**: Readable sans-serif
- **Code**: Monospace for technical content

### **Components**
- **Cards**: Rounded corners, subtle shadows
- **Buttons**: Gradient backgrounds, hover effects
- **Forms**: Clean inputs with focus states
- **Navigation**: Consistent spacing and alignment

## 🧪 Development

### **Code Standards**
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality and consistency
- **Component Structure**: Functional components with hooks
- **Props Typing**: Interface definitions for all props

### **File Organization**
- **Single Responsibility**: One component per file
- **Clear Naming**: Descriptive file and variable names  
- **Import Order**: External → Internal → Relative
- **Export Pattern**: Default exports for components

### **Testing (Future)**
```bash
# Unit tests (planned)
npm run test

# E2E tests (planned)  
npm run test:e2e
```

## 📦 Build & Deployment

### **Development**
```bash
npm run dev
# Hot reload at http://localhost:5173
```

### **Production Build**
```bash
npm run build
# Optimized build in dist/

npm run preview  
# Preview production build locally
```

### **Environment Variables**
```bash
# .env.local (optional)
VITE_API_BASE_URL=http://localhost:8000
```

## 🔗 Backend Connection

### **Local Development**
1. **Start Backend**: `cd ../derivativ.ai && uvicorn src.api.main:app --port 8000`
2. **Start Frontend**: `npm run dev`  
3. **Test Integration**: Navigate to Teacher Dashboard and generate material

### **Production Deployment**
- **API Base URL**: Configure via environment variables
- **CORS Setup**: Backend configured for frontend domain
- **Build Optimization**: Vite handles bundling and minification

## 🤝 Contributing

### **Adding New Pages**
1. Create component in `src/pages/`
2. Add route in `App.tsx`
3. Update navigation in `Navigation.tsx`
4. Test responsive design

### **Styling Guidelines**
- Use Tailwind utility classes
- Follow existing color palette
- Maintain consistent spacing (rem units)
- Test on mobile devices

---

**Part of the Derivativ AI Cambridge IGCSE Mathematics Platform**

*Frontend built with modern React and TypeScript for optimal teacher experience.*