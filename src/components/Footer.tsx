/**
 * SPDX-License-Identifier: Apache-2.0
 */

import { ShieldCheck, Server, HelpCircle, FileText, Globe } from "lucide-react";

interface FooterProps {
  currentLang: string;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
}

export default function Footer({ currentLang, onOpenPrivacy, onOpenTerms }: FooterProps) {
  const t = {
    uz: {
      descr: "HTV - HPRINT.UZ/TV tomonidan taqdim etilgan eng tezkor, sifatli va xavfsiz onlayn televideniye va kino video platformasi.",
      rules: "Foydalanish shartlari",
      privacy: "Maxfiylik siyosati",
      copyright: "Barcha huquqlar himoyalangan. O'zbekistonda ishlab chiqilgan.",
      secured: "SSL va Cloudflare himoyasi",
      speed: "Tezkor milliy CDN",
      help: "Telegram Qo'llab-quvvatlash"
    },
    ru: {
      descr: "HTV - быстрый, качественный и безопасный сервис онлайн-телевидения и кино, разработанный HPRINT.UZ/TV.",
      rules: "Условия использования",
      privacy: "Политика конфиденциальности",
      copyright: "Все права защищены. Разработано в Узбекистане.",
      secured: "Защита SSL и Cloudflare",
      speed: "Быстрый локальный CDN",
      help: "Поддержка в Telegram"
    },
    en: {
      descr: "HTV - is the fastest, safest, high-performance online television and movie platform proudly managed by HPRINT.UZ/TV.",
      rules: "Terms of Service",
      privacy: "Privacy Policy",
      copyright: "All Rights Reserved. Engineered in Uzbekistan.",
      secured: "SSL & Cloudflare Protected",
      speed: "High Speed Regional CDN",
      help: "Telegram Support Helpdesk"
    }
  }[currentLang as "uz" | "ru" | "en"] || {
    descr: "HTV - HPRINT.UZ/TV tomonidan taqdim etilgan eng tezkor, sifatli va xavfsiz onlayn televideniye va kino video platformasi.",
    rules: "Foydalanish shartlari",
    privacy: "Maxfiylik siyosati",
    copyright: "Barcha huquqlar himoyalangan. O'zbekistonda ishlab chiqilgan.",
    secured: "SSL va Cloudflare himoyasi",
    speed: "Tezkor milliy CDN",
    help: "Telegram Qo'llab-quvvatlash"
  };

  return (
    <footer className="bg-[#0c0c0c] border-t border-white/5 mt-12 py-10 px-4 md:px-8 text-gray-500 font-sans text-sm">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* BRAND COLUMN */}
        <div className="space-y-4 text-left">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded bg-black border border-cyan-500/40 flex items-center justify-center font-display font-bold text-lg text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
              H
            </div>
            <span className="font-display font-extrabold text-xl text-white tracking-tight">
              HTV<span className="text-cyan-400 font-black">.UZ</span>
            </span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed max-w-md">
            {t.descr}
          </p>
        </div>

        {/* POLICY LINKS */}
        <div className="space-y-3 text-left md:text-right md:flex md:flex-col md:items-end">
          <h4 className="text-white font-semibold font-display text-xs uppercase tracking-widest text-cyan-500">
            Huquqiy hujjatlar
          </h4>
          <div className="flex flex-col space-y-2 text-xs md:items-end">
            <button
              onClick={onOpenPrivacy}
              className="text-left md:text-right text-gray-400 hover:text-cyan-400 transition-colors cursor-pointer"
            >
              Maxfiylik siyosati
            </button>
            <button
              onClick={onOpenTerms}
              className="text-left md:text-right text-gray-400 hover:text-cyan-400 transition-colors cursor-pointer"
            >
              Foydalanish shartlari
            </button>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto border-t border-white/5 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between text-[11px] text-gray-600">
        <p>© 2026 HPRINT.UZ/TV.</p>
      </div>
    </footer>
  );
}
