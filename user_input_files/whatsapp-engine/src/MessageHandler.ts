import { SupabaseClient } from '@supabase/supabase-js';
import { Client, Message as WAMessage } from 'whatsapp-web.js';
import axios from 'axios';

export class MessageHandler {
  private supabase: SupabaseClient;
  private client: Client;
  private rateLimitQueue: Map<string, number[]> = new Map();
  private rateLimit: number;

  constructor(supabase: SupabaseClient, client: Client) {
    this.supabase = supabase;
    this.client = client;
    this.rateLimit = parseInt(process.env.RATE_LIMIT || '20');
  }

  /**
   * Handle incoming WhatsApp message
   */
  public async handleIncomingMessage(message: WAMessage) {
    try {
      console.log(`📥 Incoming message from ${message.from}: ${message.body}`);

      // Get or create contact
      const contact = await this.getOrCreateContact(message);

      // Store message in database
      const dbMessage = await this.storeMessage({
        contact_id: contact.id,
        message_text: message.body,
        direction: 'incoming',
        status: 'received',
        message_type: message.type,
        metadata: {
          whatsapp_id: message.id.id,
          timestamp: message.timestamp,
          from: message.from,
          hasMedia: message.hasMedia
        }
      });

      // Process automation rules
      const shouldAutoReply = await this.checkAutomationRules(message, contact);

      if (shouldAutoReply) {
        await this.generateAndSendResponse(message, contact, dbMessage.id);
      }

      // Update contact last_contact timestamp
      await this.updateContactActivity(contact.id);

    } catch (error) {
      console.error('Error handling incoming message:', error);
    }
  }

  /**
   * Get or create contact from WhatsApp message
   */
  private async getOrCreateContact(message: WAMessage) {
    const phone = message.from.replace('@c.us', '');
    
    // Try to get contact from WhatsApp
    const waContact = await message.getContact();
    const name = waContact.pushname || waContact.name || phone;

    // Check if contact exists in database
    const { data: existingContact } = await this.supabase
      .from('contacts')
      .select('*')
      .eq('phone', phone)
      .maybeSingle();

    if (existingContact) {
      return existingContact;
    }

    // Create new contact
    const { data: newContact, error } = await this.supabase
      .from('contacts')
      .insert({
        name,
        phone,
        source: 'whatsapp',
        status: 'new',
        lead_score: 0,
        tags: ['whatsapp-contact']
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating contact:', error);
      throw error;
    }

    console.log(`✅ Created new contact: ${name} (${phone})`);
    return newContact;
  }

  /**
   * Store message in database
   */
  private async storeMessage(messageData: any) {
    const { data, error } = await this.supabase
      .from('messages')
      .insert(messageData)
      .select()
      .single();

    if (error) {
      console.error('Error storing message:', error);
      throw error;
    }

    return data;
  }

  /**
   * Check automation rules and determine if auto-reply is needed
   */
  private async checkAutomationRules(message: WAMessage, contact: any): Promise<boolean> {
    const { data: rules } = await this.supabase
      .from('automation_rules')
      .select('*')
      .eq('is_active', true)
      .eq('trigger_type', 'keyword')
      .order('priority', { ascending: false });

    if (!rules || rules.length === 0) {
      return false;
    }

    // Check keyword matching
    const messageText = message.body.toLowerCase();
    
    for (const rule of rules) {
      const conditions = rule.trigger_conditions;
      const keywords = conditions.keywords || [];
      
      for (const keyword of keywords) {
        if (messageText.includes(keyword.toLowerCase())) {
          console.log(`🎯 Matched rule: ${rule.name} (keyword: ${keyword})`);
          
          // Update rule execution count
          await this.supabase
            .from('automation_rules')
            .update({
              run_count: rule.run_count + 1,
              last_run: new Date().toISOString()
            })
            .eq('id', rule.id);
          
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Generate AI response and send
   */
  private async generateAndSendResponse(
    message: WAMessage,
    contact: any,
    messageId: string
  ) {
    try {
      // Get conversation context (last 5 messages)
      const { data: context } = await this.supabase
        .from('messages')
        .select('message_text, direction')
        .eq('contact_id', contact.id)
        .order('created_at', { ascending: false })
        .limit(5);

      // Call AI Response Edge Function
      const response = await axios.post(
        `${process.env.SUPABASE_URL}/functions/v1/ai-response`,
        {
          message: message.body,
          context: context || []
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const aiResponse = response.data.response;

      // Send response via WhatsApp
      await this.sendMessage(message.from, aiResponse, contact.id, messageId);

    } catch (error) {
      console.error('Error generating AI response:', error);
      
      // Fallback to default response
      const fallbackMessage = "Thank you for your message! Our team will get back to you shortly.";
      await this.sendMessage(message.from, fallbackMessage, contact.id, messageId);
    }
  }

  /**
   * Send WhatsApp message with rate limiting
   */
  public async sendMessage(
    to: string,
    text: string,
    contactId?: string,
    responseToId?: string
  ): Promise<void> {
    try {
      // Check rate limit
      if (!this.checkRateLimit(to)) {
        console.warn(`⚠️  Rate limit exceeded for ${to}, queuing message`);
        setTimeout(() => this.sendMessage(to, text, contactId, responseToId), 60000);
        return;
      }

      // Send message via WhatsApp
      const sentMessage = await this.client.sendMessage(to, text);
      console.log(`📤 Message sent to ${to}: ${text.substring(0, 50)}...`);

      // Store in database
      await this.storeMessage({
        contact_id: contactId,
        message_text: text,
        direction: 'outgoing',
        status: 'sent',
        message_type: 'text',
        response_text: text,
        metadata: {
          whatsapp_id: sentMessage.id.id,
          timestamp: sentMessage.timestamp,
          to,
          response_to: responseToId
        }
      });

    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  /**
   * Check rate limit for phone number
   */
  private checkRateLimit(phone: string): boolean {
    const now = Date.now();
    const timestamps = this.rateLimitQueue.get(phone) || [];
    
    // Remove timestamps older than 1 minute
    const recentTimestamps = timestamps.filter(t => now - t < 60000);
    
    if (recentTimestamps.length >= this.rateLimit) {
      return false;
    }

    // Add current timestamp
    recentTimestamps.push(now);
    this.rateLimitQueue.set(phone, recentTimestamps);
    
    return true;
  }

  /**
   * Update message delivery status
   */
  public async updateMessageStatus(messageId: string, ack: number) {
    const statusMap: { [key: number]: string } = {
      1: 'sent',
      2: 'delivered',
      3: 'read',
      4: 'failed'
    };

    const status = statusMap[ack] || 'unknown';

    await this.supabase
      .from('messages')
      .update({ status })
      .eq('metadata->>whatsapp_id', messageId);
  }

  /**
   * Update contact's last activity timestamp
   */
  private async updateContactActivity(contactId: string) {
    await this.supabase
      .from('contacts')
      .update({
        last_contact: new Date().toISOString()
      })
      .eq('id', contactId);
  }

  /**
   * Send bulk messages (e.g., broadcast)
   */
  public async sendBulkMessages(
    contacts: Array<{ phone: string; message: string }>,
    delay: number = 5000
  ): Promise<void> {
    console.log(`📢 Sending bulk messages to ${contacts.length} contacts...`);
    
    for (const contact of contacts) {
      try {
        await this.sendMessage(`${contact.phone}@c.us`, contact.message);
        
        // Delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, delay));
      } catch (error) {
        console.error(`Error sending to ${contact.phone}:`, error);
      }
    }

    console.log('✅ Bulk message sending completed');
  }
}
