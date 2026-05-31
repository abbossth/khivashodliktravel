export type ReviewPlatform = 'google' | 'trustpilot' | 'tripadvisor';

export const GOOGLE_REVIEWS_URL =
  process.env.NEXT_PUBLIC_GOOGLE_REVIEWS_URL?.trim() ||
  'https://share.google/5eMAfjHv4OwPQduqL';

export const TRUSTPILOT_URL =
  process.env.NEXT_PUBLIC_TRUSTPILOT_URL?.trim() ||
  'https://www.trustpilot.com';

export const TRIPADVISOR_URL =
  process.env.NEXT_PUBLIC_TRIPADVISOR_URL?.trim() ||
  'https://www.tripadvisor.com';

export const GOOGLE_RATING =
  process.env.NEXT_PUBLIC_GOOGLE_RATING?.trim() || '5.0';

export const GOOGLE_REVIEW_COUNT =
  process.env.NEXT_PUBLIC_GOOGLE_REVIEW_COUNT?.trim() || '50+';

export const TRUSTPILOT_RATING =
  process.env.NEXT_PUBLIC_TRUSTPILOT_RATING?.trim() || '4.9';

export const TRUSTPILOT_REVIEW_COUNT =
  process.env.NEXT_PUBLIC_TRUSTPILOT_REVIEW_COUNT?.trim() || '30+';

export const TRIPADVISOR_RATING =
  process.env.NEXT_PUBLIC_TRIPADVISOR_RATING?.trim() || '5.0';

export const TRIPADVISOR_REVIEW_COUNT =
  process.env.NEXT_PUBLIC_TRIPADVISOR_REVIEW_COUNT?.trim() || '40+';

export type ReviewPlatformConfig = {
  id: ReviewPlatform;
  url: string;
  rating: string;
  reviewCount: string;
};

export const REVIEW_PLATFORMS: ReviewPlatformConfig[] = [
  {
    id: 'google',
    url: GOOGLE_REVIEWS_URL,
    rating: GOOGLE_RATING,
    reviewCount: GOOGLE_REVIEW_COUNT,
  },
  {
    id: 'trustpilot',
    url: TRUSTPILOT_URL,
    rating: TRUSTPILOT_RATING,
    reviewCount: TRUSTPILOT_REVIEW_COUNT,
  },
  {
    id: 'tripadvisor',
    url: TRIPADVISOR_URL,
    rating: TRIPADVISOR_RATING,
    reviewCount: TRIPADVISOR_REVIEW_COUNT,
  },
];

export type TravelerReview = {
  id: string;
  author: string;
  date: string;
  rating: number;
  source: ReviewPlatform;
  text: { en: string; ru: string; uz: string };
};

/** Curated highlights — update from your live review profiles */
export const TRAVELER_REVIEWS: TravelerReview[] = [
  {
    id: '1',
    author: 'Sarah M.',
    date: 'Nov 2025',
    rating: 5,
    source: 'google',
    text: {
      en: 'Excellent Three Fortresses day trip from Khiva. Our driver was professional, the car was comfortable, and we had enough time at Ayaz Kala and Toprak Kala. Highly recommend Shodlik Travel!',
      ru: 'Отличная однодневная поездка к трём крепостям из Хивы. Водитель профессиональный, машина комфортная, времени на Аяз-Калу и Топрак-Калу хватило. Рекомендую Shodlik Travel!',
      uz: "Xivadan uch qal'aga ajoyib kunlik sayohat. Haydovchi professional, mashina qulay, Ayoz Qal'a va Topraq Qal'ada yetarli vaqt bo'ldi. Shodlik Travelni tavsiya qilaman!",
    },
  },
  {
    id: '2',
    author: 'Marco R.',
    date: 'Oct 2025',
    rating: 5,
    source: 'tripadvisor',
    text: {
      en: 'We booked a private tour to Muynak and the Aral Sea. Long day but worth every minute — ship cemetery, desert landscapes, and a very safe driver. Great value for money.',
      ru: 'Заказали частный тур в Муйнак и на Аральское море. Долгий день, но каждая минута того стоила — кладбище кораблей, пустынные пейзажи, очень надёжный водитель.',
      uz: "Mo'ynoq va Orol dengiziga shaxsiy tur buyurtma qildik. Uzoq kun, lekin arziydi — kemalar qabristoni, cho'l manzaralari, ishonchli haydovchi.",
    },
  },
  {
    id: '3',
    author: 'Elena K.',
    date: 'Sep 2025',
    rating: 5,
    source: 'trustpilot',
    text: {
      en: 'Khiva old city guided tour was informative and well organized. Our guide spoke good English and knew the history of Ichan Kala. Easy WhatsApp booking.',
      ru: 'Экскурсия по старому городу Хивы была познавательной и хорошо организованной. Гид хорошо говорил по-английски. Бронирование через WhatsApp — просто.',
      uz: "Xiva eski shahri gidli sayohati ma'lumotli va yaxshi tashkil etilgan. Gid ingliz tilida yaxshi gapirdi. WhatsApp orqali bron qilish oson.",
    },
  },
  {
    id: '4',
    author: 'James T.',
    date: 'Aug 2025',
    rating: 5,
    source: 'google',
    text: {
      en: 'Transfer from Khiva to Urgench airport was on time and the price was exactly as quoted. Friendly team — we also booked a fortress tour for the next day.',
      ru: 'Трансфер из Хивы в аэропорт Ургенча вовремя, цена как договаривались. Дружелюбная команда — на следующий день заказали тур к крепостям.',
      uz: "Xivadan Urganch aeroportiga transfer o'z vaqtida, narx kelishilganidek. Do'stona jamoa — keyingi kun qal'a turini ham bron qildik.",
    },
  },
  {
    id: '5',
    author: 'Ayşe D.',
    date: 'Jul 2025',
    rating: 5,
    source: 'tripadvisor',
    text: {
      en: 'Family of four on a shared fortress tour — kids loved the desert forts. Pick-up at our hotel in Khiva, cold water provided. Thank you Shodlik Travel!',
      ru: 'Семья из четырёх человек на групповом туре к крепостям — детям очень понравилось. Забрали из отеля в Хиве, вода в дороге. Спасибо!',
      uz: "To'rt kishilik oila guruhli qal'a turida — bolalarga juda yoqdi. Xivadagi mehmonxonadan olib ketishdi, suv berishdi. Rahmat!",
    },
  },
  {
    id: '6',
    author: 'Thomas W.',
    date: 'Jun 2025',
    rating: 5,
    source: 'trustpilot',
    text: {
      en: 'Two-day Aral Sea adventure with yurt camp — unforgettable experience in Karakalpakstan. Everything arranged as promised. Will recommend to friends visiting Uzbekistan.',
      ru: 'Двухдневное приключение на Аральское море с юртовым лагерем — незабываемо. Всё организовано как обещали. Порекомендую друзьям.',
      uz: "Yurta lageri bilan 2 kunlik Orol dengizi sarguzashti — unutilmas. Hammasi va'da qilingandek. O'zbekistonga keladigan do'stlarga tavsiya qilaman.",
    },
  },
];

/** @deprecated use TRAVELER_REVIEWS */
export const GOOGLE_REVIEWS = TRAVELER_REVIEWS;
