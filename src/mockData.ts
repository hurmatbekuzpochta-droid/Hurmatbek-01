/**
 * SPDX-License-Identifier: Apache-2.0
 */

import { TVChannel, Movie, Series, SportMatch, NewsItem, SubscriptionPlan, SystemSettings, AdSetting, PaymentLog, SecurityLog } from "./types";

// Public test HLS and MP4 streams that are guaranteed to play beautifully and support CORS
export const SAMPLE_HLS_1 = "https://playertest.longtailvideo.com/adaptive/oceans/oceans.m3u8";
export const SAMPLE_HLS_2 = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"; // Big Buck Bunny HLS
export const SAMPLE_MP4_1 = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
export const SAMPLE_MP4_2 = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4";
export const SAMPLE_MP4_3 = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4";
export const SAMPLE_AD_VIDEO = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";

export const initialChannels: TVChannel[] = [];

export const initialMovies: Movie[] = [];

export const initialSeries: Series[] = [];

export const initialSportsMatches: SportMatch[] = [];

export const initialNews: NewsItem[] = [];

export const initialPlans: SubscriptionPlan[] = [
  {
    id: "plan-1",
    nameUz: "1 Oylik Obuna",
    nameRu: "Подписка на 1 Месяц",
    nameEn: "1-Month Subscription",
    priceUzS: 15000,
    durationMonths: 1,
    status: "active"
  },
  {
    id: "plan-3",
    nameUz: "3 Oylik Obuna (Tejamkor)",
    nameRu: "Подписка на 3 Месяца (Выгодно)",
    nameEn: "3-Months Plan (Saver)",
    priceUzS: 39000,
    durationMonths: 3,
    status: "active"
  },
  {
    id: "plan-6",
    nameUz: "6 Oylik Yarim Yillik",
    nameRu: "Подписка на 6 Месяцев",
    nameEn: "6-Months Semi-Annual",
    priceUzS: 75000,
    durationMonths: 6,
    status: "active"
  },
  {
    id: "plan-12",
    nameUz: "1 Yillik VIP Obuna",
    nameRu: "VIP Подписка на 1 Год",
    nameEn: "1-Year VIP Unrestricted",
    priceUzS: 120000,
    durationMonths: 12,
    status: "active"
  }
];

export const defaultSettings: SystemSettings = {
  telegramBotLink: "https://t.me/htv_bepul_bot",
  privacyPolicyUz: "HTV platformasi foydalanuvchilar maxfiyligini birinchi o'ringa qo'yadi. Biz sizning shaxsiy ma'lumotlaringizni xavfsiz saqlaymiz va hech qachon uchinchi shaxslarga bermaymiz. Ma'lumotlaringiz shifrlangan ma'lumotlar omborida saqlanadi va ruxsatsiz kirishlardan himoyalangan.",
  privacyPolicyRu: "Платформа HTV ставит конфиденциальность пользователей на первое место. Мы надежно сохраняем ваши персональные данные и никогда не передаем их третьим лицам. Ваши данные зашифрованы и защищены от несанкционированного доступа.",
  privacyPolicyEn: "HTV platform respects your fundamental rights of privacy. We securely encase all physical user parameters and strictly refrain from conveying details to third-party providers. Your accounts are kept encrypted securely.",
  termsOfServiceUz: "HTV xizmatlaridan foydalanish shartlari: Platformadagi kontentlarni tarqatish, noqonuniy nusxalash taqiqlanadi. Obuna to'lovlari qaytarilmaydi. Har bir foydalanuvchi o'z login va parolini maxfiy saqlashiga o'zi javobgardir.",
  termsOfServiceRu: "Условия использования услуг HTV: Запрещается распространение и незаконное копирование контента платформы. Платежи за подписку возврату не подлежат. Каждый пользователь несет личную ответственность за сохранность пароля.",
  termsOfServiceEn: "HTV Terms of Use: Re-streaming, copying, or illegally record-harvesting materials is strictly prohibited under local copyright structures. Member accounts must be guarded by account owners personally."
};

export const initialAd: AdSetting = {
  id: "ad-1",
  videoUrl: SAMPLE_AD_VIDEO,
  clickUrl: "https://hprint.uz",
  durationSeconds: 10,
  isEnabled: true
};

export const initialPayments: PaymentLog[] = [];

export const initialSecurityLogs: SecurityLog[] = [
  {
    id: "log-1",
    timestamp: "2026-05-31 18:00:00",
    level: "INFO",
    message: "HTV Xavfsiz Tizimi ishga tushirildi. Ma'lumotlar tozalangan holatda tayyor.",
    userEmail: "system",
    ipAddress: "127.0.0.1"
  }
];
