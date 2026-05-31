/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Play,
  Tv,
  Star,
  Search,
  Users,
  Grid,
  TrendingUp,
  Heart,
  ChevronRight,
  Eye,
  Calendar,
  AlertTriangle,
  Lock,
  Compass,
  ArrowRight,
  CheckCircle,
  HelpCircle,
  ShieldCheck,
  Zap,
  Info,
  Clock,
  MessageSquare,
  Bookmark,
  QrCode,
  Camera,
  RefreshCw,
  Laptop,
  Smartphone
} from "lucide-react";

// Types
import { Lang, Role, User, TVChannel, Movie, Series, SubscriptionPlan, NewsItem, SystemSettings, AdSetting, PaymentLog, SecurityLog } from "./types";

// Mock Data
import {
  initialChannels,
  initialMovies,
  initialSeries,
  initialSportsMatches,
  initialNews,
  initialPlans,
  defaultSettings,
  initialAd,
  initialPayments,
  initialSecurityLogs
} from "./mockData";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import ChannelDetail from "./components/ChannelDetail";
import MovieDetail from "./components/MovieDetail";
import AdminPanel from "./components/AdminPanel";

export default function App() {
  // Page routing
  const [activeTab, setActiveTab] = useState<string>("home");
  const [currentLang, setCurrentLang] = useState<Lang>(Lang.UZ);

  // Theme support (light/dark mode)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('theme');
      return (saved as 'light' | 'dark') || 'dark';
    } catch (e) {
      return 'dark';
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
    } else {
      root.classList.remove('light');
    }
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {
      // Iframe sandbox check fallback
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Intro Cinematic Loading Animation State
  const [appLoading, setAppLoading] = useState(true);

  // Clone structures into reactive states so mutations persist inside the React mockup!
  const [channels, setChannels] = useState<TVChannel[]>(initialChannels);
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [allSeries, setAllSeries] = useState<Series[]>(initialSeries);
  const [plans, setPlans] = useState<SubscriptionPlan[]>(initialPlans);
  const [ads, setAds] = useState<AdSetting>(initialAd);
  const [settings, setSettings] = useState<SystemSettings>(defaultSettings);
  const [users, setUsers] = useState<User[]>([
    { id: "u-1", email: "hurmatbekuzpochta@gmail.com", role: Role.SUPER_ADMIN, subscriptionPlanId: "plan-12", subscriptionExpiresAt: "2027-05-30", isPremium: true },
    { id: "u-2", email: "editor@htv.uz", role: Role.EDITOR, subscriptionPlanId: "plan-3", subscriptionExpiresAt: "2026-08-30", isPremium: true },
    { id: "u-3", email: "user@htv.uz", role: Role.USER, subscriptionPlanId: null, subscriptionExpiresAt: null, isPremium: false }
  ]);
  const [payments, setPayments] = useState<PaymentLog[]>(initialPayments);
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>(initialSecurityLogs);
  const [news, setNews] = useState<NewsItem[]>(initialNews);

  // Active streaming state
  const [selectedChannel, setSelectedChannel] = useState<TVChannel | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // Series details tracking
  const [playingEpisode, setPlayingEpisode] = useState<{
    seriesName: string;
    seriesPoster: string;
    isPremium: boolean;
    title: string;
    url: string;
  } | null>(null);

  // Session State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Favorites bookmark list
  const [favorites, setFavorites] = useState<string[]>(["ch-1", "ch-2"]);

  // Authentication UI overlays
  const [loginOverlayOpen, setLoginOverlayOpen] = useState(false);
  const [loginIsRegisterMode, setLoginIsRegisterMode] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  // Google QR & Skanerlash states
  const [loginTab, setLoginTab] = useState<'form' | 'qr_phone' | 'qr_webcam'>('form');
  const [phoneQrCountdown, setPhoneQrCountdown] = useState<number>(60);
  const [phoneQrStatus, setPhoneQrStatus] = useState<'waiting' | 'scanned' | 'connecting' | 'success' | 'expired'>('waiting');
  
  // Real Webcam / Camera QR Simulator scanner states
  const [webcamScanStatus, setWebcamScanStatus] = useState<'inactive' | 'activating' | 'searching' | 'detected' | 'success' | 'failed'>('inactive');
  const webcamVideoRef = useRef<HTMLVideoElement | null>(null);
  const webcamStreamRef = useRef<MediaStream | null>(null);
  const webcamTimerRef = useRef<any>(null);

  // Billing Checkouts Simulation state
  const [billingOverlayOpen, setBillingOverlayOpen] = useState(false);
  const [selectedCheckoutPlan, setSelectedCheckoutPlan] = useState<SubscriptionPlan | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<"plan" | "paySelect" | "redirecting" | "success">("plan");
  const [checkoutProvider, setCheckoutProvider] = useState<string>("");

  // Privacy Policy and Legal documents terms overlay states
  const [legalOverlayOpen, setLegalOverlayOpen] = useState(false);
  const [legalDocType, setLegalDocType] = useState<"privacy" | "terms">("privacy");

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedGenre, setSelectedGenre] = useState("all");

  // Loading timer simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setAppLoading(false);
      // Auto sign in user as a demo visual helper
      setCurrentUser({
        id: "u-3",
        email: "mehmon@htv.uz",
        role: Role.USER,
        subscriptionPlanId: null,
        subscriptionExpiresAt: null,
        isPremium: false
      });
    }, 2500); // Intro branding lasts 2.5 seconds
    return () => clearTimeout(timer);
  }, []);

  // Google QR scanning successful login
  const handleGoogleQrSuccessLogin = () => {
    const mockEmail = "hurmatbekuzpochta@gmail.com";
    const foundAdmin = users.find(u => u.email === mockEmail);
    const loggedUser = foundAdmin || {
      id: "g-1",
      email: mockEmail,
      role: Role.SUPER_ADMIN,
      subscriptionPlanId: "plan-12",
      isPremium: true,
      subscriptionExpiresAt: "2027-05-30"
    };
    
    // Add to users if not present
    if (!users.some(u => u.email === mockEmail)) {
      setUsers([...users, loggedUser]);
    }
    
    setCurrentUser(loggedUser);
    handleLogSecurityAction(`Google QR Auth orqali tizimga kirildi: ${mockEmail}`, "INFO");
    setLoginOverlayOpen(false);
    setLoginTab('form');
    alert("Google QR-kod orqali muvaffaqiyatli kirdingiz! (Super Admin vakolatlari faollashdi)");
  };

  // Google QR phone simulation timer
  useEffect(() => {
    let timer: any;
    if (loginOverlayOpen && loginTab === 'qr_phone') {
      setPhoneQrCountdown(60);
      setPhoneQrStatus('waiting');
      
      timer = setInterval(() => {
        setPhoneQrCountdown(prev => {
          if (prev <= 1) {
            setPhoneQrStatus('expired');
            clearInterval(timer);
            return 0;
          }
          // Scan sequence simulation
          if (prev === 52) {
            setPhoneQrStatus('scanned');
          }
          if (prev === 49) {
            setPhoneQrStatus('connecting');
          }
          if (prev === 46) {
            setPhoneQrStatus('success');
            clearInterval(timer);
            setTimeout(() => {
              handleGoogleQrSuccessLogin();
            }, 1000);
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setPhoneQrStatus('waiting');
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [loginOverlayOpen, loginTab]);

  // Start Webcam stream simulation
  const startWebcamScanner = async () => {
    setWebcamScanStatus('activating');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 640 }, height: { ideal: 480 } }
      });
      webcamStreamRef.current = stream;
      if (webcamVideoRef.current) {
        webcamVideoRef.current.srcObject = stream;
        webcamVideoRef.current.play().catch(e => console.log("Play failed", e));
      }
      setWebcamScanStatus('searching');
      
      // Simulate scanning algorithm locating QR Code
      webcamTimerRef.current = setTimeout(() => {
        setWebcamScanStatus('detected');
        
        webcamTimerRef.current = setTimeout(() => {
          setWebcamScanStatus('success');
          stopWebcamScanner();
          setTimeout(() => {
            handleGoogleQrSuccessLogin();
          }, 1200);
        }, 1500);
        
      }, 3500);
      
    } catch (err: any) {
      console.error("Webcam scan init error:", err);
      setWebcamScanStatus('failed');
    }
  };

  const stopWebcamScanner = () => {
    if (webcamStreamRef.current) {
      webcamStreamRef.current.getTracks().forEach(track => track.stop());
      webcamStreamRef.current = null;
    }
    if (webcamVideoRef.current) {
      webcamVideoRef.current.srcObject = null;
    }
    if (webcamTimerRef.current) {
      clearTimeout(webcamTimerRef.current);
    }
    setWebcamScanStatus('inactive');
  };

  // Webcam auto cleanup
  useEffect(() => {
    if (!loginOverlayOpen || loginTab !== 'qr_webcam') {
      stopWebcamScanner();
    } else if (loginOverlayOpen && loginTab === 'qr_webcam') {
      startWebcamScanner();
    }
    return () => {
      stopWebcamScanner();
    };
  }, [loginOverlayOpen, loginTab]);

  // Set selected movie when slug matches (mock url Router parser for /tv/movie/avatar-2 etc)
  const handleNavToMovieBySlug = (slug: string) => {
    const found = movies.find(m => m.slug === slug);
    if (found) {
      setSelectedMovie(found);
      setActiveTab("movie-detail");
    }
  };

  // Log Security breaches or activities
  const handleLogSecurityAction = (msg: string, level: "INFO" | "WARNING" | "CRITICAL") => {
    const newLog: SecurityLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      level,
      message: msg,
      userEmail: currentUser?.email || "Anonymous",
      ipAddress: "195.158.103.112"
    };
    setSecurityLogs([newLog, ...securityLogs]);
  };

  // Authentication Logic
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) return;

    if (loginIsRegisterMode) {
      // Sign Up simulation
      const newU: User = {
        id: `u-${Date.now()}`,
        email: loginEmail,
        role: Role.USER,
        subscriptionPlanId: null,
        subscriptionExpiresAt: null,
        isPremium: false,
        rememberMe
      };
      setUsers([...users, newU]);
      setCurrentUser(newU);
      handleLogSecurityAction(`Yangi foydalanunvchi ro'yxatdan o'tdi: ${loginEmail}`, "INFO");
      alert("Muvaffaqiyatli ro'yxatdan o'tdingiz!");
    } else {
      // Sign In simulation
      const found = users.find(u => u.email.toLowerCase() === loginEmail.toLowerCase());
      if (found) {
        setCurrentUser(found);
        handleLogSecurityAction(`Foydalanuvchi tizimga kirdi: ${loginEmail}`, "INFO");
      } else {
        // Fallback for easy demo: create an account on the fly!
        const newU: User = {
          id: `u-${Date.now()}`,
          email: loginEmail,
          role: loginEmail.includes("admin") ? Role.SUPER_ADMIN : Role.USER,
          subscriptionPlanId: loginEmail.includes("admin") ? "plan-12" : null,
          subscriptionExpiresAt: loginEmail.includes("admin") ? "2027-05-30" : null,
          isPremium: loginEmail.includes("admin") ? true : false,
          rememberMe
        };
        setUsers([...users, newU]);
        setCurrentUser(newU);
        handleLogSecurityAction(`Avtomatik namuna a'zo tizimga kirdi: ${loginEmail}`, "INFO");
      }
    }
    setLoginOverlayOpen(false);
    setLoginEmail("");
    setLoginPassword("");
  };

  // Google Sign In integration click demo
  const handleGoogleSignInDemo = () => {
    const mockEmail = "hurmatbekuzpochta@gmail.com";
    const foundAdmin = users.find(u => u.email === mockEmail);
    if (foundAdmin) {
      setCurrentUser(foundAdmin);
    } else {
      const gUser: User = {
        id: "g-1",
        email: mockEmail,
        role: Role.SUPER_ADMIN,
        subscriptionPlanId: "plan-12",
        isPremium: true,
        subscriptionExpiresAt: "2027-05-30"
      };
      setCurrentUser(gUser);
    }
    handleLogSecurityAction(`Google OAuth orqali kirildi: ${mockEmail}`, "INFO");
    setLoginOverlayOpen(false);
    alert("Google orqali kirdingiz! (Super Admin vakolatlari faollashdi)");
  };

  // Toggle favorites
  const handleToggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(f => f !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  // Subscription Checkout Simulating redirection
  const handleStartCheckout = (plan: SubscriptionPlan) => {
    setSelectedCheckoutPlan(plan);
    setCheckoutStep("paySelect");
  };

  const handleExecutePaymentRedirect = (provider: string) => {
    setCheckoutProvider(provider);
    setCheckoutStep("redirecting");

    // Simulate 2 seconds buffer simulating Click / Payme secure endpoint
    setTimeout(() => {
      setCheckoutStep("success");
      if (currentUser) {
        // Elevate user status
        const elevated: User = {
          ...currentUser,
          isPremium: true,
          subscriptionPlanId: selectedCheckoutPlan?.id || "plan-1",
          subscriptionExpiresAt: "2026-09-30"
        };
        setCurrentUser(elevated);
        setUsers(users.map(u => u.id === currentUser.id ? elevated : u));
        
        // Log transaction
        const newPayment: PaymentLog = {
          id: `pay-${Date.now().toString().substring(6)}`,
          userEmail: currentUser.email,
          planName: selectedCheckoutPlan ? selectedCheckoutPlan.nameUz : "VIP Obuna",
          amountUzS: selectedCheckoutPlan ? selectedCheckoutPlan.priceUzS : 15000,
          paymentMethod: provider,
          status: "success",
          createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
        };
        setPayments([newPayment, ...payments]);
        handleLogSecurityAction(`Muvaffaqiyatli to'lov: ${currentUser.email} (${provider})`, "INFO");
      }
    }, 2000);
  };

  // Translation Dictionaries
  const t = {
    uz: {
      nowOn: "Tavsiya etilgan kanallar",
      viewAll: "Barchasini ko'rish",
      searchHint: "Kanallar yoki kinolarni qidirish...",
      heroAction: "Hozir tomosha qiling",
      lockedCard: "Qulflangan",
      freeCard: "Bepul",
      scheduleTitle: "Bugungi Markaziy Ko'rsatuvlar",
      sportsTitle: "Jonli Sport O'yinlari",
      newsTitle: "HTV Yangiliklari",
      moviesHeader: "Premium Kino Teatr Kutubxonasi",
      tvHeader: "Jonli Efir TV Kanallari",
      favoritesHeader: "Sevimlilar ro'yxati (Bookmarks)",
      seriesHeader: "O'zbek va Jahon Seriallari",
      sportHeader: "Onlayn Sport Translyatsiyalari",
      noFavs: "Siz hali hech qaysi kanalni sevimlilarga qo'shmadingiz.",
      logoutConfirm: "Tizimdan chiqdingiz.",
      premiumUnlockNotice: "Ushbu kontentni tomosha qilish uchun Premium obunangiz bo'lishi shart!"
    },
    ru: {
      nowOn: "Рекомендуемые каналы",
      viewAll: "Смотреть все",
      searchHint: "Поиск каналов или фильмов...",
      heroAction: "Смотреть сейчас",
      lockedCard: "Премиум",
      freeCard: "Бесплатно",
      scheduleTitle: "Сегодняшняя программа передач",
      sportsTitle: "Прямые спортивные трансляции",
      newsTitle: "Новости HTV",
      moviesHeader: "Премиальная Библиотека Кинотеатра",
      tvHeader: "ТВ Каналы в Прямом Эфире",
      favoritesHeader: "Список Избранного (Закладки)",
      seriesHeader: "Узбекские и Мировые Сериалы",
      sportHeader: "Спортивные Онлайн Трансляции",
      noFavs: "Вы еще не добавили ни один канал в избранное.",
      logoutConfirm: "Вы вышли из системы.",
      premiumUnlockNotice: "Для просмотра этого контента необходима премиум-подписка!"
    },
    en: {
      nowOn: "Recommended Streams",
      viewAll: "Show all streams",
      searchHint: "Search live TV channels or movies...",
      heroAction: "Watch instantly",
      lockedCard: "Locked",
      freeCard: "Free",
      scheduleTitle: "Today's TV Guide",
      sportsTitle: "Live Sports Events",
      newsTitle: "Central Platform News",
      moviesHeader: "Premium Cinema Catalog",
      tvHeader: "Live HD Television Channels",
      favoritesHeader: "Your Bookcrossed Favorites",
      seriesHeader: "Local & Worldwide Television Series",
      sportHeader: "Sports Streams & Schedules",
      noFavs: "You haven't bookmarked any stream yet.",
      logoutConfirm: "Logged out successfully.",
      premiumUnlockNotice: "This material requires an active Premium membership card!"
    }
  }[currentLang];

  return (
    <div className="min-h-screen bg-transparent text-gray-100 flex flex-col font-sans transition-all">
      
      {/* 1. INITIAL LOGO ANIMATION LOADING (Netflix/OVVA style cinematic glowing introduction) */}
      <AnimatePresence>
        {appLoading && (
          <motion.div
            className="fixed inset-0 bg-[#020617] flex flex-col items-center justify-center z-50 select-none"
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            id="htv-cinematic-intro-loading"
          >
            <div className="text-center space-y-6">
              
              {/* Spinning and scaling customized logo ring */}
              <motion.div
                initial={{ scale: 0.5, rotate: -45, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-24 w-24 rounded-3xl bg-black border border-cyan-500 shadow-[0_0_50px_rgba(6,182,212,0.6)] flex items-center justify-center mx-auto"
              >
                <span className="font-display font-black text-6xl text-cyan-400 text-glow animate-pulse">
                  H
                </span>
              </motion.div>

              {/* Glowing title with slide animations */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="space-y-1.5"
              >
                <h1 className="font-display font-black text-4xl tracking-widest text-white">
                  HTV
                </h1>
                <p className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase font-bold text-glow">
                  "Eng tezkor onlayn TV va kino platforma"
                </p>
              </motion.div>

              {/* Loader bars */}
              <div className="w-48 h-1 bg-gray-950 rounded-full overflow-hidden mx-auto border border-cyan-500/10">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                  className="h-full bg-cyan-500 text-glow"
                />
              </div>

              <span className="text-[9px] font-mono text-gray-500 block">
                FAOL TO'LOV TIZIMI FAOL • SECURE ENGINE RESILIENT
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER NAVIGATION */}
      <Header
        currentLang={currentLang}
        onChangeLang={setCurrentLang}
        currentUser={currentUser}
        onLogout={() => {
          setCurrentUser(null);
          handleLogSecurityAction("Foydalanuvchi tizimdan chiqdi", "INFO");
          alert(t.logoutConfirm);
        }}
        activeTab={activeTab}
        onChangeTab={(tab) => {
          setActiveTab(tab);
          // reset sub-selections
          setSelectedChannel(null);
          setSelectedMovie(null);
          setPlayingEpisode(null);
        }}
        telegramLink={settings.telegramBotLink}
        onOpenLogin={() => {
          setLoginIsRegisterMode(false);
          setLoginOverlayOpen(true);
        }}
        onOpenBilling={() => {
          setCheckoutStep("plan");
          setBillingOverlayOpen(true);
        }}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* CORE BODY CONTAINER */}
      <main className="flex-grow w-full max-w-7xl mx-auto py-6" id="htv-main-views-orchestrator">
        <AnimatePresence mode="wait">
          
          {/* ==================== A. HOME BOSH SAHIFA ==================== */}
          {activeTab === "home" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-10 px-4 md:px-8"
              key="tab-home"
            >
              
              {/* 1. CINEMATIC HERO BANNER OVERLAY */}
              <div 
                className="relative w-full aspect-[2.6/1] md:aspect-[3/1] rounded-3xl overflow-hidden border border-cyan-500/25 shadow-[0_0_35px_rgba(6,182,212,0.12)] bg-cover bg-center flex items-end p-6 md:p-12"
                style={{ backgroundImage: `linear-gradient(to top, #050505 0%, rgba(5,5,5,0.85) 30%, rgba(5,5,5,0.2) 100%), url('https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&q=80&w=1200')` }}
                id="htv-cinematic-hero-card"
              >
                <div className="absolute inset-0 bg-cyan-500/5 mix-blend-overlay"></div>
                <div className="max-w-2xl space-y-3 relative z-10 text-left">
                  <span className="bg-red-600 text-white text-[9px] font-black px-2 py-0.5 w-max rounded-sm uppercase tracking-widest text-glow">
                    PREM'YERA • VIP
                  </span>
                  <h1 className="font-display font-black text-2xl md:text-5xl text-white tracking-tight leading-none mb-1">
                    AVATAR: <span className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">SUV YO'LI</span>
                  </h1>
                  <p className="text-gray-400 text-xs md:text-sm line-clamp-2 max-sm:hidden leading-relaxed max-w-lg">
                    Jeyms Kemeronning afsonaviy asari davomi. Pandora sayyorasining suv osti dunyosi va yangi xavf-xatarlar haqidagi hayratlanarli sarguzasht.
                  </p>
                  <div className="flex items-center space-x-3 pt-2">
                    <button
                      onClick={() => handleNavToMovieBySlug("avatar-2")}
                      className="px-8 py-3 rounded bg-white text-black font-extrabold text-xs uppercase font-display flex items-center space-x-2 shadow-[0_4px_12px_rgba(255,255,255,0.15)] hover:bg-cyan-400 hover:scale-[1.02] transition-colors cursor-pointer"
                    >
                      <Play size={13} className="fill-black" />
                      <span>{t.heroAction}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 2. DYNAMIC TV CHANNELS CAROUSEL */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-display font-extrabold text-sm md:text-base text-white tracking-widest uppercase flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                    <span>O'zbekiston Milliy TV oqimlari (LIVE)</span>
                  </h2>
                  <button
                    onClick={() => setActiveTab("tv")}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center space-x-1 uppercase tracking-wider"
                  >
                    <span>{t.viewAll}</span>
                    <ChevronRight size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {channels
                    .filter(c => c.isActive && c.category === "o'zbek kanallar")
                    .slice(0, 5)
                    .map((ch) => (
                      <div
                        key={ch.id}
                        onClick={() => {
                          setSelectedChannel(ch);
                          setActiveTab("channel-detail");
                        }}
                        className="group relative rounded-xl overflow-hidden border border-white/5 bg-zinc-900 p-3 h-32 flex flex-col justify-between cursor-pointer transition-all hover:border-cyan-500/50 shadow-lg glow-glow-hover"
                      >
                        <div className="flex justify-between items-start">
                          <img
                            src={ch.logo}
                            alt=""
                            className="w-10 h-10 rounded object-cover border border-white/10"
                          />
                          {ch.isPremium ? (
                            <span className="text-[8px] font-extrabold bg-gradient-to-tr from-cyan-400 to-emerald-400 text-black px-1.5 py-0.5 rounded uppercase">★</span>
                          ) : (
                            <span className="text-[8px] font-bold bg-[#0d0d0d] text-gray-400 border border-white/5 px-1.5 py-0.5 rounded uppercase">Free</span>
                          )}
                        </div>
                        <div className="text-left mt-2">
                          <p className="font-bold text-white text-xs truncate leading-normal group-hover:text-cyan-400 transition-colors">
                            {ch.name}
                          </p>
                          <span className="text-[9px] font-mono text-cyan-400/80 flex items-center">
                            <span className="h-1.5 w-1.5 bg-red-500 rounded-full mr-1 animate-ping"></span>
                            Live IPTV
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* 3. BUGUNGI SPORT JADVALI GURUH */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                
                {/* Sports listing Table */}
                <div className="lg:col-span-2 bg-[#0c0c0c] rounded-xl p-5 md:p-6 border border-white/5 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <h3 className="font-display font-extrabold text-xs uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                      <span>⚽ {t.sportsTitle}</span>
                    </h3>
                    <button
                      onClick={() => setActiveTab("sport")}
                      className="text-[10px] text-gray-400 hover:text-cyan-400 uppercase font-mono font-bold"
                    >
                      Barcha o'yinlar
                    </button>
                  </div>

                  <div className="space-y-3.0 divide-y divide-[#151515]">
                    {initialSportsMatches.map((match) => (
                      <div 
                        key={match.id} 
                        className="pt-3 pb-1 flex flex-col md:flex-row md:items-center justify-between text-xs text-left gap-3 cursor-pointer hover:bg-white/5 p-2 rounded transition-colors"
                        onClick={() => {
                          const chan = channels.find(c => c.name.toLowerCase().indexOf(match.channelName.toLowerCase()) !== -1);
                          if (chan) {
                            setSelectedChannel(chan);
                            setActiveTab("channel-detail");
                          } else {
                            setActiveTab("sport");
                          }
                        }}
                      >
                        <div className="space-y-0.5 min-w-[200px]">
                          <span className="text-[10px] font-bold text-cyan-400 font-mono block">{match.tournament}</span>
                          <div className="flex items-center space-x-2 font-bold text-white text-sm">
                            <span>{match.teamA} {match.logoA}</span>
                            <span className="text-gray-500 text-xs font-mono">vs</span>
                            <span>{match.logoB} {match.teamB}</span>
                          </div>
                        </div>

                        <div className="text-xs md:text-center shrink-0">
                          <p className="text-gray-400 font-medium">{match.startTime}</p>
                          <p className="text-[10px] font-mono text-cyan-400/80 mt-0.5">{match.channelName}</p>
                        </div>

                        {match.isLive && (
                          <span className="px-2 py-1 rounded bg-red-950 text-red-500 border border-red-900 text-[9px] uppercase font-bold font-mono animate-pulse shrink-0">
                            LIVE {match.score}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* TODAY CENTRAL NEWS SECTION */}
                <div className="bg-[#0c0c0c] rounded-xl p-5 border border-white/5 space-y-4 text-left shadow-xl">
                  <h3 className="font-display font-extrabold text-xs uppercase tracking-wider text-cyan-400 border-b border-white/5 pb-3 flex items-center gap-2">
                    <span>📰 {t.newsTitle}</span>
                  </h3>

                  <div className="space-y-4">
                    {news.map((item) => (
                      <div key={item.id} className="space-y-1.5 group select-none">
                        <img 
                          src={item.imageUrl} 
                          alt="" 
                          className="w-full aspect-[2/1] object-cover rounded-lg border border-white/5" 
                        />
                        <span className="text-[9px] text-gray-500 block font-mono">Chop etildi: {item.publishedAt}</span>
                        <h4 className="text-xs font-extrabold text-white group-hover:text-cyan-400 transition-colors">
                          {currentLang === Lang.UZ ? item.titleUz : currentLang === Lang.RU ? item.titleRu : item.titleEn}
                        </h4>
                        <p className="text-[10px] text-gray-400 line-clamp-2">
                          {currentLang === Lang.UZ ? item.contentUz : currentLang === Lang.RU ? item.contentRu : item.contentEn}
                        </p>
                      </div>
                    ))}
                  </div>

                </div>

              </div>

            </motion.div>
          )}

          {/* ==================== B. KINOLAR SAHIFA ==================== */}
          {activeTab === "movies" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6 px-4 md:px-8 text-left"
              key="tab-movies"
            >
              
              <div className="space-y-1">
                <h1 className="text-xl md:text-2xl font-display font-extrabold text-white uppercase tracking-wider">
                  {t.moviesHeader}
                </h1>
                <p className="text-xs text-gray-400">Eng so'nggi va yuqori sifatli filmlar kutubxonasidan bahramand bo'ling.</p>
              </div>

              {/* SEARCH AND GENRE FILTER UTILITY BAR */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-cyan-400" />
                  <input
                    type="text"
                    placeholder="Film qidirish..."
                    className="w-full bg-zinc-900 border border-white/5 text-xs rounded pl-9 pr-4 py-3 text-white focus:outline-none focus:border-cyan-500/50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div>
                  <select
                    className="w-full bg-zinc-900 border border-white/5 text-xs rounded p-3 text-white focus:outline-none focus:border-cyan-500/50 cursor-pointer"
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                  >
                    <option value="all">Barcha Janrlar</option>
                    <option value="fantastika">Fantastika</option>
                    <option value="komediya">Komediya</option>
                    <option value="drama">Drama</option>
                    <option value="jangari">Jangari</option>
                    <option value="multfilm">Multfilm</option>
                  </select>
                </div>

              </div>

              {/* MOVIES GRID LIST */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {movies
                  .filter((m) => {
                    const matchesSearch = m.nameUz.toLowerCase().includes(searchQuery.toLowerCase()) || m.genreUz.toLowerCase().includes(searchQuery.toLowerCase());
                    const matchesGenre = selectedGenre === "all" || m.genreUz.toLowerCase().includes(selectedGenre.toLowerCase()) || m.genreEn.toLowerCase().includes(selectedGenre.toLowerCase());
                    return m.isActive && matchesSearch && matchesGenre;
                  })
                  .map((m) => (
                    <div
                      key={m.id}
                      onClick={() => {
                        setSelectedMovie(m);
                        setActiveTab("movie-detail");
                      }}
                      className="group cursor-pointer space-y-2 text-left"
                    >
                      <div className="relative aspect-[2/3] rounded-lg overflow-hidden border border-white/5 bg-zinc-900 shadow-md group-hover:-translate-y-1 transition-all group-hover:border-cyan-500/50">
                        <img
                          src={m.poster}
                          alt={m.nameUz}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-2 right-2 flex flex-col gap-1 items-end z-10">
                          {m.isPremium ? (
                            <span className="text-[8px] font-black bg-cyan-400 text-black px-1.5 py-0.5 rounded-sm shadow">VIP ★</span>
                          ) : (
                            <span className="text-[8px] font-bold bg-black/80 text-gray-300 px-1.5 py-0.5 rounded-sm border border-white/5">FREE</span>
                          )}
                          <span className="text-[9px] font-mono font-bold bg-black/80 text-cyan-400 px-2 py-0.5 rounded-sm border border-cyan-500/15 flex items-center">
                            ★ {m.rating}
                          </span>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-xs truncate leading-normal transition-colors group-hover:text-cyan-400">
                          {currentLang === Lang.UZ ? m.nameUz : currentLang === Lang.RU ? m.nameRu : m.nameEn}
                        </h3>
                        <p className="text-[10px] text-gray-500 font-mono mt-0.5">{m.year} • {m.durationMinutes} min</p>
                      </div>
                    </div>
                  ))}
              </div>

            </motion.div>
          )}

          {/* ==================== C. MOVIE DETAIL VIEW ==================== */}
          {activeTab === "movie-detail" && selectedMovie && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key="tab-movie-detail"
            >
              <MovieDetail
                movie={selectedMovie}
                currentUser={currentUser}
                onBack={() => setActiveTab("movies")}
                lang={currentLang}
                onTriggerLogin={() => {
                  setLoginIsRegisterMode(false);
                  setLoginOverlayOpen(true);
                }}
                onTriggerSubscription={() => {
                  setCheckoutStep("plan");
                  setBillingOverlayOpen(true);
                }}
              />
            </motion.div>
          )}

          {/* ==================== D. TV KANALLAR SAHIFA ==================== */}
          {activeTab === "tv" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6 px-4 md:px-8 text-left"
              key="tab-television"
            >
              
              <div className="space-y-1">
                <h1 className="text-xl md:text-2xl font-display font-extrabold text-white uppercase tracking-wider">
                  {t.tvHeader}
                </h1>
                <p className="text-xs text-gray-400">O'zbekistondagi milliy va sport telekanallarini yuqori Full HD sifatda jonli tomosha qiling.</p>
              </div>

              {/* CHANNELS NAVIGATION BAR AND CATEGORY TABS */}
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                
                <div className="flex flex-wrap gap-2">
                  {["all", "o'zbek kanallar", "sport", "yangiliklar", "bolalar", "premium", "musiqa", "favorites"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${selectedCategory === cat ? "bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)] border-transparent" : "bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:bg-white/10"}`}
                    >
                      {cat === "favorites" ? "Sevimlilar ❤️" : cat}
                    </button>
                  ))}
                </div>

                <div className="relative max-sm:w-full md:w-64">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-cyan-400" />
                  <input
                    type="text"
                    placeholder="Kanal qidirish..."
                    className="w-full bg-zinc-900 border border-white/5 text-xs rounded pl-9 pr-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

              </div>

              {/* LISTING CHANNELS IN GRID */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {channels
                  .filter((ch) => {
                    const matchesSearch = ch.name.toLowerCase().includes(searchQuery.toLowerCase());
                    let matchesCat = true;
                    if (selectedCategory === "favorites") {
                      matchesCat = favorites.includes(ch.id);
                    } else if (selectedCategory !== "all") {
                      matchesCat = ch.category === selectedCategory;
                    }
                    return ch.isActive && matchesSearch && matchesCat;
                  })
                  .map((ch) => (
                    <div
                      key={ch.id}
                      onClick={() => {
                        setSelectedChannel(ch);
                        setActiveTab("channel-detail");
                      }}
                      className="group relative rounded-lg overflow-hidden border border-white/5 bg-zinc-900 p-3 h-32 flex flex-col justify-between cursor-pointer transition-all hover:border-cyan-500/50 shadow-lg glow-glow-hover"
                    >
                      <div className="flex justify-between items-start">
                        <img
                          src={ch.logo}
                          alt=""
                          className="w-10 h-10 rounded object-cover border border-white/10"
                        />
                        {ch.isPremium ? (
                          <span className="text-[8px] font-extrabold bg-gradient-to-tr from-cyan-400 to-emerald-400 text-black px-1.5 py-0.5 rounded-sm uppercase font-display tracking-widest shadow">VIP</span>
                        ) : (
                          <span className="text-[8px] font-bold bg-[#0d0d0d] text-gray-400 border border-white/5 px-1.5 py-0.5 rounded-sm uppercase">Free</span>
                        )}
                      </div>
                      <div className="text-left mt-2">
                        <p className="font-bold text-white text-xs truncate leading-normal transition-colors group-hover:text-cyan-400">
                          {ch.name}
                        </p>
                        <span className="text-[9px] font-mono text-cyan-400/80 flex items-center">
                          <span className="h-1 w-1 bg-red-500 rounded-full mr-1 animate-ping"></span>
                          EFIR LIVE
                        </span>
                      </div>
                    </div>
                  ))}
              </div>

              {/* NO FAVORITES FALLBACK */}
              {selectedCategory === "favorites" && favorites.length === 0 && (
                <div className="text-center py-12 text-gray-500 font-medium">
                  <p>{t.noFavs}</p>
                </div>
              )}

            </motion.div>
          )}

          {/* ==================== E. CHANNEL DETAIL VIEW ==================== */}
          {activeTab === "channel-detail" && selectedChannel && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key="tab-channel-detail"
            >
              <ChannelDetail
                channel={selectedChannel}
                allChannels={channels}
                currentUser={currentUser}
                onSelectChannel={setSelectedChannel}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                lang={currentLang}
                onTriggerLogin={() => {
                  setLoginIsRegisterMode(false);
                  setLoginOverlayOpen(true);
                }}
                onTriggerSubscription={() => {
                  setCheckoutStep("plan");
                  setBillingOverlayOpen(true);
                }}
              />
            </motion.div>
          )}

          {/* ==================== F. SERIAL SAHIFA ==================== */}
          {activeTab === "series" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6 px-4 md:px-8 text-left"
              key="tab-series"
            >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
                {allSeries.map((s) => (
                  <div key={s.id} className="bg-[#0c0c0c] p-5 rounded-xl border border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-4 items-start shadow-xl">
                    <img src={s.poster} alt="" className="w-full aspect-[2/3] object-cover rounded-lg border border-white/10" />
                    <div className="sm:col-span-2 space-y-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[9px] font-bold font-mono text-cyan-400 border border-cyan-500/20 px-1.5 py-0.5 rounded">{s.year}</span>
                          {s.isPremium && <span className="text-[9px] font-black bg-cyan-400 text-black px-1.5 py-0.5 rounded-sm">PREMIUM</span>}
                        </div>
                        <h3 className="font-display font-extrabold text-lg text-white mt-1">
                          {currentLang === Lang.UZ ? s.nameUz : currentLang === Lang.RU ? s.nameRu : s.nameEn}
                        </h3>
                        <p className="text-[10px] text-gray-500 font-mono mt-0.5">Janri: {currentLang === Lang.UZ ? s.genresUz : currentLang === Lang.RU ? s.genresRu : s.genresEn}</p>
                      </div>

                      {/* SEASON EPSIODE ACCORDION/SELECT SIMULATOR */}
                      <div className="space-y-2 border-t border-white/5 pt-3">
                        <p className="text-[10px] text-cyan-400 uppercase tracking-widest font-bold">Mavsum va qismlar:</p>
                        
                        <div className="space-y-1 max-h-[140px] overflow-y-auto pr-1">
                          {s.seasons.map((season) => (
                            <div key={season.id} className="space-y-1">
                              <p className="text-[10px] text-gray-550 font-bold uppercase mt-1">Mavsum {season.seasonNumber}:</p>
                              {season.episodes.map((ep) => (
                                <button
                                  key={ep.id}
                                  onClick={() => {
                                    setPlayingEpisode({
                                      seriesName: currentLang === Lang.UZ ? s.nameUz : s.nameEn,
                                      seriesPoster: s.poster,
                                      isPremium: s.isPremium,
                                      title: currentLang === Lang.UZ ? ep.titleUz : currentLang === Lang.RU ? ep.titleRu : ep.titleEn,
                                      url: ep.videoUrl
                                    });
                                  }}
                                  className="w-full text-left p-2 rounded bg-black/40 border border-white/5 hover:border-cyan-500/40 text-[11px] text-gray-300 hover:text-white flex items-center justify-between"
                                >
                                  <span>{currentLang === Lang.UZ ? ep.titleUz : currentLang === Lang.RU ? ep.titleRu : ep.titleEn}</span>
                                  <span className="text-[9px] font-mono text-gray-500">{ep.durationMinutes} min</span>
                                </button>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
              </div>

              {/* DYNAMIC EPISODIC OVERLAY PLAYBACK */}
              {playingEpisode && (
                <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
                  <div className="max-w-4xl w-full bg-[#0c0c0c] p-6 rounded-xl border border-white/10 text-left space-y-4 shadow-2xl">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <div className="text-left">
                        <p className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-widest">{playingEpisode.seriesName}</p>
                        <h4 className="font-display font-black text-white text-base leading-normal">{playingEpisode.title}</h4>
                      </div>
                      <button
                        onClick={() => setPlayingEpisode(null)}
                        className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded text-xs select-none transition-colors"
                      >
                        Yopish ✕
                      </button>
                    </div>

                    <div className="relative aspect-video rounded-lg overflow-hidden border border-white/5 bg-black shadow-2xl">
                      <iframe
                        src={playingEpisode.url}
                        className="w-full h-full"
                        allowFullScreen
                      />
                      
                      {/* Premium locker on episode */}
                      {playingEpisode.isPremium && !currentUser?.isPremium && (
                        <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center text-center p-6">
                          <Lock className="text-cyan-400 h-10 w-10 animate-bounce mb-3" />
                          <h4 className="text-white font-extrabold text-base">Ruxsat etilmadi</h4>
                          <p className="text-xs text-gray-400 max-w-sm mt-1.5 text-center">Ushbu seriya VIP obuna doirasida namoyish etiladi. Davom etish uchun professional hisob oling.</p>
                          <button
                            onClick={() => {
                              setPlayingEpisode(null);
                              setCheckoutStep("plan");
                              setBillingOverlayOpen(true);
                            }}
                            className="mt-4 px-6 py-2 rounded bg-cyan-500 text-black text-xs font-bold uppercase hover:bg-cyan-400 transition-colors"
                          >
                            Hozir obuna bo'lish
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          )}

          {/* ==================== G. SPORT TV JADVAL SAHIFA ==================== */}
          {activeTab === "sport" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6 px-4 md:px-8 text-left"
              key="tab-sport"
            >
              
              <div className="space-y-1">
                <h1 className="text-xl md:text-2xl font-display font-extrabold text-white uppercase tracking-wider">
                  {t.sportHeader}
                </h1>
                <p className="text-xs text-gray-400">Jahon ligalari, O'zbekiston superligasi hamda terma jamoa ishtirokidagi markaziy o'yinlar jadvali va translyatsiyalari.</p>
              </div>

              {/* LIST OF MATCES */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6">
                {initialSportsMatches.map((match) => (
                  <div
                    key={match.id}
                    className="bg-[#0c0c0c] p-5 rounded-xl border border-white/5 space-y-4 text-left shadow-xl"
                  >
                    <div className="flex justify-between items-center bg-white/5 px-3 py-1.5 rounded border border-white/5">
                      <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest font-mono">{match.tournament}</span>
                      {match.isLive ? (
                        <span className="flex items-center space-x-1.5 animate-pulse">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                          <span className="text-[9px] font-mono font-bold text-red-500 uppercase">Live efir</span>
                        </span>
                      ) : (
                        <span className="text-[9px] font-mono text-gray-500 font-bold uppercase">Kutilmoqda</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center space-x-3 w-1/3">
                        <span className="text-3xl">{match.logoA}</span>
                        <span className="font-extrabold text-white text-xs sm:text-sm">{match.teamA}</span>
                      </div>
                      
                      <div className="text-center w-1/3">
                        {match.isLive && match.score ? (
                          <span className="px-3 py-1 bg-red-600 text-white font-mono font-black text-sm rounded whitespace-nowrap shadow-[0_0_10px_rgba(220,38,38,0.3)]">
                            {match.score}
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded bg-[#0a0a0a] border border-white/5 text-gray-400 font-mono text-[10px] tracking-tight">VS</span>
                        )}
                      </div>

                      <div className="flex items-center justify-end space-x-3 w-1/3 text-right">
                        <span className="font-extrabold text-white text-xs sm:text-sm">{match.teamB}</span>
                        <span className="text-3xl">{match.logoB}</span>
                      </div>
                    </div>

                    <div className="border-t border-white/5 pt-3 flex items-center justify-between text-[11px] text-gray-400">
                      <div>
                        <p>Boshlanish vaqti: <span className="text-white font-mono">{match.startTime}</span></p>
                        <p className="text-[10px] text-cyan-400 mt-0.5 font-semibold">Telekanal: {match.channelName}</p>
                      </div>

                      <button
                        onClick={() => {
                          const chan = channels.find(c => c.name.toLowerCase().indexOf(match.channelName.toLowerCase()) !== -1);
                          if (chan) {
                            setSelectedChannel(chan);
                            setActiveTab("channel-detail");
                          } else {
                            alert("Kanal oqimi topilmadi. TV kanallar ro'yxatidan qidiring.");
                          }
                        }}
                        className="px-5 py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-[10px] uppercase shadow transition-all cursor-pointer"
                      >
                        Oqimga o'tish
                      </button>
                    </div>

                  </div>
                ))}
              </div>

            </motion.div>
          )}

          {/* ==================== H. BILLING SUBSCIPTION CHANNELS ==================== */}
          {activeTab === "billing" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6 px-4 md:px-8 max-w-4xl mx-auto text-center py-8"
              key="tab-billing"
            >
              <div className="space-y-2">
                <span className="text-[10px] bg-white/5 text-cyan-400 border border-white/10 px-3 py-1.5 rounded uppercase tracking-widest font-extrabold text-glow">
                  Tarif rejalari
                </span>
                <h1 className="text-2xl md:text-3xl font-display font-black text-white uppercase tracking-tight">
                  Premium Obunani Faollashtiring
                </h1>
                <p className="text-xs text-gray-400 max-w-lg mx-auto">
                  HTV VIP kanallari, milliy va xalqaro sport, va reklamalarsiz cheksiz filmlar tomoshalari faqat premium a'zolarimiz uchun ochiq!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                {plans.filter(p => p.status === "active").map((plan) => (
                  <div
                    key={plan.id}
                    className="bg-[#0c0c0c] rounded-xl p-6 border border-white/5 flex flex-col justify-between hover:border-cyan-500/30 transition-all shadow-xl"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-display font-extrabold text-base text-white uppercase tracking-wide">
                          {plan.nameUz}
                        </h3>
                        <span className="text-[10px] bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded font-mono font-bold">
                          {plan.durationMonths} Oy
                        </span>
                      </div>
                      <p className="text-2xl font-mono font-black text-emerald-400">
                        {plan.priceUzS.toLocaleString()} UZS
                      </p>
                      
                      <ul className="space-y-1 text-xs text-gray-400 pt-3 border-t border-gray-950">
                        <li className="flex items-center space-x-1.5">
                          <CheckCircle size={13} className="text-cyan-500" />
                          <span>100% Full HD sifatda IPTV list</span>
                        </li>
                        <li className="flex items-center space-x-1.5">
                          <CheckCircle size={13} className="text-cyan-500" />
                          <span>Hech qanday video oldi reklamalarsiz</span>
                        </li>
                        <li className="flex items-center space-x-1.5">
                          <CheckCircle size={13} className="text-cyan-500" />
                          <span>Shaxsiy xizmat va qo'llab quvvatlash darsi</span>
                        </li>
                      </ul>
                    </div>

                    <button
                      onClick={() => handleStartCheckout(plan)}
                      className="w-full mt-6 py-2.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs uppercase shadow cursor-pointer transition-transform hover:scale-[1.01]"
                    >
                      Ulanish (To'lov)
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ==================== I. ADMIN PANEL SECTION ==================== */}
          {activeTab === "admin" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key="tab-admin"
            >
              <AdminPanel
                currentUser={currentUser}
                channels={channels}
                movies={movies}
                series={allSeries}
                plans={plans}
                ads={ads}
                settings={settings}
                users={users}
                payments={payments}
                logs={securityLogs}
                news={news}
                onUpdateChannels={setChannels}
                onUpdateMovies={setMovies}
                onUpdateSeries={setAllSeries}
                onUpdatePlans={setPlans}
                onUpdateAds={setAds}
                onUpdateSettings={setSettings}
                onUpdateUsers={setUsers}
                onUpdateNews={setNews}
                onLogAction={handleLogSecurityAction}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <Footer
        currentLang={currentLang}
        onOpenPrivacy={() => {
          setLegalDocType("privacy");
          setLegalOverlayOpen(true);
        }}
        onOpenTerms={() => {
          setLegalDocType("terms");
          setLegalOverlayOpen(true);
        }}
      />

      {/* OVERLAY S1: REGISTER & LOGIN DIALOG MODAL */}
      {loginOverlayOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="glass-neon p-6 rounded-2xl border border-cyan-950 max-w-sm w-full text-left space-y-4 relative">
            <button
              onClick={() => {
                setLoginOverlayOpen(false);
                setLoginTab('form');
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-white"
            >
              ✕
            </button>

            <div className="text-center space-y-1">
              <h2 className="font-display font-extrabold text-xl text-white">
                {loginIsRegisterMode ? "HTV Ro'yxatdan o'tish" : "HTV Tizimga kirish"}
              </h2>
              <p className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase">Eng tezkor video portal</p>
            </div>

            {/* SYSTEM TAB SELECTOR FOR SCANNING MODES */}
            <div className="grid grid-cols-3 gap-1 bg-black/50 p-1 rounded-lg border border-white/5 text-[10px] font-bold uppercase tracking-wider">
              <button
                onClick={() => setLoginTab('form')}
                className={`py-1.5 rounded transition-all cursor-pointer ${loginTab === 'form' ? 'bg-cyan-500 text-black shadow' : 'text-gray-400 hover:text-white'}`}
              >
                Parol orqali
              </button>
              <button
                onClick={() => setLoginTab('qr_phone')}
                className={`py-1.5 rounded transition-all cursor-pointer ${loginTab === 'qr_phone' ? 'bg-cyan-500 text-black shadow' : 'text-gray-400 hover:text-white'}`}
              >
                Telefon (QR)
              </button>
              <button
                onClick={() => setLoginTab('qr_webcam')}
                className={`py-1.5 rounded transition-all cursor-pointer ${loginTab === 'qr_webcam' ? 'bg-cyan-500 text-black shadow' : 'text-gray-400 hover:text-white'}`}
              >
                Kamera (QR)
              </button>
            </div>

            {/* TAB 1: STANDARD LOGIN FORM */}
            {loginTab === 'form' && (
              <form onSubmit={handleAuthSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Email manzil *</label>
                  <input
                    type="email"
                    placeholder="masalan, user@example.com"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full bg-black border border-cyan-950 p-2 text-white rounded"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Maxfiy parol *</label>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-black border border-cyan-950 p-2 text-white rounded"
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-gray-400">
                  <label className="flex items-center space-x-1 px-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="accent-cyan-500"
                    />
                    <span>Eslab qolish</span>
                  </label>
                  <span className="hover:text-cyan-400 cursor-pointer">Parolni tiklash?</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-full bg-cyan-500 text-black font-extrabold uppercase text-[11px] shadow-[0_0_15px_rgba(6,182,212,0.4)] cursor-pointer animate-pulse"
                >
                  {loginIsRegisterMode ? "A'zo bo'lish" : "Kirish qilish"}
                </button>
              </form>
            )}

            {/* TAB 2: GOOGLE AUTH QR CODE DISPLAY (PHONE SCANNER) */}
            {loginTab === 'qr_phone' && (
              <div className="space-y-4 text-center">
                <p className="text-[11px] text-gray-400">
                  O'zbekistondagi yagona Google Smart Auth skanerlash tizimi. Telefoningiz bilan quyidagi xavfsiz kodni skanerlang:
                </p>

                {/* Animated vector QR code */}
                <div className="relative p-3 bg-white rounded-xl mx-auto w-36 h-36 flex items-center justify-center border-2 border-cyan-500/40">
                  <QrCode size={110} className="text-black" />
                  
                  {/* Glowing custom laser scanning bar */}
                  <div className="absolute inset-x-2 h-0.5 bg-cyan-500 shadow-[0_0_8px_#22d3ee] animate-bounce top-[45%]" />
                  
                  {/* Google Logo center identifier */}
                  <div className="absolute bg-white p-1 rounded-md shadow-md">
                    <Compass className="w-5 h-5 text-cyan-600 animate-spin" style={{ animationDuration: '6s' }} />
                  </div>
                </div>

                {/* QR scanner logs/states */}
                <div className="bg-black/40 border border-white/5 p-2.5 rounded-lg text-left font-mono text-[9px] space-y-1">
                  <div className="flex justify-between text-gray-500">
                    <span>Seans vaqti:</span>
                    <span className="text-cyan-400 font-bold">{phoneQrCountdown} soniya</span>
                  </div>
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                    <span className="text-gray-300">
                      {phoneQrStatus === 'waiting' && "Telefon skanerlanishi kutilmoqda..."}
                      {phoneQrStatus === 'scanned' && "✓ Google login so'rovi qabul qilindi"}
                      {phoneQrStatus === 'connecting' && "● Ma'lumotlarni sinxronlash..."}
                      {phoneQrStatus === 'success' && "Tabriklaymiz! Avtorizatsiya muvaffaqiyatli"}
                      {phoneQrStatus === 'expired' && "❗ QR seans muddati tugadi"}
                    </span>
                  </div>
                </div>

                {/* Simulation actions */}
                <div className="space-y-2">
                  <button
                    onClick={handleGoogleQrSuccessLogin}
                    className="w-full py-2 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-black font-extrabold text-[10px] rounded uppercase shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Smartphone size={13} />
                    <span>Tezkor skanerlashni simulyatsiya qilish</span>
                  </button>
                  {phoneQrStatus === 'expired' && (
                    <button
                      onClick={() => {
                        setPhoneQrCountdown(60);
                        setPhoneQrStatus('waiting');
                      }}
                      className="text-xs text-cyan-400 font-bold flex items-center justify-center gap-1 mx-auto"
                    >
                      <RefreshCw size={12} /> Seansni yangilash
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: APP LIVE CAM SCANNER SIMULATION */}
            {loginTab === 'qr_webcam' && (
              <div className="space-y-4 text-center">
                <p className="text-[11px] text-gray-400">
                  Kompyuteringiz kamerasini yoqib, mobil telefondagi Google Auth QR-kodini kameraga ko'rsating:
                </p>

                {/* Custom live tracking scan view finder */}
                <div className="relative rounded-xl overflow-hidden bg-black aspect-[4/3] border border-cyan-500/30 flex items-center justify-center">
                  <video ref={webcamVideoRef} className="w-full h-full object-cover scale-x-[-1]" playsInline muted />
                  
                  {/* Scanner Graphic HUD elements */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    {/* Futuristic cyan framing highlights */}
                    <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-cyan-400" />
                    <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-cyan-400" />
                    <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-cyan-400" />
                    <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-cyan-400" />

                    {/* Camera finder brackets */}
                    <div className="w-24 h-24 border border-dashed border-cyan-400/30 rounded-lg flex items-center justify-center relative">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full absolute -top-1 -left-1 animate-ping" />
                      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    </div>

                    {/* Infinite light sweeping scanning laser */}
                    <div className="absolute left-0 right-0 h-0.5 bg-cyan-400/80 shadow-[0_0_10px_#22d3ee] animate-pulse" style={{ top: '50%' }} />
                  </div>

                  {/* Status Overlay box */}
                  <div className="absolute bottom-3 left-3 right-3 bg-black/85 border border-white/15 p-2.5 rounded text-[9px] font-mono text-left select-none space-y-0.5">
                    {webcamScanStatus === 'inactive' && <span className="text-gray-500">● KAMERA ISHLAMAYAPDI</span>}
                    {webcamScanStatus === 'activating' && <span className="text-amber-400 animate-pulse">● KAMERA YOQILMOQDA...</span>}
                    {webcamScanStatus === 'searching' && <span className="text-cyan-400 animate-pulse flex items-center gap-1">⏱ SCANNER AKTIV: QR KODNI KO'RSATING...</span>}
                    {webcamScanStatus === 'detected' && <span className="text-amber-400 font-bold animate-pulse flex items-center gap-1">🎯 GOOGLE SECURE QR ANIQLANDI!</span>}
                    {webcamScanStatus === 'success' && <span className="text-emerald-400 font-bold flex items-center gap-1">✓ XAVFSIZ KIRISH RUXSATI BERILDI</span>}
                    {webcamScanStatus === 'failed' && <span className="text-red-500 font-bold flex flex-col gap-0.5">
                      <span>● RUXSAT ERTILMADI / KAMERA YO'Q</span>
                      <span className="text-[8px] text-gray-400">Sizda veb-kamera ruxsati rad etilgan yoki kamerangiz nosoz. Pastdagi simulyatsiyadan foydalaning:</span>
                    </span>}
                  </div>
                </div>

                {/* Simulated login action option */}
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      stopWebcamScanner();
                      handleGoogleQrSuccessLogin();
                    }}
                    className="w-full py-2 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-black font-extrabold text-[10px] rounded uppercase shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Laptop size={13} />
                    <span>Skanerlashni simulyatsiya qilish</span>
                  </button>
                  
                  {webcamScanStatus === 'failed' && (
                    <button
                      onClick={() => {
                        stopWebcamScanner();
                        startWebcamScanner();
                      }}
                      className="text-[10px] text-cyan-400 font-bold underline flex items-center justify-center gap-1 mx-auto mt-1 cursor-pointer"
                    >
                      <RefreshCw size={11} /> Kamerani qayta yuklash
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* FORM / OR ALTERNATIVES FOOTER */}
            <div className="border-t border-gray-900 pt-3 flex flex-col space-y-2">
              <button
                onClick={handleGoogleSignInDemo}
                className="w-full py-2 rounded-full border border-gray-800 text-gray-300 text-xs font-semibold hover:border-cyan-500 flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <Compass size={14} className="text-cyan-400" />
                <span>Google orqali kirish (Fast Admin)</span>
              </button>

              <button
                onClick={() => setLoginIsRegisterMode(!loginIsRegisterMode)}
                className="text-[11px] text-cyan-400 text-center hover:underline cursor-pointer"
              >
                {loginIsRegisterMode ? "Sizda hisob bormi? Kirish" : "Hisobingiz yo'qmi? Ro'yxatdan o'tish"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OVERLAY S2: CHECKOUT DYNAMIC STATUS MODAL */}
      {billingOverlayOpen && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4">
          <div className="glass-neon p-6 rounded-2xl border border-cyan-950 max-w-md w-full text-left space-y-4 relative">
            <button
              onClick={() => setBillingOverlayOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white"
            >
              ✕
            </button>

            {checkoutStep === "plan" && (
              <div className="space-y-4 text-xs">
                <div className="text-center">
                  <h3 className="font-display font-extrabold text-lg text-white">Tarif Tanlang</h3>
                  <p className="text-gray-400">Tomosha qilishni davom etish uchun VIP paketni faollashtiring.</p>
                </div>
                
                <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                  {plans.filter(p => p.status === "active").map(p => (
                    <div
                      key={p.id}
                      onClick={() => handleStartCheckout(p)}
                      className="p-3 rounded-lg bg-black border border-gray-900 hover:border-cyan-500 cursor-pointer flex justify-between items-center"
                    >
                      <div>
                        <p className="font-bold text-white">{p.nameUz}</p>
                        <span className="text-[10px] text-gray-500">{p.durationMonths} oy cheksiz kirish</span>
                      </div>
                      <span className="font-mono text-emerald-400 font-bold">{p.priceUzS.toLocaleString()} UZS</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {checkoutStep === "paySelect" && selectedCheckoutPlan && (
              <div className="space-y-4 text-xs">
                <div className="text-center">
                  <h3 className="font-display font-extrabold text-base text-cyan-400">To'lov Tizimi</h3>
                  <p className="text-gray-400">To'lovni amalga oshirish uchun o'zingizga qulay to'lov usulini bosing:</p>
                </div>

                <div className="bg-black/80 border border-gray-900 p-3 rounded text-center">
                  <p className="text-gray-500 uppercase text-[9px] font-bold">Tanlangan tarif:</p>
                  <p className="text-white font-extrabold text-sm">{selectedCheckoutPlan.nameUz}</p>
                  <p className="text-emerald-400 font-mono font-bold mt-1 text-base">{selectedCheckoutPlan.priceUzS.toLocaleString()} UZS</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {["Click", "Payme", "Uzum", "OCTO", "Visa", "Mastercard"].map(provider => (
                    <button
                      key={provider}
                      onClick={() => handleExecutePaymentRedirect(provider)}
                      className="py-3 rounded bg-cyan-950/20 hover:bg-cyan-950/50 text-center font-bold text-cyan-300 border border-cyan-800 transition-colors uppercase tracking-wider font-display cursor-pointer"
                    >
                      {provider}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {checkoutStep === "redirecting" && (
              <div className="text-center py-10 space-y-4">
                <div className="h-10 w-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <h3 className="font-display font-extrabold text-white text-base">Biz sizni xavfsiz to'lov shlyuziga yo'naltirmoqdamiz...</h3>
                <p className="text-xs text-cyan-400 font-mono">To'lov hamkori: {checkoutProvider} Secure Gateway</p>
              </div>
            )}

            {checkoutStep === "success" && selectedCheckoutPlan && (
              <div className="text-center py-6 space-y-4 text-xs">
                <div className="p-3 w-12 h-12 bg-emerald-950 border border-emerald-500 rounded-full text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
                  <CheckCircle size={24} />
                </div>
                <h3 className="font-display font-black text-white text-lg uppercase tracking-wide">Obuna Faollashdi! ✓</h3>
                <p className="text-gray-400 max-w-sm mx-auto">
                  To'lov muvaffaqiyatli qabul qilindi. Hozirda VIP Premium xizmatlar hisobingiz uchun to'liq yoqilgan!
                </p>
                <div className="bg-black/60 border border-gray-950 p-3 rounded font-mono">
                  <p>Tarif muvofiq: {selectedCheckoutPlan.nameUz}</p>
                  <p className="text-emerald-400 mt-0.5">Xavfsiz tranzaksiya: Muvaffaqiyatli</p>
                </div>
                <button
                  onClick={() => setBillingOverlayOpen(false)}
                  className="px-6 py-2 rounded-full bg-cyan-500 text-black font-extrabold uppercase mt-2 shadow cursor-pointer text-[10px]"
                >
                  Xursandman, tomosha qilish!
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* OVERLAY S3: LEGAL COMPULSIVE PRIVACY POLICY MODAL */}
      {legalOverlayOpen && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4">
          <div className="glass-neon p-6 rounded-2xl border border-cyan-950 max-w-lg w-full text-left space-y-4 relative text-xs leading-relaxed">
            <button
              onClick={() => setLegalOverlayOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white"
            >
              ✕
            </button>

            <h3 className="font-display font-black text-white text-base border-b border-cyan-950 pb-2 uppercase tracking-wider text-cyan-400">
              {legalDocType === "privacy" ? "Maxfiylik Siyosati (Privacy Policy)" : "Foydalanish qoidalari (Terms of Service)"}
            </h3>

            <div className="max-h-[300px] overflow-y-auto pr-1 text-gray-300 font-sans text-xs space-y-2">
              {legalDocType === "privacy" ? (
                <div>
                  <p className="font-bold text-white mb-2">HTV va HPRINT ko'rsatkichi mahfiylikni kafolatlaydi:</p>
                  <p>{settings.privacyPolicyUz}</p>
                  <p className="mt-2 text-gray-500 font-mono text-[10px]">Oxirgi yangilanish: 2026-05-30</p>
                </div>
              ) : (
                <div>
                  <p className="font-bold text-white mb-2">Tizimdan foydalanish shartlari va foydalanuvchi majburiyatlari:</p>
                  <p>{settings.termsOfServiceUz}</p>
                  <p className="mt-2 text-gray-500 font-mono text-[10px]">Sifat tizimi: HTV Premium Production</p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-cyan-950">
              <button
                onClick={() => setLegalOverlayOpen(false)}
                className="px-4 py-1.5 rounded bg-cyan-500 text-black font-bold uppercase text-[10px]"
              >
                Tushundim
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
