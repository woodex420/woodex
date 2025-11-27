import { useState, useEffect } from 'react';
import { MessageCircle, X, Send, Paperclip, Phone, Video, Clock } from 'lucide-react';

interface WhatsAppWidgetProps {
  customerPhone?: string;
  customerName?: string;
  customerId?: string;
}

interface QuickAction {
  id: string;
  label: string;
  message: string;
  icon: string;
}

const WhatsAppWidget = ({ customerPhone, customerName, customerId }: WhatsAppWidgetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ text: string; sent: boolean; time: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const quickActions: QuickAction[] = [
    {
      id: 'product_inquiry',
      label: 'Ask about this product',
      message: 'I have a question about this product',
      icon: '💬'
    },
    {
      id: 'quote_request',
      label: 'Get a quote',
      message: 'I would like to request a quotation',
      icon: '📄'
    },
    {
      id: 'showroom_visit',
      label: 'Schedule showroom visit',
      message: 'I want to schedule a showroom visit',
      icon: '📅'
    },
    {
      id: 'live_support',
      label: 'Live support',
      message: 'I need immediate assistance',
      icon: '🆘'
    },
    {
      id: 'callback',
      label: 'Request callback',
      message: 'Please call me back',
      icon: '📞'
    }
  ];

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const newMessage = {
      text,
      sent: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');

    // Show typing indicator
    setIsTyping(true);

    try {
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
      const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

      // Track journey event
      await trackJourneyEvent('whatsapp_message_sent', {
        message: text,
        customer_id: customerId
      });

      // Send real message to backend
      const response = await fetch(`${supabaseUrl}/functions/v1/whatsapp-chat-messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'send_message',
          customer_id: customerId || generateGuestId(),
          message_content: text
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        // Add auto-reply from server
        if (result.data?.auto_reply) {
          setTimeout(() => {
            const autoResponse = {
              text: result.data.auto_reply,
              sent: false,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, autoResponse]);
            setIsTyping(false);
          }, 800);
        } else {
          setIsTyping(false);
        }
      } else {
        // Fallback auto-response on error
        setTimeout(() => {
          const autoResponse = {
            text: "Thank you for contacting WoodEx Furniture! Our team will respond shortly. For immediate assistance, call us at +92-300-1234567.",
            sent: false,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          setMessages(prev => [...prev, autoResponse]);
          setIsTyping(false);
        }, 800);
      }

    } catch (error) {
      console.error('Failed to send message:', error);
      // Fallback auto-response on error
      setTimeout(() => {
        const autoResponse = {
          text: "Thank you for contacting WoodEx Furniture! Our team will respond shortly. For immediate assistance, call us at +92-300-1234567.",
          sent: false,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, autoResponse]);
        setIsTyping(false);
      }, 800);
    }
  };

  const generateGuestId = () => {
    let guestId = sessionStorage.getItem('guest_customer_id');
    if (!guestId) {
      guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('guest_customer_id', guestId);
    }
    return guestId;
  };

  const handleQuickAction = (action: QuickAction) => {
    sendMessage(action.message);
  };

  const loadMessages = async () => {
    if (!customerId) return;

    try {
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
      const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

      const response = await fetch(`${SUPABASE_URL}/functions/v1/whatsapp-chat-messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'get_messages',
          customer_id: customerId,
          limit: 50
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.data?.messages) {
          const loadedMessages = result.data.messages.map((msg: any) => ({
            text: msg.content,
            sent: msg.direction === 'inbound',
            time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }));
          setMessages(loadedMessages);
        }
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  useEffect(() => {
    if (isOpen && customerId) {
      loadMessages();
    }
  }, [isOpen, customerId]);

  const trackJourneyEvent = async (eventType: string, eventData: any) => {
    try {
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
      const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

      await fetch(`${SUPABASE_URL}/functions/v1/whatsapp-journey-tracker`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customer_id: customerId || null,
          event_type: eventType,
          event_data: eventData,
          page_url: window.location.href,
          session_id: sessionStorage.getItem('session_id') || generateSessionId()
        })
      });
    } catch (error) {
      console.error('Failed to track journey event:', error);
    }
  };

  const generateSessionId = () => {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('session_id', sessionId);
    return sessionId;
  };

  useEffect(() => {
    // Initialize session
    if (!sessionStorage.getItem('session_id')) {
      generateSessionId();
    }
  }, []);

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            trackJourneyEvent('whatsapp_widget_opened', {});
          }}
          className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 z-50"
          aria-label="Open WhatsApp Chat"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
            1
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 bg-white rounded-lg shadow-2xl z-50 flex flex-col max-h-[600px]">
          {/* Header */}
          <div className="bg-green-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">WoodEx Support</h3>
                <p className="text-xs text-green-100">Typically replies in minutes</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-green-700 rounded-full p-1"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Quick Actions */}
          {messages.length === 0 && (
            <div className="p-4 border-b border-gray-200">
              <p className="text-sm text-gray-600 mb-3">How can we help you today?</p>
              <div className="space-y-2">
                {quickActions.map(action => (
                  <button
                    key={action.id}
                    onClick={() => handleQuickAction(action)}
                    className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm flex items-center gap-2"
                  >
                    <span>{action.icon}</span>
                    <span className="text-gray-700">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageCircle className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-gray-600 text-sm">Start a conversation with us!</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sent ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-lg px-4 py-2 ${
                      msg.sent
                        ? 'bg-green-500 text-white'
                        : 'bg-white text-gray-800 shadow'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.sent ? 'text-green-100' : 'text-gray-500'}`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))
            )}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white rounded-lg px-4 py-3 shadow">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
            <div className="flex items-center gap-2">
              <button className="text-gray-400 hover:text-gray-600">
                <Paperclip className="h-5 w-5" />
              </button>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage(message)}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                onClick={() => sendMessage(message)}
                className="bg-green-500 hover:bg-green-600 text-white rounded-lg p-2"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-4 mt-3">
              <button className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-800">
                <Phone className="h-4 w-4" />
                <span>Call Us</span>
              </button>
              <button className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-800">
                <Video className="h-4 w-4" />
                <span>Video Call</span>
              </button>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="h-4 w-4" />
                <span>9 AM - 6 PM</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WhatsAppWidget;
