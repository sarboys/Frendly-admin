export const ADMIN_RUSSIA_MILLION_CITIES = [
  { name: "Москва", timezone: "Europe/Moscow" },
  { name: "Санкт-Петербург", timezone: "Europe/Moscow" },
  { name: "Новосибирск", timezone: "Asia/Novosibirsk" },
  { name: "Екатеринбург", timezone: "Asia/Yekaterinburg" },
  { name: "Казань", timezone: "Europe/Moscow" },
  { name: "Нижний Новгород", timezone: "Europe/Moscow" },
  { name: "Красноярск", timezone: "Asia/Krasnoyarsk" },
  { name: "Челябинск", timezone: "Asia/Yekaterinburg" },
  { name: "Самара", timezone: "Europe/Samara" },
  { name: "Уфа", timezone: "Asia/Yekaterinburg" },
  { name: "Ростов-на-Дону", timezone: "Europe/Moscow" },
  { name: "Краснодар", timezone: "Europe/Moscow" },
  { name: "Омск", timezone: "Asia/Omsk" },
  { name: "Воронеж", timezone: "Europe/Moscow" },
  { name: "Пермь", timezone: "Asia/Yekaterinburg" },
  { name: "Волгоград", timezone: "Europe/Volgograd" },
] as const;

export function getAdminCityTimezone(city: string) {
  return ADMIN_RUSSIA_MILLION_CITIES.find((item) => item.name === city)?.timezone ?? "Europe/Moscow";
}
