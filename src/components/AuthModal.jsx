import React, { useState } from 'react';
import { translations } from '../utils/translations';
import { X, Phone, Lock, User, ShieldAlert } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onLoginSuccess, lang }) {
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState('hotel');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const t = translations[lang];

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Verification
    if (phone.length < 10) {
      setError(lang === 'en' ? 'Phone number must be at least 10 digits.' : 'फोन नम्बर कम्तिमा १० अंकको हुनुपर्छ।');
      return;
    }
    if (password.length < 4) {
      setError(lang === 'en' ? 'Password must be at least 4 characters.' : 'पासवर्ड कम्तिमा ४ अक्षरको हुनुपर्छ।');
      return;
    }
    if (isRegister && !name.trim()) {
      setError(lang === 'en' ? 'Please enter your name.' : 'कृपया आफ्नो नाम हाल्नुहोस्।');
      return;
    }
    if (isRegister && !agree) {
      setError(lang === 'en' ? 'You must agree to quality standards.' : 'तपाईंले गुणस्तर मापदण्डहरूमा सहमति जनाउनुपर्छ।');
      return;
    }

    // Success Mock
    const mockUser = {
      name: isRegister ? name : (phone === '9841234567' ? 'Annapurna Banquet' : 'Nepal Food NGO'),
      phone,
      role: isRegister ? role : (phone === '9841234567' ? 'hotel' : 'ngo'),
    };

    onLoginSuccess(mockUser);
    onClose();
  };

  const handleQuickLogin = (selectedRole) => {
    let mockPhone = '9841234567'; // Default Hotel
    let mockName = 'Annapurna Banquet';
    
    if (selectedRole === 'ngo') {
      mockPhone = '9849876543';
      mockName = 'Hamro Sahayogi NGO';
    } else if (selectedRole === 'farm') {
      mockPhone = '9851122334';
      mockName = 'Dhulikhel Organic Farm';
    } else if (selectedRole === 'transporter') {
      mockPhone = '9801122334';
      mockName = 'Pratham Transporters';
    }

    const mockUser = {
      name: mockName,
      phone: mockPhone,
      role: selectedRole
    };

    onLoginSuccess(mockUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-md rounded-2xl bg-white border border-brand-sand shadow-2xl p-6 md:p-8 animate-in zoom-in-95 duration-300">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="font-display text-2xl font-bold text-brand-green">
            {isRegister ? t.signup : t.login}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {isRegister ? 'Join the food saving revolution' : 'Access your food rescue dashboard'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 mb-6">
          <button
            onClick={() => { setIsRegister(false); setError(''); }}
            className={`flex-1 pb-3 text-sm font-semibold border-b-2 text-center transition-all ${
              !isRegister ? 'border-brand-green text-brand-green' : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            {t.login}
          </button>
          <button
            onClick={() => { setIsRegister(true); setError(''); }}
            className={`flex-1 pb-3 text-sm font-semibold border-b-2 text-center transition-all ${
              isRegister ? 'border-brand-green text-brand-green' : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            {t.signup}
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs font-semibold text-red-600 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Name Field (Register Only) */}
          {isRegister && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">{t.name}</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  required
                  placeholder={t.enterName}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-sand bg-brand-cream/30 focus:border-brand-green focus:bg-white text-sm outline-none transition-all duration-200 placeholder:text-gray-400"
                />
              </div>
            </div>
          )}

          {/* Phone Field */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">{t.phoneNumber}</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
              <input
                type="tel"
                required
                placeholder={t.enterPhone}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-sand bg-brand-cream/30 focus:border-brand-green focus:bg-white text-sm outline-none transition-all duration-200 placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">{t.password}</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
              <input
                type="password"
                required
                placeholder={t.enterPassword}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-sand bg-brand-cream/30 focus:border-brand-green focus:bg-white text-sm outline-none transition-all duration-200 placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Role Selection (Register Only) */}
          {isRegister && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">{t.roleSelect}</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'hotel', label: t.hotel },
                  { id: 'ngo', label: t.ngo },
                  { id: 'farm', label: t.farm },
                  { id: 'transporter', label: t.transporter },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setRole(item.id)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold transition-all duration-200 ${
                      role === item.id
                        ? 'border-brand-green bg-brand-green-pale/40 text-brand-green font-bold shadow-sm'
                        : 'border-brand-sand bg-white text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Terms & Quality Standards Checkbox (Register Only) */}
          {isRegister && (
            <label className="flex items-start gap-2.5 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-brand-sand text-brand-green focus:ring-brand-green"
              />
              <span className="text-[11px] text-gray-500 font-medium leading-tight">
                {t.agreeTerms}
              </span>
            </label>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-brand-green hover:bg-brand-green-medium text-brand-cream font-bold text-sm shadow-sm transition-all duration-300 hover:shadow active:scale-98"
          >
            {t.submitAuth}
          </button>
        </form>

        {/* Quick Login Section for Testing */}
        <div className="mt-6 pt-5 border-t border-gray-100">
          <p className="text-center text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-3">
            Quick-Login Shortcuts (For Frontend Testing)
          </p>
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { id: 'hotel', label: 'Hotel' },
              { id: 'ngo', label: 'NGO' },
              { id: 'farm', label: 'Farmer' },
              { id: 'transporter', label: 'Driver' },
            ].map((roleInfo) => (
              <button
                key={roleInfo.id}
                type="button"
                onClick={() => handleQuickLogin(roleInfo.id)}
                className="py-1.5 rounded-lg border border-brand-sand bg-brand-cream text-[10px] font-bold text-brand-green hover:bg-brand-sand/50 transition-colors"
              >
                {roleInfo.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
