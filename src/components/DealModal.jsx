import React, { useState } from 'react';
import { translations } from '../utils/translations';
import { X, Send, Phone, MapPin, Clipboard, CheckCircle2, Truck, MessageSquare, AlertCircle } from 'lucide-react';

export default function DealModal({
  isOpen,
  onClose,
  post,
  user,
  onClaim,
  onSendMessage,
  lang
}) {
  const [pickupMethod, setPickupMethod] = useState('self'); // 'self' or 'transporter'
  const [chatMessage, setChatMessage] = useState('');
  const [claimSuccess, setClaimSuccess] = useState(false);

  if (!isOpen || !post) return null;

  const t = translations[lang];
  const isClaimed = post.status === 'claimed';
  
  // Checking user permissions
  const canClaim = user && !isClaimed && (
    (post.foodType === 'edible' && user.role === 'ngo') ||
    (post.foodType === 'non-edible' && user.role === 'farm') ||
    (post.foodType === 'both' && (user.role === 'ngo' || user.role === 'farm'))
  );

  const isClaimer = isClaimed && post.claimedBy === user?.name;
  const isDonor = isClaimed && post.donor === user?.name;
  const showChat = isClaimed && (isClaimer || isDonor || user?.role === 'transporter');

  const handleClaimSubmit = () => {
    onClaim(post.id, pickupMethod);
    setClaimSuccess(true);
    setTimeout(() => {
      setClaimSuccess(false);
      onClose();
    }, 2000);
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    
    onSendMessage(post.id, chatMessage);
    setChatMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg rounded-2xl bg-white border border-brand-sand shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto flex flex-col animate-in zoom-in-95 duration-300">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Claim Success Banner */}
        {claimSuccess && (
          <div className="mb-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700 text-center flex flex-col items-center gap-1.5">
            <CheckCircle2 className="h-8 w-8 text-emerald-600 animate-bounce" />
            <span>{t.dealSuccess}</span>
          </div>
        )}

        {/* Main Details */}
        <div className="space-y-4 flex-1">
          <div>
            <span className="text-[10px] font-bold text-brand-terracotta uppercase tracking-widest block mb-1">
              Food Rescue Details
            </span>
            <h3 className="font-display text-lg md:text-xl font-bold text-gray-900 leading-tight">
              {post.title}
            </h3>
            <p className="text-[11px] text-gray-400 mt-1">
              Listed by <strong className="text-gray-600">{post.donor}</strong> ({t.hotel})
            </p>
          </div>

          <div className="bg-brand-cream/60 border border-brand-sand/50 rounded-xl p-4 space-y-3 text-xs">
            <div className="flex justify-between items-start gap-4">
              <div>
                <span className="text-gray-400 block font-semibold">Quantity</span>
                <span className="font-bold text-gray-800 text-sm">{post.quantity}</span>
              </div>
              <div className="text-right">
                <span className="text-gray-400 block font-semibold">Pricing</span>
                <span className="font-bold text-brand-green text-sm">
                  {post.price === 0 ? t.free : `Rs. ${post.price}`}
                </span>
              </div>
            </div>

            <div className="border-t border-brand-sand/50 pt-2.5 grid grid-cols-2 gap-2">
              <div>
                <span className="text-gray-400 block font-semibold">Prepared At</span>
                <span className="font-bold text-gray-700">{post.cookedTime}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-semibold">Pickup Expiry</span>
                <span className="font-bold text-gray-700">{post.pickupWindow}</span>
              </div>
            </div>

            <div className="border-t border-brand-sand/50 pt-2.5 flex items-center gap-1.5 text-gray-600">
              <MapPin className="h-4 w-4 text-brand-terracotta shrink-0" />
              <span>Location: <strong>{post.location}</strong></span>
            </div>

            {post.description && (
              <div className="border-t border-brand-sand/50 pt-2.5">
                <span className="text-gray-400 block font-semibold mb-1">Description</span>
                <p className="text-gray-600 font-medium leading-relaxed">{post.description}</p>
              </div>
            )}
          </div>

          {/* User Specific actions */}
          {!user ? (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-800 flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
              <div>
                <p className="font-bold">Login Required</p>
                <p className="text-gray-600 mt-0.5">Please sign up or log in with your phone number to claim food deals or contact the donor.</p>
              </div>
            </div>
          ) : isClaimed ? (
            // Claimed State Panel
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-gray-800">Deal Claimed</p>
                  <p className="text-gray-500">Claimed by <strong>{post.claimedBy}</strong> ({t[post.claimedByRole]})</p>
                </div>
              </div>

              {/* Chat Coordination */}
              {showChat ? (
                <div className="border border-brand-sand rounded-xl bg-white flex flex-col h-64 overflow-hidden">
                  <div className="px-4 py-2 border-b border-gray-100 bg-brand-cream/40 flex items-center justify-between text-xs font-semibold text-gray-700">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3.5 w-3.5 text-brand-green" />
                      <span>Logistics Coordination Chat</span>
                    </span>
                    <span className="text-xs font-bold text-brand-terracotta flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      <span>{isDonor ? post.claimedByPhone || '9849876543' : post.donorPhone}</span>
                    </span>
                  </div>

                  {/* Messages Feed */}
                  <div className="flex-1 p-3 overflow-y-auto space-y-2.5 bg-gray-50/50">
                    {(post.chats || []).length === 0 ? (
                      <p className="text-center text-[10px] text-gray-400 py-8">
                        No messages yet. Send a message to coordinate pickup timing and details.
                      </p>
                    ) : (
                      (post.chats || []).map((msg, idx) => {
                        const isMe = msg.sender === user.name;
                        return (
                          <div
                            key={idx}
                            className={`flex flex-col max-w-[80%] ${isMe ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                          >
                            <span className="text-[9px] text-gray-400 font-bold mb-0.5">{msg.sender}</span>
                            <div className={`p-2.5 rounded-xl text-xs font-medium ${
                              isMe 
                                ? 'bg-brand-green text-brand-cream rounded-tr-none' 
                                : 'bg-white border border-brand-sand/50 text-gray-700 rounded-tl-none shadow-sm'
                            }`}>
                              {msg.text}
                            </div>
                            <span className="text-[8px] text-gray-400 mt-0.5">{msg.time}</span>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Chat Input */}
                  <form onSubmit={handleChatSubmit} className="p-2 border-t border-gray-100 flex gap-1.5 bg-white">
                    <input
                      type="text"
                      required
                      placeholder={t.chatPlaceholder}
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-brand-sand outline-none focus:border-brand-green text-gray-700 transition-colors"
                    />
                    <button
                      type="submit"
                      className="p-1.5 rounded-lg bg-brand-green text-brand-cream hover:bg-brand-green-medium transition-colors"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              ) : (
                <p className="text-center text-[10px] text-gray-400 font-semibold py-2">
                  Only the claiming NGO/Farm, the donor hotel, or assigned transporter can view this deal chat.
                </p>
              )}
            </div>
          ) : canClaim ? (
            // Claim Form Details
            <div className="space-y-4 border-t border-brand-sand/40 pt-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 block">Select Logistics Mode</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPickupMethod('self')}
                    className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                      pickupMethod === 'self'
                        ? 'border-brand-green bg-brand-green-pale/30 text-brand-green shadow-sm'
                        : 'border-brand-sand bg-white text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <Clipboard className="h-4 w-4 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold block">Self Pickup</span>
                      <span className="text-[10px] opacity-75 leading-tight block mt-0.5">We will coordinate and pick up the food ourselves.</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPickupMethod('transporter')}
                    className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                      pickupMethod === 'transporter'
                        ? 'border-brand-green bg-brand-green-pale/30 text-brand-green shadow-sm'
                        : 'border-brand-sand bg-white text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <Truck className="h-4 w-4 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold block">Request Transporter</span>
                      <span className="text-[10px] opacity-75 leading-tight block mt-0.5">Flag for a local community driver to pick up and deliver.</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Claim Button */}
              <button
                onClick={handleClaimSubmit}
                className="w-full py-3 rounded-xl bg-brand-green hover:bg-brand-green-medium text-brand-cream font-bold text-sm shadow-sm transition-all duration-300 hover:shadow"
              >
                {t.claimDeal}
              </button>
            </div>
          ) : (
            // User cannot claim (Wrong role)
            <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-center text-xs text-gray-500 font-semibold leading-relaxed">
              {user.role === 'hotel' && (
                <span>Hotels cannot claim deals. This listing is available for NGOs (Edible food) and Farmers (Non-edible food).</span>
              )}
              {user.role === 'transporter' && (
                <span>Transporters cannot claim food deals directly. Go to your dashboard to claim pending logistics pick-ups.</span>
              )}
              {user.role === 'ngo' && post.foodType === 'non-edible' && (
                <span>NGOs can only claim Edible food. This post is non-edible and reserved for farmers (animal feed/composting).</span>
              )}
              {user.role === 'farm' && post.foodType === 'edible' && (
                <span>Farmers can only claim Non-edible food. This post is edible and reserved for NGOs (human consumption).</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
