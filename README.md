# Audityzer Landing Site

**Production-ready landing page для Audityzer з контакт-формами, API endpoints та автоматизацією через Zapier.**

## ✨ Особливості

- ✅ **Contact Form API** (`POST /api/contact`) з Zapier інтеграцією
- ✅ **Demo Booking API** (`POST /api/book-demo`) для бронювання консультацій
- ✅ **GitHub Actions CI/CD** для автоматичного деплойму на Vercel
- ✅ **HTML Contact Form** з клієнтськими валідаціями (`public/contact-form.html`)
- ✅ **HTML Booking Form** для бронювання демо (`public/booking-form.html`)
- ✅ **Environment Variables** для налаштування Zapier webhooks

## 🚀 Швидкий старт

### 1. Клонуй репозиторій

```bash
git clone https://github.com/romanchaa997/audityzer-landing.git
cd audityzer-landing
```

### 2. Встанови залежності

```bash
pnpm install
# або npm install
```

### 3. Налаштуй Environment Variables

```bash
cp .env.example .env
```

Отримай Zapier webhook URLs і встав у `.env`:

```
ZAPIER_CONTACT_WEBHOOK=https://hooks.zapier.com/hooks/catch/YOUR_WEBHOOK_ID_CONTACT/
ZAPIER_BOOKING_WEBHOOK=https://hooks.zapier.com/hooks/catch/YOUR_WEBHOOK_ID_BOOKING/
PORT=3000
```

### 4. Запусти локально

```bash
pnpm dev
```

Сайт буде доступний на `http://localhost:3000`

## 📡 API Endpoints

### POST /api/contact

**Контактна форма**

```json
{
  "name": "Іван Петренко",
  "email": "ivan@example.com",
  "company": "Компанія А",
  "message": "Потрібна консультація..."
}
```

**Відповідь:**
```json
{
  "success": true,
  "message": "Thank you! We'll be in touch soon.",
  "id": "contact-1733460000000"
}
```

### POST /api/book-demo

**Бронювання консультації**

```json
{
  "name": "Іван Петренко",
  "email": "ivan@example.com",
  "company": "Компанія А",
  "preferredDate": "2025-12-15T14:00",
  "notes": "Цікавимось функціями безпеки..."
}
```

**Відповідь:**
```json
{
  "success": true,
  "message": "Thank you! We'll send you a calendar invite shortly.",
  "bookingId": "booking-1733460000000"
}
```

## 🔄 Zapier Integration

### Налаштування Contact Form Zap

1. Перейди на https://zapier.com/app/dashboard
2. Створи новий Zap
3. **Trigger**: Webhooks by Zapier → POST в URL отримаш від Zapier
4. **Actions**:
   - Jira Cloud → Create Issue
   - Slack → Send Message
   - Email → Send Email
5. Отримай webhook URL і встав у `.env`

### Залежності для Zapier

- Jira Cloud токен (Project Key + Issue Type)
- Slack webhook URL (для #sales-leads канал)
- Email сервіс (Gmail, SendGrid, тощо)

## 🔐 GitHub Actions CI/CD

### Автоматичний деплой

Усе налаштовано у `.github/workflows/deploy.yml`:

1. **Push на `main`** → Автоматичний тест + деплой на production
2. **Push на `staging`** → Тест + деплой на staging
3. **PR на `main`** → Тести (без деплойму)

### Необхідні Secrets у GitHub

```
VERCEL_TOKEN         # з https://vercel.com/account/tokens
VERCEL_ORG_ID        # ID твоєї організації в Vercel
VERCEL_PROJECT_ID    # ID проекту audityzer-landing
SLACK_WEBHOOK        # Для нотифікацій про деплой
```

## 📁 Структура Проекту

```
audityzer-landing/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD pipeline
├── src/
│   └── index.ts               # Express сервер + API endpoints
├── public/
│   ├── contact-form.html      # Контактна форма
│   ├── booking-form.html      # Форма бронювання
│   ├── style.css              # Основні стилі
│   └── logo.png               # Лого
├── .env.example               # Шаблон змінних
├── package.json               # Залежності
└── README.md                  # Цей файл
```

## 🧪 Тестування

### Локальне тестування

```bash
# Тест контактної форми
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "Test message"
  }'

# Тест форми бронювання
curl -X POST http://localhost:3000/api/book-demo \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "preferredDate": "2025-12-20T15:00"
  }'
```

## 📚 Документація

- [Express.js](https://expressjs.com/) — Framework
- [Vercel](https://vercel.com/docs) — Hosting
- [Zapier](https://zapier.com/help) — Automation
- [GitHub Actions](https://docs.github.com/en/actions) — CI/CD

## 🤝 Конвенції розробки

- TypeScript для типізації
- Async/await для асинхронних операцій
- Обробка помилок у try/catch
- Логування через console
- Gitflow для версійності

## 📞 Support

Якщо виникли питання:
1. Перевір `.env.example` для необхідних змінних
2. Переглянь логи GitHub Actions
3. Протестуй API endpoints локально
4. Перевір Zapier Zap logs на https://zapier.com/

## 📝 Ліцензія

MIT License © 2025 Audityzer

---

**Статус**: ✅ Production Ready
**Остання оновлення**: December 6, 2025
**Контактна особа**: romanchaa997@gmail.com
