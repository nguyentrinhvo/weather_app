/**
 * LoadingSpinner Component
 * Animated weather-themed loading indicator displayed during data fetches.
 */


import './LoadingSpinner.css';

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl transition-all duration-500" id="loading-spinner">
      <div className="flex flex-col items-center gap-8 animate-in fade-in zoom-in duration-700">
        <div className="relative w-32 h-32 flex items-center justify-center">
          <div className="loader-sun absolute w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 shadow-xl shadow-yellow-200/50 z-10" />
          <div className="loader-cloud absolute translate-x-4 translate-y-4 z-20">
            <div className="cloud-part cloud-part-1 absolute bg-white dark:bg-blue-100 rounded-full shadow-md w-12 h-12 -left-4 top-2" />
            <div className="cloud-part cloud-part-2 absolute bg-white dark:bg-blue-100 rounded-full shadow-md w-16 h-16 -left-0 -top-2" />
            <div className="cloud-part cloud-part-3 absolute bg-white dark:bg-blue-100 rounded-full shadow-md w-12 h-12 left-4 top-2" />
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-3">
          <p className="text-xl font-bold tracking-widest uppercase bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent dark:from-blue-300 dark:to-indigo-200">
            Fetching Weather
          </p>
          <div className="flex gap-2">
            <span className="dot w-2.5 h-2.5 rounded-full bg-blue-600 dark:bg-blue-400" />
            <span className="dot w-2.5 h-2.5 rounded-full bg-blue-500 dark:bg-blue-300" />
            <span className="dot w-2.5 h-2.5 rounded-full bg-blue-400 dark:bg-blue-200" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
