import { SupabaseClient } from '@supabase/supabase-js';
import { Client } from 'whatsapp-web.js';
import cron from 'node-cron';
import axios from 'axios';

export class AutomationProcessor {
  private supabase: SupabaseClient;
  private client: Client;
  private scheduledTasks: Map<string, cron.ScheduledTask> = new Map();
  private isRunning: boolean = false;

  constructor(supabase: SupabaseClient, client: Client) {
    this.supabase = supabase;
    this.client = client;
  }

  /**
   * Start automation processor
   */
  public start() {
    console.log('🤖 Starting Automation Processor...');
    this.isRunning = true;
    
    // Load and schedule all active rules
    this.loadAutomationRules();

    // Poll for new rules every 5 minutes
    setInterval(() => {
      if (this.isRunning) {
        this.loadAutomationRules();
      }
    }, 300000);
  }

  /**
   * Stop automation processor
   */
  public stop() {
    console.log('🛑 Stopping Automation Processor...');
    this.isRunning = false;
    
    // Stop all scheduled tasks
    this.scheduledTasks.forEach(task => task.stop());
    this.scheduledTasks.clear();
  }

  /**
   * Load automation rules from database
   */
  private async loadAutomationRules() {
    try {
      const { data: rules, error } = await this.supabase
        .from('automation_rules')
        .select('*')
        .eq('is_active', true)
        .order('priority', { ascending: false });

      if (error) {
        console.error('Error loading automation rules:', error);
        return;
      }

      console.log(`📋 Loaded ${rules?.length || 0} active automation rules`);

      // Process time-based and event-based rules
      rules?.forEach(rule => {
        if (rule.trigger_type === 'schedule') {
          this.scheduleRule(rule);
        } else if (rule.trigger_type === 'event') {
          // Event-based rules are triggered by specific system events
          console.log(`📌 Event-based rule registered: ${rule.name}`);
        }
      });

    } catch (error) {
      console.error('Error in loadAutomationRules:', error);
    }
  }

  /**
   * Schedule time-based automation rule
   */
  private scheduleRule(rule: any) {
    const ruleId = rule.id.toString();
    
    // Stop existing scheduled task if any
    if (this.scheduledTasks.has(ruleId)) {
      this.scheduledTasks.get(ruleId)!.stop();
      this.scheduledTasks.delete(ruleId);
    }

    // Get cron expression from trigger conditions
    const cronExpression = rule.trigger_conditions.cron;
    
    if (!cronExpression) {
      console.warn(`⚠️  Rule ${rule.name} has no cron expression`);
      return;
    }

    // Validate cron expression
    if (!cron.validate(cronExpression)) {
      console.error(`❌ Invalid cron expression for rule ${rule.name}: ${cronExpression}`);
      return;
    }

    // Schedule task
    const task = cron.schedule(cronExpression, async () => {
      console.log(`⏰ Executing scheduled rule: ${rule.name}`);
      await this.executeRule(rule);
    });

    this.scheduledTasks.set(ruleId, task);
    console.log(`✅ Scheduled rule: ${rule.name} (${cronExpression})`);
  }

  /**
   * Execute automation rule
   */
  private async executeRule(rule: any) {
    try {
      console.log(`🎯 Executing rule: ${rule.name}`);
      
      const actionType = rule.action_type;
      const actionConfig = rule.action_config;

      switch (actionType) {
        case 'send_message':
          await this.executeSendMessage(actionConfig);
          break;

        case 'update_contact':
          await this.executeUpdateContact(actionConfig);
          break;

        case 'create_lead':
          await this.executeCreateLead(actionConfig);
          break;

        case 'trigger_webhook':
          await this.executeTriggerWebhook(actionConfig);
          break;

        case 'send_bulk_message':
          await this.executeSendBulkMessage(actionConfig);
          break;

        default:
          console.warn(`⚠️  Unknown action type: ${actionType}`);
      }

      // Update rule execution count
      await this.supabase
        .from('automation_rules')
        .update({
          run_count: rule.run_count + 1,
          last_run: new Date().toISOString()
        })
        .eq('id', rule.id);

      console.log(`✅ Rule executed successfully: ${rule.name}`);

    } catch (error) {
      console.error(`❌ Error executing rule ${rule.name}:`, error);
    }
  }

  /**
   * Execute send message action
   */
  private async executeSendMessage(config: any) {
    const { phone, message } = config;
    
    if (!phone || !message) {
      console.warn('⚠️  Missing phone or message in send_message config');
      return;
    }

    await this.client.sendMessage(`${phone}@c.us`, message);
    console.log(`📤 Message sent to ${phone}`);
  }

  /**
   * Execute update contact action
   */
  private async executeUpdateContact(config: any) {
    const { contact_id, updates } = config;
    
    if (!contact_id || !updates) {
      console.warn('⚠️  Missing contact_id or updates in update_contact config');
      return;
    }

    await this.supabase
      .from('contacts')
      .update(updates)
      .eq('id', contact_id);

    console.log(`📝 Contact ${contact_id} updated`);
  }

  /**
   * Execute create lead action
   */
  private async executeCreateLead(config: any) {
    const { name, phone, email, source } = config;
    
    if (!name || !phone) {
      console.warn('⚠️  Missing required fields in create_lead config');
      return;
    }

    // Create contact first
    const { data: contact } = await this.supabase
      .from('contacts')
      .insert({
        name,
        phone,
        email: email || null,
        source: source || 'automation',
        status: 'new',
        lead_score: 0
      })
      .select()
      .single();

    // Create lead
    await this.supabase
      .from('leads')
      .insert({
        name,
        phone,
        email: email || null,
        source: source || 'automation',
        status: 'new',
        lead_score: 50
      });

    console.log(`🎯 Lead created: ${name} (${phone})`);
  }

  /**
   * Execute trigger webhook action
   */
  private async executeTriggerWebhook(config: any) {
    const { url, method = 'POST', headers = {}, body = {} } = config;
    
    if (!url) {
      console.warn('⚠️  Missing URL in trigger_webhook config');
      return;
    }

    try {
      const response = await axios({
        method,
        url,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        data: body
      });

      console.log(`🔗 Webhook triggered: ${url} (Status: ${response.status})`);
    } catch (error: any) {
      console.error(`❌ Webhook failed: ${url}`, error.message);
    }
  }

  /**
   * Execute send bulk message action
   */
  private async executeSendBulkMessage(config: any) {
    const { tag, message, delay = 5000 } = config;
    
    if (!tag || !message) {
      console.warn('⚠️  Missing tag or message in send_bulk_message config');
      return;
    }

    // Get contacts with specific tag
    const { data: contacts } = await this.supabase
      .from('contacts')
      .select('phone')
      .contains('tags', [tag])
      .eq('status', 'active');

    if (!contacts || contacts.length === 0) {
      console.log(`📭 No contacts found with tag: ${tag}`);
      return;
    }

    console.log(`📢 Sending bulk message to ${contacts.length} contacts with tag: ${tag}`);

    // Send messages with delay
    for (const contact of contacts) {
      try {
        await this.client.sendMessage(`${contact.phone}@c.us`, message);
        console.log(`✅ Sent to ${contact.phone}`);
        
        // Delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, delay));
      } catch (error) {
        console.error(`❌ Failed to send to ${contact.phone}:`, error);
      }
    }

    console.log('✅ Bulk message sending completed');
  }

  /**
   * Process event-based rule trigger
   */
  public async processEventTrigger(eventType: string, eventData: any) {
    try {
      const { data: rules } = await this.supabase
        .from('automation_rules')
        .select('*')
        .eq('is_active', true)
        .eq('trigger_type', 'event');

      if (!rules) return;

      // Filter rules matching the event type
      const matchingRules = rules.filter(rule => 
        rule.trigger_conditions.event_type === eventType
      );

      // Execute matching rules
      for (const rule of matchingRules) {
        await this.executeRule(rule);
      }

    } catch (error) {
      console.error('Error processing event trigger:', error);
    }
  }

  /**
   * Process lead scoring updates
   */
  public async processLeadScoring(contactId: string, action: string) {
    try {
      const { data: contact } = await this.supabase
        .from('contacts')
        .select('lead_score')
        .eq('id', contactId)
        .single();

      if (!contact) return;

      let scoreChange = 0;

      // Define scoring rules
      switch (action) {
        case 'message_sent':
          scoreChange = 5;
          break;
        case 'message_replied':
          scoreChange = 10;
          break;
        case 'website_visit':
          scoreChange = 15;
          break;
        case 'form_submitted':
          scoreChange = 20;
          break;
        case 'email_opened':
          scoreChange = 3;
          break;
        default:
          scoreChange = 0;
      }

      if (scoreChange > 0) {
        const newScore = Math.min(contact.lead_score + scoreChange, 100);

        await this.supabase
          .from('contacts')
          .update({ lead_score: newScore })
          .eq('id', contactId);

        console.log(`📊 Lead score updated for ${contactId}: ${contact.lead_score} → ${newScore}`);
      }

    } catch (error) {
      console.error('Error processing lead scoring:', error);
    }
  }
}
