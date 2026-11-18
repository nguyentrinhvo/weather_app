import { WiCloudDown } from 'react-icons/wi';
import { FiRefreshCcw } from 'react-icons/fi';
import { useWeather } from '../../context/WeatherContext';

const ErrorFallback = () => {
  const { error, retry } = useWeather();
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50" id="error-fallback">
      <div className="flex flex-col items-center max-w-md w-full mx-4 bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-white/50 text-center">
        <WiCloudDown className="text-8xl text-red-400 mb-2 drop-shadow-md" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
        <p className="text-red-500 font-medium bg-red-50 px-4 py-2 rounded-xl mb-4 w-full break-words">
            {typeof error === 'string' ? error : JSON.stringify(error)}
        </p>
        <p className="text-gray-500 text-sm mb-6">
          Please check your internet connection and try again.
        </p>
        <button className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-2xl transition-all shadow-md hover:shadow-lg active:scale-95" onClick={retry} id="retry-button">
          <FiRefreshCcw size={18} />
          Try Again
        </button>
      </div>
    </div>
  );
};
export default ErrorFallback;
