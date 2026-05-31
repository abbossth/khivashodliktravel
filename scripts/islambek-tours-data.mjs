/** Tour catalog based on islambektravel.uz (prices as listed or typical starting rates) */
import { img, pickTourCover } from './khorezm-images.mjs';

const inc = {
  en: ['Fuel', 'Professional driver', 'Mineral water', 'Pick-up & drop-off at your hotel'],
  ru: ['Топливо', 'Водитель', 'Вода', 'Трансфер от/до отеля'],
  uz: ['Yoqilg\'i', 'Haydovchi', 'Suv', 'Mehmonxonadan olib tashlash'],
};

const exc = {
  en: ['Entrance tickets', 'Meals', 'Yurt camp stay', 'Guide fees (unless stated)'],
  ru: ['Входные билеты', 'Питание', 'Юрта', 'Гид (если не указано)'],
  uz: ['Kirish chiptalari', 'Ovqat', 'Yurta', 'Gid (ko\'rsatilmagan bo\'lsa)'],
};

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

function tour({
  titleEn,
  titleRu,
  titleUz,
  shortEn,
  descEn,
  duration,
  groupSize,
  category,
  price,
  featured = false,
  cover = img.fortress,
  routeEn,
  distance,
  driving,
  sightseeing,
}) {
  const slug = slugify(titleEn);
  const routeBlock = routeEn ? `<p><strong>Route:</strong> ${routeEn}</p>` : '';
  const stats = [distance && `Distance: ${distance}`, driving && `Driving: ${driving}`, sightseeing && `Sightseeing: ${sightseeing}`]
    .filter(Boolean)
    .join(' · ');

  return {
    title: { en: titleEn, ru: titleRu || titleEn, uz: titleUz || titleEn },
    slug,
    shortDescription: {
      en: shortEn,
      ru: shortEn,
      uz: shortEn,
    },
    description: {
      en: `<p>${descEn}</p>${routeBlock}${stats ? `<p>${stats}</p>` : ''}<p>Starts and ends as described. Private vehicle with A/C. Payment to driver at the end of the trip — no prepayment required to reserve.</p>`,
      ru: `<p>${descEn}</p>${routeBlock}${stats ? `<p>${stats}</p>` : ''}`,
      uz: `<p>${descEn}</p>${routeBlock}${stats ? `<p>${stats}</p>` : ''}`,
    },
    images: [cover, img.khiva, img.toprak].filter(
      (url, i, arr) => arr.indexOf(url) === i
    ),
    coverImage: cover,
    price,
    currency: 'USD',
    duration,
    groupSize,
    category,
    includes: inc,
    excludes: exc,
    itinerary: [
      {
        day: 1,
        title: { en: titleEn, ru: titleRu || titleEn, uz: titleUz || titleEn },
        description: {
          en: routeEn || descEn,
          ru: routeEn || descEn,
          uz: routeEn || descEn,
        },
      },
    ],
    highlights: {
      en: ['Ancient Khorezm fortresses', 'Desert landscapes', 'Flexible start time'],
      ru: ['Древние крепости Хорезма', 'Пустынные пейзажи', 'Гибкое время старта'],
      uz: ['Qadimgi Xorazm qal\'alari', 'Cho\'l manzaralari', 'Moslashuvchan vaqt'],
    },
    isPublished: true,
    isFeatured: featured,
  };
}

// —— Shared ——
const sharedThreeFortresses = tour({
  titleEn: 'Shared Day Trip to Three Fortresses',
  titleRu: 'Групповой тур к трём крепостям',
  titleUz: 'Uch qal\'aga guruhli kunlik sayohat',
  shortEn: 'Daily group tour from Khiva at 09:00 (Apr–Oct). Kizil Kala, Toprak Kala, Ayaz Kala & Akchakul Lake.',
  descEn: 'Join our guaranteed departure shared tour — the same route as Islambek Travel\'s popular Three Fortresses day trip.',
  duration: '6–7 hours',
  groupSize: 20,
  category: 'shared',
  price: 20,
  featured: true,
  cover: img.fortress,
  routeEn: 'Khiva – Urgench – Kizil Kala – Toprak Kala – Akchakul Lake – Ayaz Kala – Khiva',
  distance: '225 km',
  driving: '4–5 hours',
  sightseeing: '2 hours',
});

// —— Private day trips (Khiva round trip) ——
const privateKhivaDayTrips = [
  ['Ayaz Kala Day Trip', '5–6 hours', 205, 55, 'Khiva – Ayaz Kala – Khiva'],
  ['Three Fortresses Day Trip', '6–7 hours', 225, 65, 'Khiva – Kizil Kala – Toprak Kala – Ayaz Kala – Khiva'],
  ['Five Fortresses Day Trip', '7–8 hours', 255, 75, 'Khiva – five ancient fortresses – Khiva'],
  ['Seven Fortresses Day Trip', '9–10 hours', 330, 95, 'Khiva – seven fortresses – Khiva'],
  ['Ten Fortresses Day Trip', '10–12 hours', 355, 110, 'Khiva – ten fortresses – Khiva'],
  ['Thirteen Fortresses Day Trip', '12–14 hours', 395, 130, 'Khiva – thirteen fortresses – Khiva'],
  ['Nukus, Mizdakhan & Chilpik Kala from Khiva', '10–12 hours', 415, 120, 'Khiva – Chilpik Kala – Mizdakhan – Nukus – Khiva'],
  ['Nukus & Four Fortresses from Khiva', '11–13 hours', 465, 130, 'Khiva – four fortresses – Nukus – Khiva'],
  ['Muynak Day Trip from Khiva', '16–17 hours', 780, 180, 'Khiva – Muynak ship cemetery – Khiva'],
].map(([title, duration, km, price, route]) =>
  tour({
    titleEn: title,
    shortEn: `Private day trip · ${duration} · ${km} km. Fuel, driver & water included.`,
    descEn: `Explore ancient Khorezm on a private day trip from Khiva.`,
    duration,
    groupSize: 4,
    category: 'private',
    price,
    cover: pickTourCover(title),
    routeEn: route,
    distance: `${km} km`,
  })
);

function oneWayTrips(prefix, variants) {
  return variants.map(([suffix, duration, km, price, route]) => {
    const titleEn = `${prefix} – ${suffix}`;
    return tour({
      titleEn,
      shortEn: `One-way private trip · ${duration} · ${km} km.`,
      descEn: `Private transfer with sightseeing stops between Khorezm cities.`,
      duration,
      groupSize: 4,
      category: 'private',
      price,
      cover: pickTourCover(titleEn),
      routeEn: route,
      distance: `${km} km`,
    });
  });
}

const khivaToNukus = oneWayTrips('Khiva to Nukus', [
  ['Chilpik Kala', '3–4 hours', 180, 54, 'Khiva – Chilpik Kala – Nukus'],
  ['Three Fortresses', '6–8 hours', 260, 75, 'Khiva – Three Fortresses – Nukus'],
  ['Four Fortresses', '7–9 hours', 270, 85, 'Khiva – Four Fortresses – Nukus'],
  ['Six Fortresses', '10–12 hours', 340, 110, 'Khiva – Six Fortresses – Nukus'],
  ['Ten Fortresses', '12–14 hours', 435, 130, 'Khiva – Ten Fortresses – Nukus'],
]);

const khivaToBukhara = oneWayTrips('Khiva to Bukhara', [
  ['Three Fortresses', '9–10 hours', 620, 95, 'Khiva – Three Fortresses – Bukhara'],
  ['Five Fortresses', '10–11 hours', 640, 110, 'Khiva – Five Fortresses – Bukhara'],
  ['Eight Fortresses', '12–14 hours', 710, 125, 'Khiva – Eight Fortresses – Bukhara'],
]);

const nukusToKhiva = oneWayTrips('Nukus to Khiva', [
  ['Chilpik Kala', '3–4 hours', 180, 54, 'Nukus – Chilpik Kala – Khiva'],
  ['Three Fortresses', '6–8 hours', 260, 75, 'Nukus – Three Fortresses – Khiva'],
  ['Four Fortresses', '7–9 hours', 270, 85, 'Nukus – Four Fortresses – Khiva'],
  ['Six Fortresses', '10–12 hours', 340, 110, 'Nukus – Six Fortresses – Khiva'],
  ['Ten Fortresses', '12–14 hours', 435, 130, 'Nukus – Ten Fortresses – Khiva'],
]);

const bukharaToKhiva = oneWayTrips('Bukhara to Khiva', [
  ['Three Fortresses', '9–10 hours', 620, 95, 'Bukhara – Three Fortresses – Khiva'],
  ['Five Fortresses', '10–11 hours', 640, 110, 'Bukhara – Five Fortresses – Khiva'],
  ['Eight Fortresses', '12–14 hours', 710, 125, 'Bukhara – Eight Fortresses – Khiva'],
]);

const muynakNukus = tour({
  titleEn: 'Muynak Day Trip from Nukus',
  titleRu: 'Однодневная поездка в Муйнак из Нукуса',
  titleUz: 'Nukusdan Mo\'ynoq kunlik sayohat',
  shortEn: 'Ship cemetery & Aral region from Nukus · 8–10 hours.',
  descEn: 'Day trip to Muynak and the Aral Sea region starting and ending in Nukus.',
  duration: '8–10 hours',
  groupSize: 4,
  category: 'private',
  price: 99,
  cover: img.aral,
  routeEn: 'Nukus – Muynak ship cemetery – Nukus',
  distance: '420 km',
});

// —— Multiday / Aral ——
const aralSea1 = tour({
  titleEn: 'Aral Sea Adventure 1 (2 days)',
  titleRu: 'Приключение на Аральском море 1 (2 дня)',
  titleUz: 'Orol dengizi sarguzashti 1 (2 kun)',
  shortEn: '2 days / 1 night · Muynak, ship cemetery, Aral shore, Ustyurt Canyons.',
  descEn: 'Full Aral Sea expedition from Khiva with 4WD off-road section. From $320 for 1 person (group rates available).',
  duration: '2 days / 1 night',
  groupSize: 4,
  category: 'multiday',
  price: 320,
  featured: true,
  cover: img.aral,
  routeEn: 'Khiva – Chilpik Kala – Nukus Museum – Muynak – Aral Sea shore – Ustyurt Canyons – Mizdakhan – Khiva',
  distance: '1050 km',
  driving: '16–18 hours',
  sightseeing: '6–8 hours',
});

const aralSea2 = tour({
  titleEn: 'Aral Sea Adventure 2 with Yurt Camp (2 days)',
  shortEn: 'Includes yurt camp, meals (4×), 4WD vehicle · premium package.',
  descEn: 'Two-day Aral tour with yurt accommodation and meals included.',
  duration: '2 days / 1 night',
  groupSize: 4,
  category: 'multiday',
  price: 540,
  cover: img.aral,
  routeEn: 'Khiva – Chilpik Kala – Mizdakhan – Muynak – Ustyurt – Aral shore – Kurgancha Kala – Nukus – Khiva',
  distance: '1050 km',
});

const aralSea3 = tour({
  titleEn: 'Aral Sea Adventure 3 with Sudochie Lake (2 days)',
  shortEn: 'Extended route with Sudochie Lake & Urga · yurt camp included.',
  descEn: 'Extended two-day Aral itinerary including Sudochie Lake.',
  duration: '2 days / 1 night',
  groupSize: 4,
  category: 'multiday',
  price: 580,
  cover: img.aral,
  routeEn: 'Khiva – Muynak – Ustyurt – Aral – Sudochie Lake – Nukus – Khiva',
  distance: '1100 km',
});

const twoDayThreeFortresses = tour({
  titleEn: 'Two-Day Trip: Three Fortresses (Bukhara to Khiva)',
  titleRu: 'Двухдневный тур: три крепости (Бухара – Хива)',
  titleUz: '2 kunlik sayohat: uch qal\'a (Buxoro – Xiva)',
  shortEn: 'Sleep in Ayaz Kala yurt camp · Toprak Kala & Akchakul Lake.',
  descEn: 'Discover Khorezm fortresses in 2 days with overnight at Ayaz Kala yurt camp (camp paid separately).',
  duration: '2 days / 1 night',
  groupSize: 4,
  category: 'multiday',
  price: 150,
  cover: img.fortress,
  routeEn: 'Bukhara – Toprak Kala – Akchakul Lake – Ayaz Kala (overnight) – Khiva',
  distance: '620 km',
});

const khivaCityTour = tour({
  titleEn: 'Khiva City Guided Tour (Ichan Kala)',
  titleRu: 'Экскурсия по городу Хива (Ичан-Кала)',
  titleUz: 'Xiva shahri gidli sayohati (Ichan Qala)',
  shortEn: '5–6 hours with English/Russian speaking guide · all main monuments.',
  descEn: 'Professional guided walk through UNESCO-listed Ichan Kala covering palaces, mosques and minarets.',
  duration: '5–6 hours',
  groupSize: 12,
  category: 'daytrip',
  price: 35,
  featured: true,
  cover: img.khiva,
  routeEn: 'Ichan Kala walking tour · Kalta Minor · Juma Mosque · palaces',
});

// —— Transfers (sedan price = whole car) ——
function transfer(titleEn, duration, km, sedanPrice, routeEn) {
  return tour({
    titleEn,
    shortEn: `Private transfer · ${duration} · ${km} km · Sedan from $${sedanPrice} (whole car, 1–3 pax).`,
    descEn: 'Door-to-door private transfer. SUV and minivan available at higher rates — contact us for a quote.',
    duration,
    groupSize: 3,
    category: 'transfer',
    price: sedanPrice,
    cover: img.architecture,
    routeEn,
    distance: `${km} km`,
  });
}

const transfers = [
  transfer('Khiva to Urgench Airport or Railway Station', '1 hour', 40, 15, 'Khiva – Urgench'),
  transfer('Urgench Airport or Station to Khiva', '1 hour', 40, 20, 'Urgench – Khiva'),
  transfer('Khiva to Shawat (Turkmenistan) Border', '90 min', 60, 24, 'Khiva – Shawat border'),
  transfer('Shawat Border to Khiva', '90 min', 60, 29, 'Shawat border – Khiva'),
  transfer('Khiva to Ayaz Kala (one way)', '2 hours', 120, 39, 'Khiva – Ayaz Kala'),
  transfer('Nukus to Ayaz Kala (one way)', '6 hours', 440, 69, 'Nukus – Ayaz Kala'),
  transfer('Bukhara to Ayaz Kala (one way)', '3 hours', 180, 99, 'Bukhara – Ayaz Kala'),
  transfer('Khiva to Nukus (one way)', '2 hours', 160, 54, 'Khiva – Nukus'),
  transfer('Khiva to Muynak (one way)', '6 hours', 385, 99, 'Khiva – Muynak'),
  transfer('Khiva to Bukhara (one way)', '6 hours', 430, 79, 'Khiva – Bukhara'),
  transfer('Nukus to Bukhara (one way)', '8 hours', 560, 128, 'Nukus – Bukhara'),
  transfer('Khiva to Samarkand (one way)', '10 hours', 715, 148, 'Khiva – Samarkand'),
];

export const islambekTours = [
  sharedThreeFortresses,
  khivaCityTour,
  ...privateKhivaDayTrips,
  ...khivaToNukus,
  ...khivaToBukhara,
  ...nukusToKhiva,
  ...bukharaToKhiva,
  muynakNukus,
  aralSea1,
  aralSea2,
  aralSea3,
  twoDayThreeFortresses,
  ...transfers,
];
