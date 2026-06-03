import React, { useState } from 'react';
import Navbar from './components/Navbar';
import PostCreator from './components/PostCreator';
import Feed from './components/Feed';
import Leaderboard from './components/Leaderboard';
import DealModal from './components/DealModal';
import Dashboard from './components/Dashboard';

import { translations } from './utils/translations';
import { Leaf, Users, ShieldAlert, Award, Star, Phone, Lock, User as UserIcon, CheckCircle2, Globe, Truck, Building2, HelpCircle, Heart } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState('feed'); // 'feed' | 'leaderboard' | 'dashboard'
  const [lang, setLang] = useState('en'); // 'en' | 'ne'
  
  // Set default user to null so they land on the signup/login screen first
  const [user, setUser] = useState(null);

  // Landing page form states
  const [isRegister, setIsRegister] = useState(true); // Default to sign up as requested
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('hotel');
  const [agree, setAgree] = useState(false);
  const [authError, setAuthError] = useState('');

  const [postCreatorOpen, setPostCreatorOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  
  // Seed Mock Data representing Nepal's cities and realistic situations
  const [posts, setPosts] = useState([
    {
      id: "post-1",
      title: "Surplus Veg Pulao & Mixed Dal Tadka (Approx. 40 servings)",
      donor: "Heritage Garden Sanepa",
      donorPhone: "9841234567",
      foodType: "edible",
      quantity: "25 kg",
      cookedTime: "Today, 1:00 PM",
      pickupWindow: "Before 8:30 PM tonight",
      price: 0,
      location: "Jhamsikhel, Lalitpur",
      description: "Leftover fresh vegetarian food from a high-end corporate seminar buffet. Stored under professional refrigeration. Suitable for human consumption.",
      upvotes: 24,
      hasUpvoted: false,
      comments: [
        { id: "c1", user: "Kopila NGO", text: "We can pick this up for our children's shelter. Sending logistics detail.", time: "Today, 2:15 PM" }
      ],
      status: "available",
      date: "Today"
    },
    {
      id: "post-2",
      title: "Starch Rice & Vegetable Peelings (Animal Feed / Compost)",
      donor: "Marriott Hotel Kathmandu",
      donorPhone: "9849876543",
      foodType: "non-edible",
      quantity: "85 kg",
      cookedTime: "Today, 11:30 AM",
      pickupWindow: "Before 9:00 PM",
      price: 1500,
      location: "New Baneshwor, Kathmandu",
      description: "Clean kitchen organic waste containing boiled white rice, potato peels, carrot scrapings, and outer cabbage leaves. Strictly for animal feed or vermicomposting.",
      upvotes: 12,
      hasUpvoted: false,
      comments: [],
      status: "available",
      date: "Today"
    },
    {
      id: "post-3",
      title: "Leftover Chicken Biryani & Cucumber Raita",
      donor: "Koteshwor Party Palace",
      donorPhone: "9851122334",
      foodType: "both",
      quantity: "50 plates",
      cookedTime: "Today, 3:30 PM",
      pickupWindow: "Before 10:00 PM",
      price: 0,
      location: "Koteshwor, Kathmandu",
      description: "Excellent quality spiced chicken biryani with yogurt raita from an afternoon wedding banquet. Maintained warm in chafing dishes.",
      upvotes: 38,
      hasUpvoted: true,
      comments: [
        { id: "c2", user: "Hamro Sahayogi NGO", text: "Claimed this for our evening food drive. Need a transporter!", time: "Today, 4:10 PM" }
      ],
      status: "claimed",
      claimedBy: "Hamro Sahayogi NGO",
      claimedByRole: "ngo",
      claimedByPhone: "9849988776",
      pickupMethod: "transporter",
      transporterName: null, // Open for drivers to claim
      transporterPhone: null,
      chats: [
        { sender: "Hamro Sahayogi NGO", text: "Hi! We claimed this. We requested a local driver to transport it. Please pack in clean boxes.", time: "4:12 PM" },
        { sender: "Koteshwor Party Palace", text: "Hello! We are packing it in 5 large insulated boxes. Ready for pickup.", time: "4:15 PM" }
      ],
      date: "Today"
    },
    {
      id: "post-4",
      title: "Overripe Bananas and Papayas (Pig Feed / Organic Compost)",
      donor: "Yak & Yeti Banquet",
      donorPhone: "9801122334",
      foodType: "non-edible",
      quantity: "110 kg",
      cookedTime: "Yesterday",
      pickupWindow: "By tomorrow afternoon",
      price: 800,
      location: "Thimi, Bhaktapur",
      description: "Bulk overripe fruits from buffet decoration. Too soft for human food but ideal sugar content for livestock feed or bio-gas setup.",
      upvotes: 9,
      hasUpvoted: false,
      comments: [],
      status: "claimed",
      claimedBy: "Dhulikhel Organic Farm",
      claimedByRole: "farm",
      claimedByPhone: "9851122334",
      pickupMethod: "self",
      transporterName: "Self Pickup",
      transporterPhone: "9851122334",
      chats: [
        { sender: "Dhulikhel Organic Farm", text: "We will pick this up ourselves using our small truck. See you by 6:00 PM.", time: "3:00 PM" }
      ],
      date: "Yesterday"
    }
  ]);

  const [donors, setDonors] = useState([
    { name: "Marriott Hotel Kathmandu", totalDonated: "1,420 kg", rating: 4.9, points: 14200, badges: ["Gold Savior", "Zero Waste Champion", "Kathmandu Hero"] },
    { name: "Heritage Garden Sanepa", totalDonated: "1,150 kg", rating: 4.8, points: 11500, badges: ["Zero Waste Pro", "Community Supporter"] },
    { name: "Koteshwor Party Palace", totalDonated: "980 kg", rating: 4.7, points: 9800, badges: ["Reliable Partner", "Food Rescuer"] },
    { name: "Soaltee Banquet Hall", totalDonated: "850 kg", rating: 4.6, points: 8500, badges: ["Green Contributor"] },
    { name: "Yak & Yeti Banquet", totalDonated: "620 kg", rating: 4.5, points: 6200, badges: ["Active Helper"] }
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, text: "Welcome to Aahaar Sewa! Share leftovers, prevent organic waste, and earn points.", time: "10 minutes ago", read: false },
    { id: 2, text: "Dhulikhel Organic Farm successfully collected 110kg of overripe fruit from Yak & Yeti Banquet.", time: "1 hour ago", read: true }
  ]);

  const t = translations[lang];

  // Upvote / Like Handler
  const handleUpvote = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const hasUpvoted = !post.hasUpvoted;
        return {
          ...post,
          hasUpvoted,
          upvotes: hasUpvoted ? post.upvotes + 1 : post.upvotes - 1
        };
      }
      return post;
    }));
  };

  // Add Comment Handler
  const handleAddComment = (postId, text) => {
    const newComment = {
      id: `comment-${Date.now()}`,
      user: user?.name || "Anonymous User",
      text,
      time: "Just now"
    };

    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, newComment]
        };
      }
      return post;
    }));

    // Add message alert if post belongs to current user
    const targetPost = posts.find(p => p.id === postId);
    if (targetPost && targetPost.donor === user?.name) {
      addNotification(`New comment on your post "${targetPost.title}": "${text}"`);
    }
  };

  // Claim Deal Handler
  const handleClaim = (postId, pickupMethod) => {
    if (!user) return;

    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          status: 'claimed',
          claimedBy: user.name,
          claimedByRole: user.role,
          claimedByPhone: user.phone,
          pickupMethod,
          chats: [
            {
              sender: user.name,
              text: `Hello! I have claimed this leftover food. Method of collection: ${pickupMethod === 'self' ? 'Self Pickup' : 'Transporter Requested'}.`,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]
        };
      }
      return post;
    }));

    const targetPost = posts.find(p => p.id === postId);
    addNotification(`You claimed "${targetPost.title}". Coordinate pickup inside chat.`);

    if (pickupMethod === 'transporter') {
      addNotification(`Logistics Alert: Transporter needed for "${targetPost.title}" at ${targetPost.location}.`);
    }
  };

  // Send Chat message handler
  const handleSendMessage = (postId, text) => {
    if (!user) return;

    const newMsg = {
      sender: user.name,
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setPosts(posts.map(post => {
      if (post.id === postId) {
        const updatedPost = {
          ...post,
          chats: [...(post.chats || []), newMsg]
        };
        if (selectedPost && selectedPost.id === postId) {
          setSelectedPost(updatedPost);
        }
        return updatedPost;
      }
      return post;
    }));
  };

  // Create Post Handler
  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
    addNotification(`Your surplus food post "${newPost.title}" was published successfully!`);

    // Award Leaderboard points to hotel (Adds 500 points for active sharing)
    setDonors(donors.map(donor => {
      if (donor.name === user.name) {
        const updatedPoints = donor.points + 500;
        const totalKg = parseInt(donor.totalDonated) + parseInt(newPost.quantity);
        return {
          ...donor,
          points: updatedPoints,
          totalDonated: `${totalKg} kg`
        };
      }
      return donor;
    }));
  };

  // Update Post / Deal Status Handler
  const handleUpdatePostStatus = (postId, newStatus, transporterName = null, transporterPhone = null) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const update = { ...post, status: newStatus };
        if (transporterName) {
          update.transporterName = transporterName;
          update.transporterPhone = transporterPhone;
          update.chats = [
            ...(post.chats || []),
            {
              sender: transporterName,
              text: `I have accepted this trip. I am driving to the hotel now.`,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ];
        }
        if (newStatus === 'delivered') {
          // If transaction is fully completed, award extra points to hotel
          setDonors(prevDonors => prevDonors.map(donor => {
            if (donor.name === post.donor) {
              return { ...donor, points: donor.points + 1000 };
            }
            return donor;
          }));
        }
        if (selectedPost && selectedPost.id === postId) {
          setSelectedPost(update);
        }
        return update;
      }
      return post;
    }));

    const targetPost = posts.find(p => p.id === postId);
    if (newStatus === 'delivered') {
      addNotification(`Delivery Completed: "${targetPost.title}" has been successfully delivered and verified!`);
    } else if (newStatus === 'in_transit') {
      addNotification(`Trip Started: Driver is transporting "${targetPost.title}".`);
    } else if (transporterName) {
      addNotification(`Transporter Assigned: "${transporterName}" will deliver "${targetPost.title}".`);
    }
  };

  const handleDeletePost = (postId) => {
    setPosts(posts.filter(p => p.id !== postId));
    addNotification("Food post deleted successfully.");
  };

  // General Notification Helpers
  const addNotification = (text) => {
    const newNotif = {
      id: Date.now(),
      text,
      time: "Just now",
      read: false
    };
    setNotifications([newNotif, ...notifications]);
  };

  const clearNotifications = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  // Auth Submission handler for Landing Page
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setAuthError('');

    // Nepali mobile number validation (starts with 98, 97, 96 and exactly 10 digits)
    const phonePattern = /^(98|97|96)\d{8}$/;
    if (!phonePattern.test(phone)) {
      setAuthError(
        lang === 'en'
          ? 'Enter a valid 10-digit Nepali mobile number (must start with 98, 97, or 96).'
          : 'कृपया मान्य १० अंकको नेपाली मोबाइल नम्बर हाल्नुहोस् (९८, ९७, वा ९६ बाट सुरु हुनुपर्छ)।'
      );
      return;
    }

    if (password.length < 4) {
      setAuthError(
        lang === 'en'
          ? 'Password must be at least 4 characters.'
          : 'पासवर्ड कम्तिमा ४ अक्षरको हुनुपर्छ।'
      );
      return;
    }

    if (isRegister && !name.trim()) {
      setAuthError(
        lang === 'en'
          ? 'Please enter your Full/Organization name.'
          : 'कृपया आफ्नो संस्था वा पूरा नाम हाल्नुहोस्।'
      );
      return;
    }

    if (isRegister && !agree) {
      setAuthError(
        lang === 'en'
          ? 'You must agree to verify and maintain hygiene standards.'
          : 'तपाईंले स्वच्छता र गुणस्तर मापदण्डहरू प्रमाणित गर्न सहमत हुनुपर्छ।'
      );
      return;
    }

    // Auth Successful
    const authenticatedUser = {
      name: isRegister ? name : (phone === '9841234567' ? 'Heritage Garden Sanepa' : 'Hamro Sahayogi NGO'),
      phone,
      role: isRegister ? role : (phone === '9841234567' ? 'hotel' : 'ngo')
    };

    // If new hotel register, push to donors list mock
    if (isRegister && role === 'hotel') {
      const exists = donors.some(d => d.name === name);
      if (!exists) {
        setDonors([...donors, { name, totalDonated: "0 kg", rating: 5.0, points: 0, badges: ["New Savior"] }]);
      }
    }

    setUser(authenticatedUser);
    setCurrentView('feed'); // Redirects to internal food feed page
    addNotification(`Signed in successfully as ${authenticatedUser.name}.`);
  };

  const handleQuickOnboard = (selectedRole) => {
    let mockPhone = '9841234567'; // Default Hotel
    let mockName = 'Heritage Garden Sanepa';
    
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

    setUser(mockUser);
    setCurrentView('feed');
    addNotification(`Signed in successfully as ${mockName}.`);
  };

  // Switch between English / Nepali on landing page
  const toggleLanguage = () => {
    setLang(lang === 'en' ? 'ne' : 'en');
  };

  const openPostDetails = (post) => {
    setSelectedPost(post);
  };

  return (
    <div className="min-h-screen bg-brand-cream flex flex-col font-sans antialiased">
      
      {/* ---------------- LANDING / AUTHENTICATION VIEW ---------------- */}
      {!user ? (
        <div className="flex-1 flex flex-col lg:flex-row min-h-screen">
          
          {/* Floating Language Toggler */}
          <div className="absolute top-4 right-4 z-20">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-brand-sand bg-white hover:bg-brand-cream text-xs font-bold text-brand-green shadow-sm transition-all"
            >
              <Globe className="h-4 w-4" />
              <span>{t.language}</span>
            </button>
          </div>

          {/* Left Panel: Introduction & Stats (Hidden on mobile) */}
          <div className="lg:w-5/12 bg-brand-green text-brand-cream p-10 md:p-16 flex flex-col justify-between relative overflow-hidden border-r border-brand-green-medium/35">
            <div className="absolute top-0 right-0 h-96 w-96 opacity-10 bg-white/20 blur-3xl rounded-full translate-x-24 -translate-y-24" />
            
            {/* Logo */}
            <div className="flex items-center gap-2.5 z-10">
              <div className="h-11 w-11 rounded-xl bg-brand-cream text-brand-green flex items-center justify-center font-display font-black text-2xl shadow-md">
                A
              </div>
              <div className="text-left">
                <span className="font-display text-xl font-bold tracking-tight block leading-none">{t.appName}</span>
                <span className="text-[10px] text-brand-gold font-bold uppercase tracking-widest">{t.appSubtitle}</span>
              </div>
            </div>

            {/* Motivational message */}
            <div className="space-y-6 my-12 z-10">
              <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
                {lang === 'en' ? 'Connecting Nepal’s Food Circle.' : 'नेपालको खाद्य चक्रलाई जोड्दै।'}
              </h2>
              <p className="text-sm text-brand-green-pale/85 leading-relaxed max-w-sm">
                {lang === 'en'
                  ? 'Hotels list surplus leftovers. NGOs claim edible meals for the hungry. Farmers recycle scraps for organic feed. Transporters deliver it. Safe, verified, and traceably green.'
                  : 'होटलहरूले बाँकी रहेको खाना सूचीबद्ध गर्छन्। एनजीओहरूले भोकाहरूका लागि खान योग्य खाना दावी गर्छन्। किसानहरूले प्राङ्गारिक मल वा दानाका लागि प्रयोग गर्छन्। ढुवानीकर्ताले डेलिभर गर्छन्।'}
              </p>

              {/* Steps details mini cards */}
              <div className="space-y-3.5 pt-4">
                {[
                  { num: "01", t: lang === 'en' ? 'Hotels & Banquets Post' : 'होटल र ब्याङ्क्वेटले पोस्ट गर्ने', d: lang === 'en' ? 'List fresh surplus buffet leftovers' : 'बाँकी खानाको विवरण हाल्ने' },
                  { num: "02", t: lang === 'en' ? 'NGOs & Farmers Claim' : 'गैरसरकारी संस्था र किसानको दावी', d: lang === 'en' ? 'Match based on human or animal suitability' : 'मानव वा पशु उपयुक्तताको आधारमा दावी' },
                  { num: "03", t: lang === 'en' ? 'Local Drivers Transport' : 'ढुवानीकर्ताद्वारा ढुवानी', d: lang === 'en' ? 'Accept pickup requests & coordinate chat' : 'पिकअप अनुरोध र समन्वय कुराकानी स्वीकार्ने' }
                ].map(step => (
                  <div key={step.num} className="flex gap-3 text-left">
                    <span className="font-display font-black text-brand-gold text-sm mt-0.5">{step.num}</span>
                    <div>
                      <h4 className="font-bold text-xs">{step.t}</h4>
                      <p className="text-[10px] opacity-75 mt-0.5">{step.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Foot note */}
            <div className="text-[10px] text-brand-green-pale/50 font-bold uppercase tracking-wider z-10">
              © {new Date().getFullYear()} Aahaar Sewa Nepal • Circular Ecosystem
            </div>
          </div>

          {/* Right Panel: Onboarding Form */}
          <div className="lg:w-7/12 bg-brand-cream/40 flex items-center justify-center p-6 md:p-12">
            <div className="w-full max-w-md bg-white border border-brand-sand shadow-xl rounded-3xl p-6 md:p-8 animate-in zoom-in-95 duration-300">
              
              {/* Tabs Toggle */}
              <div className="flex border-b border-gray-100 mb-6">
                <button
                  onClick={() => { setIsRegister(true); setAuthError(''); }}
                  className={`flex-1 pb-3 text-sm font-bold border-b-2 text-center transition-all ${
                    isRegister ? 'border-brand-green text-brand-green' : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {t.signup}
                </button>
                <button
                  onClick={() => { setIsRegister(false); setAuthError(''); }}
                  className={`flex-1 pb-3 text-sm font-bold border-b-2 text-center transition-all ${
                    !isRegister ? 'border-brand-green text-brand-green' : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {t.login}
                </button>
              </div>

              <div className="text-left mb-5">
                <h3 className="font-display text-lg font-extrabold text-brand-green">
                  {isRegister ? (lang === 'en' ? 'Create Your Account' : 'नयाँ खाता खोल्नुहोस्') : (lang === 'en' ? 'Welcome Back' : 'लग इन गर्नुहोस्')}
                </h3>
                <p className="text-[11px] text-gray-400 font-semibold mt-0.5">
                  {isRegister 
                    ? (lang === 'en' ? 'Register using your 10-digit mobile number to access the portal' : 'पोर्टलमा पहुँच पाउन १० अंकको मोबाइल नम्बर दर्ता गर्नुहोस्')
                    : (lang === 'en' ? 'Access your dashboard and coordination chats' : 'ड्यासबोर्ड र कुराकानी समन्वयमा पहुँच गर्नुहोस्')}
                </p>
              </div>

              {authError && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-600 flex items-start gap-2">
                  <ShieldAlert className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              {/* Authentication Form */}
              <form onSubmit={handleAuthSubmit} className="space-y-4 text-left">
                
                {/* Full/Org Name (Register Only) */}
                {isRegister && (
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wide">{t.name}</label>
                    <div className="relative">
                      <UserIcon className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        required
                        placeholder={lang === 'en' ? 'e.g., Kathmandu Banquet Hall or Kopila NGO' : 'उदा: काठमाडौँ ब्याङ्क्वेट वा कोपिला एनजीओ'}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-sand bg-brand-cream/20 focus:border-brand-green focus:bg-white text-xs font-medium outline-none transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* Mobile Number */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wide">{t.phoneNumber}</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="tel"
                      required
                      placeholder={lang === 'en' ? 'e.g., 9841XXXXXX (10-digit Nepali format)' : '९८४१XXXXXX (१० अंकको ढाँचा)'}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-sand bg-brand-cream/20 focus:border-brand-green focus:bg-white text-xs font-medium outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wide">{t.password}</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="password"
                      required
                      placeholder={t.enterPassword}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-sand bg-brand-cream/20 focus:border-brand-green focus:bg-white text-xs font-medium outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Role Cards Selector (Register Only) */}
                {isRegister && (
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wide">{t.roleSelect}</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'hotel', label: t.hotel, icon: <Building2 className="h-4 w-4" />, d: 'List leftovers' },
                        { id: 'ngo', label: t.ngo, icon: <Heart className="h-4 w-4" />, d: 'Claim edible food' },
                        { id: 'farm', label: t.farm, icon: <Leaf className="h-4 w-4" />, d: 'Claim compost' },
                        { id: 'transporter', label: t.transporter, icon: <Truck className="h-4 w-4" />, d: 'Deliver cargo' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setRole(item.id)}
                          className={`p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                            role === item.id
                              ? 'border-brand-green bg-brand-green-pale/40 text-brand-green font-bold shadow-sm'
                              : 'border-brand-sand bg-white text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          <div className={`p-1 rounded-lg ${role === item.id ? 'bg-brand-green text-brand-cream' : 'bg-gray-100 text-gray-400'}`}>
                            {item.icon}
                          </div>
                          <div>
                            <span className="text-[10px] font-bold block leading-none">{item.label}</span>
                            <span className="text-[8px] opacity-75 font-semibold mt-0.5 block">{item.d}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hygiene Certificate Checkbox (Register Only) */}
                {isRegister && (
                  <label className="flex items-start gap-2 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={agree}
                      onChange={(e) => setAgree(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-brand-sand text-brand-green focus:ring-brand-green"
                    />
                    <span className="text-[10px] text-gray-500 font-semibold leading-tight">
                      {t.agreeTerms}
                    </span>
                  </label>
                )}

                {/* Submit Action */}
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-brand-green hover:bg-brand-green-medium text-brand-cream font-bold text-xs shadow-sm transition-all duration-300 active:scale-98"
                >
                  {isRegister ? (lang === 'en' ? 'Register Account' : 'खाता दर्ता गर्नुहोस्') : (lang === 'en' ? 'Log In' : 'लग इन गर्नुहोस्')}
                </button>
              </form>

              {/* Quick Testing Portal Entry */}
              <div className="mt-6 pt-5 border-t border-gray-100">
                <p className="text-center text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-3">
                  Quick-Onboard Shortcuts (One-Click Testing)
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
                      onClick={() => handleQuickOnboard(roleInfo.id)}
                      className="py-2 rounded-xl border border-brand-sand bg-brand-cream text-[9px] font-bold text-brand-green hover:bg-brand-sand/50 transition-all active:scale-95"
                    >
                      {roleInfo.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      ) : (
        
        // ---------------- AUTHENTICATED INTERNAL APP VIEW ----------------
        <>
          {/* Internal Header */}
          <Navbar
            currentView={currentView}
            setCurrentView={setCurrentView}
            lang={lang}
            setLang={setLang}
            user={user}
            openAuthModal={() => {}} // Not needed here as they are already logged in
            onLogout={() => {
              setUser(null);
              setIsRegister(true);
              setPhone('');
              setName('');
              setAgree(false);
              setCurrentView('feed');
              addNotification("You have signed out successfully.");
            }}
            notifications={notifications}
            clearNotifications={clearNotifications}
          />

          {/* Internal Page Banner */}
          {currentView === 'feed' && (
            <header className="bg-brand-green text-brand-cream relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8 border-b border-brand-green-medium/35 shadow-inner">
              <div className="absolute top-0 right-0 h-40 w-40 opacity-10 bg-white/20 blur-2xl rounded-full translate-x-12 -translate-y-12" />
              <div className="mx-auto max-w-4xl text-center space-y-4 animate-in fade-in duration-300">
                <h1 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight">
                  {lang === 'en' ? 'Every Grain Counts.' : 'हरेक दाना मूल्यवान छ।'}
                </h1>
                <p className="text-sm md:text-base text-brand-green-pale/90 max-w-2xl mx-auto font-medium">
                  {t.tagline}
                </p>

                {/* Quick Metrics Grid */}
                <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto pt-6 border-t border-white/10 mt-6">
                  <div className="text-center">
                    <span className="font-display text-xl md:text-2xl font-black text-brand-gold block">4,250 kg</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-brand-green-pale/75 block">Food Saved</span>
                  </div>
                  <div className="text-center border-x border-white/10">
                    <span className="font-display text-xl md:text-2xl font-black text-brand-gold block">18 partners</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-brand-green-pale/75 block">Hotels & Banquets</span>
                  </div>
                  <div className="text-center">
                    <span className="font-display text-xl md:text-2xl font-black text-brand-gold block">12 NGOs</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-brand-green-pale/75 block">Farms Supported</span>
                  </div>
                </div>
              </div>
            </header>
          )}

          {/* Main Content Area */}
          <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
            {currentView === 'feed' && (
              <Feed
                posts={posts}
                user={user}
                onUpvote={handleUpvote}
                onAddComment={handleAddComment}
                onClaim={handleClaim}
                openPostCreator={() => setPostCreatorOpen(true)}
                openDealDetails={openPostDetails}
                lang={lang}
              />
            )}

            {currentView === 'leaderboard' && (
              <Leaderboard
                donors={donors}
                lang={lang}
              />
            )}

            {currentView === 'dashboard' && (
              <Dashboard
                user={user}
                posts={posts}
                onUpdatePostStatus={handleUpdatePostStatus}
                openPostDetails={openPostDetails}
                lang={lang}
                onDeletePost={handleDeletePost}
              />
            )}
          </main>

          {/* Footer */}
          <footer className="mt-16 bg-white border-t border-brand-sand py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
              <div className="flex justify-center items-center gap-2">
                <div className="h-6 w-6 rounded-lg bg-brand-green text-brand-cream flex items-center justify-center font-bold text-xs">
                  A
                </div>
                <span className="font-display font-bold text-sm text-brand-green uppercase tracking-wide">
                  {t.appName}
                </span>
              </div>

              <p className="text-[11px] text-gray-400 font-medium max-w-md mx-auto leading-relaxed">
                {lang === 'en'
                  ? 'Aahaar Sewa is a non-profit community initative in Nepal promoting circular food loops, zero waste organic recycling, and local humanitarian food aid.'
                  : 'आहार सेवा नेपालमा खाद्य चक्र, प्राङ्गारिक मल उत्पादन र भोकमरी न्यूनीकरणका लागि होटल र कृषकहरूलाई जोड्ने एक परोपकारी अभियान हो।'}
              </p>

              <div className="flex justify-center gap-6 text-[11px] font-semibold text-gray-500">
                <a href="#privacy" className="hover:text-brand-green">Privacy Policy</a>
                <span>•</span>
                <a href="#terms" className="hover:text-brand-green">Terms of Service</a>
                <span>•</span>
                <a href="#guidelines" className="hover:text-brand-green">Hygiene Guidelines</a>
              </div>

              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                © {new Date().getFullYear()} Aahaar Sewa Nepal • Beautifully Crafted
              </p>
            </div>
          </footer>

          {/* Modals & Overlay Drawers */}
          <PostCreator
            isOpen={postCreatorOpen}
            onClose={() => setPostCreatorOpen(false)}
            onPostCreated={handlePostCreated}
            lang={lang}
            user={user}
          />

          <DealModal
            isOpen={!!selectedPost}
            onClose={() => setSelectedPost(null)}
            post={selectedPost}
            user={user}
            onClaim={handleClaim}
            onSendMessage={handleSendMessage}
            lang={lang}
          />
        </>
      )}
    </div>
  );
}
