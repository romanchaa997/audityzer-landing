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


// Tasks Management - Create/Get/Update tasks
app.post('/api/tasks', async (req, res) => {
  const { title, description, priority, assignee, dueDate } = req.body
  
  if (!title || !priority) {
    return res.status(400).json({ error: 'Title and priority are required' })
  }
  
  try {
    const taskId = `task-${Date.now()}`
    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      taskId,
      task: { title, description, priority, assignee, dueDate, status: 'open', createdAt: new Date().toISOString() }
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' })
  }
})

app.get('/api/tasks', async (req, res) => {
  try {
    res.json({
      success: true,
      tasks: [
        { id: 'task-1', title: 'Security Audit', priority: 'high', status: 'in-progress' },
        { id: 'task-2', title: 'Code Review', priority: 'medium', status: 'pending' },
        { id: 'task-3', title: 'Documentation', priority: 'low', status: 'completed' }
      ]
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' })
  }
})

// Reports - Generate/Get audit reports
app.post('/api/reports/generate', async (req, res) => {
  const { domain, scanType, frequency } = req.body
  
  if (!domain || !scanType) {
    return res.status(400).json({ error: 'Domain and scanType are required' })
  }
  
  try {
    const reportId = `report-${Date.now()}`
    res.status(201).json({
      success: true,
      message: 'Report generation started',
      reportId,
      estimatedTime: '5-10 minutes',
      status: 'processing'
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate report' })
  }
})

app.get('/api/reports/:reportId', async (req, res) => {
  const { reportId } = req.params
  
  try {
    res.json({
      success: true,
      report: {
        id: reportId,
        domain: 'example.com',
        scanType: 'security',
        status: 'completed',
        generatedAt: new Date().toISOString(),
        findings: {
          critical: 2,
          high: 5,
          medium: 12,
          low: 3
        },
        score: 7.8
      }
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch report' })
  }
})

// Analytics - Usage statistics
app.get('/api/analytics', async (req, res) => {
  try {
    res.json({
      success: true,
      analytics: {
        totalScans: 1247,
        totalDomains: 89,
        averageScore: 7.5,
        criticalFindings: 34,
        reportsGenerated: 156,
        usersActive: 23,
        uptime: '99.9%',
        responseTime: '245ms',
        lastUpdated: new Date().toISOString()
      }
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics' })
  }
})

app.post('/api/analytics/track', async (req, res) => {
  const { eventType, eventData } = req.body
  
  try {
    res.json({
      success: true,
      message: 'Event tracked successfully',
      eventId: `evt-${Date.now()}`,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to track event' })
  }
})

// Audit Status - Get real-time audit status
app.get('/api/audit/status', async (req, res) => {
  try {
    res.json({
      success: true,
      status: 'operational',
      services: {
        securityAudit: 'running',
        complianceCheck: 'idle',
        vulnerabilityScanner: 'running',
        reportGeneration: 'idle'
      },
      performance: {
        cpu: 34,
        memory: 52,
        diskSpace: 78
      }
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch status' })
  }
})

// Webhooks - Handle external integrations
app.post('/api/webhooks/register', async (req, res) => {
  const { url, events } = req.body
  
  if (!url || !events) {
    return res.status(400).json({ error: 'URL and events are required' })
  }
  
  try {
    res.status(201).json({
      success: true,
      message: 'Webhook registered successfully',
      webhookId: `wh-${Date.now()}`,
      url,
      events,
      status: 'active'
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to register webhook' })
  }
})

// Start server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Audityzer server running on http://localhost:${PORT}`)
})
})


export default app
