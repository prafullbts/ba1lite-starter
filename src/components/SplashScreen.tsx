import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCalc } from '../contexts/CalcContext';
import { PillBottleAnimation } from './PillBottleAnimation';
import btsLogo from '@/assets/bts-logo.png';
import { TEAM_ENTRY } from '@/Sim/Content';

export const SplashScreen = () => {
  const { isLoading, error, isInitialized, reinitialize } = useCalc();
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing calculation model...');
  const [isRetrying, setIsRetrying] = useState(false);
  const [isStuck, setIsStuck] = useState(false);
  const navigate = useNavigate();
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    if (isLoading) {
      // Detect if loading is stuck (more than 30 seconds)
      const stuckTimeout = setTimeout(() => {
        setIsStuck(true);
      }, 30000);

      // Simulate progress updates
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 10;
        });
      }, 200);

      // Update loading text based on progress
      const textInterval = setInterval(() => {
        setProgress(current => {
          if (current < 30) {
            setLoadingText('Loading model files...');
          } else if (current < 60) {
            setLoadingText('Initializing calculation engine...');
          } else if (current < 90) {
            setLoadingText('Setting up formulas...');
          } else {
            setLoadingText('Almost ready...');
          }
          return current;
        });
      }, 500);

      return () => {
        clearTimeout(stuckTimeout);
        clearInterval(interval);
        clearInterval(textInterval);
      };
    } else if (isInitialized) {
      setProgress(100);
      setLoadingText('Ready!');
      setIsStuck(false);
      
      // Calculate elapsed time since component mount
      const elapsedTime = Date.now() - startTimeRef.current;
      const minimumDisplayTime = 3000; // 3 seconds TOTAL
      const smoothUxDelay = 1000; // Minimum delay for smooth "Ready!" state
      
      // Calculate delay: ensure at least minimumDisplayTime total,
      // but never less than smoothUxDelay
      const totalDelay = Math.max(smoothUxDelay, minimumDisplayTime - elapsedTime);
      
      // Redirect to main app after calculated delay
      setTimeout(() => {
        navigate('/', { replace: true });
      }, totalDelay);
    }
  }, [isLoading, isInitialized, navigate]);

  if (error) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-[#F5F1E8] flex items-center justify-center">
        {/* Decorative Arcs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -left-20 w-80 h-80 border-[12px] border-[#E4007C] rounded-full opacity-30"></div>
          <div className="absolute -bottom-20 -right-20 w-80 h-80 border-[12px] border-[#F68D2E] rounded-full opacity-30"></div>
        </div>
        
        {/* BTS Logo */}
        <div className="absolute top-8 left-8 z-20">
          <img src={btsLogo} alt="BTS Logo" className="h-8 w-auto object-contain opacity-90" />
        </div>
        
        {/* White Card for Error Visibility */}
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4 relative z-10">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-[#333333] mb-2">Initialization Failed</h2>
            <p className="text-[#333333]/70 mb-6">{error}</p>
            <button 
              onClick={async () => {
                setIsRetrying(true);
                try {
                  await reinitialize();
                } catch (err) {
                  console.error('Retry failed:', err);
                } finally {
                  setIsRetrying(false);
                }
              }}
              disabled={isRetrying}
              className="bg-gradient-to-r from-[#E4007C] to-[#F68D2E] text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRetrying ? 'Retrying...' : 'Retry'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#F5F1E8] flex items-center justify-center">
      {/* Decorative Arcs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 border-[12px] border-[#E4007C] rounded-full opacity-30"></div>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 border-[12px] border-[#F68D2E] rounded-full opacity-30"></div>
      </div>
      
      {/* BTS Logo */}
      <div className="absolute top-8 left-8 z-20">
        <img src={btsLogo} alt="BTS Logo" className="h-8 w-auto object-contain opacity-90" />
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 text-center px-8 max-w-5xl mx-auto">
        {/* Animated Pill Bottle */}
        <div className="mb-8 mt-12 animate-fade-in scale-90 md:scale-100" style={{ animationDelay: '0.1s' }}>
          <PillBottleAnimation />
        </div>
        
        {/* Main Heading */}
        <div className="mb-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif text-[#333333] mb-6 tracking-wide">
            {TEAM_ENTRY.PAGE_TITLE}
          </h1>
        </div>
        
        {/* Functional Section - Progress Bar and Loading Logic */}
        <div className="animate-fade-in max-w-md mx-auto" style={{ animationDelay: '0.5s' }}>
          {/* Dynamic Loading Message */}
          <p className="text-lg md:text-xl text-[#333333] font-medium mb-4">
            {loadingText}
          </p>
          
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="w-full bg-white/50 rounded-full h-3 shadow-sm">
              <div 
                className="bg-gradient-to-r from-[#E4007C] to-[#F68D2E] h-3 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
              <div className="flex justify-between text-xs text-[#333333]/60 mt-2">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
          </div>
          
          {/* Animated Loading Dots */}
          {isLoading && (
            <div className="flex justify-center mb-4">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-[#E4007C] rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-[#F68D2E] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-[#E4007C] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          )}
          
          {/* Status Text */}
          <div className="text-xs text-[#333333]/70">
            {isLoading && "Please wait while we set up your calculation environment..."}
            {isInitialized && "✓ Model loaded successfully"}
          </div>
        </div>

        {/* Stuck Loading Detection Warning */}
        {isStuck && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-md mx-auto animate-fade-in">
            <p className="text-sm text-yellow-800 mb-3">
              Loading seems to be taking longer than expected. This might be due to stored data that needs to be restored.
            </p>
            <div className="flex gap-2 justify-center">
              <button 
                onClick={async () => {
                  setIsRetrying(true);
                  try {
                    await reinitialize();
                  } catch (err) {
                    console.error('Retry failed:', err);
                  } finally {
                    setIsRetrying(false);
                  }
                }}
                disabled={isRetrying}
                className="bg-gradient-to-r from-[#E4007C] to-[#F68D2E] text-white px-3 py-1.5 rounded text-sm hover:shadow-lg transition-all duration-300 disabled:opacity-50"
              >
                {isRetrying ? 'Retrying...' : 'Retry'}
              </button>
              <button 
                onClick={async () => {
                  if (confirm('This will clear your saved data and start fresh. Continue?')) {
                    localStorage.removeItem('MODEL_STATE');
                    window.location.reload();
                  }
                }}
                className="bg-red-500 text-white px-3 py-1.5 rounded text-sm hover:bg-red-600 transition-colors"
              >
                Clear Data & Restart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
