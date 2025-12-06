import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// Home route - HTML
app.get('/', (req, res) => {
  res.type('html').send(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8"/>
        <title>Express on Vercel</title>
        <link rel="stylesheet" href="/style.css" />
      </head>
      <body>
        <nav>
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/api-data">API Data</a>
          <a href="/healthz">Health</a>
        </nav>
        <h1>Welcome to Express on Vercel 🚀</h1>
        <p>This is a minimal example without a database or forms.</p>
        <img src="/logo.png" alt="Logo" width="120" />
      </body>
    </html>
  `)
})

app.get('/about', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'components', 'about.htm'))
})

// Example API endpoint - JSON
app.get('/api-data', (req, res) => {
  res.json({
    message: 'Here is some sample API data',
    items: ['apple', 'banana', 'cherry'],
  })
})

// Health check
app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Middleware for parsing JSON
app.use(express.json())

// Contact Form - Send data to Zapier webhook
app.post('/api/contact', async (req, res) => {
  const { name, email, message, company } = req.body
  
  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' })
  }
  
  try {
    // Send to Zapier webhook
    const zapierWebhookUrl = process.env.ZAPIER_CONTACT_WEBHOOK || 'https://hooks.zapier.com/hooks/catch/YOUR_ZAPIER_WEBHOOK_ID/'
    
    const response = await fetch(zapierWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        message,
        company,
        submittedAt: new Date().toISOString(),
        source: 'contact-form',
      }),
    })
    
    if (!response.ok) throw new Error('Zapier webhook failed')
    
    res.status(200).json({ 
      success: true, 
      message: 'Thank you! We\'ll be in touch soon.',
      id: `contact-${Date.now()}` 
    })
  } catch (error) {
    console.error('Contact form error:', error)
    res.status(500).json({ error: 'Failed to submit form. Please try again.' })
  }
})

// Booking/Demo Request - Calendar integration
app.post('/api/book-demo', async (req, res) => {
  const { name, email, company, preferredDate, notes } = req.body
  
  if (!name || !email || !preferredDate) {
    return res.status(400).json({ error: 'Name, email, and preferred date are required' })
  }
  
  try {
    // Send to Zapier for calendar booking
    const zapierWebhookUrl = process.env.ZAPIER_BOOKING_WEBHOOK || 'https://hooks.zapier.com/hooks/catch/YOUR_BOOKING_WEBHOOK_ID/'
    
    const response = await fetch(zapierWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        company,
        preferredDate,
        notes,
        bookingType: 'demo',
        submittedAt: new Date().toISOString(),
      }),
    })
    
    if (!response.ok) throw new Error('Zapier booking webhook failed')
    
    res.status(200).json({ 
      success: true, 
      message: 'Thank you! We\'ll send you a calendar invite shortly.',
      bookingId: `booking-${Date.now()}` 
    })
  } catch (error) {
    console.error('Booking error:', error)
    res.status(500).json({ error: 'Failed to book demo. Please try again.' })
  }
})


export default app
