# Zapier Integration Guide for Audityzer

## Налаштування Zapier для автоматизації

Цей посібник показує, як налаштувати Zapier для автоматичного оброблення контактних форм, завдань та відправки повідомлень у Slack і Jira.

## Переваги Zapier

- ✅ Безкодова інтеграція між сервісами
- ✅ Автоматичні робочі процеси при отримані даних
- ✅ Інтеграція з 6000+ додатків
- ✅ Вільний тарифний план для початку
- ✅ Реал-тайм обробка подій

## Ettablish a Webhook

### 1. Копіювання Webhook URL з Zapier

1. Перейдіть до https://zapier.com/apps/webhook/integrations
2. Натисніть "Make a Zap"
3. Виберіть "Catch Hook" як тригер
4. Zapier згенерує унікальний URL для вебхука
5. Копіюйте цей URL - його потребно скопіювати в форму

### 2. Приклад Webhook URL:
```
https://hooks.zapier.com/hooks/catch/XXXXXXX/YYYYYYY/
```

## Конфігурація Форм

### Contact Form Integration

Наша форма `/api/contact` автоматично надсилає дані на Zapier webhook.

**Поля форми:**
- `name` - Ім'я контакту
- `email` - Email адреса
- `company` - Компанія (опціонально)
- `message` - Повідомлення

### Налаштування Zapier Zap для Contact Form

1. **Trigger:** Catch Raw Hook
   - Вставте URL вебхука

2. **Action 1:** Create Jira Issue
   - Project: Audityzer
   - Issue Type: Task
   - Summary: `Contact from {name} ({email})`
   - Description: `{message}\n\nCompany: {company}`

3. **Action 2:** Send Email
   - To: `{email}`
   - Subject: "We received your message"
   - Body: "Thank you for contacting us. We'll get back to you shortly."

4. **Action 3:** Send Slack Message
   - Channel: #audityzer-contacts
   - Message: `New contact from {name}: {message}`

## Booking Form Integration

### POST `/api/book-demo` Endpoint

**Поля форми:**
- `name` - Ім'я
- `email` - Email
- `company` - Компанія (опціонально)
- `preferredDate` - Бажана дата демонстрації
- `notes` - Додаткові примітки

### Zapier Actions для Demo Booking

1. **Trigger:** Catch Raw Hook
2. **Action 1:** Create Google Calendar Event
   - Title: `Demo meeting with {name}`
   - Date/Time: `{preferredDate}`
3. **Action 2:** Send Email Confirmation
4. **Action 3:** Post to Slack #bookings

## Analytics Tracking

### POST `/api/analytics/track` Endpoint

Сильно рекомендується налаштувати відстеження користувацьких подій.

```json
{
  "eventType": "page_view" | "form_submission" | "download" | "signup",
  "eventData": {
    "page": "/contact-form.html",
    "timestamp": "2025-12-06T18:00:00Z",
    "userId": "user_123"
  }
}
```

## Netlify Serverless Functions (Альтернатива)

Альтернативно можна використовувати Netlify Functions замість Zapier:

```bash
# Створіть функцію
npm install netlify-cli -g
netlify functions:create
```

Функція отримуватиме дані форми і обробляти їх:

```javascript
exports.handler = async (event, context) => {
  const { name, email, message } = JSON.parse(event.body)
  
  // Відправити до Jira
  // Відправити email
  // Постити до Slack
  
  return { statusCode: 200, body: JSON.stringify({ success: true }) }
}
```

## Завдання (Tasks) Integration

### Синхронізація завдань з Zapier

Новий Zap для управління завданнями:

1. **Trigger:** Zapier Email
   - Получайте завдання через email

2. **Action 1:** Parse Email
   - Витягніть тему, автора, зміст

3. **Action 2:** Create Audityzer Task
   - POST to `/api/tasks`
   - `title`: Tema email
   - `priority`: auto-detect
   - `assignee`: Від email

4. **Action 3:** Post to Slack
   - Повідомити команду про нове завдання

## Reports Automation

### Автоматичні доповіді при сканування

1. **Trigger:** Zapier Webhook (від аудиту)
2. **Action 1:** Generate Report
   - POST to `/api/reports/generate`
   - Domain: `{domain}`
   - Scan Type: `{scanType}`

3. **Action 2:** Send Report Email
   - Адресат: Клієнт
   - Вкладення: PDF звіту

4. **Action 3:** Post Summary to Slack
   - Critical findings
   - Security score
   - Next steps

## Мультимовна підтримка через Zapier

### Локалізація повідомлень

Використовуйте умовну логіку Zapier:

```
IF {language} = 'uk'
  THEN send message in Ukrainian
ELSE IF {language} = 'en'
  THEN send message in English
```

## Видалення даних і GDPR

### Запити на видалення особистих даних

1. Отримати email запиту на видалення
2. Завантажити дані користувача з бази
3. Видалити з Jira/CRM
4. Видалити з архіву звітів
5. Підтвердити видалення email

## Моніторинг та Логування

### Zapier Logging

Всі Zaps логуються, перегляньте в розділі "Activity".

### Помилки

Якщо Zap виходить з помилки:
1. Проверьте webhook URL
2. Перевірте формат JSON даних
3. Перевірте Jira/Slack токени
4. Включіть retry логіку

## Безпека

### Захист вебхука

1. Генеруйте унікальні webhook URLs
2. Не публікуйте URLs у вихідному коді
3. Зберігайте в `.env` файлі
4. Ротуйте URLs щомісяця
5. Встановіть rate limiting

## Вартість

### Zapier Pricing

- Free: До 100 завдань/місяць
- Pro: $24.99/місяць (500 завдань)
- Premium: $49/місяць (2000 завдань)

**Рекомендація:** Розпочніть з Free плану, потім оновіть по мірі зростання.

## Приклади запитів

### Test Contact Form

```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "company": "Tech Corp",
    "message": "Interested in security audit"
  }'
```

### Test Demo Booking

```bash
curl -X POST http://localhost:3000/api/book-demo \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "company": "StartupXYZ",
    "preferredDate": "2025-12-10T14:00:00Z",
    "notes": "Interested in demo"
  }'
```

## Користні ресурси

- [Zapier Documentation](https://zapier.com/help)
- [Zapier API Reference](https://zapier.com/help/create/code-webhooks/trigger-a-zap-with-webhooks)
- [Jira Integration](https://zapier.com/apps/jira/integrations)
- [Slack Integration](https://zapier.com/apps/slack/integrations)

## Підтримка

Для питань:
- Email: support@audityzer.com
- Slack: #audityzer-support
- GitHub Issues: https://github.com/romanchaa997/audityzer-landing/issues
