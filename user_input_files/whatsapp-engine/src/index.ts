import { Client, LocalAuth, Message as WAMessage } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import { createClient } from '@supabase/supabase-js';
import { MessageHandler } from './MessageHandler';
import { AutomationProcessor } from './AutomationProcessor';
import dotenv from 'dotenv';
import cron from 'node-cron';

dotenv.config();

class WhatsAppAutomationEngine {
  private client: Client;
  private supabase: ReturnType<typeof createClient>;
  private messageHandler: MessageHandler;
  private automationProcessor: AutomationProcessor;
  private isReady: boolean = false;

  constructor() {
    // Initialize WhatsApp Web client
    this.client = new Client({
      authStrategy: new LocalAuth({
        dataPath: process.env.SESSION_PATH || './.wwebjs_auth'
      }),
      puppeteer: {
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ]
      }
    });

    // Initialize Supabase client
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    );

    // Initialize handlers
    this.messageHandler = new MessageHandler(this.supabase, this.client);
    this.automationProcessor = new AutomationProcessor(this.supabase, this.client);

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    // QR Code generation for authentication
    this.client.on('qr', (qr: string) => {
      console.log('📱 Scan this QR code with your WhatsApp mobile app:');
      qrcode.generate(qr, { small: true });
      console.log('\\nQR Code: ', qr);
    });

    // Client ready event
    this.client.on('ready', async () => {
      console.log('✅ WhatsApp Web Client is ready!');
      this.isReady = true;
      
      // Update system status in database
      await this.updateSystemStatus('active');
      
      // Start automation processor
      this.automationProcessor.start();
      
      // Schedule analytics update
      this.scheduleAnalyticsUpdate();
    });

    // Authentication success
    this.client.on('authenticated', () => {
      console.log('🔐 Authentication successful!');
    });

    // Authentication failure
    this.client.on('auth_failure', (msg: string) => {
      console.error('❌ Authentication failed:', msg);
      this.updateSystemStatus('error');
    });

    // Client disconnected
    this.client.on('disconnected', async (reason: string) => {
      console.log('⚠️  Client disconnected:', reason);
      this.isReady = false;
      await this.updateSystemStatus('disconnected');
      
      // Auto-reconnect if enabled
      if (process.env.AUTO_RECONNECT === 'true') {
        console.log('🔄 Attempting to reconnect...');
        setTimeout(() => this.client.initialize(), 5000);
      }
    });

    // Incoming message handler
    this.client.on('message', async (message: WAMessage) => {
      try {
        await this.messageHandler.handleIncomingMessage(message);
      } catch (error) {
        console.error('Error handling message:', error);
      }
    });

    // Message acknowledgment (for delivery status)
    this.client.on('message_ack', async (message: WAMessage, ack: number) => {
      await this.messageHandler.updateMessageStatus(message.id.id, ack);
    });
  }

  private async updateSystemStatus(status: string) {
    try {
      await this.supabase
        .from('system_status')
        .upsert({
          id: 1,
          status,
          last_update: new Date().toISOString(),
          is_connected: status === 'active'
        });
    } catch (error) {
      console.error('Error updating system status:', error);
    }
  }

  private scheduleAnalyticsUpdate() {
    // Update analytics every hour
    cron.schedule('0 * * * *', async () => {
      console.log('📊 Updating analytics...');
      await this.updateAnalytics();
    });

    // Update daily summary at midnight
    cron.schedule('0 0 * * *', async () => {
      console.log('📈 Generating daily analytics summary...');
      await this.generateDailySummary();
    });
  }

  private async updateAnalytics() {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Count messages sent today
      const { count: messagesSent } = await this.supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('direction', 'outgoing')
        .gte('created_at', `${today}T00:00:00`);

      // Count messages received today
      const { count: messagesReceived } = await this.supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('direction', 'incoming')
        .gte('created_at', `${today}T00:00:00`);

      // Count responses (outgoing messages with response_to field)
      const { count: responsesCount } = await this.supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('direction', 'outgoing')
        .not('response_text', 'is', null)
        .gte('created_at', `${today}T00:00:00`);

      // Count leads generated today
      const { count: leadsGenerated } = await this.supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', `${today}T00:00:00`);

      // Count conversions today
      const { count: conversionCount } = await this.supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'converted')
        .gte('updated_at', `${today}T00:00:00`);

      // Calculate conversion rate
      const conversionRate = leadsGenerated ? (conversionCount! / leadsGenerated! * 100) : 0;

      // Count active contacts
      const { count: activeContacts } = await this.supabase
        .from('contacts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      // Upsert analytics data
      await this.supabase
        .from('analytics')
        .upsert({
          date: today,
          messages_sent: messagesSent || 0,
          messages_received: messagesReceived || 0,
          responses_count: responsesCount || 0,
          leads_generated: leadsGenerated || 0,
          conversion_count: conversionCount || 0,
          conversion_rate: conversionRate,
          active_contacts: activeContacts || 0,
          updated_at: new Date().toISOString()
        });

      console.log(`✅ Analytics updated for ${today}`);
    } catch (error) {
      console.error('Error updating analytics:', error);
    }
  }

  private async generateDailySummary() {
    // Generate and store daily summary report
    console.log('Generating daily summary report...');
    // Implementation: Create summary report and optionally send via WhatsApp/Email
  }

  public async start() {
    console.log('🚀 Starting WhatsApp Automation Engine...');
    console.log('📍 Environment:', {
      supabaseUrl: process.env.SUPABASE_URL,
      sessionPath: process.env.SESSION_PATH,
      autoReconnect: process.env.AUTO_RECONNECT
    });

    try {
      await this.client.initialize();
    } catch (error) {
      console.error('❌ Failed to initialize client:', error);
      process.exit(1);
    }
  }

  public async stop() {
    console.log('🛑 Stopping WhatsApp Automation Engine...');
    this.automationProcessor.stop();
    await this.updateSystemStatus('stopped');
    await this.client.destroy();
    process.exit(0);
  }
}

// Start the engine
const engine = new WhatsAppAutomationEngine();
engine.start();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\\n🛑 Received SIGINT, shutting down gracefully...');
  await engine.stop();
});

process.on('SIGTERM', async () => {
  console.log('\\n🛑 Received SIGTERM, shutting down gracefully...');
  await engine.stop();
});

export default WhatsAppAutomationEngine;
