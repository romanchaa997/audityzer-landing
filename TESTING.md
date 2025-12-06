# Complete Testing Guide for Audityzer Landing Site

## Повний посібник тестування

### Початок

```bash
# 1. Клонування та встановлення
git clone https://github.com/romanchaa997/audityzer-landing.git
cd audityzer-landing
npm install

# 2. Копіювання .env
cp .env.example .env

# 3. Розпочинання сервера
npm run dev
```

### Access URLs

- Homepage: http://localhost:3000
- Contact Form: http://localhost:3000/contact-form.html
- Booking Form: http://localhost:3000/booking-form.html
- Tasks Dashboard: http://localhost:3000/tasks-dashboard.html
- Reports Dashboard: http://localhost:3000/reports-dashboard.html
- Analytics Dashboard: http://localhost:3000/analytics-dashboard.html

## API Testing

### 1. Contact Form API

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

**Expected Response:**
```json
{
  "success": true,
  "message": "Contact form submitted successfully",
  "contactId": "contact-1702002000000",
  "timestamp": "2025-12-06T18:00:00.000Z"
}
```

### 2. Demo Booking API

```bash
curl -X POST http://localhost:3000/api/book-demo \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "company": "StartupXYZ",
    "preferredDate": "2025-12-10T14:00:00Z",
    "notes": "Interested in seeing the platform"
  }'
```

### 3. Tasks API

#### Get All Tasks
```bash
curl http://localhost:3000/api/tasks
```

#### Create New Task
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Security audit for example.com",
    "description": "Full security assessment",
    "priority": "high",
    "assignee": "john@example.com",
    "dueDate": "2025-12-15"
  }'
```

### 4. Reports API

#### Generate Report
```bash
curl -X POST http://localhost:3000/api/reports/generate \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example.com",
    "scanType": "full_security_audit",
    "frequency": "once"
  }'
```

#### Get Report
```bash
curl http://localhost:3000/api/reports/report-1702002000000
```

### 5. Analytics API

#### Get Analytics
```bash
curl http://localhost:3000/api/analytics
```

#### Track Event
```bash
curl -X POST http://localhost:3000/api/analytics/track \
  -H "Content-Type: application/json" \
  -d '{
    "eventType": "page_view",
    "eventData": {
      "page": "/contact-form.html",
      "userId": "user_123"
    }
  }'
```

### 6. Audit Status API

```bash
curl http://localhost:3000/api/audit/status
```

### 7. Webhooks API

```bash
curl -X POST http://localhost:3000/api/webhooks/register \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://hooks.zapier.com/hooks/catch/XXXXX/YYYYY/",
    "events": ["contact_form", "booking", "task_created"]
  }'
```

## HTML Form Testing

### Contact Form (contact-form.html)
1. Open http://localhost:3000/contact-form.html
2. Fill in: Name, Email, Company, Message
3. Click Submit
4. Check success message
5. Form should reset
6. Check browser console for API response

### Booking Form (booking-form.html)
1. Open http://localhost:3000/booking-form.html
2. Fill in: Name, Email, Company, Preferred Date, Notes
3. Select a future date
4. Click Submit
5. Verify success message
6. Check console for booking confirmation

### Dashboard Testing

#### Tasks Dashboard
- URL: http://localhost:3000/tasks-dashboard.html
- Should display: 12 active tasks, 5 high priority, 23 completed this week
- Console should show tasks from `/api/tasks`

#### Reports Dashboard
- URL: http://localhost:3000/reports-dashboard.html
- Should display: Report cards with scores
- Download buttons should work (demo only)

#### Analytics Dashboard
- URL: http://localhost:3000/analytics-dashboard.html
- Should display: 6 stat cards, chart bars, audit table
- Console should show analytics data from `/api/analytics`

## Error Testing

### Missing Required Fields
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe"
  }'
```

Expected: 400 Bad Request with error message

### Invalid Endpoint
```bash
curl http://localhost:3000/api/invalid
```

Expected: 404 Not Found

## Performance Testing

### Load Testing with Apache Bench
```bash
# Test homepage
ab -n 1000 -c 10 http://localhost:3000/

# Test API
ab -n 1000 -c 10 http://localhost:3000/api/tasks
```

### Response Time
- API endpoints should respond in <500ms
- Homepage load in <2s
- Dashboards load in <3s

## Browser Testing

### Chrome DevTools
1. Open DevTools (F12)
2. Go to Network tab
3. Check all requests complete successfully
4. Verify no 404 or 500 errors
5. Check Console for JavaScript errors

### Mobile Testing
1. Use Chrome DevTools Mobile view
2. Test all forms on mobile
3. Verify dashboards are responsive
4. Check touch interactions

## Security Testing

### CORS Headers
```bash
curl -I http://localhost:3000/api/contact
```

### Input Validation
```bash
# Test XSS prevention
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "<script>alert(1)</script>",
    "email": "test@example.com",
    "message": "test"
  }'
```

### SQL Injection Test
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "'; DROP TABLE tasks; --",
    "priority": "high"
  }'
```

## Integration Testing

### Contact Form -> Webhook
1. Ensure `.env` contains valid ZAPIER webhook
2. Submit contact form
3. Check webhook receives data

### Analytics Tracking
1. Submit forms
2. Track events
3. Verify data in analytics endpoint

## Deployment Testing

### Netlify Deployment
```bash
# Local build
npm run build

# Check build output
ls -la build/
```

### Environment Variables
```bash
# Test with production env
NODE_ENV=production npm run build
NODE_ENV=production npm start
```

## Checklist

- [ ] All API endpoints respond correctly
- [ ] Forms validate input
- [ ] Contact form submission works
- [ ] Booking form with date picker works
- [ ] Tasks dashboard displays data
- [ ] Reports dashboard shows reports
- [ ] Analytics dashboard loads stats
- [ ] No console errors
- [ ] No 404 or 500 errors
- [ ] Mobile responsive
- [ ] API response time <500ms
- [ ] Netlify deployment works
- [ ] Environment variables configured
- [ ] Error messages display properly
- [ ] Success messages confirm actions

## Troubleshooting

### Port 3000 already in use
```bash
# Use different port
PORT=3001 npm run dev
```

### Module not found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.yaml
npm install
```

### Webhook not working
1. Check `.env` has valid webhook URL
2. Verify Zapier webhook is active
3. Check network tab for failed requests
4. Review browser console for errors

## Quick Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build project
npm run start        # Run production
npm test             # Run tests
npm run lint         # Lint code

# Testing
npm run test:api     # Test API endpoints

# All APIs test
echo "Testing Contact..." && npm run test:api

# Complete test suite
for endpoint in /api/tasks /api/analytics /api/audit/status; do
  echo "Testing $endpoint..."
  curl http://localhost:3000$endpoint
done
```
