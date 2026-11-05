import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Navigation, 
  MapPin, 
  Truck, 
  Gauge, 
  Clock, 
  AlertTriangle,
  Zap
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { formatDistance } from '../../utils/formatters';

export function LiveRouteMap({ activeTrip, onSelectTrip, allActiveTrips = [] }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(activeTrip?.progressPercent || 50);
  const [speed, setSpeed] = useState(activeTrip?.currentSpeed || 62);

  useEffect(() => {
    if (activeTrip) {
      setProgress(activeTrip.progressPercent || 50);
      setSpeed(activeTrip.currentSpeed || 62);
    }
  }, [activeTrip]);

  // Movement animation interval
  useEffect(() => {
    let interval;
    if (isPlaying && activeTrip && activeTrip.status !== 'Completed') {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 98) {
            return 98; // Arrived near destination
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, activeTrip]);

  if (!activeTrip) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <Navigation className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
        <p className="text-xs text-slate-500">Select an active trip to view live highway telemetry & route map.</p>
      </div>
    );
  }

  // Calculate coordinates along a smooth bezier curve for realistic highway path
  const startX = 60;
  const startY = 180;
  const endX = 740;
  const endY = 140;
  const ctrlX1 = 280;
  const ctrlY1 = 80;
  const ctrlX2 = 520;
  const ctrlY2 = 240;

  // Cubic Bezier interpolation
  const t = progress / 100;
  const curX = Math.round(
    Math.pow(1 - t, 3) * startX +
    3 * Math.pow(1 - t, 2) * t * ctrlX1 +
    3 * (1 - t) * Math.pow(t, 2) * ctrlX2 +
    Math.pow(t, 3) * endX
  );
  const curY = Math.round(
    Math.pow(1 - t, 3) * startY +
    3 * Math.pow(1 - t, 2) * t * ctrlY1 +
    3 * (1 - t) * Math.pow(t, 2) * ctrlY2 +
    Math.pow(t, 3) * endY
  );

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      {/* Simulation Controls & Active Trip Selector */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 bg-slate-50/70 dark:bg-slate-850/70">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-900 dark:text-white">
                {activeTrip.vehicleReg}
              </span>
              <span className="font-mono text-xs text-brand-600 dark:text-brand-400">
                ({activeTrip.id})
              </span>
              <Badge variant={activeTrip.status} size="sm" dot />
            </div>
            <p className="text-[11px] text-slate-400">
              Pilot: <strong>{activeTrip.driverName}</strong> • Cargo: {activeTrip.cargoLoad}
            </p>
          </div>
        </div>

        {/* Live Controls */}
        <div className="flex items-center gap-3">
          {/* Trip Selector Dropdown */}
          {allActiveTrips.length > 1 && (
            <select
              value={activeTrip.id}
              onChange={(e) => {
                const found = allActiveTrips.find(t => t.id === e.target.value);
                if (found) onSelectTrip(found);
              }}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
            >
              {allActiveTrips.map(t => (
                <option key={t.id} value={t.id}>
                  {t.id}: {t.vehicleReg} ({t.origin.slice(0, 15)}...)
                </option>
              ))}
            </select>
          )}

          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-1">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
              title={isPlaying ? 'Pause telemetry stream' : 'Play telemetry stream'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-500" /> : <Play className="w-3.5 h-3.5 text-emerald-500" />}
            </button>
            <button
              onClick={() => setProgress(5)}
              className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
              title="Reset to departure point"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Visual GPS Highway Simulation Map Canvas (SVG Vector Map) */}
      <div className="relative w-full h-72 sm:h-80 bg-slate-950 overflow-hidden select-none">
        {/* Subtle Map Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-40" />

        <svg className="w-full h-full" viewBox="0 0 800 320" preserveAspectRatio="xMidYMid meet">
          {/* Defs for gradients and glow filters */}
          <defs>
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Route Shadow/Glow */}
          <path
            d={`M ${startX} ${startY} C ${ctrlX1} ${ctrlY1}, ${ctrlX2} ${ctrlY2}, ${endX} ${endY}`}
            fill="none"
            stroke="#1e3a8a"
            strokeWidth="10"
            strokeLinecap="round"
            opacity="0.5"
          />

          {/* Dotted Interstate Route Corridor */}
          <path
            d={`M ${startX} ${startY} C ${ctrlX1} ${ctrlY1}, ${ctrlX2} ${ctrlY2}, ${endX} ${endY}`}
            fill="none"
            stroke="url(#routeGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="6 6"
          />

          {/* Completed Segment of Route */}
          <path
            d={`M ${startX} ${startY} C ${ctrlX1} ${ctrlY1}, ${ctrlX2} ${ctrlY2}, ${endX} ${endY}`}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="4"
            strokeLinecap="round"
            pathLength="100"
            strokeDasharray={`${progress} 100`}
            filter="url(#glow)"
          />

          {/* Midpoint Waypoints */}
          <circle cx={ctrlX1} cy={ctrlY1} r="5" fill="#475569" stroke="#94a3b8" strokeWidth="2" />
          <text x={ctrlX1} y={ctrlY1 - 10} fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="monospace">
            Waypoint #1 (Interstate Junction)
          </text>

          <circle cx={ctrlX2} cy={ctrlY2} r="5" fill="#475569" stroke="#94a3b8" strokeWidth="2" />
          <text x={ctrlX2} y={ctrlY2 + 20} fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="monospace">
            Waypoint #2 (Weigh Station)
          </text>

          {/* Origin Marker */}
          <g transform={`translate(${startX}, ${startY})`}>
            <circle r="12" fill="#3b82f6" fillOpacity="0.2" className="animate-ping" />
            <circle r="7" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
            <text x="0" y="24" fill="#60a5fa" fontSize="11" fontWeight="bold" textAnchor="middle">
              ORIGIN
            </text>
            <text x="0" y="36" fill="#94a3b8" fontSize="9" textAnchor="middle">
              {activeTrip.origin.split('(')[0]}
            </text>
          </g>

          {/* Destination Marker */}
          <g transform={`translate(${endX}, ${endY})`}>
            <circle r="12" fill="#10b981" fillOpacity="0.2" />
            <circle r="7" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
            <text x="0" y="24" fill="#34d399" fontSize="11" fontWeight="bold" textAnchor="middle">
              DESTINATION
            </text>
            <text x="0" y="36" fill="#94a3b8" fontSize="9" textAnchor="middle">
              {activeTrip.destination.split('(')[0]}
            </text>
          </g>

          {/* Vehicle Marker with Dynamic Location & Animated Beacon */}
          <g transform={`translate(${curX}, ${curY})`}>
            <circle r="20" fill="#3b82f6" fillOpacity="0.25" className="animate-ping" />
            <circle r="12" fill="#2563eb" stroke="#ffffff" strokeWidth="2.5" />
            {/* Compass directional pointer */}
            <circle r="4" fill="#ffffff" />
            <rect x="-35" y="-32" width="70" height="18" rx="4" fill="#0f172a" fillOpacity="0.9" stroke="#3b82f6" strokeWidth="1" />
            <text x="0" y="-20" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              {speed} KM/H
            </text>
          </g>
        </svg>

        {/* Floating Telemetry HUD */}
        <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-3 rounded-xl text-white shadow-xl text-xs space-y-1">
          <div className="flex items-center gap-2 text-brand-400 font-bold uppercase tracking-wider text-[10px]">
            <Zap className="w-3.5 h-3.5" /> Live Telemetry Feed
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-400">Current Velocity:</span>
            <span className="font-mono font-bold text-white">{speed} km/h</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-400">Route Traveled:</span>
            <span className="font-mono font-bold text-white">{progress}% ({Math.round((activeTrip.distanceKm * progress) / 100)} / {activeTrip.distanceKm} km)</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-400">Status:</span>
            <span className={`font-bold ${activeTrip.isDelayed ? 'text-amber-400' : 'text-emerald-400'}`}>
              {activeTrip.status}
            </span>
          </div>
        </div>

        {/* Floating Scrubber Slider */}
        <div className="absolute bottom-3 left-4 right-4 bg-slate-900/80 backdrop-blur-sm border border-slate-800/80 px-4 py-2 rounded-xl flex items-center gap-3 text-xs text-white">
          <span className="text-slate-400 text-[11px] whitespace-nowrap">Simulation Progress:</span>
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
          />
          <span className="font-mono text-brand-400 font-bold min-w-[36px] text-right">{progress}%</span>
        </div>
      </div>
    </div>
  );
}
