import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import { AssessmentProvider } from './contexts/AssessmentContext';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Practice from './pages/Practice';
import Learn from './pages/Learn';
import Assessment from './pages/Assessment';
import TeacherDashboard from './pages/TeacherDashboard';
import About from './pages/About';

function App() {
  return (
    <UserProvider>
      <AssessmentProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/practice" element={<Practice />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/assessment" element={<Assessment />} />
              <Route path="/teacher" element={<TeacherDashboard />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </div>
        </Router>
      </AssessmentProvider>
    </UserProvider>
  );
}

export default App;