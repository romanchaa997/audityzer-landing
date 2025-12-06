# Audityzer Local Development Guide

## Налаштування локального середовища без GitHub Actions

Цей посібник допоможе вам налаштувати Audityzer для локальної розробки та тестування без залежності від GitHub Actions.

## Вимоги

- Node.js 20+ (https://nodejs.org/)
- npm або pnpm
- Git

## Початок роботи

### 1. Клонування репозиторію

```bash
git clone https://github.com/romanchaa997/audityzer-landing.git
cd audityzer-landing
```

### 2. Встановлення залежностей

```bash
npm install
# або
pnpm install
```

### 3. Налаштування змінних оточення

Створіть файл `.env` в кореневій папці:

```bash
cp .env.example .env
```

Отримайте Zapier webhook URLs з https://zapier.com/ та оновіть `.env`:

```
ZAPIER_CONTACT_WEBHOOK=https://hooks.zapier.com/hooks/catch/YOUR_WEBHOOK_ID_FOR_CONTACT/
ZAPIER_BOOKING_WEBHOOK=https://hooks.zapier.com/hooks/catch/YOUR_WEBHOOK_ID_FOR_BOOKING/
PORT=3000
```

### 4. Запуск локального сервера

```bash
npm run dev
```

Сервер запуститься на http://localhost:3000

## npm Скрипти

### Desarrollo (з гарячою перезавантаженням)
```bash
npm run dev
```

### Вбудована збірка
```bash
npm run build
```

### Запуск в продакшені
```bash
npm run start
```

### Тестування
```bash
npm test
```

### Linting
```bash
npm run lint
```

## API Endpoints локально

### Контактні форми
- POST `/api/contact` - Відправка контактної форми
- POST `/api/book-demo` - Запит на демонстрацію

### Управління завданнями
- POST `/api/tasks` - Створення завдання
- GET `/api/tasks` - Отримання списку завдань

### Доповіді
- POST `/api/reports/generate` - Створення звіту
- GET `/api/reports/:reportId` - Отримання звіту

### Аналітика
- GET `/api/analytics` - Статистика використання
- POST `/api/analytics/track` - Відстеження подій
- GET `/api/audit/status` - Статус аудиту

### Webhooks
- POST `/api/webhooks/register` - Реєстрація webhook

## HTML Сторінки

- `/` - Головна сторінка
- `/contact-form.html` - Контактна форма
- `/booking-form.html` - Форма бронювання
- `/tasks-dashboard.html` - Дашборд завдань
- `/reports-dashboard.html` - Дашборд доповідей

## Локальне тестування API

### Тестування контактної форми
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Test message"
  }'
```

### Тестування завдань
```bash
curl -X GET http://localhost:3000/api/tasks
```

### Тестування аналітики
```bash
curl -X GET http://localhost:3000/api/analytics
```

## Структура проекту

```
audityzer-landing/
├── src/
│   └── index.ts          # Express сервер та API endpoints
├── public/
│   ├── contact-form.html # Контактна форма
│   ├── booking-form.html # Форма бронювання
│   ├── tasks-dashboard.html # Дашборд завдань
│   └── reports-dashboard.html # Дашборд доповідей
├── .env.example          # Шаблон змінних оточення
├── package.json          # npm залежності
├── tsconfig.json         # TypeScript конфіг
└── README.md             # Основна документація
```

## Безплатні хостинги

### Netlify (рекомендується)
1. Заєдіть на https://netlify.com
2. Підключіть свій GitHub репозиторій
3. Netlify автоматично розпізнає конфіг
4. Сайт розгорнеться безплатно

### Vercel (альтернатива)
1. Заєдіть на https://vercel.com
2. Імпортуйте проект з GitHub
3. Розгортання відбудеться автоматично

### GitHub Pages (для статичного вмісту)
1. Перейдіть в Settings > Pages
2. Виберіть гілку main
3. Виберіть папку /docs або root

## Налаштування альтернативних доменів

### Додавання поддомену

Оновіть `package.json`:
```json
{
  "domains": [
    "audityzer.com",
    "auditorsec.com",
    "audityzer.web3"
  ]
}
```

Для налаштування DNS:
- Перейдіть до регістратора доменів
- Додайте CNAME запис, що вказує на Netlify/Vercel
- Активуйте HTTPS

## Локальне тестування з docker

```bash
# Создание Dockerfile
docker build -t audityzer .
docker run -p 3000:3000 audityzer
```

## Розв'язання проблем

### Порт 3000 вже використовується
```bash
PORT=3001 npm run dev
```

### Zapier webhook не працює
- Перевірте, що Zapier активний
- Переконайтесь, що URL вірний у `.env`
- Перевірте консоль на помилки

### Git errors при Pushу
```bash
git config --global credential.helper store
```

## Support

Для питань або проблем:
- Відкрийте issue на GitHub
- Зв'яжіться з командою розробки
- Перевірте документацію
