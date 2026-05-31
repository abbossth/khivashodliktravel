import mongoose from 'mongoose';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { IMG as img } from './khorezm-images.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnv() {
  const envPath = resolve(__dirname, '../.env.local');
  const content = readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq);
    let val = trimmed.slice(eq + 1);
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    process.env[key] = val.replace(/\\n/g, '\n');
  }
}

loadEnv();

const localizedString = {
  en: String,
  ru: String,
  uz: String,
};

const localizedArray = {
  en: [String],
  ru: [String],
  uz: [String],
};

const tourSchema = new mongoose.Schema(
  {
    title: localizedString,
    slug: { type: String, unique: true },
    description: localizedString,
    shortDescription: localizedString,
    images: [String],
    coverImage: String,
    price: Number,
    currency: { type: String, enum: ['USD', 'UZS'] },
    duration: String,
    groupSize: Number,
    category: {
      type: String,
      enum: ['daytrip', 'multiday', 'shared', 'private', 'transfer'],
    },
    includes: localizedArray,
    excludes: localizedArray,
    itinerary: [
      {
        day: Number,
        title: localizedString,
        description: localizedString,
      },
    ],
    highlights: localizedArray,
    isPublished: Boolean,
    isFeatured: Boolean,
  },
  { timestamps: true }
);

const Tour = mongoose.models.Tour || mongoose.model('Tour', tourSchema);

const imgKhiva = img.ichanKala;
const imgDesert = img.ayazKala;
const imgBazaar = img.kaltaMinor;
const imgAral = img.aralMoynaq;
const imgToprak = img.toprakKala;

const tours = [
  {
    title: {
      en: 'Khiva Old City Day Tour',
      ru: 'Однодневный тур по старому городу Хивы',
      uz: 'Xiva eski shahar kunlik sayohati',
    },
    slug: 'khiva-old-city-day-tour',
    shortDescription: {
      en: 'Discover Ichan Kala — mosques, madrasas, and Silk Road history in one unforgettable day.',
      ru: 'Откройте Ичан-Калу — мечети, медресе и история Великого шёлкового пути за один день.',
      uz: 'Ichan Qalani kashf eting — bir kunlik unutilmas sayohat.',
    },
    description: {
      en: 'Walk through the UNESCO-listed walled city of Khiva with an expert local guide. Visit the Kalta Minor minaret, Juma Mosque, and the palaces of khans while learning stories passed down for centuries.',
      ru: 'Прогулка по объекту ЮНЕСКО с опытным гидом. Калта-Минор, мечеть Джума и дворцы ханов.',
      uz: 'YuNESKO ro\'yxatidagi Xiva qal\'asida mahalliy gid bilan sayr qiling.',
    },
    images: [imgKhiva, imgBazaar],
    coverImage: imgKhiva,
    price: 45,
    currency: 'USD',
    duration: '1 day',
    groupSize: 12,
    category: 'daytrip',
    includes: {
      en: ['Licensed local guide', 'Entrance fees to monuments', 'Bottled water'],
      ru: ['Лицензированный гид', 'Входные билеты', 'Вода'],
      uz: ['Litsenziyalangan gid', 'Kirish to\'lovlari', 'Suv'],
    },
    excludes: {
      en: ['Lunch', 'Personal expenses'],
      ru: ['Обед', 'Личные расходы'],
      uz: ['Tushlik', 'Shaxsiy xarajatlar'],
    },
    itinerary: [
      {
        day: 1,
        title: { en: 'Ichan Kala highlights', ru: 'Достопримечательности Ичан-Калы', uz: 'Ichan Qala diqqatga sazovor joylari' },
        description: {
          en: 'Morning meet-up at West Gate. Guided walk through main monuments until late afternoon.',
          ru: 'Встреча у Западных ворот. Экскурсия до позднего дня.',
          uz: 'G\'arbiy darvozada uchrashuv. Kechgacha gid bilan sayr.',
        },
      },
    ],
    highlights: {
      en: ['UNESCO World Heritage', 'Small group experience', 'Photo-friendly routes'],
      ru: ['Наследие ЮНЕСКО', 'Малая группа', 'Маршруты для фото'],
      uz: ['YuNESKO merosi', 'Kichik guruh', 'Suratga olish uchun qulay'],
    },
    isPublished: true,
    isFeatured: true,
  },
  {
    title: {
      en: 'Khiva to Aral Sea Adventure',
      ru: 'Приключение из Хивы к Аральскому морю',
      uz: 'Xivadan Orol dengiziga sarguzasht',
    },
    slug: 'khiva-aral-sea-adventure',
    shortDescription: {
      en: 'A 3-day journey through the desert to the legendary Aral Sea and ship cemetery of Muynak.',
      ru: '3-дневное путешествие через пустыню к Аральскому морю и кладбищу кораблей в Муйнаке.',
      uz: '3 kunlik cho\'l va Orol dengizi sayohati.',
    },
    description: {
      en: 'Experience one of Central Asia\'s most dramatic landscapes. Travel from Khiva across the Kyzylkum desert to Muynak, witness the Aral Sea shoreline, and stay in local guesthouses.',
      ru: 'Одно из самых впечатляющих путешествий в Центральной Азии. Переезд через пустыню Кызылкум.',
      uz: 'Markaziy Osiyoning eng ta\'sirli manzaralaridan birini ko\'ring.',
    },
    images: [imgAral, img.ayazKalaOasis, imgKhiva],
    coverImage: imgAral,
    price: 320,
    currency: 'USD',
    duration: '3 days / 2 nights',
    groupSize: 8,
    category: 'multiday',
    includes: {
      en: ['Private 4x4 transport', '2 nights accommodation', 'Breakfast daily', 'Experienced driver-guide'],
      ru: ['Транспорт 4x4', '2 ночи проживания', 'Завтраки', 'Водитель-гид'],
      uz: ['4x4 transport', '2 tun yotoq', 'Nonushta', 'Haydovchi-gid'],
    },
    excludes: {
      en: ['Lunch and dinner', 'Travel insurance', 'Tips'],
      ru: ['Обед и ужин', 'Страховка', 'Чаевые'],
      uz: ['Tushlik va kechki ovqat', 'Sug\'urta', 'Choy puli'],
    },
    itinerary: [
      {
        day: 1,
        title: { en: 'Khiva to desert camp', ru: 'Хива — лагерь в пустыне', uz: 'Xiva — cho\'l lageri' },
        description: {
          en: 'Depart Khiva after breakfast. Scenic drive with photo stops. Evening at desert camp.',
          ru: 'Выезд из Хивы. Живописная дорога. Вечер в лагере.',
          uz: 'Nonushtadan keyin jo\'nash. Kechqurun lagerda tunash.',
        },
      },
      {
        day: 2,
        title: { en: 'Muynak & Aral Sea', ru: 'Муйнак и Аральское море', uz: 'Mo\'ynoq va Orol dengizi' },
        description: {
          en: 'Visit the ship cemetery and Aral Sea viewpoint. Explore Muynak museum.',
          ru: 'Кладбище кораблей и смотровая площадка. Музей Муйнака.',
          uz: 'Kemalar qabristoni va dengiz manzarasi.',
        },
      },
      {
        day: 3,
        title: { en: 'Return to Khiva', ru: 'Возвращение в Хиву', uz: 'Xivaga qaytish' },
        description: {
          en: 'Morning departure. Arrive Khiva by afternoon.',
          ru: 'Утренний выезд. Прибытие в Хиву днём.',
          uz: 'Ertalab jo\'nash. Tushdan keyin Xivaga yetib borish.',
        },
      },
    ],
    highlights: {
      en: ['Unique Aral Sea landscape', 'Ship cemetery', 'Off-the-beaten-path adventure'],
      ru: ['Уникальный пейзаж', 'Кладбище кораблей', 'Нетуристический маршрут'],
      uz: ['Noyob manzara', 'Kemalar qabristoni', 'Kam tashrif buyuriladigan marshrut'],
    },
    isPublished: true,
    isFeatured: true,
  },
  {
    title: {
      en: 'Sunset Camel Ride in Khorezm',
      ru: 'Верховая езда на верблюдах на закате',
      uz: 'Xorazmda quyosh botishida tuya sayohati',
    },
    slug: 'sunset-camel-ride-khorezm',
    shortDescription: {
      en: 'A magical evening camel trek near Khiva with tea and traditional music.',
      ru: 'Вечерняя прогулка на верблюдах с чаем и традиционной музыкой.',
      uz: 'Xiva yaqinida tushda tuya sayohati va choy marosimi.',
    },
    description: {
      en: 'Perfect for families and couples. Ride camels through dunes as the sun sets over the Khorezm oasis, followed by green tea and local snacks.',
      ru: 'Идеально для семей и пар. Верблюды, закат и традиционный чай.',
      uz: 'Oila va juftliklar uchun ideal. Quyosh botishi va mahalliy choy.',
    },
    images: [img.ayazKalaOasis, imgDesert],
    coverImage: img.ayazKalaOasis,
    price: 35,
    currency: 'USD',
    duration: '3 hours',
    groupSize: 10,
    category: 'shared',
    includes: {
      en: ['Camel ride', 'Guide', 'Tea and snacks'],
      ru: ['Катание на верблюдах', 'Гид', 'Чай и закуски'],
      uz: ['Tuya sayohati', 'Gid', 'Choy va gazaklar'],
    },
    excludes: {
      en: ['Hotel pickup (available on request)'],
      ru: ['Трансфер от отеля (по запросу)'],
      uz: ['Mehmonxonadan olib ketish (so\'rov bo\'yicha)'],
    },
    itinerary: [],
    highlights: {
      en: ['Sunset views', 'Cultural experience', 'Great for photos'],
      ru: ['Закат', 'Культурный опыт', 'Фото'],
      uz: ['Quyosh botishi', 'Madaniy tajriba', 'Suratlar'],
    },
    isPublished: true,
    isFeatured: false,
  },
  {
    title: {
      en: 'Urgench Airport Transfer',
      ru: 'Трансфер в аэропорт Ургенча',
      uz: 'Urganch aeroportiga transfer',
    },
    slug: 'urgench-airport-transfer',
    shortDescription: {
      en: 'Private door-to-door transfer between Khiva and Urgench International Airport.',
      ru: 'Частный трансфер между Хивой и аэропортом Ургенча.',
      uz: 'Xiva va Urganch aeroporti o\'rtasida shaxsiy transfer.',
    },
    description: {
      en: 'Comfortable air-conditioned sedan or minivan. Fixed price, no hidden fees. Meet & greet at arrivals.',
      ru: 'Комфортабельный автомобиль с кондиционером. Фиксированная цена.',
      uz: 'Konditsionerli qulay mashina. Belgilangan narx.',
    },
    images: [imgKhiva],
    coverImage: imgKhiva,
    price: 25,
    currency: 'USD',
    duration: '1–2 hours',
    groupSize: 4,
    category: 'transfer',
    includes: {
      en: ['Private vehicle', 'Meet & greet', 'Luggage assistance'],
      ru: ['Частный автомобиль', 'Встреча', 'Помощь с багажом'],
      uz: ['Shaxsiy mashina', 'Kutib olish', 'Yuk yordami'],
    },
    excludes: {
      en: ['Waiting time over 60 min (extra charge)'],
      ru: ['Ожидание более 60 мин (доплата)'],
      uz: ['60 daqiqadan ortiq kutish (qo\'shimcha to\'lov)'],
    },
    itinerary: [],
    highlights: {
      en: ['Fixed price', '24/7 availability on request', 'Professional driver'],
      ru: ['Фиксированная цена', 'Круглосуточно по запросу'],
      uz: ['Belgilangan narx', 'So\'rov bo\'yicha 24/7'],
    },
    isPublished: true,
    isFeatured: false,
  },
];

const blogSchema = new mongoose.Schema(
  {
    title: localizedString,
    slug: { type: String, unique: true },
    content: localizedString,
    excerpt: localizedString,
    coverImage: String,
    tags: [String],
    isPublished: Boolean,
  },
  { timestamps: true }
);

const BlogPost = mongoose.models.BlogPost || mongoose.model('BlogPost', blogSchema);

const posts = [
  {
    title: {
      en: 'Why Khiva Should Be on Your Uzbekistan Itinerary',
      ru: 'Почему Хиву стоит включить в маршрут по Узбекистану',
      uz: 'Nima uchun Xivani O\'zbekiston marshrutiga qo\'shish kerak',
    },
    slug: 'why-khiva-should-be-on-your-itinerary',
    excerpt: {
      en: 'From Ichan Kala to desert sunsets — five reasons travelers fall in love with Khiva.',
      ru: 'Пять причин полюбить Хиву — от Ичан-Калы до закатов в пустыне.',
      uz: 'Xivani sevish uchun beshta sabab.',
    },
    content: {
      en: '<p>Khiva is one of the best-preserved Silk Road cities in Central Asia. Wander through Ichan Kala, climb minarets for panoramic views, and taste plov cooked the Khorezm way.</p><p>Most visitors pair Khiva with Bukhara and Samarkand — allow at least two full days here.</p>',
      ru: '<p>Хива — один из лучше всего сохранившихся городов Великого шёлкового пути.</p>',
      uz: '<p>Xiva — Buyuk Ipak yo\'lidagi eng yaxshi saqlangan shaharlardan biri.</p>',
    },
    coverImage: imgKhiva,
    tags: ['Khiva', 'Travel tips', 'Uzbekistan'],
    isPublished: true,
  },
  {
    title: {
      en: 'Visiting the Aral Sea: What to Expect',
      ru: 'Поездка к Аральскому морю: чего ожидать',
      uz: 'Orol dengiziga sayohat: nimalarni kutish kerak',
    },
    slug: 'visiting-the-aral-sea-what-to-expect',
    excerpt: {
      en: 'Practical tips for the 3-day journey from Khiva to Muynak and the ship cemetery.',
      ru: 'Практические советы для 3-дневного путешествия из Хивы в Муйнак.',
      uz: 'Xivadan Mo\'ynoqqa 3 kunlik sayohat bo\'yicha maslahatlar.',
    },
    content: {
      en: '<p>The Aral Sea trip is rugged but rewarding. Pack layers, sunscreen, and a sense of adventure.</p><p>Roads are long but scenic — your guide will handle permits and accommodation.</p>',
      ru: '<p>Поездка к Аральскому морю требует подготовки, но впечатления стоят того.</p>',
      uz: '<p>Orol dengizi sayohati qiyin, lekin unutilmas tajriba.</p>',
    },
    coverImage: imgAral,
    tags: ['Aral Sea', 'Adventure', 'Muynak'],
    isPublished: true,
  },
];

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not set in .env.local');

  await mongoose.connect(uri);

  for (const tour of tours) {
    await Tour.findOneAndUpdate({ slug: tour.slug }, tour, { upsert: true, returnDocument: 'after' });
    console.log('✓ Tour:', tour.slug);
  }

  for (const post of posts) {
    await BlogPost.findOneAndUpdate({ slug: post.slug }, post, { upsert: true, returnDocument: 'after' });
    console.log('✓ Blog:', post.slug);
  }

  console.log(`\nDone: ${tours.length} tours, ${posts.length} blog posts seeded.`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
