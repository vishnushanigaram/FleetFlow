import React from 'react';
import { Star, Trophy, Award, ShieldCheck } from 'lucide-react';
import { formatDistance } from '../../utils/formatters';

export function DriverLeaderboard({ drivers = [] }) {
  // Sort by rating desc, then safetyScore desc
  const sorted = [...drivers].sort((a, b) => (b.rating * 100 + b.safetyScore) - (a.rating * 100 + a.safetyScore)).slice(0, 5);

  const getRankBadge = (rank) => {
    switch (rank) {
      case 1:
        return <span className="w-5 h-5 rounded-full bg-amber-400 text-amber-950 font-bold flex items-center justify-center text-xs shadow-sm">1</span>;
      case 2:
        return <span className="w-5 h-5 rounded-full bg-slate-300 text-slate-800 font-bold flex items-center justify-center text-xs shadow-sm">2</span>;
      case 3:
        return <span className="w-5 h-5 rounded-full bg-amber-700 text-amber-100 font-bold flex items-center justify-center text-xs shadow-sm">3</span>;
      default:
        return <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium flex items-center justify-center text-xs">{rank}</span>;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-500" />
          <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Driver Safety & Reliability Leaderboard
          </h4>
        </div>
        <span className="text-xs text-slate-400">Top Performers</span>
      </div>

      <div className="space-y-2.5 text-xs">
        {sorted.map((d, idx) => (
          <div
            key={d.id}
            className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 dark:bg-slate-850/70 border border-slate-100 dark:border-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="flex items-center gap-3">
              {getRankBadge(idx + 1)}
              <img src={d.avatar} alt={d.name} className="w-8 h-8 rounded-full object-cover" />
              <div>
                <p className="font-bold text-slate-900 dark:text-white leading-tight">
                  {d.name}
                </p>
                <span className="text-[10px] text-slate-400">
                  {d.completedTrips} trips • {formatDistance(d.totalDistance)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-right">
              <div>
                <span className="font-bold text-amber-500 flex items-center justify-end gap-1">
                  <Star className="w-3.5 h-3.5 fill-current" /> {d.rating}
                </span>
                <span className="text-[10px] text-slate-400">Customer Score</span>
              </div>

              <div>
                <span className="font-bold text-emerald-600 block">
                  {d.safetyScore}%
                </span>
                <span className="text-[10px] text-slate-400">Safety Index</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
