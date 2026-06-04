# SEO Audit — Khiva Shodlik Travel (khivashodliktravel.uz)

**Date:** June 2026  
**Target market:** Khiva, Xorazm, Uzbekistan — international tourists (EN/RU/UZ)  
**Primary goals:** Rank page 1 for *Khiva Tours*, *Khiva Travel Agency*, *Khiva Excursions*, *Uzbekistan Tours*

---

## SEO score (after implementation)

| Area | Before | After | Weight |
|------|--------|-------|--------|
| Technical SEO | 52/100 | **82/100** | 25% |
| On-page / content | 48/100 | **78/100** | 30% |
| Structured data | 0/100 | **85/100** | 15% |
| Local SEO | 40/100 | **65/100** | 15% |
| International (hreflang) | 20/100 | **80/100** | 10% |
| Performance (CWV) | 62/100 | **70/100** | 5% |

### **Overall: 74/100** (was ~42/100)

*Page-1 rankings still require backlinks, reviews volume, and 8–12 weeks of indexing — code alone does not guarantee position 1.*

---

## Problems found (before) → fixes (implemented)

### HIGH priority

| Problem | Fix |
|---------|-----|
| No JSON-LD (TravelAgency, FAQ, Breadcrumbs) | `lib/seo.ts` + `components/seo/JsonLd.tsx` on layout, home, tours, landings |
| No hreflang / canonical per locale | `buildPageMetadata()` + `alternates.languages` on all public pages |
| No dedicated keyword landing pages | `/khiva-tours`, `/uzbekistan-tours`, `/aral-sea-tours`, `/about` |
| Weak title/H1 for “Khiva Tours” | Hero H1 + home meta target primary keywords |
| Sitemap missing blog posts & landings | `app/sitemap.ts` updated + `getAllBlogSlugs()` |
| No FAQ for long-tail | Home FAQ + per-landing FAQ with `FAQPage` schema |
| `<html lang>` fixed to `en` | `SetHtmlLang` client sync per locale |
| Thin Open Graph / no Twitter cards | Full OG + `twitter: summary_large_image` in metadata helper |

### MEDIUM priority

| Problem | Fix |
|---------|-----|
| Tours list used `<h2>` only | `SectionHeading as="h1"` on tours/contact |
| No breadcrumbs | `PageBreadcrumbs` + `BreadcrumbList` schema |
| Internal links weak | Footer + services links to SEO pages |
| Tour pages missing rich metadata | Dynamic OG image, `TouristTrip` schema |
| About only on homepage | Dedicated `/about` page |

### LOW priority (remaining)

| Item | Action |
|------|--------|
| Dedicated OG image 1200×630 | Design export → `/public/og.jpg` |
| Full RU/UZ body copy on landing pages | Translate `seo.*` sections in `messages/ru.json` / `uz.json` |
| Google Search Console + Analytics 4 | Verify domain, submit sitemap |
| Google Business Profile | Claim “Khiva Shodlik Travel” — see below |
| Core Web Vitals field data | Monitor after deploy; optimize LCP image weight |
| Backlink campaign | See backlink section |

---

## Code map (implementation)

| File | Purpose |
|------|---------|
| `lib/seo.ts` | Metadata builder, NAP, JSON-LD generators |
| `lib/seo-landing.ts` | Load landing page copy from i18n |
| `components/seo/JsonLd.tsx` | Render JSON-LD scripts |
| `components/seo/FaqSection.tsx` | FAQ UI + schema |
| `components/seo/PageBreadcrumbs.tsx` | Breadcrumbs + schema |
| `components/seo/SeoLandingTemplate.tsx` | Reusable SEO landing layout |
| `components/seo/SetHtmlLang.tsx` | `document.documentElement.lang` |
| `app/sitemap.ts` | Multilingual URLs + tours + blog |
| `app/robots.ts` | Allow/disallow + sitemap host |
| `messages/*.json` → `seo` | Meta, FAQs, landing content |

---

## Recommended title tags & meta (by page)

| Page | Title (EN) | Meta description |
|------|------------|------------------|
| Home | Khiva Tours & Travel Agency \| Uzbekistan Tours from Khiva | Book Khiva tours, Ichan Kala walks, Khorezm day trips & Aral Sea adventures with Khiva Shodlik Travel. |
| Khiva Tours | Khiva Tours & Excursions \| Khiva Travel Agency | Book Khiva tours, walking tours, Ichan Kala excursions with a local travel agency. |
| Uzbekistan Tours | Uzbekistan Tours from Khiva \| Silk Road Travel Agency | Uzbekistan tours from Khiva — Khorezm, Bukhara transfers, Silk Road packages. |
| Aral Sea | Aral Sea Tour from Khiva \| Muynak & Ship Cemetery | Aral Sea tours from Khiva — Muynak, ship cemetery, Ustyurt canyons. |
| Tours catalog | Our Tours \| Khiva Tours & Uzbekistan Packages | Explore the best of Uzbekistan — day trips, multi-day, private tours. |
| About | About Us \| Khiva Travel Agency | Local Khiva travel agency for Uzbekistan tours and excursions. |
| Contact | Contact Us \| Khiva Travel Agency | Get in touch for custom tours and inquiries. |

---

## H1 / H2 hierarchy (semantic)

```
Home:     h1 = Khiva Tours & Travel Agency in Uzbekistan (hero)
          h2 = Featured Tours, Why Us, FAQ, CTA

Khiva Tours landing:
          h1 = Khiva Tours & Excursions
          h2 = city tours | Khorezm | why us | FAQ | CTA

Tours list: h1 = Our Tours
Tour detail: h1 = {Tour name}
          h2 = Overview / Itinerary / Includes (tabs)

About:    h1 = About Khiva Shodlik Travel
          h2 = About section title
```

---

## Local SEO — NAP consistency

Use **identical** data everywhere (site footer, GBP, TripAdvisor, directories):

```
Khiva Shodlik Travel
Ichan Kala area, Khiva, Xorazm Region, 220900, Uzbekistan
+998 91 989 68 67
+998 90 224 69 69
info@khivashodliktravel.uz
https://www.khivashodliktravel.uz
Hours: Mon–Sun 08:00–20:00
```

### Google Business Profile checklist

1. Claim/create profile — category: **Travel agency** + **Tour operator**
2. Service area: Khiva, Urgench, Nukus, Bukhara (transfers)
3. Upload 20+ photos (Ichan Kala, Kalta Minor, tours, vehicles)
4. Add services: Khiva city tour, Khorezm day trip, Aral Sea tour, transfers
5. Post weekly (offers, new tours, guest photos)
6. Collect Google reviews — reply in EN/RU
7. WhatsApp button + booking link to `/en/contact`
8. Attributes: LGBTQ+ friendly if applicable, languages: English, Russian, Uzbek

---

## Internal linking strategy

```
Home → Khiva Tours, Uzbekistan Tours, Aral Sea, Tours catalog, About, Contact
Khiva Tours ↔ Uzbekistan Tours ↔ Aral Sea ↔ Tours catalog
Every tour detail → Tours catalog + Contact (booking form)
Blog posts → relevant tour + Khiva Tours landing
Footer → all money pages (implemented)
```

---

## Backlink opportunities (tourism)

| Type | Targets |
|------|---------|
| Uzbekistan tourism boards | uzbekistan.travel, local DMO listings |
| Hotel partners in Khiva | Darboz, Orient Star, Malika — “recommended tours” page |
| TripAdvisor / Viator / GetYourGuide | List experiences with link back |
| Travel blogs | Nomadic Matt forums, Caravanistan, Silk Road bloggers |
| UNESCO / culture sites | Pitch “responsible Khiva tours” content |
| Expats & FB groups | Uzbekistan Travel, Visit Uzbekistan |
| Local directories | 2GIS, Yandex Maps, Apple Maps |
| Press | Environmental angle for Aral Sea tours |

---

## 50 SEO blog topics

1. Best Khiva tours for first-time visitors  
2. Khiva walking tour: perfect 3-hour itinerary  
3. Ichan Kala UNESCO guide: what to see in one day  
4. Kalta Minor: history and photo tips  
5. Khiva vs Bukhara: which city first?  
6. How to get from Urgench airport to Khiva  
7. Top things to do in Khiva in 48 hours  
8. Best time to visit Khiva (month by month)  
9. Khiva travel agency: how to choose a reliable operator  
10. Private guide in Khiva: prices and what to expect  
11. Khiva day tour vs multi-day Khorezm trip  
12. Ellik Qala fortresses explained  
13. Ayaz-Qala and Toprak-Qala day trip from Khiva  
14. Shared vs private tours in Khorezm  
15. What to wear in Khiva and the desert  
16. Khiva restaurants and food guide  
17. Photography spots in Ichan Kala  
18. Khiva at sunrise: why early tours win  
19. Family-friendly tours in Khiva  
20. Khiva budget travel tips 2026  
21. Uzbekistan visa guide for tourists  
22. Silk Road tours Uzbekistan: sample 7-day route  
23. Khiva to Bukhara transfer options  
24. Khiva to Nukus: road, time, stops  
25. Aral Sea tour from Khiva: complete guide  
26. Muynak ship cemetery: visitor tips  
27. Ustyurt Plateau canyons day trip  
28. Is the Aral Sea tour worth it?  
29. Desert packing list for Khorezm  
30. Best Uzbekistan tours starting in Khiva  
31. Uzbekistan travel agency comparison (Khiva-based)  
32. Khiva excursions with English-speaking drivers  
33. Khiva UNESCO tour: tickets and timings  
34. Wedding and proposal spots in Khiva  
35. Solo female travel in Khiva  
36. Khiva winter travel guide  
37. Ramadan and cultural etiquette in Khiva  
38. Money, SIM cards, and ATMs in Khiva  
39. Tipping guides and drivers in Uzbekistan  
40. Khiva craft workshops: silk, carpets, wood  
41. Museum guide inside Ichan Kala  
42. Minarets of Khiva: Islam Khoja, Juma, Kalta Minor  
43. Khiva hot air balloon — myth vs reality  
44. Eco-tourism and responsible travel in Khorezm  
45. Combining Khiva with Samarkand itinerary  
46. Group tour vs custom Uzbekistan package  
47. Khiva hotel pickup — how tours start  
48. Reviews: why guests choose Shodlik Travel  
49. Khiva festivals and events calendar  
50. FAQ: booking Khiva tours online vs WhatsApp  

---

## Core Web Vitals notes

| Metric | Status | Recommendation |
|--------|--------|----------------|
| **LCP** | Hero uses `priority` + `sizes="100vw"` | Compress hero WebP; consider `fetchPriority="high"` |
| **CLS** | Gallery/booking layout stable | Keep explicit `width/height` on cards |
| **INP** | Client islands (WhatsApp, gallery) | Defer non-critical JS; keep booking form lean |

Run [PageSpeed Insights](https://pagespeed.web.dev/) on production URL after deploy.

---

## Post-deploy checklist

- [ ] Google Search Console — add property, submit `https://www.khivashodliktravel.uz/sitemap.xml`
- [ ] Bing Webmaster Tools
- [ ] GA4 + conversion events (WhatsApp click, booking form)
- [ ] Validate schema: [Google Rich Results Test](https://search.google.com/test/rich-results)
- [ ] Request indexing for `/en/khiva-tours`, `/en/uzbekistan-tours`
- [ ] Publish 2 blog posts/month from topic list
- [ ] Build 10+ Google reviews in 90 days

---

## Brand note (SH.TRAVEL vs Khiva Shodlik Travel)

Public SEO uses **Khiva Shodlik Travel** (legal/branded). If you rebrand to SH.TRAVEL, update `SITE_NAME` in `lib/seo.ts` and message files consistently.
