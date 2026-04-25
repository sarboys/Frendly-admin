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

Пока UI использует моковые данные из `src/admin/data.ts`.
Следующий шаг, заменить их на admin API под `/admin/*`.
