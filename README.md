# Frendly Admin

Отдельная React админка для Frendly.

## Локальный запуск

```bash
npm install
cp .env.example .env
npm run dev
```

По умолчанию dev server стартует на `http://localhost:8081`.

## API

Адрес backend задается через:

```bash
VITE_API_BASE_URL=http://localhost:3000
```

## Порталы

Один код собирается в два режима:

```bash
VITE_ADMIN_PORTAL=internal
VITE_ADMIN_PORTAL=partner
```

`internal` используется для `admin.frendly.tech`.
`partner` используется для `partner.frendly.tech`.

Оба портала ходят в один API:

```bash
VITE_API_BASE_URL=https://api.frendly.tech
```

Пока UI использует моковые данные из `src/admin/data.ts`.
Следующий шаг, заменить их на admin API под `/admin/*`.
