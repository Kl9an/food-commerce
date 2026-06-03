import React, { useState } from 'react';
import { translations } from '../utils/translations';
import { X, Calendar, Clock, MapPin, DollarSign, Edit3, ShieldCheck } from 'lucide-react';

export default function PostCreator({ isOpen, onClose, onPostCreated, lang, user }) {
  const [title, setTitle] = useState('');
  const [foodType, setFoodType] = useState('edible');
  const [quantity, setQuantity] = useState('');
  const [location, setLocation] = useState('Koteshwor, Kathmandu');
  const [cookedTime, setCookedTime] = useState('Today, 2:00 PM');
  const [pickupWindow, setPickupWindow] = useState('Before 9:00 PM tonight');
  const [price, setPrice] = useState('0');
  const [description, setDescription] = useState('');
  const [certified, setCertified] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const t = translations[lang];

  // Common Nepali districts/cities for selection
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !quantity.trim() || !description.trim()) {
      setError(lang === 'en' ? 'Please fill in all fields.' : 'कृपया सबै क्षेत्रहरू भर्नुहोस्।');
      return;
    }

    if (!certified) {
      setError(
        lang === 'en'
          ? 'You must certify that the food has been stored safely.'
          : 'तपाईंले खाना सुरक्षित रूपमा भण्डारण गरिएको प्रमाणित गर्नुपर्छ।'
      );
      return;
    }

    const priceNum = parseFloat(price) || 0;

    const newPost = {
      id: `post-${Date.now()}`,
      title,
      donor: user?.name || "Koteshwor Banquet",
      donorPhone: user?.phone || "9841234567",
      foodType,
      quantity,
      cookedTime,
      pickupWindow,
      price: priceNum,
      location,
      description,
      upvotes: 0,
      hasUpvoted: false,
      comments: [],
      status: 'available',
      date: new Date().toLocaleDateString()
    };

    onPostCreated(newPost);
    
    // Reset form
    setTitle('');
    setQuantity('');
    setDescription('');
    setPrice('0');
    setCertified(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg rounded-2xl bg-white border border-brand-sand shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-5">
          <h3 className="font-display text-xl font-bold text-brand-green flex items-center gap-2">
            <Edit3 className="h-5 w-5 text-brand-terracotta" />
            <span>{t.postPlaceholder}</span>
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Fill in the leftover food details carefully for NGOs and farmers.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Post Title */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">{t.postTitle}</label>
            <input
              type="text"
              required
              placeholder="e.g., Leftover Chicken Curry & Jeera Rice (approx. 50 servings)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-brand-sand bg-brand-cream/30 focus:border-brand-green focus:bg-white text-sm outline-none transition-colors"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">Food Description & Ingredients</label>
            <textarea
              required
              rows={3}
              placeholder="List down the food items, storage condition, and any allergen info (e.g., Paneer, Naan, Dal. Kept hot/refrigerated)."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-brand-sand bg-brand-cream/30 focus:border-brand-green focus:bg-white text-sm outline-none transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Quantity */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">{t.quantity}</label>
              <input
                type="text"
                required
                placeholder="e.g., 20 kg / 45 plates"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-brand-sand bg-brand-cream/30 focus:border-brand-green focus:bg-white text-sm outline-none transition-colors"
              />
            </div>

            {/* Price */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">{t.price}</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-xs font-bold text-gray-400">Rs.</span>
                <input
                  type="number"
                  min="0"
                  required
                  placeholder="0 (Free)"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-brand-sand bg-brand-cream/30 focus:border-brand-green focus:bg-white text-sm outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Food Suitability */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700">{t.foodType}</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'edible', label: lang === 'en' ? 'Edible (NGOs)' : 'खान योग्य (NGOs)' },
                { id: 'non-edible', label: lang === 'en' ? 'Non-Edible (Farms)' : 'खान नमिल्ने (Farms)' },
                { id: 'both', label: lang === 'en' ? 'Mixed / Both' : 'मिश्रित / दुवै' }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFoodType(item.id)}
                  className={`p-2 rounded-lg border text-center text-xs font-semibold transition-all ${
                    foodType === item.id
                      ? 'border-brand-green bg-brand-green-pale/40 text-brand-green font-bold'
                      : 'border-brand-sand bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">{t.location}</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-brand-sand bg-brand-cream/30 focus:border-brand-green focus:bg-white text-sm outline-none transition-colors appearance-none"
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Cooked Time */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">{t.cookedTime}</label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g., Today, 1:30 PM"
                  value={cookedTime}
                  onChange={(e) => setCookedTime(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-brand-sand bg-brand-cream/30 focus:border-brand-green focus:bg-white text-sm outline-none transition-colors"
                />
              </div>
            </div>

            {/* Pickup Window */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">{t.pickupWindow}</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g., By 8:30 PM tonight"
                  value={pickupWindow}
                  onChange={(e) => setPickupWindow(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-brand-sand bg-brand-cream/30 focus:border-brand-green focus:bg-white text-sm outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Quality Certification */}
          <label className="flex items-start gap-2.5 cursor-pointer pt-2">
            <input
              type="checkbox"
              checked={certified}
              onChange={(e) => setCertified(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-brand-sand text-brand-green focus:ring-brand-green"
            />
            <span className="text-[11px] text-gray-600 font-medium leading-tight flex gap-1.5 items-center">
              <ShieldCheck className="h-3.5 w-3.5 text-brand-green shrink-0" />
              <span>{t.qualityCertified} (I certify this food is safe, hygienic, and properly packed)</span>
            </span>
          </label>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-brand-sand text-gray-500 hover:bg-gray-50 font-semibold text-xs transition-colors"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-brand-green hover:bg-brand-green-medium text-brand-cream font-bold text-xs shadow-sm transition-all hover:shadow duration-200"
            >
              {t.submitPost}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
