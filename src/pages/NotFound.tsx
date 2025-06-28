import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getFeatureFlag } from '../config/featureFlags';
import { Home, ArrowLeft, Search, Calculator, BookOpen, Target, RefreshCw } from 'lucide-react';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mathJoke, setMathJoke] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Check if user is trying to access disabled Learn page
  const isLearnPageDisabled = location.pathname === '/learn' && !getFeatureFlag('LEARN_PAGE');

  const mathJokes = [
    "404 = 4 × 101... Wait, that's not right either! 🤔",
    "We tried to solve for X, but found Y instead! 📐",
    "Error 404: Page not found. Did you try turning math off and on again? 🔄",
    "This page is like dividing by zero: undefined! ∞",
    "404 in binary is 110010100... still not found! 💾",
    "We integrated this page, but the result was a constant... disappointment! ∫",
  ];

  const quickLinks = [
    { name: 'Practice Problems', path: '/practice', icon: Calculator, color: 'blue' },
    { name: 'Auto-Assessment', path: '/assessment', icon: Target, color: 'green' },
    { name: 'About Us', path: '/about', icon: BookOpen, color: 'purple' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMathJoke((prev) => (prev + 1) % mathJokes.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [mathJokes.length]);

  const handleCalculate404 = () => {
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
      // Randomly pick a new joke
      setMathJoke(Math.floor(Math.random() * mathJokes.length));
    }, 1500);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // In a real app, you'd implement search functionality
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Animated 404 with Math Symbols */}
        <div className="mb-8 relative">
          <div className="text-8xl md:text-9xl font-bold text-gray-200 select-none">
            4
            0
            4
          </div>

          {/* Floating Math Symbols */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-4 left-1/4 text-2xl text-blue-400 animate-float">∑</div>
            <div className="absolute top-12 right-1/4 text-xl text-purple-400 animate-float-delayed">∫</div>
            <div className="absolute bottom-8 left-1/3 text-lg text-green-400 animate-float">π</div>
            <div className="absolute bottom-4 right-1/3 text-xl text-red-400 animate-float-delayed">√</div>
            <div className="absolute top-8 left-1/2 text-sm text-yellow-400 animate-float">∞</div>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {isLearnPageDisabled ? 'Learn Page Coming Soon!' : 'Oops! Page Not Found'}
        </h1>

        {/* Special message for disabled Learn page */}
        {isLearnPageDisabled && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
            <div className="text-2xl mb-2">🚧</div>
            <h2 className="text-xl font-semibold text-yellow-800 mb-2">Under Construction</h2>
            <p className="text-yellow-700 mb-4">
              The Learn page is currently being developed and will be available soon!
              In the meantime, try out our Practice problems or take an Assessment.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Link
                to="/practice"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Calculator className="w-4 h-4" />
                <span>Try Practice Instead</span>
              </Link>
              <Link
                to="/assessment"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                <Target className="w-4 h-4" />
                <span>Take Assessment</span>
              </Link>
            </div>
          </div>
        )}

        {/* Rotating Math Jokes */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-l-4 border-blue-500">
          <p className="text-lg text-gray-700 min-h-[3rem] flex items-center justify-center">
            {mathJokes[mathJoke]}
          </p>
          <button
            onClick={handleCalculate404}
            disabled={isCalculating}
            className="mt-4 inline-flex items-center space-x-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors duration-200 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isCalculating ? 'animate-spin' : ''}`} />
            <span>{isCalculating ? 'Calculating...' : 'Calculate New Joke'}</span>
          </button>
        </div>

        {/* Fun Math Equation */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Let's solve this together:</h3>
          <div className="text-2xl font-mono text-gray-700 mb-2">
            <span className="text-blue-600">f(x)</span> =
            <span className="text-green-600"> find_page(</span>
            <span className="text-red-600">your_url</span>
            <span className="text-green-600">)</span>
          </div>
          <div className="text-lg text-gray-600">
            where <span className="font-semibold">your_url</span> ∈ {"{valid_pages}"}
          </div>
          <div className="text-sm text-gray-500 mt-2">
            💡 <em>Hint: Try one of the links below to get back on track!</em>
          </div>
        </div>



        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {quickLinks.map((link) => {
            const IconComponent = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1`}
              >
                <div className={`w-12 h-12 bg-${link.color}-100 text-${link.color}-600 rounded-lg flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform duration-200`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{link.name}</h3>
                <p className="text-gray-600 text-sm">
                  {link.name === 'Practice Problems' && 'Sharpen your math skills'}
                  {link.name === 'Auto-Assessment' && 'Test your knowledge'}
                  {link.name === 'About Us' && 'Learn about Derivativ'}
                </p>
              </Link>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </button>

          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
          >
            <Home className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
        </div>

        <div className="mt-12 text-xs text-gray-400" />

      </div>


    </div>
  );
};

export default NotFound; 