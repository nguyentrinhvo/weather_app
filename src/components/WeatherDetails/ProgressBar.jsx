/**
 * ProgressBar — Horizontal gauge with color segments.
 * Used in weather detail cards for UV, AQI, humidity, etc.
 */
const ProgressBar = ({ value, max, color, segments = [] }) => {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="flex flex-col gap-1 w-full mt-auto">
      <div className="relative h-2.5 w-full bg-slate-300/50 border border-slate-400/20 rounded-full overflow-hidden shadow-inner">
        <div
          className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out shadow-sm"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      {segments.length > 0 && (
        <div className="flex justify-between w-full px-0.5 mt-0.5">
          {segments.map((s, i) => (
            <span key={i} className="text-[10px] sm:text-[11px] font-bold text-blue-600 tracking-wider uppercase">{s}</span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
