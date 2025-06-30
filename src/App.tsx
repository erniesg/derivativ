import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthContextProvider } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';
import { AssessmentProvider } from './contexts/AssessmentContext';
import { RoleProvider } from './contexts/RoleContext';
import { AuthCallback } from './components/auth/AuthCallback';
import { getFeatureFlag } from './config/featureFlags';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Practice from './pages/Practice';
import Learn from './pages/Learn';
import Assessment from './pages/Assessment';
import TeacherDashboard from './pages/TeacherDashboard';
import TeacherGenerationPage from './pages/TeacherGenerationPage';
import About from './pages/About';
import NotFound from './pages/NotFound';

function App() {
  return (
    <RoleProvider>
      <AuthContextProvider>
        <UserProvider>
          <AssessmentProvider>
            <Router>
              <Layout>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/landing" element={<LandingPage />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/practice" element={<Practice />} />
                  {getFeatureFlag('LEARN_PAGE') && (
                    <Route path="/learn" element={<Learn />} />
                  )}
                  <Route path="/assessment" element={<Assessment />} />
                  <Route path="/teacher" element={<TeacherDashboard />} />
                  <Route path="/teacher/generate" element={<TeacherGenerationPage />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  {/* Catch-all route for 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </Router>
          </AssessmentProvider>
        </UserProvider>
      </AuthContextProvider>
    </RoleProvider>
  );
}

export default App;