/**
 * WindGauge — Compass-style wind direction and speed display.
 */
import { getWindDirection } from '../../utils';

const WindGauge = ({ speed, deg }) => {
  const dir = getWindDirection(deg);
  return (
    <div className="flex items-center gap-4 mt-2">
      <div className="relative w-14 h-14 rounded-full border-2 border-gray-300 flex items-center justify-center bg-gray-50/50">
        <span className="absolute top-0.5 text-[8px] font-bold text-gray-400">N</span>
        <span className="absolute right-1 text-[8px] font-bold text-gray-400">E</span>
        <span className="absolute bottom-0.5 text-[8px] font-bold text-gray-400">S</span>
        <span className="absolute left-1 text-[8px] font-bold text-gray-400">W</span>
        <div
          className="absolute w-full h-full flex items-center justify-center transition-transform duration-1000"
          style={{ transform: `rotate(${deg || 0}deg)` }}
        >
          <div className="w-1 absolute top-1 bottom-1/2 bg-blue-500 rounded-full flex flex-col items-center">
            <div className="w-2 h-2 rounded-full bg-blue-600 -mt-1"></div>
          </div>
        </div>
      </div>
      <div className="flex flex-col leading-tight">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black text-gray-800">{Math.round(speed)}</span>
          <span className="text-sm font-semibold text-gray-500">km/h</span>
        </div>
        <span className="text-sm font-bold text-blue-600">{dir}</span>
      </div>
    </div>
  );
};

export default WindGauge;
