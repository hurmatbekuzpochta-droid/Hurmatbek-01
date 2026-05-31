/**
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Eye, Heart, Tv, Star, Volume2, Bookmark, CheckCircle, Share2, HelpCircle } from "lucide-react";
import { TVChannel, SportMatch, User } from "../types";
import VideoPlayer from "./VideoPlayer";
import { initialSportsMatches, initialAd } from "../mockData";

interface ChannelDetailProps {
  channel: TVChannel;
  allChannels: TVChannel[];
  currentUser: User | null;
  onSelectChannel: (ch: TVChannel) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  lang: string;
  onTriggerLogin: () => void;
  onTriggerSubscription: () => void;
}

export default function ChannelDetail({
  channel,
  allChannels,
  currentUser,
  onSelectChannel,
  favorites,
  onToggleFavorite,
  lang,
  onTriggerLogin,
  onTriggerSubscription
}: ChannelDetailProps) {
  const [copied, setCopied] = useState(false);
  
  const isFav = favorites.includes(channel.id);

  const matchedSchedule = initialSportsMatches.filter(
    (m) => m.channelName.toLowerCase().indexOf(channel.name.toLowerCase()) !== -1 || channel.category === "sport"
  );

  const t = {
    uz: {
      nowOnAir: "Hozir efirda",
      schedule: "Ko'rsatuvlar jadvali",
      similar: "Boshqa kanallar",
      viewers: "tomoshabinlar",
      addedFav: "Sevimlilarga qo'shildi",
      addFav: "Sevimlilarga qo'shish",
      share: "Ulashish",
      shareSuccess: "Havola nusxalandi!",
      premium: "Premium kanal",
      free: "Bepul kanal",
      aboutTv: "Kanal haqida",
      notLoginFav: "Sevimlilarga qo'shish uchun tizimga kiring!"
    },
    ru: {
      nowOnAir: "Сейчас в эфире",
      schedule: "Программа передач",
      similar: "Другие каналы",
      viewers: "просмотров",
      addedFav: "В избранном",
      addFav: "В избранное",
      share: "Поделиться",
      shareSuccess: "Ссылка скопирована!",
      premium: "Премиум канал",
      free: "Бесплатный канал",
      aboutTv: "О канале",
      notLoginFav: "Войдите, чтобы добавить в избранное!"
    },
    en: {
      nowOnAir: "Now Streaming LIVE",
      schedule: "TV Guide / Schedule",
      similar: "Other Channels",
      viewers: "live views",
      addedFav: "Added to favorites",
      addFav: "Add to favorites",
      share: "Share link",
      shareSuccess: "Link copied to clipboard!",
      premium: "Premium stream",
      free: "Free stream",
      aboutTv: "Channel Info",
      notLoginFav: "Log in to add to your bookmark favorites!"
    }
  }[lang as "uz" | "ru" | "en"] || {
    nowOnAir: "Hozir efirda",
    schedule: "Ko'rsatuvlar jadvali",
    similar: "Boshqa kanallar",
    viewers: "tomoshabinlar",
    addedFav: "Sevimlilarga qo'shildi",
    addFav: "Sevimlilarga qo'shish",
    share: "Ulashish",
    shareSuccess: "Havola nusxalandi!",
    premium: "Premium kanal",
    free: "Bepul kanal",
    aboutTv: "Kanal haqida",
    notLoginFav: "Sevimlilarga qo'shish uchun tizimga kiring!"
  };

  const handleShare = () => {
    const url = `${window.location.host}/tv/channel/${channel.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const categories = [...new Set(allChannels.map(c => c.category))];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 font-sans">
      
      {/* Back to streams link */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* PLAYER & METADATA COLUMN */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Custom Player Wrapper */}
          <VideoPlayer
            streamUrl={channel.streamUrl}
            poster={channel.poster}
            title={channel.name}
            isPremiumContent={channel.isPremium}
            userIsPremium={!!currentUser?.isPremium}
            adSetting={initialAd}
            onAdClicked={() => window.open(initialAd.clickUrl, "_blank")}
            onTriggerLogin={onTriggerLogin}
            onTriggerSubscription={onTriggerSubscription}
          />

          {/* Sunder line with channel info */}
          <div className="glass rounded-xl p-6 border border-cyan-950/40">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              
              <div className="flex items-center space-x-4">
                <img
                  src={channel.logo}
                  alt={channel.name}
                  className="w-12 h-12 rounded-lg object-cover border border-cyan-500/30 bg-black"
                />
                <div>
                  <h1 className="text-xl md:text-2xl font-display font-extrabold text-white tracking-wide">
                    {channel.name}
                  </h1>
                  <div className="flex items-center space-x-2.5 mt-1">
                    <span className="text-[10px] font-bold font-mono tracking-wider uppercase bg-cyan-950/50 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded">
                      Category: {channel.category}
                    </span>
                    {channel.isPremium ? (
                      <span className="text-[10px] font-extrabold bg-gradient-to-tr from-cyan-400 to-emerald-400 text-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow">
                        PREMIUM ★
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold bg-gray-800 text-gray-300 px-2.5 py-0.5 rounded-full uppercase">
                        FREE
                      </span>
                    )}
                    {channel.isLive && (
                      <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                    )}
                  </div>
                </div>
              </div>

              {/* ACTION TOOLS */}
              <div className="flex items-center space-x-2">
                
                {/* Save favorites */}
                <button
                  onClick={() => {
                    if (!currentUser) {
                      alert(t.notLoginFav);
                      onTriggerLogin();
                      return;
                    }
                    onToggleFavorite(channel.id);
                  }}
                  className={`flex items-center space-x-1 px-4 py-2 rounded-full border text-xs font-semibold select-none cursor-pointer transition-all ${isFav ? "bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.3)]" : "border-gray-800 text-gray-400 hover:text-white hover:border-gray-700"}`}
                >
                  <Heart size={14} className={isFav ? "fill-cyan-400" : ""} />
                  <span>{isFav ? t.addedFav : t.addFav}</span>
                </button>

                {/* Share stream link */}
                <button
                  onClick={handleShare}
                  className="px-4 py-2 rounded-full border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700 text-xs font-semibold flex items-center space-x-1 cursor-pointer transition-all"
                >
                  <Share2 size={13} />
                  <span>{copied ? t.shareSuccess : t.share}</span>
                </button>

              </div>

            </div>

            {/* CHANNEL ANALYTICS MOCK */}
            <div className="grid grid-cols-3 gap-4 border-t border-gray-900 mt-6 pt-4 text-center">
              <div>
                <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider">Hozir tomosha qilmoqda</p>
                <p className="text-lg font-mono font-extrabold text-cyan-400 flex items-center justify-center space-x-1.5 mt-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                  <span>{Math.floor(channel.viewsCount / 200 + 45)} ta</span>
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider">Ushbu oy ko'rishlar</p>
                <p className="text-lg font-mono font-extrabold text-white mt-0.5">{(channel.viewsCount).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider">Ping Latency</p>
                <p className="text-lg font-mono font-extrabold text-emerald-400 mt-0.5">0.08 s</p>
              </div>
            </div>

          </div>

          {/* TELEGRAM COOPERATION BOT PROMOTION */}
          <div className="glass rounded-xl p-4 border border-cyan-950/25 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Tv size={18} className="text-cyan-500" />
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Kanal ishlamay qoldimi?</h4>
                <p className="text-[10px] text-gray-400">Telegram robotimizga xabar yuborishingiz bilan adminlarimiz oqimni yangilaydi!</p>
              </div>
            </div>
            <a
              href="https://t.me/htv_bepul_bot"
              target="_blank"
              rel="noopener referrer"
              className="px-3.5 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-black text-[11px] font-bold cursor-pointer transition-all"
            >
              Robotga yozish
            </a>
          </div>

        </div>

        {/* RELATED CHANNELS COLUMN */}
        <div className="space-y-4">
          
          {/* NOW BROADCAST SCHEDULE GUIDE */}
          <div className="glass rounded-xl p-5 border border-cyan-950/40">
            <h3 className="text-white font-display font-extrabold text-sm uppercase tracking-wider border-b border-gray-950 pb-3 mb-4 text-cyan-400">
              🗓️ {t.schedule}
            </h3>
            
            {matchedSchedule.length > 0 ? (
              <div className="space-y-3.0">
                {matchedSchedule.map((match) => (
                  <div key={match.id} className="p-3 rounded-lg bg-black/60 border border-cyan-950/50 flex flex-col space-y-1.5">
                    <span className="text-[9px] font-bold text-cyan-500 uppercase font-mono">{match.tournament}</span>
                    <div className="flex items-center justify-between text-xs font-semibold text-white">
                      <span>{match.teamA} {match.logoA}</span>
                      <span className="text-[10px] text-gray-500 font-mono">vs</span>
                      <span>{match.logoB} {match.teamB}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-gray-400 mt-1">
                      <span>Vaqt: {match.startTime}</span>
                      {match.isLive && (
                        <span className="px-1.5 py-0.5 rounded bg-red-950 text-red-500 border border-red-900 text-[8px] uppercase font-bold">LIVE</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3.5">
                <div className="flex items-start space-x-3 py-1 border-b border-gray-950/50">
                  <span className="text-[10px] font-mono text-cyan-500 font-bold bg-cyan-950/50 px-1.5 py-0.5 rounded">09:00</span>
                  <div>
                    <h5 className="text-xs text-white font-medium">Tonggi Yangiliklar (LIVE)</h5>
                    <p className="text-[10px] text-gray-500">Bugungi kunning birinchi darajali yangiliklar darsi.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 py-1 border-b border-gray-950/50">
                  <span className="text-[10px] font-mono text-cyan-500 font-bold bg-cyan-950/50 px-1.5 py-0.5 rounded">13:15</span>
                  <div>
                    <h5 className="text-xs text-white font-medium">Milliy Serial: Qo'shnilar</h5>
                    <p className="text-[10px] text-gray-500">O'zbek oilaviy hayotining samimiy hayot lahzalari.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 py-1 border-b border-gray-950/50">
                  <span className="text-[10px] font-mono text-cyan-500 font-bold bg-cyan-950/50 px-1.5 py-0.5 rounded">18:00</span>
                  <div>
                    <h5 className="text-xs text-white font-medium">Badiiy multfilm: Koko siri</h5>
                    <p className="text-[10px] text-gray-500">Kichkintoylar uchun hayratlanarli sarguzashtli tasvirlar.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 py-1">
                  <span className="text-[10px] font-mono text-cyan-500 font-bold bg-cyan-950/50 px-1.5 py-0.5 rounded">21:00</span>
                  <div>
                    <h5 className="text-xs text-white font-medium">Tungi Kinomarafon (Premium)</h5>
                    <p className="text-[10px] text-gray-500">Gollivudning ramziy durdona asarlari eng tiniq ovozda.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SIMILAR RECENT CHANNELS */}
          <div className="glass rounded-xl p-5 border border-cyan-950/40">
            <h3 className="text-white font-display font-extrabold text-sm uppercase tracking-wider border-b border-gray-950 pb-3 mb-4 text-cyan-500">
              📺 {t.similar}
            </h3>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {allChannels
                .filter((ch) => ch.id !== channel.id && ch.isActive)
                .slice(0, 7)
                .map((ch) => (
                  <div
                    key={ch.id}
                    onClick={() => onSelectChannel(ch)}
                    className="flex items-center space-x-3 p-2 rounded hover:bg-cyan-950/20 border border-transparent hover:border-cyan-900/40 cursor-pointer transition-all"
                  >
                    <img
                      src={ch.logo}
                      alt={ch.name}
                      className="w-10 h-10 rounded object-cover border border-cyan-500/10 bg-black"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{ch.name}</p>
                      <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest">{ch.category}</span>
                    </div>
                    {ch.isPremium && (
                      <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
                    )}
                  </div>
                ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
