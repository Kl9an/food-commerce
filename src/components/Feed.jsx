import React, { useState } from 'react';
import { translations } from '../utils/translations';
import { Heart, MessageSquare, MapPin, Clock, Calendar, CheckCircle2, MessageCircle, Info, Tag, Plus } from 'lucide-react';

export default function Feed({
  posts = [],
  user,
  onUpvote,
  onAddComment,
  onClaim,
  openPostCreator,
  openDealDetails,
  lang
}) {
  const [filterType, setFilterType] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [expandedComments, setExpandedComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});

  const t = translations[lang];

  // Common Nepal locations for filtering
  const locations = [
    "Koteshwor, Kathmandu",
    "Jhamsikhel, Lalitpur",
    "Thimi, Bhaktapur",
    "New Baneshwor, Kathmandu",
    "Lakeside, Pokhara",
    "Bharatpur, Chitwan",
    "Dharan, Sunsari",
    "Butwal, Rupandehi"
  ];

  const handleCommentSubmit = (e, postId) => {
    e.preventDefault();
    const commentText = commentInputs[postId];
    if (!commentText || !commentText.trim()) return;

    onAddComment(postId, commentText);
    setCommentInputs({
      ...commentInputs,
      [postId]: ''
    });
  };

  const toggleComments = (postId) => {
    setExpandedComments({
      ...expandedComments,
      [postId]: !expandedComments[postId]
    });
  };

  const handleCommentChange = (postId, text) => {
    setCommentInputs({
      ...commentInputs,
      [postId]: text
    });
  };

  // Filter logic
  const filteredPosts = posts.filter((post) => {
    const typeMatch =
      filterType === 'all' ||
      post.foodType === filterType ||
      post.foodType === 'both';
    
    const locMatch =
      filterLocation === 'all' ||
      post.location.includes(filterLocation) ||
      filterLocation.includes(post.location);

    return typeMatch && locMatch;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-6">
      
      {/* Left Sidebar - Filters */}
      <div className="lg:col-span-4 space-y-6">
        <div className="rounded-2xl border border-brand-sand bg-white p-5 shadow-sm sticky top-20">
          <h4 className="font-display text-base font-bold text-brand-green mb-4 flex items-center gap-2">
            <Tag className="h-4 w-4 text-brand-terracotta" />
            <span>{t.filterTitle}</span>
          </h4>
          
          {/* Suitability Filters */}
          <div className="space-y-2 mb-6">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
              {t.foodType}
            </label>
            <div className="flex flex-col gap-1.5">
              {[
                { id: 'all', label: t.all },
                { id: 'edible', label: t.filterEdible },
                { id: 'non-edible', label: t.filterNonEdible }
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => setFilterType(type.id)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    filterType === type.id
                      ? 'bg-brand-green text-brand-cream font-bold shadow-sm'
                      : 'bg-brand-cream/35 border border-brand-sand/50 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Location Filters */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
              {t.selectLocation}
            </label>
            <select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-brand-sand bg-brand-cream/30 text-xs font-semibold text-gray-700 outline-none focus:border-brand-green focus:bg-white transition-all"
            >
              <option value="all">{lang === 'en' ? 'All Locations (Nepal)' : 'सबै स्थानहरू (नेपाल)'}</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* Platform Information Card */}
          <div className="mt-6 p-4 rounded-xl bg-brand-green-pale/20 border border-brand-green-pale/50 text-xs text-brand-green leading-relaxed flex gap-2">
            <Info className="h-4 w-4 shrink-0 text-brand-green mt-0.5" />
            <div>
              <p className="font-semibold mb-1">
                {lang === 'en' ? 'Did you know?' : 'के तपाईंलाई थाहा छ?'}
              </p>
              <p className="text-gray-600">
                {lang === 'en' 
                  ? 'Edible surplus goes directly to verified local NGOs supporting vulnerable communities. Non-edible surplus goes to farmers for livestock feed & composting.'
                  : 'खान योग्य बचेको खाना सीधै खाँचोमा परेका समुदायहरूलाई सहयोग गर्ने प्रमाणित स्थानीय एनजीओहरूमा जान्छ। खान नमिल्ने खाना पशु आहार र मल बनाउनका लागि किसानहरूमा पठाइन्छ।'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Feed Content */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* Post Trigger Banner (Only for Hotels, or prompts others to login/understand) */}
        {user?.role === 'hotel' ? (
          <div className="rounded-2xl border border-brand-sand bg-white p-5 shadow-sm flex items-center justify-between gap-4 transition-all duration-300 hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-brand-green-pale/50 flex items-center justify-center text-brand-green font-display font-bold">
                {user.name[0].toUpperCase()}
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{t.hotel}</p>
                <p className="text-sm font-bold text-gray-800">{user.name}</p>
              </div>
            </div>
            <button
              onClick={openPostCreator}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-green text-brand-cream hover:bg-brand-green-medium font-bold text-xs shadow-sm transition-all hover:scale-102"
            >
              <Plus className="h-4 w-4" />
              <span>{lang === 'en' ? 'Share Leftover Food' : 'बचेको खाना साझा गर्नुहोस्'}</span>
            </button>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-brand-sand bg-white/50 p-6 text-center">
            <p className="text-xs text-gray-500 font-medium">
              {lang === 'en'
                ? 'Only Hotels, Party Palaces, and Banquet Halls can create food sharing posts.'
                : 'होटल, पार्टी प्यालेस र ब्याङ्क्वेट हलहरूले मात्र बचेको खाद्य सामग्री पोस्ट गर्न सक्छन्।'}
            </p>
            {!user && (
              <button
                onClick={openPostCreator} // This will trigger auth flow since user is not logged in
                className="mt-3 text-xs font-bold text-brand-green hover:text-brand-green-medium underline"
              >
                {lang === 'en' ? 'Log in as a Hotel to start posting' : 'पोस्ट गर्न सुरु गर्न होटलको रूपमा लग इन गर्नुहोस्'}
              </button>
            )}
          </div>
        )}

        {/* Post Items */}
        {filteredPosts.length === 0 ? (
          <div className="rounded-2xl border border-brand-sand bg-white py-12 text-center shadow-sm">
            <p className="text-sm text-gray-400 font-semibold">
              {lang === 'en' ? 'No food posts available matching filters.' : 'फिल्टरसँग मेल खाने कुनै खाद्य पोस्ट फेला परेन।'}
            </p>
          </div>
        ) : (
          filteredPosts.map((post) => {
            const isClaimed = post.status === 'claimed';
            const commentsList = post.comments || [];
            
            // Determine suitability visual tag
            let suitabilityTag = {
              bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/50',
              label: t.edible,
              indicator: 'bg-emerald-500'
            };
            if (post.foodType === 'non-edible') {
              suitabilityTag = {
                bg: 'bg-amber-50 text-amber-800 border-amber-200/50',
                label: t.nonEdible,
                indicator: 'bg-amber-600'
              };
            } else if (post.foodType === 'both') {
              suitabilityTag = {
                bg: 'bg-indigo-50 text-indigo-700 border-indigo-200/50',
                label: t.bothTypes,
                indicator: 'bg-indigo-500'
              };
            }

            return (
              <div
                key={post.id}
                className={`rounded-2xl border transition-all duration-300 bg-white ${
                  isClaimed 
                    ? 'border-gray-200 opacity-75 shadow-sm'
                    : 'border-brand-sand/70 hover:border-brand-sand hover:shadow-md shadow-sm'
                }`}
              >
                {/* Post Header */}
                <div className="p-5 border-b border-gray-50 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {/* Visual Mock Avatar representation */}
                    <div className="h-10 w-10 rounded-xl bg-gradient-brand text-brand-cream flex items-center justify-center font-display font-black shadow-inner">
                      {post.donor[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h5 className="font-bold text-sm text-gray-900">{post.donor}</h5>
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-brand-green-pale/40 text-[9px] font-bold text-brand-green">
                          <CheckCircle2 className="h-2.5 w-2.5" />
                          {t.qualityCertified}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-400">
                        <span className="font-medium text-brand-terracotta">{t.hotel}</span>
                        <span>•</span>
                        <span>{post.date || 'Today'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Location Badge */}
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-100 text-xs font-semibold text-gray-500">
                    <MapPin className="h-3 w-3 text-brand-terracotta" />
                    <span>{post.location}</span>
                  </div>
                </div>

                {/* Post Content */}
                <div className="p-5 space-y-4">
                  {/* Suitability Badge */}
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${suitabilityTag.bg}`}>
                    <span className={`h-2 w-2 rounded-full ${suitabilityTag.indicator}`} />
                    <span>{suitabilityTag.label}</span>
                  </div>

                  <h3 className="font-display text-base font-bold text-gray-900 leading-tight">
                    {post.title}
                  </h3>

                  <p className="text-xs text-gray-600 leading-relaxed font-medium">
                    {post.description}
                  </p>

                  {/* Logistics Parameters Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-brand-cream/40 rounded-xl p-3 border border-brand-sand/50">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 block uppercase">{t.quantity}</span>
                      <span className="text-xs font-bold text-gray-800">{post.quantity}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 block uppercase">{t.price}</span>
                      <span className="text-xs font-bold text-brand-green">
                        {post.price === 0 ? t.free : `Rs. ${post.price}`}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 block uppercase">{t.cookedTime}</span>
                      <span className="text-xs font-bold text-gray-700 flex items-center gap-1">
                        <Clock className="h-3 w-3 text-gray-400 shrink-0" />
                        <span>{post.cookedTime}</span>
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 block uppercase">{t.pickupWindow}</span>
                      <span className="text-xs font-bold text-gray-700 flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-gray-400 shrink-0" />
                        <span>{post.pickupWindow}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Post Footer Action Bar */}
                <div className="px-5 py-3 border-t border-gray-50 flex items-center justify-between gap-4 text-xs font-semibold text-gray-500">
                  <div className="flex items-center gap-4">
                    {/* Upvote Button */}
                    <button
                      onClick={() => onUpvote(post.id)}
                      className={`flex items-center gap-1.5 transition-colors ${
                        post.hasUpvoted 
                          ? 'text-brand-terracotta' 
                          : 'hover:text-brand-terracotta'
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${post.hasUpvoted ? 'fill-brand-terracotta text-brand-terracotta' : ''}`} />
                      <span>{post.upvotes} {t.upvotes}</span>
                    </button>

                    {/* Comments Toggle */}
                    <button
                      onClick={() => toggleComments(post.id)}
                      className="flex items-center gap-1.5 hover:text-brand-green transition-colors"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>{commentsList.length} {t.comments}</span>
                    </button>
                  </div>

                  {/* Claim/Contact Actions */}
                  <div>
                    {isClaimed ? (
                      <span className="px-3.5 py-1.5 rounded-xl bg-gray-100 text-gray-400 font-bold text-xs flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>{t.claimed} by {post.claimedBy}</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => openDealDetails(post)}
                        className="px-4 py-2 rounded-xl bg-brand-green text-brand-cream hover:bg-brand-green-medium font-bold text-xs shadow-sm transition-all duration-300 hover:shadow"
                      >
                        {t.viewDetails}
                      </button>
                    )}
                  </div>
                </div>

                {/* Collapsible Comments Section */}
                {expandedComments[post.id] && (
                  <div className="border-t border-gray-50 bg-gray-50/50 rounded-b-2xl p-5 space-y-4">
                    {/* Comments List */}
                    {commentsList.length > 0 && (
                      <div className="space-y-3">
                        {commentsList.map((c) => (
                          <div key={c.id} className="flex gap-2.5 text-xs">
                            <div className="h-7 w-7 rounded-lg bg-brand-sand flex items-center justify-center font-bold text-brand-green uppercase">
                              {c.user[0]}
                            </div>
                            <div className="flex-1 bg-white border border-brand-sand/50 rounded-xl p-2.5">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <span className="font-bold text-gray-800">{c.user}</span>
                                <span className="text-[9px] text-gray-400">{c.time}</span>
                              </div>
                              <p className="text-gray-600 font-medium">{c.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* New Comment Input */}
                    {user ? (
                      <form onSubmit={(e) => handleCommentSubmit(e, post.id)} className="flex gap-2">
                        <input
                          type="text"
                          required
                          placeholder={t.writeComment}
                          value={commentInputs[post.id] || ''}
                          onChange={(e) => handleCommentChange(post.id, e.target.value)}
                          className="flex-1 px-3 py-2 text-xs rounded-xl border border-brand-sand bg-white outline-none focus:border-brand-green transition-colors"
                        />
                        <button
                          type="submit"
                          className="px-3.5 py-2 rounded-xl bg-brand-green text-brand-cream hover:bg-brand-green-medium font-bold text-xs transition-colors"
                        >
                          {t.postComment}
                        </button>
                      </form>
                    ) : (
                      <p className="text-[10px] text-center text-gray-400 font-semibold">
                        {lang === 'en' ? 'Log in to write a comment.' : 'प्रतिक्रिया लेख्न लग इन गर्नुहोस्।'}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
