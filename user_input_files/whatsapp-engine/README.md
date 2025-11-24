# WhatsApp Automation Engine

A Node.js-based WhatsApp Web automation engine using Puppeteer for automated message handling, CRM synchronization, and intelligent responses.

## Features

- 🤖 **WhatsApp Web Automation** - Automated message sending/receiving via Puppeteer
- 💬 **AI Response Generation** - Intelligent responses using Google Gemini API
- 📊 **CRM Integration** - Real-time synchronization with Supabase database
- ⚙️ **Automation Rules** - Keyword, schedule, and event-based triggers
- 📈 **Analytics Tracking** - Automatic metrics and performance tracking
- 🔒 **Session Management** - Persistent WhatsApp Web session storage
- 🚀 **Rate Limiting** - Built-in rate limiting to prevent blocks
- 📱 **QR Code Auth** - Simple QR code authentication flow

## Prerequisites

- Node.js >= 18.0.0
- npm or pnpm
- Supabase project with database tables
- Google Gemini API key (optional, for AI responses)

## Installation

1. **Clone the repository** (if not already done)
```bash
cd /workspace/whatsapp-engine
```

2. **Install dependencies**
```bash
npm install
# or
pnpm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env with your actual configuration
```

4. **Required Environment Variables**
```env
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key

# Google Gemini API Key (for AI responses)
GEMINI_API_KEY=your_gemini_api_key

# Engine Configuration
SESSION_PATH=./.wwebjs_auth
LOG_LEVEL=info
AUTO_RECONNECT=true
MESSAGE_POLL_INTERVAL=5000
RATE_LIMIT=20
```

## Build & Run

### Development Mode

```bash
npm run dev
# or
pnpm dev
```

### Production Mode

```bash
# Build TypeScript to JavaScript
npm run build

# Run compiled code
npm start
```

## Authentication

1. **Start the engine**
```bash
npm start
```

2. **Scan QR Code**
   - A QR code will be displayed in the terminal
   - Open WhatsApp on your mobile device
   - Go to Settings → Linked Devices → Link a Device
   - Scan the QR code shown in the terminal

3. **Session Persistence**
   - Once authenticated, session data is saved in `./.wwebjs_auth/`
   - Future runs will auto-authenticate without QR code
   - Delete `./.wwebjs_auth/` to re-authenticate

## Architecture

```
WhatsApp Engine
├── src/
│   ├── index.ts              # Main engine entry point
│   ├── MessageHandler.ts     # Incoming/outgoing message handling
│   └── AutomationProcessor.ts # Automation rules execution
├── .wwebjs_auth/            # WhatsApp session data (generated)
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
└── .env                      # Environment variables
```

## Core Components

### 1. Main Engine (index.ts)

**Responsibilities:**
- Initialize WhatsApp Web client
- Connect to Supabase database
- Coordinate MessageHandler and AutomationProcessor
- Handle QR code authentication
- Monitor connection status
- Schedule analytics updates

**Key Features:**
- Auto-reconnect on disconnection
- Graceful shutdown handling
- System status tracking
- Hourly analytics updates
- Daily summary generation

### 2. MessageHandler (MessageHandler.ts)

**Responsibilities:**
- Process incoming WhatsApp messages
- Generate AI responses
- Send outgoing messages
- Store messages in database
- Manage rate limiting

**Key Methods:**
- `handleIncomingMessage()` - Process new messages
- `sendMessage()` - Send WhatsApp messages
- `generateAndSendResponse()` - AI response generation
- `sendBulkMessages()` - Broadcast to multiple contacts

### 3. AutomationProcessor (AutomationProcessor.ts)

**Responsibilities:**
- Load automation rules from database
- Schedule time-based rules
- Execute rule actions
- Process event triggers
- Update lead scores

**Supported Actions:**
- Send message to specific number
- Update contact information
- Create new lead
- Trigger external webhook
- Send bulk messages by tag

## Usage Examples

### Send a Message

```typescript
// Via MessageHandler
await messageHandler.sendMessage(
  '1234567890@c.us',  // WhatsApp ID
  'Hello from automation!',
  contactId  // Optional: contact ID from database
);
```

### Send Bulk Messages

```typescript
// Send to multiple contacts
await messageHandler.sendBulkMessages([
  { phone: '1234567890', message: 'Hello!' },
  { phone: '9876543210', message: 'Hi there!' }
], 5000); // 5 second delay between messages
```

### Create Automation Rule

```sql
-- Insert into Supabase database
INSERT INTO automation_rules (
  name,
  description,
  trigger_type,
  trigger_conditions,
  action_type,
  action_config,
  is_active,
  priority
) VALUES (
  'Welcome Message',
  'Send welcome message when keyword "hello" is received',
  'keyword',
  '{"keywords": ["hello", "hi", "hey"]}',
  'send_message',
  '{"message": "Welcome! How can I help you today?"}',
  true,
  1
);
```

### Schedule Automated Messages

```sql
-- Send daily reminder at 9 AM
INSERT INTO automation_rules (
  name,
  trigger_type,
  trigger_conditions,
  action_type,
  action_config,
  is_active
) VALUES (
  'Daily Reminder',
  'schedule',
  '{"cron": "0 9 * * *"}',  -- 9 AM daily
  'send_bulk_message',
  '{"tag": "subscribers", "message": "Good morning! Don''t forget to check our latest offers."}',
  true
);
```

## Rate Limiting

The engine implements automatic rate limiting to prevent WhatsApp blocks:

- Default: 20 messages per minute per number
- Configurable via `RATE_LIMIT` environment variable
- Queues messages when limit exceeded
- Automatically retries after 1 minute

## Monitoring & Logs

### Console Logs

The engine provides detailed logging:

```
🚀 Starting WhatsApp Automation Engine...
📱 Scan this QR code with your WhatsApp mobile app:
🔐 Authentication successful!
✅ WhatsApp Web Client is ready!
🤖 Starting Automation Processor...
📥 Incoming message from 1234567890: Hello
🎯 Matched rule: Welcome Message (keyword: hello)
📤 Message sent to 1234567890: Welcome! How can I help you today?
📊 Updating analytics...
✅ Analytics updated for 2025-10-30
```

### System Status

Status is tracked in database:

```sql
SELECT * FROM system_status;
-- id | status | last_update | is_connected
-- 1  | active | 2025-10-30  | true
```

## Deployment

### Option 1: Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Add environment variables
railway variables set SUPABASE_URL=your_url
railway variables set SUPABASE_ANON_KEY=your_key
railway variables set GEMINI_API_KEY=your_key

# Deploy
railway up
```

### Option 2: Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create app
heroku create whatsapp-automation-engine

# Add buildpack
heroku buildpacks:set heroku/nodejs

# Set environment variables
heroku config:set SUPABASE_URL=your_url
heroku config:set SUPABASE_ANON_KEY=your_key

# Deploy
git push heroku main
```

### Option 3: Docker

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

CMD ["npm", "start"]
```

```bash
# Build image
docker build -t whatsapp-engine .

# Run container
docker run -d \
  -e SUPABASE_URL=your_url \
  -e SUPABASE_ANON_KEY=your_key \
  -v $(pwd)/.wwebjs_auth:/app/.wwebjs_auth \
  whatsapp-engine
```

## Troubleshooting

### Issue: QR Code Not Displaying

**Solution:** Ensure terminal supports Unicode characters. Try:
```bash
export LANG=en_US.UTF-8
npm start
```

### Issue: Session Lost After Restart

**Solution:** Ensure `.wwebjs_auth/` directory persists:
- Check file permissions
- If using Docker, mount volume correctly
- Don't delete session directory

### Issue: WhatsApp Web Disconnects

**Solution:**
- Check internet connection
- Verify AUTO_RECONNECT=true in .env
- Monitor system logs for errors
- Ensure mobile phone has internet

### Issue: Rate Limit Errors

**Solution:**
- Reduce RATE_LIMIT in .env
- Increase delay between messages
- Avoid sending too many messages quickly

## Security Best Practices

1. **Environment Variables**
   - Never commit .env file to version control
   - Use secret management tools in production
   - Rotate API keys regularly

2. **Session Security**
   - Protect `.wwebjs_auth/` directory
   - Use file permissions: `chmod 700 .wwebjs_auth/`
   - Backup session data securely

3. **API Security**
   - Use HTTPS for all webhook endpoints
   - Validate webhook payloads
   - Implement request signing

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Contact: support@example.com

---

**Built with ❤️ by MiniMax Agent**
