import React, { useState, useRef, useEffect } from 'react';
import Navigation from '../components/Navigation';
import { Play, BookOpen, FileText, Video, ChevronRight, Clock, Star, Pen, Type, Eraser, Send, Volume2, Pause, SkipForward, MousePointer, X, Edit3 } from 'lucide-react';

interface LearningModule {
  id: string;
  title: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'video' | 'interactive' | 'notes';
  duration: string;
  description: string;
  progress: number;
  rating: number;
  videoUrl?: string;
  hasQuiz?: boolean;
  hasCanvas?: boolean;
}

interface PersonalizedVideo {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: string;
  tailoredFor: string;
}

interface TextElement {
  id: string;
  x: number;
  y: number;
  text: string;
  fontSize: number;
  color: string;
}

interface DrawingPath {
  id: string;
  path: Array<{x: number, y: number}>;
  color: string;
  width: number;
}

const Learn: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState('');
  const [workAreaMode, setWorkAreaMode] = useState<'text' | 'draw' | 'select'>('text'); // Text as default
  const [isDrawing, setIsDrawing] = useState(false);
  const [showPersonalizedVideos, setShowPersonalizedVideos] = useState(false);
  
  // Enhanced work area state
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [drawingPaths, setDrawingPaths] = useState<DrawingPath[]>([]);
  const [currentPath, setCurrentPath] = useState<Array<{x: number, y: number}>>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [selectedElementType, setSelectedElementType] = useState<'text' | 'drawing' | null>(null);
  const [isAddingText, setIsAddingText] = useState(false);
  const [textInputPosition, setTextInputPosition] = useState({ x: 0, y: 0 });
  const [currentTextInput, setCurrentTextInput] = useState('');
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);

  const topics = ['Algebra', 'Geometry', 'Trigonometry', 'Statistics', 'Number Theory'];
  
  const learningModules: LearningModule[] = [
    {
      id: '1',
      title: 'Quadratic Equations Interactive Primer',
      topic: 'Algebra',
      difficulty: 'medium',
      type: 'interactive',
      duration: '25 min',
      description: 'Learn quadratic equations through video lessons and interactive practice',
      progress: 75,
      rating: 4.8,
      videoUrl: 'https://example.com/quadratic-video',
      hasQuiz: true,
      hasCanvas: true
    },
    {
      id: '2',
      title: 'Triangle Properties Video Series',
      topic: 'Geometry',
      difficulty: 'easy',
      type: 'interactive',
      duration: '15 min',
      description: 'Interactive video primer with canvas exercises on triangle properties',
      progress: 0,
      rating: 4.9,
      videoUrl: 'https://example.com/triangle-video',
      hasQuiz: true,
      hasCanvas: true
    },
    {
      id: '3',
      title: 'Sine and Cosine Rules Notes',
      topic: 'Trigonometry',
      difficulty: 'hard',
      type: 'notes',
      duration: '30 min',
      description: 'Comprehensive study notes with worked examples',
      progress: 100,
      rating: 4.7
    },
    {
      id: '4',
      title: 'Statistical Measures Primer',
      topic: 'Statistics',
      difficulty: 'medium',
      type: 'interactive',
      duration: '20 min',
      description: 'Video-based learning with interactive quizzes and practice',
      progress: 40,
      rating: 4.6,
      videoUrl: 'https://example.com/stats-video',
      hasQuiz: true,
      hasCanvas: false
    }
  ];

  const personalizedVideos: PersonalizedVideo[] = [
    {
      id: 'p1',
      title: 'Advanced Quadratic Applications',
      description: 'Challenging problems tailored to your current algebra level',
      difficulty: 'hard',
      duration: '12 min',
      tailoredFor: 'Based on your algebra progress'
    },
    {
      id: 'p2',
      title: 'Real-world Triangle Problems',
      description: 'Engineering applications of triangle properties',
      difficulty: 'medium',
      duration: '8 min',
      tailoredFor: 'Matches your interests in practical applications'
    }
  ];

  useEffect(() => {
    redrawCanvas();
  }, [textElements, drawingPaths, selectedElementId, selectedElementType]);

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all paths
    drawingPaths.forEach(pathData => {
      if (pathData.path.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = selectedElementId === pathData.id && selectedElementType === 'drawing' 
          ? '#3B82F6' : pathData.color;
        ctx.lineWidth = selectedElementId === pathData.id && selectedElementType === 'drawing' 
          ? pathData.width + 2 : pathData.width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        ctx.moveTo(pathData.path[0].x, pathData.path[0].y);
        pathData.path.forEach(point => {
          ctx.lineTo(point.x, point.y);
        });
        ctx.stroke();
      }
    });

    // Draw all text elements
    textElements.forEach(textEl => {
      if (editingTextId !== textEl.id) {
        ctx.font = `${textEl.fontSize}px Arial`;
        ctx.fillStyle = textEl.color;
        ctx.fillText(textEl.text, textEl.x, textEl.y);
        
        // Draw selection border if selected
        if (selectedElementId === textEl.id && selectedElementType === 'text') {
          const metrics = ctx.measureText(textEl.text);
          ctx.strokeStyle = '#3B82F6';
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 5]);
          ctx.strokeRect(textEl.x - 4, textEl.y - textEl.fontSize - 2, metrics.width + 8, textEl.fontSize + 6);
          ctx.setLineDash([]);
        }
      }
    });
  };

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getCanvasCoordinates(e);

    if (workAreaMode === 'text') {
      startTextInput(x, y);
    } else if (workAreaMode === 'select') {
      selectElementAt(x, y);
    }
  };

  const startTextInput = (x: number, y: number) => {
    setIsAddingText(true);
    setTextInputPosition({ x, y });
    setCurrentTextInput('');
    setEditingTextId(null);
    setTimeout(() => {
      textInputRef.current?.focus();
    }, 0);
  };

  const selectElementAt = (x: number, y: number) => {
    // Check text elements first
    const clickedText = textElements.find(textEl => {
      const canvas = canvasRef.current;
      if (!canvas) return false;
      const ctx = canvas.getContext('2d');
      if (!ctx) return false;
      
      ctx.font = `${textEl.fontSize}px Arial`;
      const metrics = ctx.measureText(textEl.text);
      
      return x >= textEl.x - 4 && x <= textEl.x + metrics.width + 4 &&
             y >= textEl.y - textEl.fontSize - 2 && y <= textEl.y + 4;
    });

    if (clickedText) {
      setSelectedElementId(clickedText.id);
      setSelectedElementType('text');
      return;
    }

    // Check drawing paths
    const clickedPath = drawingPaths.find(pathData => {
      return pathData.path.some(point => {
        const distance = Math.sqrt(Math.pow(x - point.x, 2) + Math.pow(y - point.y, 2));
        return distance <= pathData.width + 5; // 5px tolerance
      });
    });

    if (clickedPath) {
      setSelectedElementId(clickedPath.id);
      setSelectedElementType('drawing');
    } else {
      setSelectedElementId(null);
      setSelectedElementType(null);
    }
  };

  const handleTextInputSubmit = () => {
    if (currentTextInput.trim()) {
      if (editingTextId) {
        // Update existing text
        setTextElements(prev => prev.map(el => 
          el.id === editingTextId 
            ? { ...el, text: currentTextInput }
            : el
        ));
        setEditingTextId(null);
      } else {
        // Add new text
        const newTextElement: TextElement = {
          id: Date.now().toString(),
          x: textInputPosition.x,
          y: textInputPosition.y,
          text: currentTextInput,
          fontSize: 16,
          color: '#374151'
        };
        setTextElements(prev => [...prev, newTextElement]);
      }
    }
    
    setIsAddingText(false);
    setCurrentTextInput('');
  };

  const handleTextInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTextInputSubmit();
    } else if (e.key === 'Escape') {
      setIsAddingText(false);
      setCurrentTextInput('');
      setEditingTextId(null);
    }
  };

  const editSelectedText = () => {
    if (selectedElementId && selectedElementType === 'text') {
      const textElement = textElements.find(el => el.id === selectedElementId);
      if (textElement) {
        setEditingTextId(textElement.id);
        setCurrentTextInput(textElement.text);
        setTextInputPosition({ x: textElement.x, y: textElement.y });
        setIsAddingText(true);
        setTimeout(() => {
          textInputRef.current?.focus();
        }, 0);
      }
    }
  };

  const deleteSelected = () => {
    if (selectedElementId) {
      if (selectedElementType === 'text') {
        setTextElements(prev => prev.filter(el => el.id !== selectedElementId));
      } else if (selectedElementType === 'drawing') {
        setDrawingPaths(prev => prev.filter(path => path.id !== selectedElementId));
      }
      setSelectedElementId(null);
      setSelectedElementType(null);
    }
  };

  const filteredModules = learningModules.filter(module => {
    const topicMatch = selectedTopic === 'all' || module.topic === selectedTopic;
    const typeMatch = selectedType === 'all' || module.type === selectedType;
    return topicMatch && typeMatch;
  });

  const startModule = (moduleId: string) => {
    setActiveModule(moduleId);
    setVideoProgress(0);
    setIsVideoPlaying(false);
    setQuizAnswer('');
    clearWorkArea();
  };

  const closeModule = () => {
    setActiveModule(null);
    setIsVideoPlaying(false);
    setShowPersonalizedVideos(false);
  };

  const toggleVideo = () => {
    setIsVideoPlaying(!isVideoPlaying);
    if (!isVideoPlaying) {
      const interval = setInterval(() => {
        setVideoProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setShowPersonalizedVideos(true);
            return 100;
          }
          return prev + 2;
        });
      }, 200);
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (workAreaMode !== 'draw') return;
    
    const { x, y } = getCanvasCoordinates(e);
    setIsDrawing(true);
    setCurrentPath([{ x, y }]);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || workAreaMode !== 'draw') return;

    const { x, y } = getCanvasCoordinates(e);
    setCurrentPath(prev => [...prev, { x, y }]);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    
    if (currentPath.length > 0) {
      const lastPoint = currentPath[currentPath.length - 1];
      ctx.beginPath();
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    if (isDrawing && currentPath.length > 1) {
      const newPath: DrawingPath = {
        id: Date.now().toString(),
        path: currentPath,
        color: '#374151',
        width: 2
      };
      setDrawingPaths(prev => [...prev, newPath]);
    }
    
    setIsDrawing(false);
    setCurrentPath([]);
  };

  const clearWorkArea = () => {
    setTextElements([]);
    setDrawingPaths([]);
    setSelectedElementId(null);
    setSelectedElementType(null);
    setIsAddingText(false);
    setEditingTextId(null);
    redrawCanvas();
  };

  const getCursorStyle = () => {
    switch (workAreaMode) {
      case 'text': return 'cursor-text';
      case 'draw': return 'cursor-crosshair';
      case 'select': return 'cursor-pointer';
      default: return 'cursor-default';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video size={16} />;
      case 'interactive': return <Play size={16} />;
      case 'notes': return <FileText size={16} />;
      default: return <BookOpen size={16} />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const activeModuleData = learningModules.find(m => m.id === activeModule);

  if (activeModule && activeModuleData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{activeModuleData.title}</h1>
              <p className="text-gray-600">{activeModuleData.description}</p>
            </div>
            <button
              onClick={closeModule}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ← Back to Learning
            </button>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="aspect-video bg-gray-900 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={toggleVideo}
                      className="w-16 h-16 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                    >
                      {isVideoPlaying ? <Pause className="w-8 h-8 text-white" /> : <Play className="w-8 h-8 text-white ml-1" />}
                    </button>
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-white text-sm">{Math.round(videoProgress)}%</span>
                      <div className="flex-1 bg-white/20 rounded-full h-1">
                        <div 
                          className="bg-blue-500 h-1 rounded-full transition-all duration-200"
                          style={{ width: `${videoProgress}%` }}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Volume2 className="w-4 h-4 text-white" />
                        <SkipForward className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {activeModuleData.hasQuiz && videoProgress > 50 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Check</h3>
                  <p className="text-gray-700 mb-4">
                    What is the discriminant of the quadratic equation x² - 4x + 3 = 0?
                  </p>
                  <div className="space-y-2 mb-4">
                    {['4', '16', '1', '-8'].map((option, index) => (
                      <button
                        key={index}
                        onClick={() => setQuizAnswer(option)}
                        className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                          quizAnswer === option
                            ? 'border-blue-500 bg-blue-50 text-blue-900'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  <button
                    disabled={!quizAnswer}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      quizAnswer
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Submit Answer
                  </button>
                </div>
              )}

              {showPersonalizedVideos && (
                <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl p-6 text-white">
                  <h3 className="text-lg font-semibold mb-2">Personalized for You</h3>
                  <p className="text-purple-100 mb-4">Based on your progress, here are some tailored challenges:</p>
                  
                  <div className="space-y-3">
                    {personalizedVideos.map((video) => (
                      <div key={video.id} className="bg-white/10 rounded-lg p-4 hover:bg-white/20 transition-colors cursor-pointer">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{video.title}</h4>
                          <span className="text-sm">{video.duration}</span>
                        </div>
                        <p className="text-sm text-purple-100 mb-2">{video.description}</p>
                        <p className="text-xs text-purple-200">{video.tailoredFor}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {activeModuleData.hasCanvas && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Practice Area</h3>
                  <div className="flex items-center space-x-2">
                    <div className="flex bg-gray-100 rounded-lg p-1">
                      <button
                        onClick={() => setWorkAreaMode('text')}
                        className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                          workAreaMode === 'text'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-600 hover:text-gray-800'
                        }`}
                      >
                        <Type size={14} />
                        <span>Text</span>
                      </button>
                      <button
                        onClick={() => setWorkAreaMode('draw')}
                        className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                          workAreaMode === 'draw'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-600 hover:text-gray-800'
                        }`}
                      >
                        <Pen size={14} />
                        <span>Draw</span>
                      </button>
                      <button
                        onClick={() => setWorkAreaMode('select')}
                        className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                          workAreaMode === 'select'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-600 hover:text-gray-800'
                        }`}
                      >
                        <MousePointer size={14} />
                        <span>Select</span>
                      </button>
                    </div>
                    
                    {selectedElementId && selectedElementType === 'text' && (
                      <button
                        onClick={editSelectedText}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit3 size={18} />
                      </button>
                    )}
                    
                    {selectedElementId && (
                      <button
                        onClick={deleteSelected}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X size={18} />
                      </button>
                    )}
                    
                    <button
                      onClick={clearWorkArea}
                      className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Eraser size={18} />
                    </button>
                  </div>
                </div>

                <div className="relative border-2 border-dashed border-gray-300 rounded-lg">
                  <canvas
                    ref={canvasRef}
                    width={400}
                    height={300}
                    className={`w-full h-64 border border-gray-200 rounded-lg bg-white ${getCursorStyle()}`}
                    onClick={handleCanvasClick}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                  />
                  
                  {isAddingText && (
                    <input
                      ref={textInputRef}
                      type="text"
                      value={currentTextInput}
                      onChange={(e) => setCurrentTextInput(e.target.value)}
                      onKeyDown={handleTextInputKeyDown}
                      onBlur={handleTextInputSubmit}
                      className="absolute bg-white border-2 border-blue-500 rounded px-2 py-1 text-gray-700 font-sans shadow-lg"
                      style={{
                        left: `${(textInputPosition.x / 400) * 100}%`,
                        top: `${((textInputPosition.y - 20) / 300) * 100}%`,
                        fontSize: '16px',
                        minWidth: '120px',
                        zIndex: 10
                      }}
                      placeholder="Type here..."
                    />
                  )}
                </div>

                <div className="mt-4 space-y-2">
                  <div className="text-sm text-gray-500">
                    {workAreaMode === 'text' && (
                      <p className="flex items-center">
                        <Type size={14} className="mr-2 text-blue-500" />
                        <strong>Text mode:</strong> Click anywhere to add text
                      </p>
                    )}
                    {workAreaMode === 'draw' && (
                      <p className="flex items-center">
                        <Pen size={14} className="mr-2 text-green-500" />
                        <strong>Draw mode:</strong> Click and drag to draw
                      </p>
                    )}
                    {workAreaMode === 'select' && (
                      <p className="flex items-center">
                        <MousePointer size={14} className="mr-2 text-purple-500" />
                        <strong>Select mode:</strong> Click on elements to select
                      </p>
                    )}
                  </div>
                  
                  {selectedElementId && (
                    <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
                      {selectedElementType === 'text' ? 'Text selected' : 'Drawing selected'}
                    </div>
                  )}
                </div>

                <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  <Send size={16} className="inline mr-2" />
                  Submit Work
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Interactive Learning</h1>
          <p className="text-gray-600">
            Choose from personalized video content, interactive primers, and comprehensive notes
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Topics</option>
                {topics.map(topic => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Types</option>
                <option value="video">Video Lessons</option>
                <option value="interactive">Interactive Primers</option>
                <option value="notes">Study Notes</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((module) => (
            <div
              key={module.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 overflow-hidden group cursor-pointer"
            >
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className={`p-2 rounded-lg ${module.type === 'video' ? 'bg-red-100 text-red-600' : 
                                                    module.type === 'interactive' ? 'bg-blue-100 text-blue-600' : 
                                                    'bg-green-100 text-green-600'}`}>
                      {getTypeIcon(module.type)}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(module.difficulty)}`}>
                      {module.difficulty.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">{module.topic}</span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {module.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {module.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Clock size={14} />
                      <span>{module.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star size={14} className="text-yellow-500" />
                      <span>{module.rating}</span>
                    </div>
                  </div>
                </div>

                {module.progress > 0 && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{module.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${module.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {module.type === 'interactive' && (
                  <div className="flex items-center space-x-2 mb-4">
                    {module.hasQuiz && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                        Interactive Quiz
                      </span>
                    )}
                    {module.hasCanvas && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        Canvas Practice
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <button 
                  onClick={() => startModule(module.id)}
                  className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  <span>{module.progress === 100 ? 'Review' : module.progress > 0 ? 'Continue' : 'Start'}</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-2">Personalized for You</h2>
          <p className="text-blue-100 mb-6">
            Based on your assessment results, we recommend focusing on these areas to improve your weakest topics.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="font-semibold mb-1">Focus Area: Algebra</h3>
              <p className="text-sm text-blue-100">Your current score: 4/10</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="font-semibold mb-1">Recommended: Interactive Primers</h3>
              <p className="text-sm text-blue-100">Video + practice combination works best for you</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="font-semibold mb-1">Study Time: 30 min/day</h3>
              <p className="text-sm text-blue-100">Optimal for your schedule</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Learn;