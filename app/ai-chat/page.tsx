'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { useChatWithAIMutation, useGetConversationHistoryQuery } from '@/lib/api/aiApi';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
  action?: string;
}

export default function AIChatPage() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Get user data from Redux
  const user = useSelector((state: RootState) => state.auth.user);
  const userId = user?._id || user?.id;

  // API hooks
  const [chatWithAI, { isLoading: isChatting }] = useChatWithAIMutation();
  const { data: historyData, isLoading: isLoadingHistory } = useGetConversationHistoryQuery(
    { userId: userId! },
    { skip: !userId }
  );

  // Load conversation history
  useEffect(() => {
    if (historyData?.data?.messages) {
      const formattedMessages: Message[] = historyData.data.messages.map(msg => ({
        id: msg.id,
        type: msg.type as 'user' | 'ai',
        content: msg.content,
        timestamp: msg.timestamp,
        action: msg.action,
      }));
      setMessages(formattedMessages);
    }
  }, [historyData]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim() || !userId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    const currentMessage = message;
    setMessage('');

    try {
      const response = await chatWithAI({
        message: currentMessage,
        user_id: userId,
        session_id: 'default', // or generate unique session
      }).unwrap();

      const aiMessage: Message = {
        id: Date.now().toString() + '_ai',
        type: 'ai',
        content: response.message,
        timestamp: response.timestamp,
        action: response.action,
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error: any) {
      console.error('Chat error:', error);

      const errorMessage: Message = {
        id: Date.now().toString() + '_error',
        type: 'ai',
        content: 'عذراً، حدث خطأ في الاتصال. يرجى المحاولة لاحقاً.',
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!userId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <p className="text-center text-gray-600">
              يرجى تسجيل الدخول أولاً لاستخدام المساعد الذكي
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4">
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-blue-600" />
            المساعد الذكي - مراسيل
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            {isLoadingHistory ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="mr-2">جاري تحميل المحادثة...</span>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Bot className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">مرحباً بك في المساعد الذكي!</h3>
                <p className="text-gray-600 max-w-md">
                  يمكنني مساعدتك في إدارة شحناتك. جرب أن تسألني عن:
                </p>
                <div className="mt-4 text-sm text-gray-500 space-y-1">
                  <p>• "كم رصيد محفظتي؟"</p>
                  <p>• "أريد إنشاء شحنة جديدة"</p>
                  <p>• "تتبع الشحنة رقم 123456"</p>
                  <p>• "عرض شحناتي"</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${
                      msg.type === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`flex gap-3 max-w-[80%] ${
                        msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                      }`}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className={
                          msg.type === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-green-600 text-white'
                        }>
                          {msg.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                        </AvatarFallback>
                      </Avatar>

                      <div
                        className={`rounded-lg px-4 py-2 ${
                          msg.type === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        {msg.action && msg.action !== 'CHAT_RESPONSE' && (
                          <span className="text-xs opacity-75 mt-1 block">
                            عملية: {msg.action}
                          </span>
                        )}
                        <span className="text-xs opacity-50 block mt-1">
                          {new Date(msg.timestamp).toLocaleTimeString('ar-SA')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {isChatting && (
                  <div className="flex gap-3 justify-start">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-green-600 text-white">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-gray-100 rounded-lg px-4 py-2">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm text-gray-600">جاري التفكير...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="اكتب رسالتك هنا..."
                className="flex-1"
                disabled={isChatting}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim() || isChatting}
                size="icon"
              >
                {isChatting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
