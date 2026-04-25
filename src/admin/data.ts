// Mock data for admin dashboard (UI-only, no backend)

export type AdminUser = {
  id: string;
  name: string;
  handle: string;
  email: string;
  city: string;
  joined: string;
  status: "active" | "banned" | "pending";
  plan: "free" | "plus" | "afterdark";
  verified: boolean;
  meetups: number;
  reports: number;
};

export type AdminMeetup = {
  id: string;
  title: string;
  host: string;
  city: string;
  venue: string;
  date: string;
  time: string;
  participants: number;
  capacity: number;
  type: "meetup" | "date" | "afterdark";
  status: "live" | "upcoming" | "past" | "cancelled";
};

export type AdminCommunity = {
  id: string;
  name: string;
  city: string;
  members: number;
  posts: number;
  status: "open" | "closed" | "archived";
  owner: string;
  created: string;
};

export type AdminPoster = {
  id: string;
  title: string;
  venue: string;
  city: string;
  date: string;
  attendees: number;
  status: "published" | "draft" | "rejected";
};

export type AdminSubscription = {
  id: string;
  user: string;
  plan: "plus" | "afterdark";
  started: string;
  renews: string;
  amount: number;
  status: "active" | "cancelled" | "trial" | "expired";
};

export type AdminReport = {
  id: string;
  reporter: string;
  target: string;
  reason: string;
  type: "user" | "meetup" | "community" | "poster";
  date: string;
  status: "open" | "reviewing" | "resolved" | "dismissed";
  severity: "low" | "med" | "high";
};

export type AdminPayment = {
  id: string;
  user: string;
  amount: number;
  method: string;
  date: string;
  status: "succeeded" | "refunded" | "failed" | "pending";
  type: "subscription" | "one-time";
};

export const kpis = {
  users: { value: 12483, delta: +8.4, series: [820, 910, 880, 1020, 1180, 1320, 1410] },
  active: { value: 4127, delta: +3.1, series: [380, 420, 410, 450, 480, 510, 540] },
  meetups: { value: 318, delta: +12.7, series: [22, 28, 26, 32, 38, 42, 48] },
  revenue: { value: 184230, delta: +5.2, series: [12, 14, 13, 16, 18, 21, 24] },
  reports: { value: 17, delta: -22, series: [6, 4, 5, 3, 4, 2, 3] },
  conversion: { value: 7.4, delta: +0.6, series: [5.8, 6.1, 6.4, 6.7, 6.9, 7.1, 7.4] },
};

export const users: AdminUser[] = [
  { id: "u1", name: "Аня Колесникова", handle: "anya.k", email: "anya@mail.com", city: "Москва", joined: "12 мар 2025", status: "active", plan: "plus", verified: true, meetups: 14, reports: 0 },
  { id: "u2", name: "Никита Орлов", handle: "nik.o", email: "nik@mail.com", city: "СПб", joined: "03 фев 2025", status: "active", plan: "afterdark", verified: true, meetups: 22, reports: 1 },
  { id: "u3", name: "Лера М.", handle: "lera_m", email: "lera@mail.com", city: "Казань", joined: "21 янв 2025", status: "active", plan: "free", verified: false, meetups: 4, reports: 0 },
  { id: "u4", name: "Стас Г.", handle: "stas.g", email: "stas@mail.com", city: "Москва", joined: "08 апр 2025", status: "pending", plan: "free", verified: false, meetups: 0, reports: 0 },
  { id: "u5", name: "Маша П.", handle: "mashap", email: "masha@mail.com", city: "Сочи", joined: "15 фев 2025", status: "active", plan: "plus", verified: true, meetups: 11, reports: 0 },
  { id: "u6", name: "Артём Б.", handle: "artyom_b", email: "art@mail.com", city: "Москва", joined: "29 дек 2024", status: "banned", plan: "free", verified: false, meetups: 2, reports: 5 },
  { id: "u7", name: "Соня Л.", handle: "sonya.l", email: "sonya@mail.com", city: "Тбилиси", joined: "10 мар 2025", status: "active", plan: "plus", verified: true, meetups: 9, reports: 0 },
  { id: "u8", name: "Илья К.", handle: "ilyak", email: "ilya@mail.com", city: "Берлин", joined: "01 апр 2025", status: "active", plan: "free", verified: false, meetups: 1, reports: 0 },
];

export const meetups: AdminMeetup[] = [
  { id: "m1", title: "Винный вечер на крыше", host: "Аня К.", city: "Москва", venue: "Roof 12", date: "26 апр", time: "20:00", participants: 8, capacity: 10, type: "meetup", status: "upcoming" },
  { id: "m2", title: "Пробежка вдоль реки", host: "Никита О.", city: "СПб", venue: "Нева", date: "25 апр", time: "08:00", participants: 12, capacity: 20, type: "meetup", status: "live" },
  { id: "m3", title: "Свидание · кофе", host: "Лера М.", city: "Казань", venue: "Smena", date: "24 апр", time: "15:00", participants: 2, capacity: 2, type: "date", status: "past" },
  { id: "m4", title: "Ночь джаза 18+", host: "Маша П.", city: "Сочи", venue: "Velvet", date: "27 апр", time: "23:00", participants: 14, capacity: 25, type: "afterdark", status: "upcoming" },
  { id: "m5", title: "Книжный клуб", host: "Соня Л.", city: "Тбилиси", venue: "Cafe Linville", date: "23 апр", time: "19:00", participants: 6, capacity: 8, type: "meetup", status: "past" },
  { id: "m6", title: "Pottery вечер", host: "Илья К.", city: "Берлин", venue: "Studio 9", date: "28 апр", time: "18:30", participants: 4, capacity: 6, type: "meetup", status: "upcoming" },
];

export const communities: AdminCommunity[] = [
  { id: "c1", name: "Московские бегуны", city: "Москва", members: 482, posts: 124, status: "open", owner: "Никита О.", created: "12 окт 2024" },
  { id: "c2", name: "Питерский книжный", city: "СПб", members: 215, posts: 67, status: "open", owner: "Соня Л.", created: "03 ноя 2024" },
  { id: "c3", name: "Wine lovers MSK", city: "Москва", members: 339, posts: 89, status: "closed", owner: "Аня К.", created: "21 авг 2024" },
  { id: "c4", name: "Berlin coffee crawl", city: "Берлин", members: 124, posts: 31, status: "open", owner: "Илья К.", created: "05 фев 2025" },
  { id: "c5", name: "Sochi sunsets", city: "Сочи", members: 98, posts: 22, status: "archived", owner: "Маша П.", created: "14 янв 2025" },
];

export const posters: AdminPoster[] = [
  { id: "p1", title: "Open-air concert · Mumiy Troll", venue: "VK Stadium", city: "Москва", date: "15 мая", attendees: 320, status: "published" },
  { id: "p2", title: "Standup ночь", venue: "Punchline", city: "СПб", date: "29 апр", attendees: 78, status: "published" },
  { id: "p3", title: "Festival · Dikaya Myata", venue: "Тула", city: "Тула", date: "22 июн", attendees: 540, status: "draft" },
  { id: "p4", title: "Rave · Mutabor", venue: "Mutabor", city: "Москва", date: "03 мая", attendees: 210, status: "rejected" },
];

export const subscriptions: AdminSubscription[] = [
  { id: "s1", user: "Аня К.", plan: "plus", started: "01 мар 2025", renews: "01 май 2025", amount: 599, status: "active" },
  { id: "s2", user: "Никита О.", plan: "afterdark", started: "15 фев 2025", renews: "15 май 2025", amount: 1290, status: "active" },
  { id: "s3", user: "Маша П.", plan: "plus", started: "20 янв 2025", renews: "20 апр 2025", amount: 599, status: "active" },
  { id: "s4", user: "Соня Л.", plan: "plus", started: "10 апр 2025", renews: "10 май 2025", amount: 0, status: "trial" },
  { id: "s5", user: "Лера М.", plan: "plus", started: "01 янв 2025", renews: "—", amount: 599, status: "cancelled" },
  { id: "s6", user: "Стас Г.", plan: "afterdark", started: "12 окт 2024", renews: "—", amount: 1290, status: "expired" },
];

export const reports: AdminReport[] = [
  { id: "r1", reporter: "Лера М.", target: "Артём Б.", reason: "Оскорбления в чате", type: "user", date: "23 апр", status: "reviewing", severity: "high" },
  { id: "r2", reporter: "Стас Г.", target: "Wine lovers MSK", reason: "Спам", type: "community", date: "22 апр", status: "open", severity: "low" },
  { id: "r3", reporter: "Аня К.", target: "Rave · Mutabor", reason: "Не та локация", type: "poster", date: "20 апр", status: "resolved", severity: "med" },
  { id: "r4", reporter: "Илья К.", target: "Артём Б.", reason: "Не пришёл на встречу", type: "user", date: "19 апр", status: "open", severity: "med" },
  { id: "r5", reporter: "Маша П.", target: "Свидание · кофе", reason: "Неподобающее поведение", type: "meetup", date: "24 апр", status: "open", severity: "high" },
];

export const payments: AdminPayment[] = [
  { id: "pay1", user: "Аня К.", amount: 599, method: "Visa •• 4242", date: "01 апр", status: "succeeded", type: "subscription" },
  { id: "pay2", user: "Никита О.", amount: 1290, method: "Apple Pay", date: "15 фев", status: "succeeded", type: "subscription" },
  { id: "pay3", user: "Маша П.", amount: 599, method: "Mastercard •• 1010", date: "20 апр", status: "succeeded", type: "subscription" },
  { id: "pay4", user: "Стас Г.", amount: 1290, method: "Visa •• 0002", date: "12 окт", status: "refunded", type: "subscription" },
  { id: "pay5", user: "Илья К.", amount: 199, method: "Google Pay", date: "23 апр", status: "succeeded", type: "one-time" },
  { id: "pay6", user: "Лера М.", amount: 599, method: "Visa •• 7788", date: "10 апр", status: "failed", type: "subscription" },
];

export const recentActivity = [
  { id: "a1", icon: "user-plus", text: "Регистрация: Илья К.", time: "5 мин назад" },
  { id: "a2", icon: "calendar-plus", text: "Создана встреча «Винный вечер на крыше»", time: "12 мин назад" },
  { id: "a3", icon: "shield-alert", text: "Новая жалоба на пользователя Артём Б.", time: "1 ч назад" },
  { id: "a4", icon: "credit-card", text: "Оплата Frendly+ от Аня К. · 599 ₽", time: "2 ч назад" },
  { id: "a5", icon: "users", text: "Новое сообщество «Berlin coffee crawl»", time: "3 ч назад" },
  { id: "a6", icon: "ban", text: "Пользователь Артём Б. забанен", time: "5 ч назад" },
];

export const cities = ["Москва", "СПб", "Казань", "Сочи", "Тбилиси", "Берлин", "Тула"];

// ===== Analytics =====
export const analytics = {
  dau: { value: 4127, delta: +3.1, series: [3520, 3680, 3740, 3820, 3950, 4020, 4127] },
  mau: { value: 28940, delta: +6.8, series: [22100, 23400, 24800, 25900, 26700, 27800, 28940] },
  retention: { value: 42, delta: +1.4, series: [38, 39, 40, 40, 41, 41, 42] },
  sessionAvg: { value: 11.4, delta: +0.7, series: [9.8, 10.1, 10.4, 10.7, 11.0, 11.2, 11.4] },
  funnel: [
    { step: "Открыли приложение", value: 12483, pct: 100 },
    { step: "Прошли онбординг", value: 9870, pct: 79 },
    { step: "Подтвердили номер", value: 8512, pct: 68 },
    { step: "Заполнили профиль", value: 6720, pct: 54 },
    { step: "Записались на встречу", value: 4127, pct: 33 },
    { step: "Купили подписку", value: 924, pct: 7.4 },
  ],
  geo: [
    { city: "Москва", users: 4820, share: 38.6 },
    { city: "СПб", users: 2410, share: 19.3 },
    { city: "Казань", users: 980, share: 7.8 },
    { city: "Сочи", users: 720, share: 5.8 },
    { city: "Берлин", users: 540, share: 4.3 },
    { city: "Тбилиси", users: 410, share: 3.3 },
    { city: "Прочие", users: 2603, share: 20.9 },
  ],
  sources: [
    { source: "Instagram", users: 4120, pct: 33 },
    { source: "TikTok", users: 3210, pct: 26 },
    { source: "Поиск App Store", users: 2090, pct: 17 },
    { source: "Реферал", users: 1640, pct: 13 },
    { source: "Прямые", users: 1423, pct: 11 },
  ],
};

// ===== Notifications / Campaigns =====
export type AdminCampaign = {
  id: string;
  title: string;
  channel: "push" | "email" | "inapp";
  segment: string;
  audience: number;
  scheduled: string;
  status: "sent" | "scheduled" | "draft" | "sending";
  open: number;
  click: number;
};

export const campaigns: AdminCampaign[] = [
  { id: "n1", title: "Пятничные встречи в Москве", channel: "push", segment: "Москва · активные", audience: 4820, scheduled: "25 апр, 18:00", status: "scheduled", open: 0, click: 0 },
  { id: "n2", title: "Frendly+ скидка 30%", channel: "email", segment: "Free · ≥3 встречи", audience: 2140, scheduled: "23 апр, 12:00", status: "sent", open: 41, click: 12 },
  { id: "n3", title: "Новая афиша на выходные", channel: "inapp", segment: "Все активные", audience: 12483, scheduled: "26 апр, 09:00", status: "scheduled", open: 0, click: 0 },
  { id: "n4", title: "Возвращайся! Что-то новое", channel: "push", segment: "Неактивные 14д+", audience: 3290, scheduled: "—", status: "draft", open: 0, click: 0 },
  { id: "n5", title: "After Dark · ночной чат", channel: "push", segment: "After Dark подписка", audience: 412, scheduled: "сейчас", status: "sending", open: 18, click: 5 },
];

export const notificationTemplates = [
  { id: "t1", name: "Welcome push", channel: "push", uses: 482 },
  { id: "t2", name: "Re-engagement email", channel: "email", uses: 124 },
  { id: "t3", name: "Meetup reminder", channel: "push", uses: 1820 },
  { id: "t4", name: "Subscription expiring", channel: "email", uses: 312 },
];

// ===== Verification =====
export type AdminVerification = {
  id: string;
  user: string;
  handle: string;
  type: "selfie" | "document" | "photo";
  submitted: string;
  status: "queue" | "approved" | "rejected" | "needs_info";
  city: string;
};

export const verifications: AdminVerification[] = [
  { id: "v1", user: "Стас Г.", handle: "stas.g", type: "selfie", submitted: "10 мин назад", status: "queue", city: "Москва" },
  { id: "v2", user: "Илья К.", handle: "ilyak", type: "document", submitted: "32 мин назад", status: "queue", city: "Берлин" },
  { id: "v3", user: "Лера М.", handle: "lera_m", type: "photo", submitted: "2 ч назад", status: "needs_info", city: "Казань" },
  { id: "v4", user: "Аня К.", handle: "anya.k", type: "selfie", submitted: "12 мар", status: "approved", city: "Москва" },
  { id: "v5", user: "Артём Б.", handle: "artyom_b", type: "document", submitted: "29 дек", status: "rejected", city: "Москва" },
  { id: "v6", user: "Соня Л.", handle: "sonya.l", type: "selfie", submitted: "10 мар", status: "approved", city: "Тбилиси" },
];

// ===== Promo / Referral =====
export type AdminPromo = {
  id: string;
  code: string;
  type: "discount" | "trial" | "credit";
  value: string;
  uses: number;
  limit: number;
  expires: string;
  status: "active" | "expired" | "paused";
};

export const promos: AdminPromo[] = [
  { id: "pr1", code: "SPRING30", type: "discount", value: "-30%", uses: 412, limit: 1000, expires: "30 апр", status: "active" },
  { id: "pr2", code: "FRIEND14", type: "trial", value: "14 дней", uses: 1820, limit: 5000, expires: "—", status: "active" },
  { id: "pr3", code: "AFTER50", type: "discount", value: "-50%", uses: 89, limit: 200, expires: "15 мая", status: "active" },
  { id: "pr4", code: "WELCOME", type: "credit", value: "500 ₽", uses: 3210, limit: 0, expires: "—", status: "active" },
  { id: "pr5", code: "WINTER", type: "discount", value: "-20%", uses: 980, limit: 1000, expires: "01 мар", status: "expired" },
  { id: "pr6", code: "VIP100", type: "discount", value: "-100%", uses: 12, limit: 50, expires: "—", status: "paused" },
];

export const referrals = {
  total: 3210,
  active: 1240,
  topReferrers: [
    { user: "Аня К.", invites: 48, paid: 14, earned: 8400 },
    { user: "Никита О.", invites: 41, paid: 11, earned: 6600 },
    { user: "Маша П.", invites: 32, paid: 9, earned: 5400 },
    { user: "Соня Л.", invites: 27, paid: 7, earned: 4200 },
    { user: "Илья К.", invites: 19, paid: 4, earned: 2400 },
  ],
};

// ===== Content / Pages =====
export type AdminContentPage = {
  id: string;
  title: string;
  slug: string;
  type: "policy" | "faq" | "rules" | "onboarding" | "page";
  updated: string;
  author: string;
  status: "published" | "draft";
};

export const contentPages: AdminContentPage[] = [
  { id: "cp1", title: "Правила сообщества", slug: "/rules", type: "rules", updated: "12 апр", author: "Админ", status: "published" },
  { id: "cp2", title: "FAQ", slug: "/faq", type: "faq", updated: "08 апр", author: "Support", status: "published" },
  { id: "cp3", title: "Политика конфиденциальности", slug: "/privacy", type: "policy", updated: "01 фев", author: "Legal", status: "published" },
  { id: "cp4", title: "Условия использования", slug: "/terms", type: "policy", updated: "01 фев", author: "Legal", status: "published" },
  { id: "cp5", title: "Онбординг · Welcome", slug: "/onboarding/welcome", type: "onboarding", updated: "20 апр", author: "Product", status: "published" },
  { id: "cp6", title: "Онбординг · After Dark", slug: "/onboarding/afterdark", type: "onboarding", updated: "—", author: "Product", status: "draft" },
  { id: "cp7", title: "О Frendly+", slug: "/about-plus", type: "page", updated: "15 апр", author: "Marketing", status: "published" },
];

// ===== Featured / Banners =====
export type AdminBanner = {
  id: string;
  title: string;
  placement: "home_top" | "afterdark" | "feed" | "posters";
  starts: string;
  ends: string;
  ctr: number;
  status: "active" | "scheduled" | "ended" | "draft";
};

export const banners: AdminBanner[] = [
  { id: "b1", title: "Frendly+ весенняя скидка", placement: "home_top", starts: "20 апр", ends: "30 апр", ctr: 4.2, status: "active" },
  { id: "b2", title: "Открытие After Dark в Сочи", placement: "afterdark", starts: "01 мая", ends: "15 мая", ctr: 0, status: "scheduled" },
  { id: "b3", title: "Афиша · Mumiy Troll", placement: "posters", starts: "10 апр", ends: "15 мая", ctr: 6.8, status: "active" },
  { id: "b4", title: "Книжный клуб набор", placement: "feed", starts: "—", ends: "—", ctr: 0, status: "draft" },
  { id: "b5", title: "Зимняя акция", placement: "home_top", starts: "10 дек", ends: "01 мар", ctr: 3.1, status: "ended" },
];

export type AdminFeatured = {
  id: string;
  title: string;
  type: "meetup" | "community" | "poster";
  city: string;
  position: number;
  views: number;
};

export const featuredItems: AdminFeatured[] = [
  { id: "f1", title: "Винный вечер на крыше", type: "meetup", city: "Москва", position: 1, views: 4820 },
  { id: "f2", title: "Mumiy Troll · VK Stadium", type: "poster", city: "Москва", position: 2, views: 3210 },
  { id: "f3", title: "Московские бегуны", type: "community", city: "Москва", position: 3, views: 2140 },
  { id: "f4", title: "Ночь джаза 18+", type: "meetup", city: "Сочи", position: 4, views: 1820 },
];
