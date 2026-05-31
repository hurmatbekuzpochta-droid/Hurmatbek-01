/**
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { Play, Pause, Volume2, VolumeX, Maximize2, Settings, AlertTriangle, ShieldCheck, Eye, Film, Forward, HelpCircle } from "lucide-react";
import { TVChannel, Movie, AdSetting } from "../types";

interface VideoPlayerProps {
  streamUrl: string;
  poster: string;
  title: string;
  isPremiumContent: boolean;
  userIsPremium: boolean;
  adSetting?: AdSetting;
  onAdClicked?: () => void;
  onTriggerLogin?: () => void;
  onTriggerSubscription?: () => void;
}

export default function VideoPlayer({
  streamUrl,
  poster,
  title,
  isPremiumContent,
  userIsPremium,
  adSetting,
  onAdClicked,
  onTriggerLogin,
  onTriggerSubscription
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  // States
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [quality, setQuality] = useState("auto (720p)");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);

  // Error & Diagnostic States
  const [playerError, setPlayerError] = useState<{
    code: string;
    details: string;
    solutions: string[];
  } | null>(null);

  // Advertisements states
  const [isShowingAd, setIsShowingAd] = useState(false);
  const [adTimer, setAdTimer] = useState(0);
  const [adCanSkip, setAdCanSkip] = useState(false);

  // Handle auto-fade controls
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const handleMouseMove = () => {
      setIsControlsVisible(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (isPlaying && !showSettings) {
          setIsControlsVisible(false);
        }
      }, 3000);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
    }
    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
      }
      clearTimeout(timeoutId);
    };
  }, [isPlaying, showSettings]);

  // Locked check
  const isLocked = isPremiumContent && !userIsPremium;

  // Pre-roll ad logic
  useEffect(() => {
    if (isLocked) {
      setIsShowingAd(false);
      return;
    }

    if (adSetting?.isEnabled && !userIsPremium && streamUrl) {
      setIsShowingAd(true);
      setAdTimer(adSetting.durationSeconds);
      setAdCanSkip(false);
      
      const interval = setInterval(() => {
        setAdTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsShowingAd(false);
            // Auto play main stream after ad is done
            if (videoRef.current) {
              videoRef.current.play().catch(() => {});
            }
            return 0;
          }
          if (adSetting.durationSeconds - prev >= 3) {
            setAdCanSkip(true);
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setIsShowingAd(false);
    }
  }, [streamUrl, isLocked, userIsPremium, adSetting]);

  // HLS.js or Native initialization
  useEffect(() => {
    setPlayerError(null);
    const video = videoRef.current;
    if (!video || isLocked || isShowingAd) return;

    // Reset stream
    setIsPlaying(false);
    setCurrentTime(0);

    // Diagnostics link check
    if (!streamUrl) {
      setPlayerError({
        code: "URL_EMPTY",
        details: "Video manbasi kiritilmadi (Stream Link empty)",
        solutions: [
          "Admin paneldan oqim havolasini tekshiring",
          "M3U playlist importida xatolik bormi?"
        ]
      });
      return;
    }

    // Diagnostics check for CORS/Wrong link on load start
    const fetchCheck = async () => {
      try {
        if (streamUrl.startsWith("http")) {
          const controller = new AbortController();
          const id = setTimeout(() => controller.abort(), 3500); // Fail fast
          
          await fetch(streamUrl, { method: "HEAD", signal: controller.signal, mode: "no-cors" });
          clearTimeout(id);
        }
      } catch (err: any) {
        // High likelihood of Server offline or CORS block
        setPlayerError({
          code: "CORS_OR_OFFLINE",
          details: "Server javob bermadi yoki CORS blokirovkasi aniqlandi",
          solutions: [
            "HLS oqim serverida CORS headerlar yetishmayotgani (Access-Control-Allow-Origin)",
            "Kollektor IP manzili bloklangan bo'lishi mumkin (Cloudflare Firewall)",
            "Oqim havolasi eskirgan yoki xato kiritilgan"
          ]
        });
      }
    };
    fetchCheck();

    // HLS handler
    if (Hls.isSupported() && streamUrl.endsWith(".m3u8")) {
      const hls = new Hls({
        maxBufferLength: 30,
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsRef.current = hls;

      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().then(() => setIsPlaying(true)).catch(() => {});
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              setPlayerError({
                code: "HLS_NETWORK_FAIL",
                details: "HLS yuklanmadi: Tarmoq ulanishida uzilish (Network error)",
                solutions: [
                  "Tarmoq ulanishingizni tekshiring",
                  "IPTV serveri o'chirilgan yoki faolligi yo'qolgan"
                ]
              });
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              setPlayerError({
                code: "HLS_MEDIA_FAIL",
                details: "HLS yuklanmadi: Media fayli sifati dekod qilinmadi (Media error)",
                solutions: [
                  "Boshqa sifat variantiga o'tib ko'ring",
                  "Video h.264 video formatini qo'llashi shart"
                ]
              });
              hls.recoverMediaError();
              break;
            default:
              setPlayerError({
                code: "HLS_FATAL_ERROR",
                details: `HLS.js tizimli xatoligi: ${data.details}`,
                solutions: [
                  "Oqim manbasini tekshiring",
                  "M3U playlist link to'g'riligiga ishonch hosil qiling"
                ]
              });
              break;
          }
        }
      });

      return () => {
        hls.destroy();
        hlsRef.current = null;
      };
    } else {
      // Native stream playback
      video.src = streamUrl;
      const onCanPlay = () => {
        video.play().then(() => setIsPlaying(true)).catch(() => {});
      };
      const onNativeErr = () => {
        setPlayerError({
          code: "HTML5_NATIVE_ERR",
          details: "Native Player Xatosi: Brauzer ushbu oqimni o'qi olmaydi",
          solutions: [
            "Chromium brauzerlari native .m3u8 o'qiy olmaydi. HTV HLS.js orqali yuklamoqda.",
            "Video sarlavhasi (headers) yaroqsiz yoki ruxsat berilmagan."
          ]
        });
      };

      video.addEventListener("canplay", onCanPlay);
      video.addEventListener("error", onNativeErr);

      return () => {
        video.removeEventListener("canplay", onCanPlay);
        video.removeEventListener("error", onNativeErr);
      };
    }
  }, [streamUrl, isLocked, isShowingAd]);

  // Add event listener for general keyboard hotkeys (F key)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") {
        return;
      }
      if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        toggleFullscreen();
      }
      if (e.key === " ") {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video || isLocked || isShowingAd) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play().then(() => {
        setIsPlaying(true);
        setPlayerError(null);
      }).catch((e) => {
        setPlayerError({
          code: "AUTOPLAY_BLOCKED",
          details: "Brauzer avtomatik video ijrosini blokladi",
          solutions: [
            "Ekran ustiga bir marta bosing",
            "Ovozni o'chirgan holda sinab ko'ring"
          ]
        });
      });
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const next = !isMuted;
      setIsMuted(next);
      videoRef.current.muted = next;
      // sync volume visual
      if (next) {
        videoRef.current.volume = 0;
      } else {
        videoRef.current.volume = volume;
      }
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const changePlaybackRate = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
    setShowSettings(false);
  };

  const skipAd = () => {
    if (adCanSkip) {
      setIsShowingAd(false);
      if (videoRef.current) {
        videoRef.current.play().catch(() => {});
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video rounded-xl overflow-hidden bg-black border border-cyan-950 glow-glow flex items-center justify-center font-sans tracking-wide"
      id="htv-professional-video-player"
    >
      
      {/* 1. COMPONENT WATERMARK */}
      <div className="absolute top-4 left-4 z-30 pointer-events-none select-none flex items-center space-x-1 opacity-70">
        <span className="h-2 w-2 rounded-full bg-cyan-400 text-glow animate-ping"></span>
        <span className="font-display font-black text-xs tracking-widest text-cyan-400 uppercase bg-black/60 px-2 py-1 rounded border border-cyan-500/20">
          HTV STREAM
        </span>
      </div>

      {/* 2. LOCKED PREMIUM OVERLAY */}
      {isLocked && (
        <div className="absolute inset-0 z-40 bg-gray-950/95 flex flex-col items-center justify-center text-center p-6 border border-cyan-500/30">
          <div className="p-4 rounded-full bg-cyan-950/60 border border-cyan-500 mb-4 animate-bounce">
            <AlertTriangle className="h-10 w-10 text-cyan-400 text-glow" />
          </div>
          <h3 className="font-display font-extrabold text-xl md:text-2xl text-white">
            Premium Kontent Qulflangan
          </h3>
          <p className="text-sm text-gray-400 mt-2 max-w-md">
            Siz tanlagan "{title}" faqat premium obunachilar guruhiga ruxsatlangan. Tomosha qilish uchun professional tarif sotib oling.
          </p>
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-6">
            <button
              onClick={onTriggerSubscription}
              className="px-6 py-2.5 rounded-full bg-cyan-500 text-black font-bold text-xs font-display flex items-center space-x-2 shadow-[0_0_15px_rgba(6,182,212,0.6)] hover:bg-cyan-400 transition-all cursor-pointer"
            >
              <ShieldCheck size={14} />
              <span>Tarif sotib olish</span>
            </button>
            <button
              onClick={onTriggerLogin}
              className="px-5 py-2.5 rounded-full border border-gray-700 hover:border-cyan-500 text-gray-200 text-xs font-semibold hover:text-white transition-all cursor-pointer"
            >
              Tizimga kirish
            </button>
          </div>
        </div>
      )}

      {/* 3. ADVERT PLAYBACK OVERLAY */}
      {isShowingAd && adSetting && (
        <div className="absolute inset-0 z-40 bg-black flex items-center justify-center pointer-events-auto">
          {/* Ad playback element */}
          <video
            src={adSetting.videoUrl}
            autoPlay
            muted
            className="w-full h-full object-cover"
            onClick={onAdClicked}
          />
          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between z-50">
            <a
              href={adSetting.clickUrl}
              target="_blank"
              rel="noopener referrer"
              onClick={onAdClicked}
              className="px-4 py-2 bg-cyan-950/90 hover:bg-cyan-900 text-cyan-300 rounded border border-cyan-500 text-xs flex items-center space-x-2 transition-all cursor-pointer shadow-lg"
            >
              <Film size={14} />
              <span>Batafsil ma'lumot (Reklama)</span>
            </a>
            
            <div className="flex items-center space-x-3">
              <span className="text-white text-xs font-mono font-bold bg-black/80 px-3 py-2 rounded border border-gray-800">
                Reklama tugaydi: {adTimer} s
              </span>

              {adCanSkip ? (
                <button
                  onClick={skipAd}
                  className="px-4 py-2 bg-white hover:bg-cyan-500 hover:text-black text-black font-bold uppercase tracking-widest text-[10px] rounded flex items-center space-x-1.5 transition-all cursor-pointer shadow-lg"
                >
                  <span>O'tkazib yuborish</span>
                  <Forward size={14} />
                </button>
              ) : (
                <span className="text-[10px] text-gray-400 bg-black/60 px-3 py-2 rounded">
                  O'tkazib yuborish {Math.max(0, adTimer - adSetting.durationSeconds + 3)}...
                </span>
              )}
            </div>
          </div>
          <div className="absolute top-4 right-4 z-50">
            <span className="text-[10px] font-semibold text-cyan-400 uppercase tracking-widest border border-cyan-400/40 bg-emerald-950/80 px-3 py-1 rounded">
              Reklama hamkori: HPRINT
            </span>
          </div>
        </div>
      )}

      {/* 4. MAIN HTML5 VIDEO PLAYBACK */}
      {!isLocked && !isShowingAd && (
        <video
          ref={videoRef}
          poster={poster || "https://images.unsplash.com/photo-1598257006458-087169a1f08d?w=800&auto=format&fit=crop&q=80"}
          className="w-full h-full object-contain cursor-pointer"
          preload="metadata"
          onClick={togglePlay}
          onTimeUpdate={() => {
            if (videoRef.current) {
              setCurrentTime(videoRef.current.currentTime);
            }
          }}
          onDurationChange={() => {
            if (videoRef.current) {
              setDuration(videoRef.current.duration);
            }
          }}
        />
      )}

      {/* 5. DIAGNOSTICS ALERTS */}
      {playerError && !isLocked && !isShowingAd && (
        <div className="absolute inset-0 z-30 bg-black/90 p-4 md:p-8 flex flex-col justify-center text-sm">
          <div className="flex items-center space-x-3 text-red-500 mb-2 font-display">
            <AlertTriangle className="h-6 w-6 animate-pulse" />
            <h4 className="font-extrabold text-white text-base">HATO DIAGNOSTIKASI (STREAM ERROR)</h4>
          </div>
          <p className="text-gray-300 bg-red-950/20 border border-red-900/30 p-2 text-xs rounded font-mono break-all leading-normal">
            ⚙️ <span className="text-red-400 font-bold">{playerError.code}:</span> {playerError.details}
          </p>
          <div className="mt-4">
            <p className="text-gray-400 text-xs uppercase font-extrabold tracking-widest">Tavsiya etilgan tuzatish ishlari:</p>
            <ul className="list-disc pl-5 text-gray-300 text-xs mt-1.5 space-y-1">
              {playerError.solutions.map((sol, index) => (
                <li key={index}>{sol}</li>
              ))}
            </ul>
          </div>
          <div className="mt-6 flex space-x-3">
            <button
              onClick={() => {
                setPlayerError(null);
                if (videoRef.current) videoRef.current.load();
              }}
              className="px-4 py-1.5 bg-gray-800 hover:bg-gray-700 text-white rounded text-xs transition-colors cursor-pointer"
            >
              Oqimni yuklab ko'rish
            </button>
            <a
              href={streamUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-1.5 bg-cyan-950 text-cyan-300 rounded text-xs border border-cyan-800 transition-colors flex items-center space-x-1"
            >
              <span>Tashqi playerda ochish</span>
            </a>
          </div>
        </div>
      )}

      {/* 6. SUBTITLE OVERLAY CONTROLS */}
      {subtitlesEnabled && isPlaying && !isLocked && !isShowingAd && !playerError && (
        <div className="absolute bottom-16 left-0 right-0 text-center pointer-events-none select-none z-20">
          <p className="inline-block bg-black/80 px-3 py-1 rounded text-cyan-200 border border-cyan-500/10 text-xs md:text-sm font-light text-glow">
            {currentTime < 10 ? "[HTV Sifatli O'zbek Tili tarjimasi]" : currentTime > 15 && currentTime < 25 ? `Tomosha qilinmoqda: ${title}` : null}
          </p>
        </div>
      )}

      {/* 7. CUSTOM CINEMATIC CONTROLS PANEL */}
      {!isLocked && !isShowingAd && !playerError && isControlsVisible && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 flex flex-col space-y-3 z-30 transition-opacity">
          
          {/* Timeline slider for MP4/videos (no action for live IPTV channels) */}
          {duration > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono text-gray-400">
                {Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, "0")}
              </span>
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  if (videoRef.current) videoRef.current.currentTime = val;
                }}
                className="w-full accent-cyan-500 bg-gray-800 rounded-lg cursor-pointer h-1.5"
              />
              <span className="text-[10px] font-mono text-gray-400">
                {Math.floor(duration / 60)}:{String(Math.floor(duration % 60)).padStart(2, "0")}
              </span>
            </div>
          )}

          {/* Buttons Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3.5">
              
              {/* Play Pause */}
              <button
                onClick={togglePlay}
                className="text-gray-200 hover:text-cyan-400 cursor-pointer h-8 w-8 rounded-full bg-cyan-950/20 border border-transparent hover:border-cyan-500/20 flex items-center justify-center transition-all"
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </button>

              {/* Volume */}
              <div className="flex items-center space-x-2">
                <button onClick={toggleMute} className="text-gray-300 hover:text-cyan-400 cursor-pointer">
                  {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 accent-cyan-500 bg-gray-800 rounded cursor-pointer h-1"
                />
              </div>

              {/* Title & status */}
              <span className="text-xs text-cyan-300 font-display font-medium truncate max-w-[160px] md:max-w-xs uppercase tracking-wider flex items-center">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping mr-2"></span>
                {title}
              </span>

            </div>

            <div className="flex items-center space-x-3 text-gray-300 relative">
              
              {/* Settings Toggle icon */}
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-1 hover:text-cyan-400 cursor-pointer transition-colors"
                title="Sifat va Tezlik sozlamalari"
              >
                <Settings size={16} />
              </button>

              {/* Settings Dropdown block */}
              {showSettings && (
                <div className="absolute right-0 bottom-8 w-44 rounded-lg bg-gray-950 border border-cyan-900 p-2 z-50 text-xs space-y-2 text-left">
                  <div>
                    <p className="text-gray-500 font-bold uppercase text-[9px] mb-1">Tezlik (Speed):</p>
                    <div className="grid grid-cols-4 gap-1">
                      {[0.5, 1.0, 1.5, 2.0].map((rate) => (
                        <button
                          key={rate}
                          onClick={() => changePlaybackRate(rate)}
                          className={`p-1 rounded font-mono ${playbackRate === rate ? "bg-cyan-500 text-black font-extrabold" : "bg-gray-900 hover:bg-gray-850 text-gray-300"}`}
                        >
                          {rate}x
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-500 font-bold uppercase text-[9px] mb-1">Sifat (Quality):</p>
                    <div className="flex flex-col space-y-1">
                      {["Auto (720p)", "1080p Ultra", "720p HD", "480p", "360p"].map((qual) => (
                        <button
                          key={qual}
                          onClick={() => {
                            setQuality(qual);
                            setShowSettings(false);
                          }}
                          className={`text-left p-1 rounded font-mono ${quality === qual ? "text-cyan-400 font-extrabold" : "text-gray-300 hover:bg-gray-900"}`}
                        >
                          {qual}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={() => {
                        setSubtitlesEnabled(!subtitlesEnabled);
                        setShowSettings(false);
                      }}
                      className="w-full text-left p-1 rounded flex items-center justify-between"
                    >
                      <span className="text-gray-400">Tarjima titrlari:</span>
                      <span className={`font-mono ${subtitlesEnabled ? "text-emerald-400" : "text-gray-500"}`}>
                        {subtitlesEnabled ? "ON" : "OFF"}
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* Big Screen button */}
              <button
                onClick={toggleFullscreen}
                className="p-1 hover:text-cyan-400 cursor-pointer transition-colors"
                title="Fullscreen (kompyuterda F tugmasini bosing)"
              >
                <Maximize2 size={16} />
              </button>

            </div>
          </div>

        </div>
      )}

    </div>
  );
}
