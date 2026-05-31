/**
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Shield,
  Tv,
  Film,
  Users,
  CreditCard,
  Settings,
  AlertOctagon,
  LogOut,
  Save,
  Plus,
  Trash2,
  Edit2,
  FileText,
  TrendingUp,
  Globe,
  Database,
  Lock,
  ChevronRight,
  Clipboard,
  Check,
  PlaySquare,
  Import,
  RefreshCw,
  Folder,
  FileCode,
  CheckCheck
} from "lucide-react";
import {
  TVChannel,
  Movie,
  Series,
  SubscriptionPlan,
  AdSetting,
  SystemSettings,
  User,
  Role,
  PaymentLog,
  SecurityLog,
  NewsItem
} from "../types";

// Import sample structures so we can render default PHP previews
import { phpMVCSourceFiles, sqlSchemaString } from "../helpers/phpExporter";

interface AdminPanelProps {
  currentUser: User | null;
  channels: TVChannel[];
  movies: Movie[];
  series: Series[];
  plans: SubscriptionPlan[];
  ads: AdSetting;
  settings: SystemSettings;
  users: User[];
  payments: PaymentLog[];
  logs: SecurityLog[];
  news: NewsItem[];
  authSettings: {
    googleLoginEnabled: boolean;
    googleAuthenticatorEnabled: boolean;
    allowedAdmins: string[];
  };
  onUpdateAuthSettings: (settings: {
    googleLoginEnabled: boolean;
    googleAuthenticatorEnabled: boolean;
    allowedAdmins: string[];
  }) => void;
  
  onUpdateChannels: (ch: TVChannel[]) => void;
  onUpdateMovies: (m: Movie[]) => void;
  onUpdateSeries: (s: Series[]) => void;
  onUpdatePlans: (p: SubscriptionPlan[]) => void;
  onUpdateAds: (ad: AdSetting) => void;
  onUpdateSettings: (set: SystemSettings) => void;
  onUpdateUsers: (u: User[]) => void;
  onUpdateNews: (n: NewsItem[]) => void;
  onLogAction: (msg: string, level: "INFO" | "WARNING" | "CRITICAL") => void;
  siteWords: {
    uz: Record<string, string>;
    ru: Record<string, string>;
    en: Record<string, string>;
  };
  onUpdateSiteWords: (words: any) => void;
}

export default function AdminPanel({
  currentUser,
  channels,
  movies,
  series,
  plans,
  ads,
  settings,
  users,
  payments,
  logs,
  news,
  authSettings,
  onUpdateAuthSettings,
  onUpdateChannels,
  onUpdateMovies,
  onUpdateSeries,
  onUpdatePlans,
  onUpdateAds,
  onUpdateSettings,
  onUpdateUsers,
  onUpdateNews,
  onLogAction,
  siteWords,
  onUpdateSiteWords
}: AdminPanelProps) {
  const [activeSubTab, setActiveSubTab] = useState<
    "dash" | "tv" | "movies" | "series" | "users" | "plans" | "ads" | "news" | "security" | "settings" | "words" | "php_export"
  >("dash");

  // Selection states
  const [editingChannel, setEditingChannel] = useState<TVChannel | null>(null);
  const [newAdminEmail, setNewAdminEmail] = useState("");

  const handleAddAdminEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const emailStr = newAdminEmail.trim().toLowerCase();
    if (!emailStr) return;
    if (!emailStr.includes("@") || !emailStr.includes(".")) {
      alert("Iltimos to'g'ri elektron pochta manzilini kiriting!");
      return;
    }
    if (authSettings.allowedAdmins.includes(emailStr)) {
      alert("Ushbu foydalanuvchi allaqachon adminlar ro'yxatida mavjud!");
      return;
    }
    const updatedAllowed = [...authSettings.allowedAdmins, emailStr];
    onUpdateAuthSettings({
      ...authSettings,
      allowedAdmins: updatedAllowed
    });
    setNewAdminEmail("");
    onLogAction(`Yangi admin ruxsatnomasi qo'shildi: ${emailStr}`, "INFO");
    alert(`Yangi admin (${emailStr}) muvaffaqiyatli ruxsat etilganlar ro'yxatiga qo'shildi!`);
  };

  const handleRemoveAdminEmail = (emailToRemove: string) => {
    if (emailToRemove === "hurmatbekuzpochta@gmail.com") {
      alert("Asosiy tizim egasini ruxsatnomalar ro'yxatidan o'chirib bo'lmaydi!");
      return;
    }
    if (!confirm(`Siz rostdan ham ${emailToRemove} ni adminlar safidan o'chirmoqchimisiz?`)) {
      return;
    }
    const updatedAllowed = authSettings.allowedAdmins.filter(email => email !== emailToRemove);
    onUpdateAuthSettings({
      ...authSettings,
      allowedAdmins: updatedAllowed
    });
    onLogAction(`Admin tizimidan o'chirildi: ${emailToRemove}`, "WARNING");
  };
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [editingSeries, setEditingSeries] = useState<Series | null>(null);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);

  // Deletion confirmations
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    type: "channel" | "movie" | "series" | "plan" | "news" | "user";
    id: string;
    label: string;
  } | null>(null);

  // M3U Playlist Import states
  const [m3uText, setM3uText] = useState("");
  const [importedChannels, setImportedChannels] = useState<Partial<TVChannel>[]>([]);
  const [m3uError, setM3uError] = useState("");
  const [m3uSuccess, setM3uSuccess] = useState("");

  // PHP File Explorer state
  const [selectedPhpFile, setSelectedPhpFile] = useState<string>("README.md");
  const [copiedPhpCode, setCopiedPhpCode] = useState(false);

  // Google 2FA codes
  const [twoFaStatus, setTwoFaStatus] = useState<"disabled" | "setup" | "enabled">("disabled");
  const [twoFaCode, setTwoFaCode] = useState("");
  const [twoFaSetupSecret, setTwoFaSetupSecret] = useState("HTV_SECURE_AUTH_KEY_2026");

  // Check roles
  const canModify = currentUser?.role === Role.SUPER_ADMIN || currentUser?.role === Role.EDITOR;
  const isSuperAdmin = currentUser?.role === Role.SUPER_ADMIN;

  // TV Channel CRUD handlers
  const handleSaveChannel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canModify) return alert("Sizga ushbu o'zgarish ruxsat etilmagan (EDITOR or SUPER_ADMIN required)");
    
    const fd = new FormData(e.target as HTMLFormElement);
    const newChan: TVChannel = {
      id: editingChannel?.id || `ch-${Date.now()}`,
      name: fd.get("name") as string,
      logo: fd.get("logo") as string || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
      category: (fd.get("category") as string).toLowerCase(),
      streamUrl: fd.get("streamUrl") as string,
      poster: fd.get("poster") as string || "https://images.unsplash.com/photo-1598257006458-087169a1f08d?w=800&auto=format&fit=crop&q=80",
      isPremium: fd.get("isPremium") === "true",
      isLive: fd.get("isLive") === "true",
      viewsCount: editingChannel?.viewsCount || 0,
      orderIndex: parseInt(fd.get("orderIndex") as string) || 10,
      isActive: fd.get("isActive") === "true"
    };

    if (editingChannel) {
      onUpdateChannels(channels.map(c => c.id === editingChannel.id ? newChan : c));
      onLogAction(`Kanal tahrirlandi: ${newChan.name}`, "INFO");
    } else {
      onUpdateChannels([...channels, newChan]);
      onLogAction(`Yangi kanal qo'shildi: ${newChan.name}`, "INFO");
    }
    setEditingChannel(null);
  };

  // Movie CRUD handlers
  const handleSaveMovie = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canModify) return alert("Sizga ushbu o'zgarish ruxsat etilmagan");
    
    const fd = new FormData(e.target as HTMLFormElement);
    const newMov: Movie = {
      id: editingMovie?.id || `m-${Date.now()}`,
      nameUz: fd.get("nameUz") as string,
      nameRu: fd.get("nameRu") as string,
      nameEn: fd.get("nameEn") as string,
      slug: fd.get("slug") as string || "kino-" + Date.now(),
      poster: fd.get("poster") as string || "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80",
      backdrop: fd.get("backdrop") as string || "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80",
      videoUrl: fd.get("videoUrl") as string,
      trailerUrl: fd.get("trailerUrl") as string,
      year: parseInt(fd.get("year") as string) || 2026,
      genreUz: fd.get("genreUz") as string,
      genreRu: fd.get("genreRu") as string,
      genreEn: fd.get("genreEn") as string,
      durationMinutes: parseInt(fd.get("durationMinutes") as string) || 120,
      rating: parseFloat(fd.get("rating") as string) || 7.5,
      descriptionUz: fd.get("descriptionUz") as string,
      descriptionRu: fd.get("descriptionRu") as string,
      descriptionEn: fd.get("descriptionEn") as string,
      isPremium: fd.get("isPremium") === "true",
      isActive: fd.get("isActive") === "true"
    };

    if (editingMovie) {
      onUpdateMovies(movies.map(m => m.id === editingMovie.id ? newMov : m));
      onLogAction(`Film tahrirlandi: ${newMov.nameUz}`, "INFO");
    } else {
      onUpdateMovies([...movies, newMov]);
      onLogAction(`Yangi film qo'shildi: ${newMov.nameUz}`, "INFO");
    }
    setEditingMovie(null);
  };

  // M3U Playlist Parser Logic
  const handleParseM3u = () => {
    setM3uError("");
    setM3uSuccess("");
    if (!m3uText.trim()) {
      setM3uError("Matn bo'sh! Iltimos .m3u pleylist matnini kiriting.");
      return;
    }

    try {
      const parsed: Partial<TVChannel>[] = [];
      const lines = m3uText.split("\n");
      
      let currentName = "";
      let currentLogo = "";
      let currentCategory = "o'zbek kanallar";

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith("#EXTINF:")) {
          // Parse channel metadata
          const nameMatch = line.match(/,(.+)$/);
          if (nameMatch) currentName = nameMatch[1].trim();

          const logoMatch = line.match(/tvg-logo="([^"]+)"/);
          if (logoMatch) currentLogo = logoMatch[1].trim();

          const groupMatch = line.match(/group-title="([^"]+)"/);
          if (groupMatch) currentCategory = groupMatch[1].trim();
        } else if (line.startsWith("http")) {
          // This is the link
          if (currentName) {
            parsed.push({
              id: `imported-${Date.now()}-${parsed.length}`,
              name: currentName,
              logo: currentLogo || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
              category: currentCategory.toLowerCase(),
              streamUrl: line,
              poster: "https://images.unsplash.com/photo-1598257006458-087169a1f08d?w=800&auto=format&fit=crop&q=80",
              isPremium: false,
              isLive: true,
              viewsCount: 0,
              orderIndex: 50,
              isActive: true
            });
          }
          currentName = "";
          currentLogo = "";
          currentCategory = "o'zbek kanallar";
        }
      }

      if (parsed.length === 0) {
        setM3uError("M3U formatida mos kanallar topilmadi! (M3U tags validation failed)");
      } else {
        setImportedChannels(parsed);
        setM3uSuccess(`${parsed.length} ta potentsial kanal muvaffaqiyatli import qilindi! Iltimos pastda tasdiqlang.`);
      }
    } catch (err) {
      setM3uError("M3U formatini qayta ishlashda xato yuz berdi.");
    }
  };

  const handleApproveImport = () => {
    onUpdateChannels([...channels, ...(importedChannels as TVChannel[])]);
    onLogAction(`M3U playlist orqali ${importedChannels.length} ta kanal import qilindi`, "INFO");
    setImportedChannels([]);
    setM3uText("");
    setM3uSuccess("Barcha kanallar tasdiqlandi va efir guruhiga o'tkazildi!");
  };

  // General Decompiler for Deletes
  const requestDelete = (type: any, id: string, label: string) => {
    setConfirmationModal({
      isOpen: true,
      type,
      id,
      label
    });
  };

  const executeDelete = () => {
    if (!confirmationModal) return;
    const { type, id } = confirmationModal;

    if (!isSuperAdmin) {
      alert("Faqat super_admin foydalanuvchilar ob'ektlarni o'chira oladi!");
      setConfirmationModal(null);
      return;
    }

    if (type === "channel") {
      onUpdateChannels(channels.filter(c => c.id !== id));
      onLogAction(`Kanal o'chirildi: ${id}`, "WARNING");
    } else if (type === "movie") {
      onUpdateMovies(movies.filter(m => m.id !== id));
      onLogAction(`Film o'chirildi: ${id}`, "WARNING");
    } else if (type === "series") {
      onUpdateSeries(series.filter(s => s.id !== id));
    } else if (type === "plan") {
      onUpdatePlans(plans.filter(p => p.id !== id));
    } else if (type === "news") {
      onUpdateNews(news.filter(n => n.id !== id));
    } else if (type === "user") {
      onUpdateUsers(users.filter(u => u.id !== id));
    }

    setConfirmationModal(null);
  };

  // Google 2FA Setup verifying
  const handleToggle2Fa = (e: React.FormEvent) => {
    e.preventDefault();
    if (twoFaCode === "123456" || twoFaCode.length === 6) {
      setTwoFaStatus("enabled");
      onLogAction("Admin Google Authenticator 2FA faollashtirildi", "INFO");
    } else {
      alert("Iltimos to'g'ri 6-xonali Google Authenticator kodini kiriting! (Mock checking accepts any 6 numbers)");
    }
  };

  // Settings Save
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    const updated: SystemSettings = {
      telegramBotLink: fd.get("telegramBotLink") as string,
      privacyPolicyUz: fd.get("privacyPolicyUz") as string,
      privacyPolicyRu: fd.get("privacyPolicyRu") as string,
      privacyPolicyEn: fd.get("privacyPolicyEn") as string,
      termsOfServiceUz: fd.get("termsOfServiceUz") as string,
      termsOfServiceRu: fd.get("termsOfServiceRu") as string,
      termsOfServiceEn: fd.get("termsOfServiceEn") as string
    };
    onUpdateSettings(updated);
    onLogAction("Tizim umumiy sozlamalari yangilandi", "INFO");
    alert("Sozlamalar saqlandi!");
  };

  // Subscribed status manual modification
  const toggleUserPremium = (userId: string) => {
    if (!canModify) return alert("Huquq yetarli emas");
    const updated = users.map((u) => {
      if (u.id === userId) {
        const nextState = !u.isPremium;
        return {
          ...u,
          isPremium: nextState,
          subscriptionPlanId: nextState ? "plan-12" : null,
          subscriptionExpiresAt: nextState ? "2027-05-30" : null
        };
      }
      return u;
    });
    onUpdateUsers(updated);
    onLogAction(`Foydalanuvchi obunasi o'zgartirildi: ${userId}`, "INFO");
  };

  // Ad Settings
  const handleSaveAd = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    const updated: AdSetting = {
      id: "ad-1",
      videoUrl: fd.get("videoUrl") as string,
      clickUrl: fd.get("clickUrl") as string,
      durationSeconds: parseInt(fd.get("durationSeconds") as string) || 10,
      isEnabled: fd.get("isEnabled") === "true"
    };
    onUpdateAds(updated);
    onLogAction("Pre-roll reklama parametrlari o'zgartirildi", "INFO");
    alert("Reklama sozlamalari muvaffaqiyatli saqlandi!");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 font-sans">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-cyan-950 pb-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800">
            <Shield size={24} />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-display font-extrabold text-white uppercase tracking-wider flex items-center">
              HTV Markaziy Admin Panel <span className="text-xs bg-cyan-400 text-black font-bold px-2 py-0.5 rounded-full ml-3 uppercase">{currentUser?.role}</span>
            </h1>
            <p className="text-xs text-gray-400 font-medium">Boshqaruv va tizim paneli.</p>
          </div>
        </div>

        {/* 2FA Quick display */}
        <div className="mt-4 md:mt-0 max-sm:w-full">
          <div className="glass px-4 py-2 rounded-lg border border-cyan-900 flex items-center justify-between space-x-3">
            <div className="text-left text-xs">
              <p className="text-gray-400 font-semibold uppercase text-[9px] tracking-widest">2FA STATUS</p>
              <p className={`font-mono font-bold uppercase mt-0.5 ${twoFaStatus === "enabled" ? "text-emerald-400" : "text-amber-500 animate-pulse"}`}>
                {twoFaStatus === "enabled" ? "Faol" : "Kiritilmagan"}
              </p>
            </div>
            {twoFaStatus !== "enabled" && (
              <button
                onClick={() => setTwoFaStatus("setup")}
                className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-black text-[10px] font-extrabold uppercase tracking-wider"
              >
                2FA Sozlash
              </button>
            )}
          </div>
        </div>
      </div>

      {/* TWO-FA MOCKUP SETUP BLOCK */}
      {twoFaStatus === "setup" && (
        <div className="glass-neon p-6 rounded-xl border border-amber-950 max-w-md mx-auto mb-6 text-sm">
          <div className="flex items-center space-x-2 text-amber-500 mb-3">
            <Lock className="h-5 w-5 animate-bounce" />
            <h4 className="font-display font-extrabold uppercase">Google Authenticator 2FA Sozlash</h4>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            HTV jiddiy va professional platforma! Admin faolligini saqlash uchun telefoningizdagi <b>Google Authenticator</b> yoki <b>Authy</b> ilovasi orqali quyidagi kodni skanerlang yoki qo'lda kiriting:
          </p>
          <div className="bg-black border border-gray-950 p-3 mt-4 text-center font-mono font-bold text-amber-400 text-xs tracking-wider rounded">
            Maxfiy kalit: {twoFaSetupSecret}
          </div>
          <form onSubmit={handleToggle2Fa} className="mt-4 space-y-3">
            <input
              type="text"
              placeholder="Ilovadan 6-xonali kodni kiriting (masalan, 123456)"
              required
              className="w-full bg-cyan-950/20 border border-amber-900/60 rounded px-3 py-2 text-xs text-white"
              value={twoFaCode}
              onChange={(e) => setTwoFaCode(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setTwoFaStatus("disabled")}
                className="px-3 py-1.5 bg-gray-900 text-gray-400 rounded text-xs hover:text-white"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs rounded uppercase"
              >
                Tasdiqlash
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SYSTEM AND SUB-TABS SELECTORS */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* LEFTSIDE NAVIGATION BUTTONS BAR */}
        <div className="lg:col-span-1 space-y-1 bg-black/40 border border-cyan-950/50 p-2.5 rounded-xl">
          <p className="text-gray-500 text-[9px] uppercase font-mono font-bold px-3 py-1 pb-1.5 tracking-wider border-b border-gray-950 mb-1.5">Boshqaruv navigatsiyasi</p>
          
          <button
            onClick={() => setActiveSubTab("dash")}
            className={`w-full text-left px-4 py-2 rounded text-xs font-semibold flex items-center justify-between cursor-pointer transition-all ${activeSubTab === "dash" ? "bg-cyan-950 text-cyan-400 border-l-2 border-cyan-400" : "text-gray-400 hover:bg-cyan-950/20 hover:text-white"}`}
          >
            <span className="flex items-center space-x-2">
              <TrendingUp size={14} />
              <span>Analitika & Statistika</span>
            </span>
            <ChevronRight size={12} className="opacity-40" />
          </button>

          <button
            onClick={() => setActiveSubTab("tv")}
            className={`w-full text-left px-4 py-2 rounded text-xs font-semibold flex items-center justify-between cursor-pointer transition-all ${activeSubTab === "tv" ? "bg-cyan-950 text-cyan-400 border-l-2 border-cyan-400" : "text-gray-400 hover:bg-cyan-950/20 hover:text-white"}`}
          >
            <span className="flex items-center space-x-2">
              <Tv size={14} />
              <span>TV Kanallar ({channels.length})</span>
            </span>
            <ChevronRight size={12} className="opacity-40" />
          </button>

          <button
            onClick={() => setActiveSubTab("movies")}
            className={`w-full text-left px-4 py-2 rounded text-xs font-semibold flex items-center justify-between cursor-pointer transition-all ${activeSubTab === "movies" ? "bg-cyan-950 text-cyan-400 border-l-2 border-cyan-400" : "text-gray-400 hover:bg-cyan-950/20 hover:text-white"}`}
          >
            <span className="flex items-center space-x-2">
              <Film size={14} />
              <span>Filmlar ({movies.length})</span>
            </span>
            <ChevronRight size={12} className="opacity-40" />
          </button>

          <button
            onClick={() => setActiveSubTab("users")}
            className={`w-full text-left px-4 py-2 rounded text-xs font-semibold flex items-center justify-between cursor-pointer transition-all ${activeSubTab === "users" ? "bg-cyan-950 text-cyan-400 border-l-2 border-cyan-400" : "text-gray-400 hover:bg-cyan-950/20 hover:text-white"}`}
          >
            <span className="flex items-center space-x-2">
              <Users size={14} />
              <span>Obunachilar ({users.length})</span>
            </span>
            <ChevronRight size={12} className="opacity-40" />
          </button>

          <button
            onClick={() => setActiveSubTab("plans")}
            className={`w-full text-left px-4 py-2 rounded text-xs font-semibold flex items-center justify-between cursor-pointer transition-all ${activeSubTab === "plans" ? "bg-cyan-950 text-cyan-400 border-l-2 border-cyan-400" : "text-gray-400 hover:bg-cyan-950/20 hover:text-white"}`}
          >
            <span className="flex items-center space-x-2">
              <CreditCard size={14} />
              <span>VIP Tarif Rejalari ({plans.length})</span>
            </span>
            <ChevronRight size={12} className="opacity-40" />
          </button>

          <button
            onClick={() => setActiveSubTab("ads")}
            className={`w-full text-left px-4 py-2 rounded text-xs font-semibold flex items-center justify-between cursor-pointer transition-all ${activeSubTab === "ads" ? "bg-cyan-950 text-cyan-400 border-l-2 border-cyan-400" : "text-gray-400 hover:bg-cyan-950/20 hover:text-white"}`}
          >
            <span className="flex items-center space-x-2">
              <PlaySquare size={14} />
              <span>Reklama pre-rolls</span>
            </span>
            <ChevronRight size={12} className="opacity-40" />
          </button>

          <button
            onClick={() => setActiveSubTab("security")}
            className={`w-full text-left px-4 py-2 rounded text-xs font-semibold flex items-center justify-between cursor-pointer transition-all ${activeSubTab === "security" ? "bg-cyan-950 text-cyan-400 border-l-2 border-cyan-400" : "text-gray-400 hover:bg-cyan-950/20 hover:text-white"}`}
          >
            <span className="flex items-center space-x-2">
              <AlertOctagon size={14} />
              <span>Xavfsizlik Loglari ({logs.length})</span>
            </span>
            <ChevronRight size={12} className="opacity-40" />
          </button>

          <button
            onClick={() => setActiveSubTab("settings")}
            className={`w-full text-left px-4 py-2 rounded text-xs font-semibold flex items-center justify-between cursor-pointer transition-all ${activeSubTab === "settings" ? "bg-cyan-950 text-cyan-400 border-l-2 border-cyan-400" : "text-gray-400 hover:bg-cyan-950/20 hover:text-white"}`}
          >
            <span className="flex items-center space-x-2">
              <Settings size={14} />
              <span>Tizim Sozlamalari</span>
            </span>
            <ChevronRight size={12} className="opacity-40" />
          </button>

          <button
            onClick={() => setActiveSubTab("words")}
            className={`w-full text-left px-4 py-2 rounded text-xs font-semibold flex items-center justify-between cursor-pointer transition-all ${activeSubTab === "words" ? "bg-cyan-950 text-cyan-400 border-l-2 border-cyan-400" : "text-gray-400 hover:bg-cyan-950/20 hover:text-white"}`}
          >
            <span className="flex items-center space-x-2">
              <Globe size={14} className="text-cyan-400" />
              <span>Sayt So'zlari (Translation)</span>
            </span>
            <ChevronRight size={12} className="opacity-40" />
          </button>

          {/* PHP PRODUCTION EXPORTER */}
          <button
            onClick={() => setActiveSubTab("php_export")}
            className={`w-full text-left px-4 py-2.5 rounded text-xs font-bold uppercase tracking-wider flex items-center justify-between cursor-pointer transition-all border border-cyan-500/20 bg-gradient-to-r from-black/80 to-cyan-950/30 ${activeSubTab === "php_export" ? "bg-cyan-500 text-black border-cyan-400" : "text-cyan-400 hover:bg-cyan-950/40"}`}
          >
            <span className="flex items-center space-x-2">
              <Database size={14} />
              <span>PHP / MySQL cPanel Exporter</span>
            </span>
            <Folder size={13} />
          </button>

        </div>

        {/* RIGHTSIDE WORKSPACE TAB AREA */}
        <div className="lg:col-span-3 glass rounded-xl p-6 border border-cyan-950/40 min-h-[500px]">
          
          {/* A. DASHBOARD STATISTICS TAB */}
          {activeSubTab === "dash" && (
            <div className="space-y-6">
              <h3 className="text-white font-display font-extrabold text-base uppercase tracking-wider text-cyan-400 flex items-center">
                📊 Analitika & Tizim Ko'rsatkichlari
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-cyan-900 bg-cyan-950/10 text-left">
                  <p className="text-gray-500 font-bold uppercase text-[9px] tracking-widest">Platforma obunachilari</p>
                  <p className="text-2xl font-mono font-black text-cyan-400 mt-1">{users.length} ta</p>
                  <div className="text-[10px] text-gray-400 mt-1.5">
                    Premium obunachilar: <span className="text-emerald-400 font-bold">{users.filter(u => u.isPremium).length} ta</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-cyan-900 bg-cyan-950/10 text-left">
                  <p className="text-gray-500 font-bold uppercase text-[9px] tracking-widest">Faol TV kanallar</p>
                  <p className="text-2xl font-mono font-black text-cyan-400 mt-1">{channels.filter(c => c.isActive).length} ta</p>
                  <div className="text-[10px] text-gray-400 mt-1.5">
                    Mavjud jami kino kutubxona: <span className="text-white font-bold">{movies.length} ta</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-cyan-900 bg-cyan-950/10 text-left">
                  <p className="text-gray-500 font-bold uppercase text-[9px] tracking-widest">Jami moliyaviy aylanma</p>
                  <p className="text-2xl font-mono font-black text-emerald-400 mt-1">
                    {payments.reduce((acc, p) => p.status === "success" ? acc + p.amountUzS : acc, 0).toLocaleString()} UZS
                  </p>
                  <div className="text-[10px] text-gray-400 mt-1.5">
                    Bu oydagi muvaffaqiyatli tranzatsiyalar: <span className="text-white font-bold">{payments.filter(p => p.status === "success").length} ta</span>
                  </div>
                </div>
              </div>

              {/* RECENT TRANSACTIONS TABLE */}
              <div className="space-y-3.0">
                <h4 className="text-white font-bold font-display text-xs uppercase tracking-wider text-gray-300">Oxirgi kassa obuna to'lovlari:</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-cyan-950 text-gray-500 uppercase font-mono text-[9px] tracking-wider">
                        <th className="py-2.5">Tranzaksiya ID</th>
                        <th className="py-2.5">Email</th>
                        <th className="py-2.5">Tarif</th>
                        <th className="py-2.5">Narxi</th>
                        <th className="py-2.5">Tizim</th>
                        <th className="py-2.5">Holati</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-900">
                      {payments.map((p) => (
                        <tr key={p.id} className="text-gray-300">
                          <td className="py-2 font-mono text-[10px] text-cyan-500">{p.id}</td>
                          <td className="py-2 font-medium">{p.userEmail}</td>
                          <td className="py-2">{p.planName}</td>
                          <td className="py-2 font-mono font-semibold text-white">{p.amountUzS.toLocaleString()} UZS</td>
                          <td className="py-2 uppercase text-[10px] font-bold text-gray-400">{p.paymentMethod}</td>
                          <td className="py-2">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-900 text-[9px] uppercase font-bold font-mono">
                              Paid
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* B. TV CHANNELS MANAGER TAB */}
          {activeSubTab === "tv" && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between border-b border-gray-950 pb-3">
                <h3 className="text-white font-display font-extrabold text-base uppercase tracking-wider text-cyan-400">
                  📺 TV Kanallar Boshqaruvi
                </h3>
                <button
                  onClick={() => setEditingChannel({
                    id: "", name: "", logo: "", category: "o'zbek kanallar", streamUrl: "", poster: "",
                    isPremium: false, isLive: true, viewsCount: 0, orderIndex: 1, isActive: true
                  })}
                  className="px-3 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow"
                >
                  <Plus size={14} />
                  <span>Kanal qo'shish</span>
                </button>
              </div>

              {/* SECTION FOR M3U IMPORT QUICK UTILITY */}
              <div className="bg-cyan-950/5 p-4 rounded-xl border border-cyan-950/40 space-y-3">
                <h4 className="text-white font-bold text-xs uppercase tracking-wider flex items-center space-x-1.5 text-cyan-400">
                  <Import size={14} />
                  <span>M3U Playlist Import (Batch Import)</span>
                </h4>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  Uzbekistan IPTV .m3u playlist matnini (sarlavhali va stream linkli formatda) quyiga yopishtiring va import tugmasini bosing:
                </p>
                <textarea
                  placeholder={`#EXTM3U\n#EXTINF:-1 tvg-logo="https://..." group-title="Uzbekistan",O'zbekiston TV HD\nhttps://example.com/stream.m3u8`}
                  rows={4}
                  className="w-full bg-black/95 text-xs text-cyan-300 font-mono p-3 rounded-lg border border-cyan-950 focus:border-cyan-500 focus:outline-none"
                  value={m3uText}
                  onChange={(e) => setM3uText(e.target.value)}
                />
                
                {m3uError && <p className="text-xs font-bold text-red-500">{m3uError}</p>}
                {m3uSuccess && <p className="text-xs font-bold text-emerald-400">{m3uSuccess}</p>}

                <div className="flex space-x-2">
                  <button
                    onClick={handleParseM3u}
                    className="px-4 py-1.5 bg-cyan-950 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 font-bold text-xs rounded transition-all cursor-pointer"
                  >
                    Pleylistni tasniflash
                  </button>
                  {importedChannels.length > 0 && (
                    <button
                      onClick={handleApproveImport}
                      className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs rounded transition-all cursor-pointer flex items-center space-x-1"
                    >
                      <CheckCheck size={13} />
                      <span>{importedChannels.length} ta oqimni tasdiqlash</span>
                    </button>
                  )}
                </div>
              </div>

              {/* CRUD FORM FOR CHANNEL */}
              {editingChannel && (
                <form onSubmit={handleSaveChannel} className="p-4 bg-gray-950 rounded-xl border border-cyan-900 space-y-4">
                  <h4 className="text-white font-bold text-xs uppercase tracking-wider pb-2 border-b border-gray-900 text-cyan-400">
                    {editingChannel.id ? "Kanalni tahrirlash" : "Yangi kanal kiritish"}
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] text-gray-400 uppercase font-bold mb-1">Kanal nomi (Sarlavha) *</label>
                      <input
                        type="text"
                        name="name"
                        defaultValue={editingChannel.name}
                        required
                        placeholder="Masalan, Zo'r TV HD"
                        className="w-full bg-black/80 border border-cyan-950 rounded p-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-400 uppercase font-bold mb-1">Kategoriya *</label>
                      <select
                        name="category"
                        defaultValue={editingChannel.category}
                        className="w-full bg-black/80 border border-cyan-950 rounded p-2 text-xs text-white"
                      >
                        <option value="o'zbek kanallar">O'zbek Kanallar</option>
                        <option value="sport">Sport</option>
                        <option value="yangiliklar">Yangiliklar</option>
                        <option value="bolalar">Bolalar</option>
                        <option value="musiqa">Musiqa</option>
                        <option value="premium">Premium VIP guruh</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-400 uppercase font-bold mb-1">Stream Oqim Linki (IPTV .m3u8 yoki MP4) *</label>
                      <input
                        type="text"
                        name="streamUrl"
                        defaultValue={editingChannel.streamUrl}
                        required
                        placeholder="https://server.com/stream.m3u8"
                        className="w-full bg-black/80 border border-cyan-950 rounded p-2 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-400 uppercase font-bold mb-1">Kanal Logo Rasmi (URL)</label>
                      <input
                        type="text"
                        name="logo"
                        defaultValue={editingChannel.logo}
                        placeholder="https://photo-host.com/logo.png"
                        className="w-full bg-black/80 border border-cyan-950 rounded p-2 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-400 uppercase font-bold mb-1">Poster Rasmi (Bosh fon URL)</label>
                      <input
                        type="text"
                        name="poster"
                        defaultValue={editingChannel.poster}
                        placeholder="https://photo-host.com/cover.png"
                        className="w-full bg-black/80 border border-cyan-950 rounded p-2 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-400 uppercase font-bold mb-1">Ko'rsatish Tartib Raqami</label>
                      <input
                        type="number"
                        name="orderIndex"
                        defaultValue={editingChannel.orderIndex}
                        className="w-full bg-black/80 border border-cyan-950 rounded p-2 text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <div>
                      <label className="block text-[11px] text-gray-400 uppercase font-bold mb-1">Status (Obuna turi)</label>
                      <select name="isPremium" defaultValue={editingChannel.isPremium ? "true" : "false"} className="w-full bg-black/80 border border-cyan-950 rounded p-2 text-xs text-white">
                        <option value="false">BEPUL (Eski va yangi a'zolarga ochiq)</option>
                        <option value="true">★ PREMIUM (Faqat obunali a'zolarga)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-400 uppercase font-bold mb-1">Efir holati (Live status)</label>
                      <select name="isLive" defaultValue={editingChannel.isLive ? "true" : "false"} className="w-full bg-black/80 border border-cyan-950 rounded p-2 text-xs text-white">
                        <option value="true">Efirda - LIVE translyatsiya</option>
                        <option value="false">Yozuv shaklida efir</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-400 uppercase font-bold mb-1">Kanal Aktivligi</label>
                      <select name="isActive" defaultValue={editingChannel.isActive ? "true" : "false"} className="w-full bg-black/80 border border-cyan-950 rounded p-2 text-xs text-white">
                        <option value="true">Faol (Active - ko'rinadigan)</option>
                        <option value="false">Faol emas (Inactive - yashirin)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 border-t border-gray-900 pt-3">
                    <button
                      type="button"
                      onClick={() => setEditingChannel(null)}
                      className="px-3 py-1.5 bg-gray-900 text-gray-400 hover:text-white rounded text-xs cursor-pointer"
                    >
                      Bekor qilish
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-cyan-500 text-black font-extrabold text-xs rounded cursor-pointer"
                    >
                      <Save size={13} className="inline mr-1" />
                      <span>Kanalni saqlash</span>
                    </button>
                  </div>
                </form>
              )}

              {/* LIST OF CURRENT RECENT TV CHANNELS */}
              <div className="space-y-2">
                {channels.map((ch) => (
                  <div key={ch.id} className="p-3 rounded-lg bg-black/40 border border-gray-900 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center space-x-3">
                      <img src={ch.logo} alt="" className="w-10 h-10 rounded object-cover border border-cyan-500/10 bg-black" />
                      <div>
                        <p className="font-bold text-white leading-normal flex items-center">
                          <span>{ch.name}</span>
                          {ch.isPremium && <span className="ml-2 font-display text-[8px] bg-cyan-400 text-black font-extrabold px-1.5 rounded">PREMIUM</span>}
                        </p>
                        <span className="font-mono text-[9px] text-gray-500 uppercase tracking-widest">{ch.category}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setEditingChannel(ch)}
                        className="p-1 text-gray-400 hover:text-cyan-400 transition-colors"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => requestDelete("channel", ch.id, ch.name)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* C. MOVIES MANAGER TAB */}
          {activeSubTab === "movies" && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between border-b border-gray-950 pb-3">
                <h3 className="text-white font-display font-extrabold text-base uppercase tracking-wider text-cyan-400">
                  🎬 Filmlar Kutubxonasi Sozlamalari
                </h3>
                <button
                  onClick={() => setEditingMovie({
                    id: "", nameUz: "", nameRu: "", nameEn: "", slug: "", poster: "", backdrop: "",
                    videoUrl: "", trailerUrl: "", year: 2026, genreUz: "", genreRu: "", genreEn: "",
                    durationMinutes: 120, rating: 7.5, descriptionUz: "", descriptionRu: "", descriptionEn: "",
                    isPremium: false, isActive: true
                  })}
                  className="px-3 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow"
                >
                  <Plus size={14} />
                  <span>Kino qo'shish</span>
                </button>
              </div>

              {/* CRUD FORM FOR MOVIES */}
              {editingMovie && (
                <form onSubmit={handleSaveMovie} className="p-4 bg-gray-950 rounded-xl border border-cyan-900 space-y-4 text-xs">
                  <h4 className="text-white font-bold text-xs uppercase tracking-wider pb-2 border-b border-gray-900 text-cyan-400">
                    {editingMovie.id ? "Filmni tahrirlash" : "Yangi film yuklash"}
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Nomi (Uzbekcha) *</label>
                      <input type="text" name="nameUz" defaultValue={editingMovie.nameUz} required className="w-full bg-black border border-cyan-950 rounded p-2 text-white" />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Nomi (Ruscha) *</label>
                      <input type="text" name="nameRu" defaultValue={editingMovie.nameRu} required className="w-full bg-black border border-cyan-950 rounded p-2 text-white" />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Nomi (Inglizcha) *</label>
                      <input type="text" name="nameEn" defaultValue={editingMovie.nameEn} required className="w-full bg-black border border-cyan-950 rounded p-2 text-white" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Slug URL (Xonasi) *</label>
                      <input type="text" name="slug" defaultValue={editingMovie.slug} required placeholder="avatar-2" className="w-full bg-black border border-cyan-950 rounded p-2 text-white font-mono" />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Yili *</label>
                      <input type="number" name="year" defaultValue={editingMovie.year} required className="w-full bg-black border border-cyan-950 rounded p-2 text-white font-mono" />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Reyting Score</label>
                      <input type="text" name="rating" defaultValue={editingMovie.rating} placeholder="8.5" className="w-full bg-black border border-cyan-950 rounded p-2 text-white font-mono" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Asosiy Video Linki (HLS .m3u8 yoki MP4) *</label>
                      <input type="text" name="videoUrl" defaultValue={editingMovie.videoUrl} required className="w-full bg-black border border-cyan-950 rounded p-2 text-white font-mono" />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Teaser / Trailer Video Link (CORS-friendly MP4 önerilir) *</label>
                      <input type="text" name="trailerUrl" defaultValue={editingMovie.trailerUrl} required className="w-full bg-black border border-cyan-950 rounded p-2 text-white font-mono" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Janr (O'zbek tili) *</label>
                      <input type="text" name="genreUz" defaultValue={editingMovie.genreUz} required placeholder="Jangari, Drama" className="w-full bg-black border border-cyan-950 rounded p-2 text-white" />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Poster Tik Rasm (URL)</label>
                      <input type="text" name="poster" defaultValue={editingMovie.poster} className="w-full bg-black border border-cyan-950 rounded p-2 text-white font-mono" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Tarif cheklovi</label>
                      <select name="isPremium" defaultValue={editingMovie.isPremium ? "true" : "false"} className="w-full bg-black border border-cyan-950 rounded p-2 text-white">
                        <option value="false">BEPUL / FREE</option>
                        <option value="true">VIP PREMIUM obuna</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Davomiyligi (Daqiqalarda)</label>
                      <input type="number" name="durationMinutes" defaultValue={editingMovie.durationMinutes} className="w-full bg-black border border-cyan-950 rounded p-2 text-white font-mono" />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Film holati (Status)</label>
                      <select name="isActive" defaultValue={editingMovie.isActive ? "true" : "false"} className="w-full bg-black border border-cyan-950 rounded p-2 text-white">
                        <option value="true">Faol (Saytda chiqadi)</option>
                        <option value="false">Yashirin hamda faolsiz</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] text-gray-400 uppercase font-bold">Kino Tavsifi (O'zbekcha)</label>
                    <textarea name="descriptionUz" defaultValue={editingMovie.descriptionUz} rows={2} className="w-full bg-black border border-cyan-950 rounded p-2 text-white" />
                  </div>

                  <div className="flex justify-end space-x-2 border-t border-gray-900 pt-3">
                    <button type="button" onClick={() => setEditingMovie(null)} className="px-3 py-1.5 bg-gray-900 text-gray-400 hover:text-white rounded">Bekor qilish</button>
                    <button type="submit" className="px-4 py-1.5 bg-cyan-500 text-black font-extrabold rounded">Muvofiq saqlash</button>
                  </div>
                </form>
              )}

              {/* MOVIE DISPLAY ITEMS CARD */}
              <div className="space-y-2">
                {movies.map((m) => (
                  <div key={m.id} className="p-3 rounded-lg bg-black/40 border border-gray-900 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-3">
                      <img src={m.poster} alt="" className="w-8 h-10 rounded object-cover border border-cyan-500/10 bg-black" />
                      <div>
                        <p className="font-bold text-white">{m.nameUz} <span className="font-normal text-gray-500">({m.year})</span></p>
                        <span className="text-[10px] text-cyan-400 font-mono">/tv/movie/{m.slug}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button onClick={() => setEditingMovie(m)} className="p-1 hover:text-cyan-400 text-gray-500"><Edit2 size={13} /></button>
                      <button onClick={() => requestDelete("movie", m.id, m.nameUz)} className="p-1 hover:text-red-500 text-gray-500"><Trash2 size={13} /></button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* D. USERS COORDINATOR TAB */}
          {activeSubTab === "users" && (
            <div className="space-y-6">
              <h3 className="text-white font-display font-extrabold text-base uppercase tracking-wider text-cyan-400 border-b border-gray-950 pb-3">
                👥 Foydalanuvchilar & Obuna Boshqaruvi
              </h3>

              <div className="space-y-2">
                {users.map((u) => (
                  <div key={u.id} className="p-4 rounded-xl border border-gray-950 bg-black/60 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-bold text-white text-sm">{u.email}</p>
                        <span className="font-mono text-[9px] bg-gray-900 px-1.5 py-0.5 rounded text-gray-400">{u.role}</span>
                      </div>
                      
                      <div className="flex items-center space-x-3 text-[11px] text-gray-400 mt-1">
                        <span>VIP Obuna:</span>
                        <span className={`font-bold uppercase ${u.isPremium ? "text-cyan-400" : "text-gray-500"}`}>
                          {u.isPremium ? "FAOL (PREMIUM VIP)" : "BEPUL MEHMON"}
                        </span>
                        {u.isPremium && u.subscriptionExpiresAt && (
                          <span className="text-[10px] text-gray-600 font-mono">({u.subscriptionExpiresAt} gacha)</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2.5">
                      <button
                        onClick={() => toggleUserPremium(u.id)}
                        className={`px-3 py-1.5 rounded text-[11px] font-bold cursor-pointer transition-all ${u.isPremium ? "bg-red-950/40 text-red-400 border border-red-900/40 hover:bg-red-900/20" : "bg-cyan-950 text-cyan-400 border border-cyan-800 hover:bg-cyan-900"}`}
                      >
                        {u.isPremium ? "Obunani o'chirish" : "Premium obuna yoqish"}
                      </button>
                      
                      {currentUser?.role === Role.SUPER_ADMIN && u.email !== currentUser.email && (
                        <button
                          onClick={() => requestDelete("user", u.id, u.email)}
                          className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-950/20 rounded transition-colors"
                          title="Foydalanuvchini platformadan butunlay o'chirish"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* E. RATES AND PLANS EDITOR */}
          {activeSubTab === "plans" && (
            <div className="space-y-5">
              <h3 className="text-white font-display font-extrabold text-base uppercase tracking-wider text-cyan-400 border-b border-gray-950 pb-3">
                💳 Premium VIP Tarif Rejalari
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {plans.map((plan) => (
                  <div key={plan.id} className="p-4 rounded-xl border border-cyan-950 bg-black/60 space-y-2 text-xs text-left">
                    <div className="flex items-center justify-between">
                      <h4 className="text-white font-extrabold text-sm uppercase tracking-wide">{plan.nameUz}</h4>
                      <span className="font-mono text-emerald-400 font-bold text-sm">{(plan.priceUzS).toLocaleString()} UZS</span>
                    </div>

                    <p className="text-gray-500">Muddati: <span className="text-white font-mono font-bold">{plan.durationMonths} oy</span></p>
                    <p className="text-gray-500">Tizimdagi holati: <span className="text-emerald-400 font-bold uppercase">{plan.status}</span></p>
                    
                    <div className="border-t border-cyan-950/50 pt-2 flex justify-end space-x-2">
                      <span className="text-[10px] text-gray-600 font-mono">Plan: {plan.id}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* F. PRE-ROLL ANIMATING ADS */}
          {activeSubTab === "ads" && (
            <form onSubmit={handleSaveAd} className="space-y-4 text-xs">
              <h3 className="text-white font-display font-extrabold text-base uppercase tracking-wider text-cyan-400 border-b border-gray-950 pb-3">
                📺 Pre-roll Video Reklama Boshqaruvi
              </h3>

              <p className="text-gray-400 leading-normal text-[11px]">
                Ushbu bo'limda video yuklanishdan oldin bepul foydalanuvchilarga ko'rsatiladigan pre-roll reklamalarni yoqishingiz yoki sozlamalarini o'zgartirishingiz mumkin. <b>Premium foydalanuvchilarga reklamalar umuman ko'rsatilmaydi!</b>
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-gray-400 uppercase font-bold mb-1">Reklama ko'rsatish yoqilganmi?</label>
                  <select name="isEnabled" defaultValue={ads.isEnabled ? "true" : "false"} className="w-full bg-black border border-cyan-950 text-white p-2 rounded">
                    <option value="true">HA - Faol (Bepul foydalanuvchilar uchun)</option>
                    <option value="false">YO'Q - O'chirilgan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-gray-400 uppercase font-bold mb-1">Reklama video davomiyligi (soniya)</label>
                  <input type="number" name="durationSeconds" defaultValue={ads.durationSeconds} className="w-full bg-black border border-cyan-950 text-white p-2 rounded font-mono" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] text-gray-400 uppercase font-bold mb-1">Reklama Video URL (.mp4 format tavsiya qilinadi)</label>
                  <input type="text" name="videoUrl" defaultValue={ads.videoUrl} className="w-full bg-black border border-cyan-950 text-white p-2 rounded font-mono" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] text-gray-400 uppercase font-bold mb-1">Raqamli hamkorga yo'naltiruvchi havola (Click redirect URL)</label>
                  <input type="text" name="clickUrl" defaultValue={ads.clickUrl} className="w-full bg-black border border-cyan-950 text-white p-2 rounded font-mono" />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button type="submit" className="px-5 py-2 rounded bg-cyan-500 font-extrabold text-black hover:bg-cyan-400 cursor-pointer shadow">
                  Reklama parametrlarini yangilash
                </button>
              </div>
            </form>
          )}

          {/* G. SECURITY CONTROLS AND FIREWALL LOGGER */}
          {activeSubTab === "security" && (
            <div className="space-y-6">
              <h3 className="text-white font-display font-extrabold text-base uppercase tracking-wider text-cyan-400 border-b border-gray-950 pb-3">
                🛡️ Markaziy Xavfsizlik & 2FA Kirish Sozlamalari
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                
                {/* COLUMN 1: INTERACTIVE KEY CONFIGS & ADMINS MANAGEMENT */}
                <div className="space-y-5 bg-black/40 border border-cyan-950/60 p-4 rounded-xl">
                  <div className="space-y-1">
                    <h4 className="text-white font-bold text-xs uppercase tracking-wider text-gray-300">🔐 Kirish Usullari (2FA Sozlamalari)</h4>
                    <p className="text-[10px] text-gray-500">Tizimga kirish bo'limida majburiy tekshiruv va ruxsat berish usullari:</p>
                  </div>

                  <div className="space-y-2.5">
                    <button
                      type="button"
                      onClick={() => onUpdateAuthSettings({ ...authSettings, googleLoginEnabled: !authSettings.googleLoginEnabled })}
                      className={`w-full py-2.5 px-4 rounded text-xs font-bold flex items-center justify-between border cursor-pointer transition-all ${authSettings.googleLoginEnabled ? 'bg-cyan-950/30 text-cyan-400 border-cyan-500/20' : 'bg-gray-900 border-transparent text-gray-500'}`}
                    >
                      <span>Google Akkaunt talab qilish (Gg Login)</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-black ${authSettings.googleLoginEnabled ? 'bg-cyan-500 text-black' : 'bg-gray-800 text-gray-500'}`}>
                        {authSettings.googleLoginEnabled ? "Yoqilgan (Faol)" : "O'chirilgan"}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onUpdateAuthSettings({ ...authSettings, googleAuthenticatorEnabled: !authSettings.googleAuthenticatorEnabled })}
                      className={`w-full py-2.5 px-4 rounded text-xs font-bold flex items-center justify-between border cursor-pointer transition-all ${authSettings.googleAuthenticatorEnabled ? 'bg-cyan-950/30 text-cyan-400 border-cyan-500/20' : 'bg-gray-900 border-transparent text-gray-500'}`}
                    >
                      <span>Google Authenticator (6 xonali kod)</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-black ${authSettings.googleAuthenticatorEnabled ? 'bg-cyan-500 text-black' : 'bg-gray-800 text-gray-500'}`}>
                        {authSettings.googleAuthenticatorEnabled ? "Majburiy" : "Ixtiyoriy"}
                      </span>
                    </button>
                  </div>

                  {/* ADMINS MANAGEMENT MODULE */}
                  <div className="border-t border-cyan-950/50 pt-4 space-y-3">
                    <div className="space-y-1">
                      <h4 className="text-white font-bold text-xs uppercase tracking-wider text-gray-300">👥 Qo'shimcha Adminlar Ro'yxati</h4>
                      <p className="text-[10px] text-gray-500">Google va parol orqali faqatgina ushbu ruxsat etilgan Gmail profil egalari admin panelga kira oladilar:</p>
                    </div>

                    <form onSubmit={handleAddAdminEmail} className="flex gap-2">
                      <input
                        type="email"
                        required
                        placeholder="masalan, yangiadmin@gmail.com"
                        value={newAdminEmail}
                        onChange={(e) => setNewAdminEmail(e.target.value)}
                        className="flex-1 bg-black border border-cyan-950 rounded px-3 py-2 text-xs text-white"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs rounded transition-all cursor-pointer shadow"
                      >
                        Qo'shish
                      </button>
                    </form>

                    <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1">
                      {authSettings.allowedAdmins.map(email => (
                        <div key={email} className="p-2.5 rounded bg-black/50 flex items-center justify-between text-xs border border-cyan-950/20">
                          <span className="font-mono text-cyan-400 font-bold tracking-wide">{email}</span>
                          {email !== "hurmatbekuzpochta@gmail.com" ? (
                            <button
                              type="button"
                              onClick={() => handleRemoveAdminEmail(email)}
                              className="p-1 hover:text-red-500 text-gray-500 cursor-pointer"
                              title="Tizimdan o'chirish"
                            >
                              <Trash2 size={13} />
                            </button>
                          ) : (
                            <span className="text-[9px] bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded uppercase font-black tracking-widest border border-cyan-900">Asosiy</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* COLUMN 2: SECURITY FIREWALL LOGS */}
                <div className="space-y-4 bg-black/20 border border-cyan-950/40 p-4 rounded-xl">
                  <div className="space-y-1">
                    <h4 className="text-white font-bold text-xs uppercase tracking-wider text-cyan-400">🛡️ Tizim Xavfsizlik Sensorlari & SQL Xatoliklari Logi</h4>
                    <p className="text-[10px] text-gray-500">SQL Injection, Cross-Site Scripting (XSS) hamda ruxsatsiz so'rovlarni avtomatik aniqlash tizimi qaydlari:</p>
                  </div>

                  <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                    {logs.map((log) => (
                      <div key={log.id} className="p-3 rounded bg-black/60 border border-cyan-950/20 text-xs font-mono space-y-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-cyan-400 font-bold">{log.timestamp}</span>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold ${log.level === "CRITICAL" ? "bg-red-950 text-red-500 border border-red-900/30" : log.level === "WARNING" ? "bg-amber-950 text-amber-500 border border-amber-900/30" : "bg-cyan-950 text-cyan-400"}`}>
                            {log.level}
                          </span>
                        </div>
                        <p className="text-gray-300 leading-normal">{log.message}</p>
                        <div className="flex justify-between text-[9px] text-gray-500 pt-1 border-t border-cyan-950/15">
                          <span>IP Address: {log.ipAddress}</span>
                          {log.userEmail && <span>Pochta: {log.userEmail}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* H. COORPORATE SETTINGS TAB */}
          {activeSubTab === "settings" && (
            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              <h3 className="text-white font-display font-extrabold text-base uppercase tracking-wider text-cyan-400 border-b border-gray-950 pb-3">
                ⚙️ Umumiy Tizim Sozlamalari
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] text-gray-400 uppercase font-bold mb-1">Telegram qo'llab-quvvatlash bot linki</label>
                  <input type="text" name="telegramBotLink" defaultValue={settings.telegramBotLink} required className="w-full bg-black border border-cyan-950 p-2 rounded text-white font-mono" />
                </div>

                <div>
                  <label className="block text-[11px] text-gray-400 uppercase font-bold mb-1">Maxfiylik Siyosati (Uzbekcha)</label>
                  <textarea name="privacyPolicyUz" defaultValue={settings.privacyPolicyUz} rows={3} required className="w-full bg-black border border-cyan-950 p-2 rounded text-white" />
                </div>

                <div>
                  <label className="block text-[11px] text-gray-400 uppercase font-bold mb-1">Foydalanish qoidalari (Uzbekcha)</label>
                  <textarea name="termsOfServiceUz" defaultValue={settings.termsOfServiceUz} rows={3} required className="w-full bg-black border border-cyan-950 p-2 rounded text-white" />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button type="submit" className="px-5 py-2 rounded bg-cyan-500 font-extrabold text-black hover:bg-cyan-400 cursor-pointer shadow">
                  Tizim parametrlarini saqlash
                </button>
              </div>
            </form>
          )}

          {/* SITES WORDS & TRANSLATION REPAIR EDITOR TAB */}
          {activeSubTab === "words" && (
            <div className="space-y-4 text-xs text-left">
              <div className="border-b border-gray-950 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <h3 className="text-white font-display font-extrabold text-base uppercase tracking-wider text-cyan-400">
                    🗣️ Sayt So'zlarini va Tarjimalarini Tahrirlash
                  </h3>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Bu yerdan saytdagi barcha yozuvlarni, sarlavhalarni, va tarjimalardagi imlo xatolarini to'g'irlashingiz yoki o'zgartirishingiz mumkin.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const confirmReset = window.confirm("Tarjimalarni standart holatiga qaytarishni xohlaysizmi?");
                    if (confirmReset) {
                      localStorage.removeItem("site_words");
                      window.location.reload();
                    }
                  }}
                  className="px-3 py-1.5 rounded border border-red-900/60 bg-red-950/20 text-red-400 hover:bg-red-950/40 font-bold text-[10px] uppercase cursor-pointer"
                >
                  Barchasini asliga qaytarish
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const target = e.currentTarget;
                  const newWords = {
                    uz: {} as Record<string, string>,
                    ru: {} as Record<string, string>,
                    en: {} as Record<string, string>
                  };

                  Object.keys(siteWords.uz).forEach((key) => {
                    newWords.uz[key] = (target.elements.namedItem(`uz_${key}`) as HTMLInputElement)?.value || "";
                    newWords.ru[key] = (target.elements.namedItem(`ru_${key}`) as HTMLInputElement)?.value || "";
                    newWords.en[key] = (target.elements.namedItem(`en_${key}`) as HTMLInputElement)?.value || "";
                  });

                  onUpdateSiteWords(newWords);
                  onLogAction("Admin sayt so'zlarini va tarjimalarni muvaffaqiyatli tahrirladi", "INFO");
                  alert("Ajoyib! Saytdagi barcha yozuvlar va imlo xatolari muvaffaqiyatli yangilandi va saqlandi.");
                }}
                className="space-y-4"
              >
                <div className="space-y-3.5 max-h-[550px] overflow-y-auto pr-2">
                  {Object.keys(siteWords.uz).map((key) => {
                    const keyDescriptions: Record<string, string> = {
                      nowOn: "Tavsiya etilgan oqimlar sarlavhasi",
                      viewAll: "Barchasini ko'rish tugmasi",
                      searchHint: "Qidiruv maydonchasi ichki matni",
                      heroAction: "Bosh ekrandagi tomosha qilish tugmasi",
                      lockedCard: "Premium (Qulflangan) belgisi",
                      freeCard: "Bepul belgisi",
                      scheduleTitle: "Bugungi ko'rsatuvlar sarlavhasi",
                      sportsTitle: "Jonli sport o'yinlari sarlavhasi",
                      newsTitle: "Yangiliklar sarlavhasi",
                      moviesHeader: "Filmlar rukni sarlavhasi",
                      tvHeader: "Jonli efir kanallari sarlavhasi",
                      favoritesHeader: "Sevimlilar bo'limi sarlavhasi",
                      seriesHeader: "Seriallar rukni sarlavhasi",
                      sportHeader: "Sport sahifasi sarlavhasi",
                      noFavs: "Sevimlilar bo'sh bo'lgandagi ogohlantirish",
                      logoutConfirm: "Tizimdan chiqish tasdiq so'zi",
                      premiumUnlockNotice: "Premium qulflangandagi ogohlantirish matni"
                    };

                    return (
                      <div key={key} className="p-4 rounded bg-black/60 border border-cyan-950/40 space-y-2.5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-gray-900 pb-1.5">
                          <span className="font-mono text-[11px] text-cyan-400 font-bold bg-cyan-950/40 px-2 py-0.5 rounded">
                            {key}
                          </span>
                          <span className="text-[10px] text-gray-500 italic">
                            {keyDescriptions[key] || "Tizim so'zi"}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">UZ - O'zbekcha</label>
                            <input
                              type="text"
                              name={`uz_${key}`}
                              defaultValue={siteWords.uz[key] || ""}
                              required
                              className="w-full bg-black border border-cyan-950/60 p-2 rounded text-white text-xs placeholder-gray-800 focus:border-cyan-500 outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">RU - Ruscha</label>
                            <input
                              type="text"
                              name={`ru_${key}`}
                              defaultValue={siteWords.ru[key] || ""}
                              required
                              className="w-full bg-black border border-cyan-950/40 p-2 rounded text-gray-300 text-xs placeholder-gray-800 focus:border-cyan-500 outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">EN - Inglizcha</label>
                            <input
                              type="text"
                              name={`en_${key}`}
                              defaultValue={siteWords.en[key] || ""}
                              required
                              className="w-full bg-black border border-cyan-950/40 p-2 rounded text-gray-300 text-xs placeholder-gray-800 focus:border-cyan-500 outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-3 border-t border-cyan-950/30 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded bg-cyan-500 text-black font-extrabold uppercase hover:bg-cyan-400 cursor-pointer shadow-lg shadow-cyan-950/50 flex items-center space-x-2"
                  >
                    <Save size={14} />
                    <span>O'zgarishlarni va ifodalarni saqlash</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* I. PHP CODES EXPORTER (THE EXTREMELY COOL CORE COMPONENT) */}
          {activeSubTab === "php_export" && (
            <div className="space-y-4">
              <div className="border-b border-gray-950 pb-3">
                <h3 className="text-cyan-400 font-display font-black text-base uppercase tracking-widest flex items-center">
                  <Database size={18} className="mr-2 animate-pulse" />
                  <span>PHP MVC + MySQL Production Source Code Exporter</span>
                </h3>
                <p className="text-[11px] text-gray-400 mt-1">
                  Ushbu platforma cPanel, XAMPP va Xostinglarga 100% mos keladigan PHP 8.2+ PDO ga asoslangan to'liq xavfsiz MVC kod tizimini o'z ichiga oladi. Kodlarni to'g'ridan-to'g'ri ko'chirib oling!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                
                {/* 1. CODE FILE TREE SELECTOR */}
                <div className="bg-black/60 border border-cyan-950/60 rounded-xl p-3 space-y-1 max-h-[400px] overflow-y-auto">
                  <p className="text-gray-500 font-mono uppercase text-[9px] font-bold px-2.5 pb-2 border-b border-gray-900 mb-2">Loyiha fayllari daraxti</p>
                  
                  {Object.keys(phpMVCSourceFiles).map((filename) => (
                    <button
                      key={filename}
                      onClick={() => {
                        setSelectedPhpFile(filename);
                        setCopiedPhpCode(false);
                      }}
                      className={`w-full text-left p-1.5 rounded font-mono text-[10px] tracking-tight flex items-center justify-between cursor-pointer transition-all ${selectedPhpFile === filename ? "bg-cyan-500/10 text-cyan-300 font-bold border border-cyan-500/20" : "text-gray-400 hover:bg-cyan-950/10 hover:text-white"}`}
                    >
                      <span className="flex items-center space-x-1.5 truncate">
                        {filename.endsWith(".php") ? <FileCode size={12} className="text-purple-400" /> : <FileText size={12} className="text-cyan-400" />}
                        <span className="truncate">{filename}</span>
                      </span>
                    </button>
                  ))}
                </div>

                {/* 2. FILE VIEWER DISPLAY TERMINAL */}
                <div className="md:col-span-2 space-y-3.0">
                  <div className="flex items-center justify-between bg-gray-950 border border-cyan-950 p-3 rounded-t-xl">
                    <span className="text-[11px] font-mono font-bold text-gray-300">
                      📄 Fayl: <span className="text-cyan-400">{selectedPhpFile}</span>
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(phpMVCSourceFiles[selectedPhpFile]);
                        setCopiedPhpCode(true);
                        setTimeout(() => setCopiedPhpCode(false), 2000);
                      }}
                      className="px-3 py-1 bg-cyan-950 text-cyan-300 border border-cyan-500/20 hover:bg-cyan-900 rounded font-bold text-[10px] uppercase cursor-pointer"
                    >
                      {copiedPhpCode ? "Nusxalandi! ✓" : "Nusxa olish"}
                    </button>
                  </div>
                  
                  <div className="bg-black border-x border-b border-cyan-950 p-4 rounded-b-xl overflow-x-auto max-h-[320px] overflow-y-auto">
                    <pre className="text-[11px] font-mono text-gray-300 text-left whitespace-pre select-all leading-relaxed font-normal">
                      {phpMVCSourceFiles[selectedPhpFile]}
                    </pre>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>

      </div>

      {/* CONFIRMATION UTILITY MODAL (STRICTLY REQUIRED PRIOR TO DELETING ANY DATA) */}
      {confirmationModal?.isOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="glass-neon p-6 rounded-xl border border-red-950 max-w-sm w-full text-center space-y-4">
            <div className="p-3 w-12 h-12 rounded-full bg-red-950 border border-red-500 text-red-500 flex items-center justify-center mx-auto">
              <AlertOctagon size={24} />
            </div>

            <div className="space-y-1">
              <h3 className="font-display font-extrabold text-white text-base">Rostdan ham o'chirasizmi?</h3>
              <p className="text-xs text-gray-400">
                Siz hozir <b>{confirmationModal.label}</b> ob'ektini butunlay o'chirish arafasidasiz. Bu amalni qaytarib bo'lmaydi!
              </p>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => setConfirmationModal(null)}
                className="flex-1 py-2 rounded bg-gray-900 hover:bg-gray-800 text-gray-300 text-xs font-semibold cursor-pointer"
              >
                Bekor qilish
              </button>
              <button
                onClick={executeDelete}
                className="flex-1 py-2 rounded bg-red-500 hover:bg-red-400 text-black text-xs font-black uppercase tracking-wider cursor-pointer"
              >
                O'chirish (Tasdiq)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
