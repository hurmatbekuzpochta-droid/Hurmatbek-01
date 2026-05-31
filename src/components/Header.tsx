/**
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Play, Tv, LogIn, User, LogOut, MessageSquare, Globe, Menu, X, Shield, Lock, CreditCard, Sun, Moon } from "lucide-react";
import { User as UserType, Lang } from "../types";

interface HeaderProps {
  currentLang: Lang;
  onChangeLang: (lang: Lang) => void;
  currentUser: UserType | null;
  onLogout: () => void;
  activeTab: string;
  onChangeTab: (tab: string) => void;
  telegramLink: string;
  onOpenLogin: () => void;
  onOpenBilling: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export default function Header({
  currentLang,
  onChangeLang,
  currentUser,
  onLogout,
  activeTab,
  onChangeTab,
  telegramLink,
  onOpenLogin,
  onOpenBilling,
  theme,
  onToggleTheme
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const t = {
    uz: {
      movies: "Kinolar",
      tv: "TV Kanallar",
      series: "Seriallar",
      sport: "Sport",
      contact: "Bog'lanish",
      billing: "Obuna / Tariflar",
      login: "Kirish",
      premiumUser: "Premium",
      freeUser: "Bepul A'zo",
      adminPanel: "Admin Panel",
      logout: "Chiqish",
      slogan: "Eng tezkor onlayn TV va kino platforma"
    },
    ru: {
      movies: "Фильмы",
      tv: "ТВ Каналы",
      series: "Сериалы",
      sport: "Спорт",
      contact: "Связь",
      billing: "Подписка / Тарифы",
      login: "Войти",
      premiumUser: "Премиум",
      freeUser: "Бесплатный",
      adminPanel: "Админ Панель",
      logout: "Выйти",
      slogan: "Самая быстрая ТВ и кино платформа"
    },
    en: {
      movies: "Movies",
      tv: "TV Channels",
      series: "Series",
      sport: "Sports",
      contact: "Contact Us",
      billing: "Pricing / Subscription",
      login: "Sign In",
      premiumUser: "Premium Member",
      freeUser: "Free Member",
      adminPanel: "Admin Panel",
      logout: "Log Out",
      slogan: "The fastest online TV and Cinema platform"
    }
  }[currentLang];

  const handleNav = (tab: string) => {
    onChangeTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-black/40 backdrop-blur-xl border-b border-cyan-500/20 px-4 md:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* LOGO AREA */}
        <div 
          onClick={() => handleNav("home")} 
          className="flex items-center space-x-2.5 cursor-pointer group"
          id="htv-logo-header"
        >
          <div className="h-10 w-10 rounded-lg bg-black border border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.4)] flex items-center justify-center p-1 font-display font-black text-2xl text-cyan-400 group-hover:scale-105 transition-transform">
            <span className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">H</span>
          </div>
          <div className="flex flex-col">
            <span className="font-display font-black text-2xl tracking-tighter text-white flex items-center leading-none">
              HTV
              <span className="ml-2 text-[8px] bg-cyan-950 text-cyan-400 border border-cyan-500/30 px-1 py-0.5 rounded uppercase tracking-widest font-black max-sm:hidden">ONLINE</span>
            </span>
            <span className="text-[9px] font-mono tracking-tighter text-gray-500 font-semibold uppercase mt-0.5 max-sm:hidden">
              {t.slogan}
            </span>
          </div>
        </div>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden lg:flex items-center space-x-6">
          <button
            onClick={() => handleNav("home")}
            className={`font-medium text-sm transition-colors cursor-pointer hover:text-cyan-400 ${activeTab === "home" ? "text-cyan-400 font-extrabold" : "text-gray-400"}`}
          >
            Bosh sahifa
          </button>
          <button
            onClick={() => handleNav("movies")}
            className={`font-medium text-sm transition-colors cursor-pointer hover:text-cyan-400 ${activeTab === "movies" ? "text-cyan-400 font-extrabold" : "text-gray-400"}`}
          >
            {t.movies}
          </button>
          <button
            onClick={() => handleNav("tv")}
            className={`font-medium text-sm transition-colors cursor-pointer hover:text-cyan-400 ${activeTab === "tv" ? "text-cyan-400 font-extrabold" : "text-gray-400"}`}
          >
            {t.tv}
          </button>
          <button
            onClick={() => handleNav("series")}
            className={`font-medium text-sm transition-colors cursor-pointer hover:text-cyan-400 ${activeTab === "series" ? "text-cyan-400 font-extrabold" : "text-gray-400"}`}
          >
            {t.series}
          </button>
          <button
            onClick={() => handleNav("sport")}
            className={`font-medium text-sm transition-colors cursor-pointer hover:text-cyan-400 ${activeTab === "sport" ? "text-cyan-400 font-extrabold" : "text-gray-400"}`}
          >
            {t.sport}
          </button>
          <a
            href={telegramLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 font-medium text-sm text-gray-400 hover:text-cyan-400 transition-colors"
          >
            <MessageSquare size={14} />
            <span>{t.contact}</span>
          </a>
        </nav>

        {/* RIGHT ACTION CONTROLS */}
        <div className="flex items-center space-x-4">
          
          {/* SUBSCRIPTION SHORTCUT FOR ANONYMOUS / FREE */}
          <button
            onClick={onOpenBilling}
            className="hidden sm:flex items-center space-x-1.5 px-4 py-1.5 rounded bg-white/5 text-cyan-400 font-display text-xs border border-white/10 font-bold hover:bg-cyan-500 hover:text-black hover:border-transparent transition-all cursor-pointer"
          >
            <CreditCard size={13} />
            <span>{t.billing}</span>
          </button>

          {/* LANGUAGE SELECTOR */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(false)}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-md text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors"
              title="Change Language"
            >
              <Globe size={16} className="text-cyan-500" />
              <span className="uppercase font-mono font-medium text-xs text-gray-200">{currentLang}</span>
            </button>
            <div className="absolute right-0 mt-1 w-24 rounded-md shadow-lg py-1 bg-gray-900 border border-gray-800 hidden hover:block group-hover:block focus-within:block">
              {/* Fallback mouse hover handled elegantly or just custom inline selection */}
            </div>
            
            {/* Inline Toggle helper for language to make it dead simple without dropdown bugs */}
            <select
              value={currentLang}
              onChange={(e) => onChangeLang(e.target.value as Lang)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full"
            >
              <option value="uz">UZ</option>
              <option value="ru">RU</option>
              <option value="en">EN</option>
            </select>
          </div>

          {/* THEME TOGGLE BUTTON */}
          <button
            onClick={onToggleTheme}
            className="flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-500/10 transition-colors cursor-pointer"
            title={theme === "dark" ? "Kunduzgi rejim" : "Tungi rejim"}
          >
            {theme === "dark" ? (
              <Sun size={17} className="text-amber-400" />
            ) : (
              <Moon size={17} className="text-indigo-400" />
            )}
          </button>

          {/* USER SESSION COMPONENT */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-800/40 text-sm hover:border-cyan-500 transition-colors cursor-pointer"
              >
                <div className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-xs ${currentUser.isPremium ? "bg-gradient-to-tr from-cyan-400 to-emerald-400 text-black" : "bg-gray-800 text-gray-300"}`}>
                  {currentUser.isPremium ? "★" : "U"}
                </div>
                <span className="max-w-[80px] truncate text-xs font-medium text-gray-200 max-sm:hidden">
                  {currentUser.email.split("@")[0]}
                </span>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-md shadow-2xl glass border border-cyan-950 p-2 text-sm z-50">
                  <div className="px-3 py-2 border-b border-gray-800">
                    <p className="font-semibold text-white truncate text-xs">{currentUser.email}</p>
                    <p className="text-[10px] mt-1 text-gray-400 flex items-center">
                      <span className={`inline-block h-1.5 w-1.5 rounded-full mr-1.5 ${currentUser.isPremium ? "bg-cyan-400" : "bg-gray-500"}`}></span>
                      {currentUser.isPremium ? `${t.premiumUser}` : t.freeUser}
                    </p>
                    {currentUser.isPremium && currentUser.subscriptionExpiresAt && (
                      <p className="text-[9px] text-cyan-400 font-mono mt-0.5">Exp: {currentUser.subscriptionExpiresAt}</p>
                    )}
                  </div>
                  
                  {/* ADMIN PANEL ROUTE */}
                  {(currentUser.role === "super_admin" || currentUser.role === "editor" || currentUser.role === "moderator") && (
                    <button
                      onClick={() => {
                        handleNav("admin");
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left flex items-center space-x-2 px-3 py-2 mt-1 rounded md hover:bg-cyan-950/50 text-cyan-400 font-medium text-xs transition-colors cursor-pointer"
                    >
                      <Shield size={14} />
                      <span>{t.adminPanel} ({currentUser.role})</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      onOpenBilling();
                      setUserMenuOpen(false);
                    }}
                    className="w-full text-left flex items-center space-x-2 px-3 py-2 rounded md hover:bg-gray-800/80 text-xs text-gray-300 transition-colors cursor-pointer"
                  >
                    <CreditCard size={14} />
                    <span>{t.billing}</span>
                  </button>

                  <button
                    onClick={() => {
                      onLogout();
                      setUserMenuOpen(false);
                    }}
                    className="w-full text-left flex items-center space-x-2 px-3 py-2 rounded md hover:bg-red-950/40 text-xs text-red-400 transition-colors cursor-pointer"
                  >
                    <LogOut size={14} />
                    <span>{t.logout}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="flex items-center space-x-1.5 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-4 py-1.5 rounded-full text-xs font-display transition-all transform hover:scale-[1.03] cursor-pointer shadow-[0_0_10px_rgba(6,182,212,0.3)]"
            >
              <LogIn size={13} />
              <span>{t.login}</span>
            </button>
          )}

          {/* MOBILE MENU TOGGLER */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 text-gray-400 hover:text-white rounded hover:bg-gray-800/50"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden pt-4 pb-3 border-t border-cyan-950 mt-3 space-y-2 flex flex-col">
          <button
            onClick={() => handleNav("home")}
            className={`w-full text-left py-2 px-4 text-sm font-medium rounded ${activeTab === "home" ? "bg-cyan-950/60 text-cyan-400" : "text-gray-300 hover:bg-gray-900"}`}
          >
            Bosh sahifa
          </button>
          <button
            onClick={() => handleNav("movies")}
            className={`w-full text-left py-2 px-4 text-sm font-medium rounded ${activeTab === "movies" ? "bg-cyan-950/60 text-cyan-400" : "text-gray-300 hover:bg-gray-900"}`}
          >
            {t.movies}
          </button>
          <button
            onClick={() => handleNav("tv")}
            className={`w-full text-left py-2 px-4 text-sm font-medium rounded ${activeTab === "tv" ? "bg-cyan-950/60 text-cyan-400" : "text-gray-300 hover:bg-gray-900"}`}
          >
            {t.tv}
          </button>
          <button
            onClick={() => handleNav("series")}
            className={`w-full text-left py-2 px-4 text-sm font-medium rounded ${activeTab === "series" ? "bg-cyan-950/60 text-cyan-400" : "text-gray-300 hover:bg-gray-900"}`}
          >
            {t.series}
          </button>
          <button
            onClick={() => handleNav("sport")}
            className={`w-full text-left py-2 px-4 text-sm font-medium rounded ${activeTab === "sport" ? "bg-cyan-950/60 text-cyan-400" : "text-gray-300 hover:bg-gray-900"}`}
          >
            {t.sport}
          </button>
          
          <a
            href={telegramLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 py-2 px-4 text-sm text-gray-300 hover:bg-gray-900 rounded"
          >
            <MessageSquare size={16} className="text-cyan-500" />
            <span>{t.contact}</span>
          </a>

          <button
            onClick={() => handleNav("billing")}
            className="flex items-center space-x-2 py-2 px-4 text-sm text-cyan-400 font-semibold"
          >
            <CreditCard size={16} />
            <span>{t.billing}</span>
          </button>
        </div>
      )}
    </header>
  );
}
