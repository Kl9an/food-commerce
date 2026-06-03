import React, { useState } from 'react';
import { translations } from '../utils/translations';
import { Award, Star, Flame, Trophy, TrendingUp, ShieldAlert } from 'lucide-react';

export default function Leaderboard({ donors = [], lang }) {
  const [sortBy, setSortBy] = useState('points'); // 'points' or 'rating'

  const t = translations[lang];

  // Sort logic
  const sortedDonors = [...donors].sort((a, b) => {
    if (sortBy === 'rating') {
      return b.rating - a.rating;
    }
    return b.points - a.points;
  });

  // Top 3 for the visual podium
  const topThree = sortedDonors.slice(0, 3);
  const remainingDonors = sortedDonors.slice(3);

  // Re-arrange top 3 for classic podium layout: [2nd, 1st, 3rd]
  const podiumOrder = [];
  if (topThree[1]) podiumOrder.push({ ...topThree[1], displayRank: 2 });
  if (topThree[0]) podiumOrder.push({ ...topThree[0], displayRank: 1 });
  if (topThree[2]) podiumOrder.push({ ...topThree[2], displayRank: 3 });

  // Icon mapping for ranks
  const getRankBadge = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500 animate-float" />;
      case 2:
        return <Trophy className="h-6 w-6 text-slate-400" />;
      case 3:
        return <Trophy className="h-6 w-6 text-amber-700" />;
      default:
        return <span className="font-bold text-xs text-gray-400">#{rank}</span>;
    }
  };

  const getBadgeStyle = (badge) => {
    const b = badge.toLowerCase();
    if (b.includes('gold') || b.includes('saviour') || b.includes('बचतकर्ता')) {
      return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    }
    if (b.includes('waste') || b.includes('शून्य') || b.includes('pro')) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
    return 'bg-blue-50 text-blue-700 border-blue-200';
  };

  return (
    <div className="py-6 space-y-8">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="font-display text-2xl md:text-3xl font-extrabold text-brand-green tracking-tight">
          {t.lbTitle}
        </h2>
        <p className="text-xs md:text-sm text-gray-500 font-medium">
          {t.lbSubtitle}
        </p>
      </div>

      {/* Sort Selector Panel */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-xl p-1 bg-brand-sand border border-brand-sand shadow-inner">
          <button
            onClick={() => setSortBy('points')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              sortBy === 'points'
                ? 'bg-white text-brand-green shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <Flame className="h-3.5 w-3.5 text-brand-terracotta" />
            <span>{lang === 'en' ? 'Highest Volume Saved' : 'अधिकतम परिमाण बचत'}</span>
          </button>
          <button
            onClick={() => setSortBy('rating')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              sortBy === 'rating'
                ? 'bg-white text-brand-green shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <Star className="h-3.5 w-3.5 text-brand-gold fill-brand-gold" />
            <span>{lang === 'en' ? 'Top Quality Rating' : 'सर्वोच्च गुणस्तर दर'}</span>
          </button>
        </div>
      </div>

      {/* Visual Podium for Top 3 */}
      {podiumOrder.length > 0 && (
        <div className="grid grid-cols-3 max-w-xl mx-auto items-end gap-2 md:gap-4 pt-12 pb-6 px-2">
          {podiumOrder.map((donor) => {
            const isFirst = donor.displayRank === 1;
            const isSecond = donor.displayRank === 2;
            const isThird = donor.displayRank === 3;

            // Height and styling depending on rank
            let heightClass = 'h-32 bg-slate-100 border-slate-200';
            let textShadow = 'text-slate-400';
            if (isFirst) {
              heightClass = 'h-44 bg-yellow-50 border-yellow-200 shadow-md ring-2 ring-yellow-400/20';
              textShadow = 'text-yellow-500';
            } else if (isThird) {
              heightClass = 'h-24 bg-amber-50 border-amber-200';
              textShadow = 'text-amber-700';
            }

            return (
              <div key={donor.name} className="flex flex-col items-center text-center">
                {/* Avatar/Trophy */}
                <div className="mb-2 flex flex-col items-center">
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center font-bold text-sm bg-white border shadow-sm ${
                    isFirst ? 'border-yellow-400 ring-4 ring-yellow-100' : 'border-gray-200'
                  }`}>
                    {getRankBadge(donor.displayRank)}
                  </div>
                  <span className="text-[11px] font-bold text-gray-800 mt-1 truncate max-w-[80px] sm:max-w-[120px] block">
                    {donor.name}
                  </span>
                  <div className="flex items-center gap-0.5 mt-0.5">
                    <Star className="h-3 w-3 text-brand-gold fill-brand-gold" />
                    <span className="text-[10px] font-bold text-gray-600">{donor.rating}</span>
                  </div>
                </div>

                {/* Pedestal block */}
                <div className={`w-full rounded-t-2xl border-t border-x flex flex-col justify-between p-3 ${heightClass}`}>
                  <span className={`font-display text-3xl font-extrabold ${textShadow}`}>
                    {donor.displayRank}
                  </span>
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                      {t.points}
                    </span>
                    <span className="text-xs font-black text-gray-700 block">
                      {donor.points.toLocaleString()}
                    </span>
                    <span className="text-[9px] text-gray-500 font-semibold block">
                      ({donor.totalDonated})
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Ranks 4+ List */}
      <div className="max-w-3xl mx-auto rounded-2xl border border-brand-sand bg-white overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <h4 className="font-display text-sm font-bold text-brand-green flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-brand-terracotta" />
            <span>{lang === 'en' ? 'Ranking Leaderboard' : 'क्रमाङ्कन स्तर तालिका'}</span>
          </h4>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            {lang === 'en' ? 'Nepal Green Alliance' : 'नेपाल हरित गठबन्धन'}
          </span>
        </div>

        <div className="divide-y divide-gray-100">
          {remainingDonors.map((donor, idx) => {
            const currentRank = idx + 4;

            return (
              <div
                key={donor.name}
                className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:bg-gray-50/50"
              >
                {/* Left - Rank and Profile */}
                <div className="flex items-center gap-4">
                  <div className="w-6 text-center">
                    <span className="font-bold text-xs text-gray-400">#{currentRank}</span>
                  </div>
                  <div className="h-9 w-9 rounded-xl bg-brand-cream border border-brand-sand flex items-center justify-center font-display font-extrabold text-brand-green text-sm">
                    {donor.name[0]}
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-gray-900 leading-tight">{donor.name}</h5>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Star className="h-3 w-3 text-brand-gold fill-brand-gold" />
                      <span className="text-xs font-bold text-gray-600">{donor.rating}</span>
                      <span className="text-gray-300 text-[10px] font-medium">•</span>
                      <span className="text-xs text-gray-400 font-semibold">{t.totalDonated}: {donor.totalDonated}</span>
                    </div>
                  </div>
                </div>

                {/* Right - Badges & Score */}
                <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 border-gray-50 pt-2.5 sm:pt-0">
                  {/* Badges */}
                  <div className="flex gap-1.5">
                    {donor.badges.slice(0, 2).map((badge) => (
                      <span
                        key={badge}
                        className={`px-2 py-0.5 rounded-full border text-[9px] font-bold tracking-wide uppercase ${getBadgeStyle(badge)}`}
                      >
                        {badge}
                      </span>
                    ))}
                  </div>

                  {/* Points score */}
                  <div className="text-right min-w-[70px]">
                    <span className="text-xs font-black text-brand-green block">
                      {donor.points.toLocaleString()}
                    </span>
                    <span className="text-[9px] font-bold text-gray-400 block uppercase tracking-wider">
                      {t.points}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
