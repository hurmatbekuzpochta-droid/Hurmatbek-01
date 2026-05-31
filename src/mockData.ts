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

export const initialChannels: TVChannel[] = [
  {
    id: "ch-1",
    name: "O'zbekiston HD",
    logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
    category: "o'zbek kanallar",
    streamUrl: SAMPLE_HLS_1,
    poster: "https://images.unsplash.com/photo-1598257006458-087169a1f08d?w=800&auto=format&fit=crop&q=80",
    isPremium: false,
    isLive: true,
    viewsCount: 14520,
    orderIndex: 1,
    isActive: true
  },
  {
    id: "ch-2",
    name: "Sport Uz LIVE",
    logo: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=150&auto=format&fit=crop&q=80",
    category: "sport",
    streamUrl: SAMPLE_HLS_2,
    poster: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80",
    isPremium: false,
    isLive: true,
    viewsCount: 38400,
    orderIndex: 2,
    isActive: true
  },
  {
    id: "ch-3",
    name: "HTV Premium Cinema",
    logo: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=150&auto=format&fit=crop&q=80",
    category: "premium",
    streamUrl: SAMPLE_MP4_1,
    poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80",
    isPremium: true,
    isLive: true,
    viewsCount: 8900,
    orderIndex: 3,
    isActive: true
  },
  {
    id: "ch-4",
    name: "Bolajon TV",
    logo: "https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?w=150&auto=format&fit=crop&q=80",
    category: "bolalar",
    streamUrl: SAMPLE_MP4_2,
    poster: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=800&auto=format&fit=crop&q=80",
    isPremium: false,
    isLive: true,
    viewsCount: 19300,
    orderIndex: 4,
    isActive: true
  },
  {
    id: "ch-5",
    name: "Mening Yurtim (MY5)",
    logo: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=150&auto=format&fit=crop&q=80",
    category: "o'zbek kanallar",
    streamUrl: SAMPLE_HLS_1,
    poster: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80",
    isPremium: false,
    isLive: true,
    viewsCount: 22100,
    orderIndex: 5,
    isActive: true
  },
  {
    id: "ch-6",
    name: "Yoshlar TV",
    logo: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80",
    category: "o'zbek kanallar",
    streamUrl: SAMPLE_HLS_2,
    poster: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80",
    isPremium: false,
    isLive: false,
    viewsCount: 11200,
    orderIndex: 6,
    isActive: true
  },
  {
    id: "ch-7",
    name: "Milliy TV",
    logo: "https://images.unsplash.com/photo-1512418490979-917959338e31?w=150&auto=format&fit=crop&q=80",
    category: "o'zbek kanallar",
    streamUrl: SAMPLE_MP4_3,
    poster: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&auto=format&fit=crop&q=80",
    isPremium: false,
    isLive: true,
    viewsCount: 27900,
    orderIndex: 7,
    isActive: true
  },
  {
    id: "ch-8",
    name: "BBC News",
    logo: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=150&auto=format&fit=crop&q=80",
    category: "yangiliklar",
    streamUrl: SAMPLE_HLS_1,
    poster: "https://images.unsplash.com/photo-1495020689067-958852a6565d?w=800&auto=format&fit=crop&q=80",
    isPremium: false,
    isLive: true,
    viewsCount: 43200,
    orderIndex: 8,
    isActive: true
  },
  {
    id: "ch-9",
    name: "Musiqa Uz",
    logo: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&auto=format&fit=crop&q=80",
    category: "musiqa",
    streamUrl: SAMPLE_MP4_1,
    poster: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80",
    isPremium: false,
    isLive: true,
    viewsCount: 15400,
    orderIndex: 9,
    isActive: true
  },
  {
    id: "ch-10",
    name: "Sky Sports Premier LIVE",
    logo: "https://images.unsplash.com/photo-1518063319789-7217e6706b04?w=150&auto=format&fit=crop&q=80",
    category: "premium",
    streamUrl: SAMPLE_HLS_2,
    poster: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80",
    isPremium: true,
    isLive: true,
    viewsCount: 52100,
    orderIndex: 10,
    isActive: true
  }
];

export const initialMovies: Movie[] = [
  {
    id: "m-1",
    nameUz: "Avatar: Suv Yo'li",
    nameRu: "Аватар: Путь Воды",
    nameEn: "Avatar: The Way of Water",
    slug: "avatar-2",
    poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80",
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80",
    videoUrl: SAMPLE_HLS_1,
    trailerUrl: SAMPLE_MP4_1,
    year: 2022,
    genreUz: "Fantastika, Sarguzasht",
    genreRu: "Фантастика, Приключения",
    genreEn: "Sci-Fi, Adventure",
    durationMinutes: 192,
    rating: 8.9,
    descriptionUz: "Avatar voqealaridan 10 yil o'tib, Jeyk Salli Pandora sayyorasida o'z oilasi bilan tinch hayot kechiradi. Biroq eski dushmanlar qaytgach, u oilasini va xalqini himoya qilish uchun yangi jang boshlashga majbur bo'ladi.",
    descriptionRu: "Спустя более чем десять лет после событий первого фильма, Джейк Салли живет со своей новой семьей на планете Пандора. Когда возвращается старая угроза, они должны работать вместе, чтобы защитить свой дом.",
    descriptionEn: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na'vi race.",
    isPremium: true,
    isActive: true
  },
  {
    id: "m-2",
    nameUz: "Gladiator II",
    nameRu: "Гладиатор II",
    nameEn: "Gladiator II",
    slug: "gladiator-2",
    poster: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=500&auto=format&fit=crop&q=80",
    backdrop: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=1600&auto=format&fit=crop&q=80",
    videoUrl: SAMPLE_MP4_3,
    trailerUrl: SAMPLE_MP4_2,
    year: 2024,
    genreUz: "Drama, Jangari, Tarixiy",
    genreRu: "Драма, Боевик, Исторический",
    genreEn: "Drama, Action, History",
    durationMinutes: 148,
    rating: 8.4,
    descriptionUz: "Rim imperiyasining shafqatsiz hukmdorlari davrida, o'tmishdagi qahramon Maksimusning izidan boruvchi yangi jangchining taqdiri va Rim arenasi qonli janglari tasvirlanadi.",
    descriptionRu: "Спустя годы после того, как он стал свидетелем смерти почитаемого героя Максимуса от рук своего дяди, Люций вынужден войти в Колизей после того, как его дом был завоеван тираническими императорами.",
    descriptionEn: "After witnessing the death of the revered hero Maximus at the hands of his uncle, Lucius is forced to enter the Colosseum after his home is conquered by the tyrannical Emperors.",
    isPremium: false,
    isActive: true
  },
  {
    id: "m-3",
    nameUz: "Kulgi Terapiyasi",
    nameRu: "Смехотерапия",
    nameEn: "Laughter Therapy",
    slug: "laughter-therapy",
    poster: "https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=500&auto=format&fit=crop&q=80",
    backdrop: "https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=1600&auto=format&fit=crop&q=80",
    videoUrl: SAMPLE_HLS_2,
    trailerUrl: SAMPLE_MP4_3,
    year: 2023,
    genreUz: "Komediya",
    genreRu: "Комедия",
    genreEn: "Comedy",
    durationMinutes: 105,
    rating: 7.2,
    descriptionUz: "Toshkentda tasodifan uchrashib qolgan uch do'stning kulgili va kutilmagan sarguzashtlari haqida o'zbek oilaviy komediyasi.",
    descriptionRu: "Увлекательная узбекская комедия о забавных и неожиданных приключениях трех друзей, случайно встретившихся в Ташкенте.",
    descriptionEn: "An engaging Uzbek comedy about the hilarious and unexpected adventures of three friends who meet by chance in Tashkent.",
    isPremium: false,
    isActive: true
  },
  {
    id: "m-4",
    nameUz: "Muzlik Davri: Sarguzasht",
    nameRu: "Ледниковый Период: Приключения",
    nameEn: "Ice Age: Adventures",
    slug: "ice-age-adventures",
    poster: "https://images.unsplash.com/photo-1608889174633-41a0c2439401?w=500&auto=format&fit=crop&q=80",
    backdrop: "https://images.unsplash.com/photo-1608889174633-41a0c2439401?w=1600&auto=format&fit=crop&q=80",
    videoUrl: SAMPLE_MP4_2,
    trailerUrl: SAMPLE_MP4_1,
    year: 2023,
    genreUz: "Multfilm, Sarguzasht, Oilaviy",
    genreRu: "Мультфильм, Приключения, Семейный",
    genreEn: "Animation, Adventure, Family",
    durationMinutes: 92,
    rating: 7.8,
    descriptionUz: "Menni, Sid, Sego va tishli sincap Scrat ning muzlik davri erishi xavfidan qochib, yangi sarguzashtlarga duch kelishi.",
    descriptionRu: "Мэнни, Сид, Диего и доисторическая белка Скрат сталкиваются с угрозой таяния ледников и отправляются на поиски безопасного места.",
    descriptionEn: "Manny, Sid, Diego and the saber-toothed squirrel Scrat are back in an all-new epic adventure to escape the melting glacier peaks.",
    isPremium: false,
    isActive: true
  },
  {
    id: "m-5",
    nameUz: "Pushti Pantera qaytishi",
    nameRu: "Возвращение Розовой Пантеры",
    nameEn: "Return of Pink Panther",
    slug: "pink-panther-return",
    poster: "https://images.unsplash.com/photo-1542204172-e7052809a937?w=500&auto=format&fit=crop&q=80",
    backdrop: "https://images.unsplash.com/photo-1542204172-e7052809a937?w=1600&auto=format&fit=crop&q=80",
    videoUrl: SAMPLE_MP4_1,
    trailerUrl: SAMPLE_MP4_3,
    year: 2024,
    genreUz: "Janri: Jangari, Komediya",
    genreRu: "Жанр: Боевик, Комедия",
    genreEn: "Genre: Action, Comedy",
    durationMinutes: 110,
    rating: 6.9,
    descriptionUz: "Taniqli olmos o'g'irlangach, ishi yomonlashgan detektiv Inspektor Kluzo yana kulgili tergovlar bilan poygaga kirishadi.",
    descriptionRu: "После кражи знаменитого бриллианта детектив инспектор Клузо возвращается к расследованию с присущими ему курьезами.",
    descriptionEn: "When the famous diamond goes missing once again, Clouseau is called on to investigate, causing hilarious mishaps along the way.",
    isPremium: true,
    isActive: true
  }
];

export const initialSeries: Series[] = [
  {
    id: "s-1",
    nameUz: "Qora Sevdor",
    nameRu: "Черная Любовь",
    nameEn: "Endless Love",
    slug: "karasevda",
    poster: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=500&auto=format&fit=crop&q=80",
    genresUz: "Drama, Romantika",
    genresRu: "Драма, Мелодрама",
    genresEn: "Drama, Romance",
    year: 2021,
    isPremium: false,
    isActive: true,
    seasons: [
      {
        id: "s1-se1",
        seasonNumber: 1,
        episodes: [
          {
            id: "s1-se1-ep1",
            titleUz: "1-Qism: Taqdir Uchrashuvi",
            titleRu: "1 Серия: Встреча Судьбы",
            titleEn: "Episode 1: Meeting of Fate",
            videoUrl: SAMPLE_HLS_1,
            durationMinutes: 45
          },
          {
            id: "s1-se1-ep2",
            titleUz: "2-Qism: Haqiqat va Orzular",
            titleRu: "2 Серия: Мечты и Реальность",
            titleEn: "Episode 2: Reality and Dreams",
            videoUrl: SAMPLE_MP4_1,
            durationMinutes: 44
          },
          {
            id: "s1-se1-ep3",
            titleUz: "3-Qism: Birinchi Sinov (Premium)",
            titleRu: "3 Серия: Первое Испытание (Премиум)",
            titleEn: "Episode 3: First Obstacle (Premium)",
            videoUrl: SAMPLE_MP4_2,
            durationMinutes: 48
          }
        ]
      },
      {
        id: "s1-se2",
        seasonNumber: 2,
        episodes: [
          {
            id: "s1-se2-ep1",
            titleUz: "1-Qism: Yangi Boshlanish",
            titleRu: "1 Серия: Новое Начало",
            titleEn: "Episode 1: New Beginnings",
            videoUrl: SAMPLE_MP4_3,
            durationMinutes: 52
          },
          {
            id: "s1-se2-ep2",
            titleUz: "2-Qism: Dushmanlar Qasamyodi",
            titleRu: "2 Серия: Клятва Врагов",
            titleEn: "Episode 2: Oath of Enemies",
            videoUrl: SAMPLE_HLS_2,
            durationMinutes: 50
          }
        ]
      }
    ]
  },
  {
    id: "s-2",
    nameUz: "Taxtlar O'yini",
    nameRu: "Игра Престолов",
    nameEn: "Game of Thrones",
    slug: "game-of-thrones",
    poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=80",
    genresUz: "Fantastika, Drama, Jangari",
    genresRu: "Фэнтези, Драма, Боевик",
    genresEn: "Fantasy, Drama, Action",
    year: 2019,
    isPremium: true,
    isActive: true,
    seasons: [
      {
        id: "s2-se1",
        seasonNumber: 1,
        episodes: [
          {
            id: "s2-se1-ep1",
            titleUz: "1-Qism: Qish Kelmoqda",
            titleRu: "1 Серия: Зима Близко",
            titleEn: "Episode 1: Winter is Coming",
            videoUrl: SAMPLE_HLS_2,
            durationMinutes: 62
          },
          {
            id: "s2-se1-ep2",
            titleUz: "2-Qism: Qirollik Yo'li",
            titleRu: "2 Серия: Королевский Тракт",
            titleEn: "Episode 2: The Kingsroad",
            videoUrl: SAMPLE_MP4_3,
            durationMinutes: 58
          }
        ]
      }
    ]
  }
];

export const initialSportsMatches: SportMatch[] = [
  {
    id: "sp-1",
    teamA: "Uzbekistan",
    teamB: "Qatar",
    logoA: "🇺🇿",
    logoB: "🇶🇦",
    tournament: "JCh-2026 Saralash bosqichi",
    startTime: "Bugun, 19:00",
    channelName: "Sport Uz LIVE",
    channelStreamUrl: SAMPLE_HLS_2,
    isLive: true,
    score: "2 - 1",
    isPremium: false
  },
  {
    id: "sp-2",
    teamA: "Pakhtakor",
    teamB: "Nasaf",
    logoA: "🟡",
    logoB: "🔵",
    tournament: "O'zbekiston Superligasi",
    startTime: "Bugun, 21:00",
    channelName: "Milliy TV",
    channelStreamUrl: SAMPLE_MP4_3,
    isLive: false,
    isPremium: false
  },
  {
    id: "sp-3",
    teamA: "Real Madrid",
    teamB: "Barcelona",
    logoA: "⚪",
    logoB: "🔴",
    tournament: "UEFA Champions League FAYNL",
    startTime: "Bugun, 23:45",
    channelName: "Sky Sports Premier LIVE",
    channelStreamUrl: SAMPLE_HLS_1,
    isLive: true,
    score: "3 - 2",
    isPremium: true
  }
];

export const initialNews: NewsItem[] = [
  {
    id: "n-1",
    titleUz: "HTV da yangi O'zbek Kanallari soni ko'paydi!",
    titleRu: "На HTV увеличилось количество узбекских каналов!",
    titleEn: "HTV adds more high-quality Uzbek local television channels!",
    contentUz: "Sizlar uchun xushxabar! HTV onlayn platformasiga O'zbekistonning eng ommabop telekanallari eng yuqori Full HD sifatda qo'shildi. Endi siz istalgan joyda bepul tomosha qilishingiz mumkin.",
    contentRu: "Отличные новости! На платформу HTV добавлены самые популярные телеканалы Узбекистана в высочайшем качестве Full HD. Смотрите бесплатно в любом месте.",
    contentEn: "We are thrilled to announce that the most famous local Uzbek television streams are now integrated on HTV in crystal clear Full HD standards. Watch for free anywhere.",
    imageUrl: "https://images.unsplash.com/photo-1598257006458-087169a1f08d?w=800&auto=format&fit=crop&q=80",
    publishedAt: "2026-05-30"
  },
  {
    id: "n-2",
    titleUz: "Premium obunachilar uchun maxsus kinolar!",
    titleRu: "Специальные фильмы для премиум-подписчиков!",
    titleEn: "Special blockbuster releases for Premium members!",
    contentUz: "Premium tarifni sotib oling va 'Avatar: Suv Yo'li' kabi eng so'nggi jahon kinosi blokbasterlaridan bahramand bo'ling. Hech qanday reklamalarsiz va professional ovozda!",
    contentRu: "Оформите премиум-подписку и наслаждайтесь последними мировыми блокбастерами без какой-либо рекламы и в профессиональном переводе!",
    contentEn: "Unlock premium subscription models right now to Stream the world's most anticipated blockbusters without any commercial interruptions in high dynamic sound ranges.",
    imageUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80",
    publishedAt: "2026-05-29"
  }
];

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

export const initialPayments: PaymentLog[] = [
  {
    id: "pay-1",
    userEmail: "hurmatbekuzpochta@gmail.com",
    planName: "1 Yillik VIP Obuna",
    amountUzS: 120000,
    paymentMethod: "Click",
    status: "success",
    createdAt: "2026-05-30 11:22:15"
  },
  {
    id: "pay-2",
    userEmail: "demo@example.com",
    planName: "1 Oylik Obuna",
    amountUzS: 15000,
    paymentMethod: "Payme",
    status: "success",
    createdAt: "2026-05-30 14:05:43"
  }
];

export const initialSecurityLogs: SecurityLog[] = [
  {
    id: "log-1",
    timestamp: "2026-05-30 18:00:12",
    level: "INFO",
    message: "Admin login successful",
    userEmail: "admin@htv.uz",
    ipAddress: "195.158.12.33"
  },
  {
    id: "log-2",
    timestamp: "2026-05-30 18:10:45",
    level: "WARNING",
    message: "Failed login attempt detected (XSS attempt cleared)",
    ipAddress: "84.22.41.119"
  },
  {
    id: "log-3",
    timestamp: "2026-05-30 18:12:00",
    level: "CRITICAL",
    message: "SQL Injection attack thwarted on /api/movies endpoint",
    ipAddress: "142.250.74.46"
  }
];
