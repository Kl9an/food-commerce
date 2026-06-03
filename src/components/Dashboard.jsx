import React from 'react';
import { translations } from '../utils/translations';
import { Clipboard, Award, ShieldCheck, Heart, MapPin, Truck, CheckCircle2, MessageSquare, Flame, Trash2, ArrowRight } from 'lucide-react';

export default function Dashboard({
  user,
  posts = [],
  onUpdatePostStatus,
  openPostDetails,
  lang,
  onDeletePost
}) {
  if (!user) return null;

  const t = translations[lang];

  // Helper stats calculation
  const hotelPosts = posts.filter(p => p.donor === user.name);
  const totalSavedKg = hotelPosts.reduce((acc, p) => acc + (parseFloat(p.quantity) || 0), 0);
  const claimedCount = hotelPosts.filter(p => p.status === 'claimed').length;

  const claimedDeals = posts.filter(p => p.claimedBy === user.name);
  const claimedKg = claimedDeals.reduce((acc, p) => acc + (parseFloat(p.quantity) || 0), 0);

  // For transporters: Find deals that need transport
  const pendingDeliveries = posts.filter(p => p.status === 'claimed' && p.pickupMethod === 'transporter' && !p.transporterName);
  const myDeliveries = posts.filter(p => p.status === 'claimed' && p.transporterName === user.name);

  // Status mapping colors
  const getStatusBadge = (status) => {
    switch (status) {
      case 'available':
        return <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold text-[10px] uppercase">Available</span>;
      case 'claimed':
        return <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-100 font-bold text-[10px] uppercase">Claimed / Processing</span>;
      case 'in_transit':
        return <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-100 font-bold text-[10px] uppercase">In Transit</span>;
      case 'delivered':
        return <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-500 border border-gray-200 font-bold text-[10px] uppercase">Completed</span>;
      default:
        return null;
    }
  };

  return (
    <div className="py-6 space-y-8 animate-in fade-in duration-300">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-brand text-brand-cream rounded-2xl p-6 md:p-8 border border-brand-green/30 shadow-md relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Background visual graphics */}
        <div className="absolute right-0 bottom-0 opacity-10 font-display text-[120px] font-black pointer-events-none select-none select-tr select-t leading-none">
          HERO
        </div>
        
        <div>
          <span className="text-[10px] font-bold text-brand-gold uppercase tracking-widest bg-brand-green-medium/50 px-3 py-1 rounded-full">
            {t[user.role]} Account
          </span>
          <h2 className="font-display text-2xl md:text-3xl font-extrabold mt-3 tracking-tight">
            {t.welcome}, {user.name}!
          </h2>
          <p className="text-xs text-brand-green-pale/80 max-w-md mt-1">
            Thank you for being part of the Nepal Food Rescue Portal. Your actions are reducing organic waste and feeding our communities.
          </p>
        </div>

        {/* Dynamic points/impact indicator */}
        <div className="flex gap-2.5 items-center bg-white/10 backdrop-blur-sm border border-white/15 p-4 rounded-xl">
          <Award className="h-6 w-6 text-brand-gold" />
          <div className="text-left text-xs font-semibold">
            <span className="text-brand-gold font-bold block text-sm">
              {user.role === 'hotel' ? `${(totalSavedKg * 10).toLocaleString()} Points` : 'Rescue Hero'}
            </span>
            <span className="opacity-80 block text-[10px] mt-0.5">Community Tier Badge</span>
          </div>
        </div>
      </div>

      {/* RENDER HOTEL DASHBOARD */}
      {user.role === 'hotel' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-brand-sand bg-white p-5 shadow-sm text-left">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Total Surplus Saved</span>
              <span className="font-display text-2xl font-black text-brand-green block mt-1">{totalSavedKg} kg</span>
              <span className="text-[10px] text-gray-500 font-medium mt-0.5 block">Across {hotelPosts.length} listings</span>
            </div>
            <div className="rounded-2xl border border-brand-sand bg-white p-5 shadow-sm text-left">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Active Claims</span>
              <span className="font-display text-2xl font-black text-brand-terracotta block mt-1">{claimedCount} deals</span>
              <span className="text-[10px] text-gray-500 font-medium mt-0.5 block">Waiting to be picked up</span>
            </div>
            <div className="rounded-2xl border border-brand-sand bg-white p-5 shadow-sm text-left">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Leaderboard Rank</span>
              <span className="font-display text-2xl font-black text-brand-gold block mt-1">Top 5</span>
              <span className="text-[10px] text-gray-500 font-medium mt-0.5 block">Based on quality and volume</span>
            </div>
          </div>

          {/* Listings History */}
          <div className="rounded-2xl border border-brand-sand bg-white overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <h3 className="font-display text-sm font-bold text-brand-green flex items-center gap-2">
                <Clipboard className="h-4 w-4 text-brand-terracotta" />
                <span>{t.pastDonations}</span>
              </h3>
            </div>

            {hotelPosts.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-400">
                You haven't posted any food listings yet. Go to the feed to create one.
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {hotelPosts.map(post => (
                  <div key={post.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="text-left space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-gray-800">{post.title}</h4>
                        {getStatusBadge(post.status)}
                      </div>
                      <p className="text-[11px] text-gray-500 font-semibold">
                        Quantity: <strong>{post.quantity}</strong> | Prepared: {post.cookedTime} | Expiry: {post.pickupWindow}
                      </p>
                      {post.status === 'claimed' && (
                        <p className="text-[11px] text-brand-green font-medium">
                          Claimed by: <strong>{post.claimedBy}</strong> ({post.claimedByRole.toUpperCase()}) | Delivery: <strong>{post.pickupMethod === 'self' ? 'Self Pickup' : 'Driver Requested'}</strong>
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 self-start md:self-auto">
                      <button
                        onClick={() => openPostDetails(post)}
                        className="px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>Chat/Details</span>
                      </button>

                      {post.status === 'claimed' && (
                        <button
                          onClick={() => onUpdatePostStatus(post.id, 'delivered')}
                          className="px-3.5 py-2 rounded-xl bg-brand-green text-brand-cream hover:bg-brand-green-medium font-bold text-xs shadow-sm transition-all"
                        >
                          Verify Completed Delivery
                        </button>
                      )}

                      {post.status === 'available' && (
                        <button
                          onClick={() => onDeletePost(post.id)}
                          className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* RENDER NGO / FARMER DASHBOARD */}
      {(user.role === 'ngo' || user.role === 'farm') && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-brand-sand bg-white p-5 shadow-sm text-left">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                {user.role === 'ngo' ? 'Meals Served (Est.)' : 'Animal Feed Generated (Est.)'}
              </span>
              <span className="font-display text-2xl font-black text-brand-green block mt-1">
                {Math.round(claimedKg * 2.5)} servings
              </span>
              <span className="text-[10px] text-gray-500 font-medium mt-0.5 block">From your claimed portal deals</span>
            </div>
            <div className="rounded-2xl border border-brand-sand bg-white p-5 shadow-sm text-left">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Total Surplus Claimed</span>
              <span className="font-display text-2xl font-black text-brand-terracotta block mt-1">{claimedKg} kg</span>
              <span className="text-[10px] text-gray-500 font-medium mt-0.5 block">Across {claimedDeals.length} deals</span>
            </div>
            <div className="rounded-2xl border border-brand-sand bg-white p-5 shadow-sm text-left">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">CO2 Footprint Offset</span>
              <span className="font-display text-2xl font-black text-brand-gold block mt-1">{Math.round(claimedKg * 2.1)} kg</span>
              <span className="text-[10px] text-gray-500 font-medium mt-0.5 block">Reduced organic landfill emissions</span>
            </div>
          </div>

          {/* Claimed Deals History */}
          <div className="rounded-2xl border border-brand-sand bg-white overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-display text-sm font-bold text-brand-green flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-brand-terracotta" />
                <span>{t.claimedFood}</span>
              </h3>
            </div>

            {claimedDeals.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-400">
                You haven't claimed any leftover food listings yet. Go to the feed to look for available listings.
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {claimedDeals.map(post => (
                  <div key={post.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="text-left space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-gray-800">{post.title}</h4>
                        {getStatusBadge(post.status)}
                      </div>
                      <p className="text-[11px] text-gray-500 font-semibold">
                        Donor: <strong>{post.donor}</strong> | Quantity: <strong>{post.quantity}</strong> | Location: <strong>{post.location}</strong>
                      </p>
                      <p className="text-[11px] text-gray-500 font-semibold">
                        Logistics: <strong>{post.pickupMethod === 'self' ? 'Self Pickup' : 'Transporter Requested'}</strong>
                        {post.transporterName && ` | Assigned Driver: ${post.transporterName} (${post.transporterPhone})`}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-start md:self-auto">
                      <button
                        onClick={() => openPostDetails(post)}
                        className="px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>Chat / Coordinate</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* RENDER TRANSPORTER DASHBOARD */}
      {user.role === 'transporter' && (
        <div className="space-y-6">
          {/* Active Shipments */}
          <div className="rounded-2xl border border-brand-sand bg-white overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-display text-sm font-bold text-brand-green flex items-center gap-2">
                <Truck className="h-4 w-4 text-brand-terracotta" />
                <span>My Active Shipments</span>
              </h3>
            </div>

            {myDeliveries.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-400">
                No active shipments assigned. Check the available queue below to accept a trip.
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {myDeliveries.map(post => (
                  <div key={post.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="text-left space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-gray-800">{post.title}</h4>
                        {getStatusBadge(post.status)}
                      </div>
                      <div className="text-[11px] text-gray-500 font-semibold flex flex-wrap items-center gap-1.5">
                        <span>From Hotel: <strong>{post.donor}</strong></span>
                        <ArrowRight className="h-3 w-3 text-gray-400" />
                        <span>To NGO/Farm: <strong>{post.claimedBy}</strong></span>
                      </div>
                      <p className="text-[11px] text-gray-500 font-semibold">
                        Pickup Location: <strong>{post.location}</strong> | Quantity: <strong>{post.quantity}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-start md:self-auto">
                      <button
                        onClick={() => openPostDetails(post)}
                        className="px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>Chat</span>
                      </button>

                      {post.status === 'claimed' && (
                        <button
                          onClick={() => onUpdatePostStatus(post.id, 'in_transit')}
                          className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition-colors"
                        >
                          Start Shipment (In Transit)
                        </button>
                      )}

                      {post.status === 'in_transit' && (
                        <button
                          onClick={() => onUpdatePostStatus(post.id, 'delivered')}
                          className="px-3.5 py-2 rounded-xl bg-brand-green text-brand-cream hover:bg-brand-green-medium font-bold text-xs transition-colors"
                        >
                          Mark Delivered
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Open Queue of pickups */}
          <div className="rounded-2xl border border-brand-sand bg-white overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-display text-sm font-bold text-brand-green flex items-center gap-2">
                <Clipboard className="h-4 w-4 text-brand-terracotta" />
                <span>{t.availablePickups}</span>
              </h3>
            </div>

            {pendingDeliveries.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-400">
                No pending deliveries requesting transporter support at this time.
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {pendingDeliveries.map(post => (
                  <div key={post.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="text-left space-y-1">
                      <h4 className="font-bold text-sm text-gray-800">{post.title}</h4>
                      <div className="text-[11px] text-gray-500 font-semibold flex flex-wrap items-center gap-1.5">
                        <span>From Hotel: <strong>{post.donor}</strong></span>
                        <ArrowRight className="h-3 w-3 text-gray-400" />
                        <span>To NGO/Farm: <strong>{post.claimedBy}</strong> ({post.claimedByRole.toUpperCase()})</span>
                      </div>
                      <p className="text-[11px] text-gray-500 font-semibold">
                        Pickup Location: <strong>{post.location}</strong> | Quantity: <strong>{post.quantity}</strong> | Expiry: <strong>{post.pickupWindow}</strong>
                      </p>
                    </div>

                    <button
                      onClick={() => onUpdatePostStatus(post.id, 'claimed', user.name, user.phone)}
                      className="px-3.5 py-2 rounded-xl bg-brand-green text-brand-cream hover:bg-brand-green-medium font-bold text-xs transition-all shadow-sm duration-300 active:scale-95"
                    >
                      {t.acceptPickup}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
