/**
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Star, ShieldAlert, Film, ChevronLeft, Play, ArrowLeft, RefreshCw, Eye } from "lucide-react";
import { Movie, User } from "../types";
import VideoPlayer from "./VideoPlayer";
import { initialAd } from "../mockData";

interface MovieDetailProps {
  movie: Movie;
  currentUser: User | null;
  onBack: () => void;
  lang: string;
  onTriggerLogin: () => void;
  onTriggerSubscription: () => void;
}

export default function MovieDetail({
  movie,
  currentUser,
  onBack,
  lang,
  onTriggerLogin,
  onTriggerSubscription
}: MovieDetailProps) {
  const [activeSource, setActiveSource] = useState<"video" | "trailer">("video");
  
  const isPremiumLocked = movie.isPremium && !currentUser?.isPremium;

  const t = {
    uz: {
      watchTrailer: "Treylerni ko'rish",
      watchMovie: "To'liq kinoni ko'rish",
      year: "Yil",
      genre: "Janr",
      duration: "Davomiyligi",
      rating: "Reyting",
      minutes: "daqiqa",
      lockedTitle: "Ushbu kino obuna bilan ko'rsatiladi",
      notLogin: "Kinoni ko'rish uchun avval tizimga kiring!",
      buyPlan: "Tarif sotib olish",
      detailsHeader: "Kino tafsilotlari",
      trailer: "Treyler",
      mainVideo: "Asosiy video"
    },
    ru: {
      watchTrailer: "Смотреть Трейлер",
      watchMovie: "Смотреть Фильм",
      year: "Год",
      genre: "Жанр",
      duration: "Длительность",
      rating: "Рейтинг",
      minutes: "минут",
      lockedTitle: "Этот фильм доступен по подписке",
      notLogin: "Войдите в систему для просмотра фильма!",
      buyPlan: "Купить тариф",
      detailsHeader: "О фильме",
      trailer: "Трейлер",
      mainVideo: "Основное видео"
    },
    en: {
      watchTrailer: "Watch Trailer",
      watchMovie: "Watch Full Movie",
      year: "Year",
      genre: "Genre",
      duration: "Duration",
      rating: "Rating",
      minutes: "mins",
      lockedTitle: "This movie is accessible via VIP sub",
      notLogin: "Log in or Sign up first to unlock streaming channels!",
      buyPlan: "Purchase premium tier",
      detailsHeader: "Movie Details",
      trailer: "Trailer Only",
      mainVideo: "Full Movie Video"
    }
  }[lang as "uz" | "ru" | "en"] || {
    watchTrailer: "Treylerni ko'rish",
    watchMovie: "To'liq kinoni ko'rish",
    year: "Yil",
    genre: "Janr",
    duration: "Davomiyligi",
    rating: "Reyting",
    minutes: "daqiqa",
    lockedTitle: "Ushbu kino obuna bilan ko'rsatiladi",
    notLogin: "Kinoni ko'rish uchun avval tizimga kiring!",
    buyPlan: "Tarif sotib olish",
    detailsHeader: "Kino tafsilotlari",
    trailer: "Treyler",
    mainVideo: "Asosiy video"
  };

  const name = {
    uz: movie.nameUz,
    ru: movie.nameRu,
    en: movie.nameEn
  }[lang as "uz" | "ru" | "en"] || movie.nameUz;

  const genre = {
    uz: movie.genreUz,
    ru: movie.genreRu,
    en: movie.genreEn
  }[lang as "uz" | "ru" | "en"] || movie.genreUz;

  const descr = {
    uz: movie.descriptionUz,
    ru: movie.descriptionRu,
    en: movie.descriptionEn
  }[lang as "uz" | "ru" | "en"] || movie.descriptionUz;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 font-sans">
      
      {/* Back to library button */}
      <button
        onClick={onBack}
        className="flex items-center space-x-1 text-xs text-cyan-400 hover:text-cyan-300 font-bold mb-6 tracking-wider uppercase cursor-pointer"
      >
        <ArrowLeft size={16} />
        <span>Kutubxonaga qaytish</span>
      </button>

      {/* Main player display box */}
      <div className="space-y-6">
        
        {/* VIDEO INSTANTIATION */}
        <div className="relative">
          <VideoPlayer
            streamUrl={activeSource === "video" ? movie.videoUrl : movie.trailerUrl}
            poster={movie.backdrop}
            title={`${name} [${activeSource === "video" ? t.mainVideo : t.trailer}]`}
            isPremiumContent={activeSource === "video" ? movie.isPremium : false} // Trailer is always FREE
            userIsPremium={!!currentUser?.isPremium}
            adSetting={initialAd}
            onAdClicked={() => window.open(initialAd.clickUrl, "_blank")}
            onTriggerLogin={onTriggerLogin}
            onTriggerSubscription={onTriggerSubscription}
          />
        </div>

        {/* METADATA DETAILS CARD */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* POSTER CARD AND MULTI-SOURCE TOGGLER */}
          <div className="space-y-4">
            <img
              src={movie.poster}
              alt={name}
              className="w-full text-center aspect-[2/3] object-cover rounded-2xl border border-cyan-950/40 glow-glow shadow-2xl"
            />

            {/* TOGGLE SOURCE SWITCHERS */}
            <div className="grid grid-cols-2 gap-2 mt-2">
              <button
                onClick={() => setActiveSource("video")}
                className={`flex items-center justify-center space-x-1.5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${activeSource === "video" ? "bg-cyan-500 text-black shadow-[0_0_12px_rgba(6,182,212,0.4)]" : "bg-cyan-950/20 hover:bg-cyan-950/40 border border-cyan-950 text-cyan-400"}`}
              >
                <Play size={13} />
                <span>{t.watchMovie}</span>
              </button>

              <button
                onClick={() => setActiveSource("trailer")}
                className={`flex items-center justify-center space-x-1.5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${activeSource === "trailer" ? "bg-cyan-500 text-black shadow-[0_0_12px_rgba(6,182,212,0.4)]" : "bg-cyan-950/20 hover:bg-cyan-950/45 border border-cyan-950 text-cyan-400"}`}
              >
                <Film size={13} />
                <span>{t.watchTrailer}</span>
              </button>
            </div>
          </div>

          {/* META TEXT DETAILS */}
          <div className="lg:col-span-2 space-y-6 glass rounded-2xl p-6 md:p-8 border border-cyan-950/40 text-sm">
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2.5 flex-wrap">
                <span className="text-[10px] font-bold font-mono tracking-widest bg-cyan-950 text-cyan-400 border border-cyan-500/20 px-2.5 py-0.5 rounded uppercase">
                  {movie.year}
                </span>
                <span className="text-[10px] font-bold font-mono tracking-widest bg-cyan-950 text-cyan-400 border border-cyan-500/20 px-2.5 py-0.5 rounded uppercase">
                  {movie.durationMinutes} {t.minutes}
                </span>
                {movie.isPremium ? (
                  <span className="text-[9px] font-extrabold bg-gradient-to-tr from-cyan-400 to-emerald-400 text-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                     Premium Obuna ★
                  </span>
                ) : (
                  <span className="text-[9px] font-bold bg-gray-800 text-gray-300 px-2.5 py-1 rounded-full uppercase tracking-wider">
                     BEPUL LOYIHA
                  </span>
                )}
              </div>

              <h2 className="text-2xl md:text-3xl font-display font-black text-white tracking-wide">
                {name}
              </h2>
              
              <p className="text-cyan-400/80 text-xs font-mono font-medium">
                {t.genre}: {genre}
              </p>
            </div>

            {/* DESCRIPTION SECTION */}
            <div className="border-t border-cyan-950/80 pt-4 space-y-2">
              <h4 className="text-white font-extrabold text-xs uppercase tracking-widest">Tavsif (Description):</h4>
              <p className="text-gray-400 leading-relaxed text-xs">
                {descr}
              </p>
            </div>

            {/* RATING INFORMATION BAR */}
            <div className="flex items-center space-x-4 border-t border-cyan-950/80 pt-4">
              <div className="flex items-center space-x-2 bg-black/40 border border-cyan-500/10 rounded-lg p-3">
                <Star className="text-cyan-400 h-5 w-5 text-glow fill-cyan-400" />
                <div>
                  <p className="text-white font-black font-mono text-base">{movie.rating}</p>
                  <p className="text-[9px] text-gray-500 uppercase tracking-widest leading-none mt-0.5">HTV Rating</p>
                </div>
              </div>

              <div className="text-xs text-gray-500 font-mono">
                <p>Slug url: /tv/movie/{movie.slug}</p>
                <p className="mt-1 flex items-center text-emerald-400/80">
                  <ShieldAlert size={12} className="mr-1" />
                  <span>Xavfsiz tomosha kafolatlangan</span>
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
