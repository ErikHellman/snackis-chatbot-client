import { useState, useEffect, useRef, useCallback } from "react";
import { ChatHeader } from "./ChatHeader";
import { ChatMessage, Message } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { MessageCircle, Sparkles } from "lucide-react";

// Mock AI responses for demonstration
const mockResponses = [
  "I'm here to help! What would you like to know?",
  "That's a great question! Let me think about that for a moment.",
  "I understand what you're asking. Here's what I think...",
  "That's really interesting! I'd love to explore that topic with you.",
  "I'm happy to help you with that. Let me break it down for you.",
  "Thank you for sharing that with me. Here's my perspective...",
  "I see what you mean. Let me offer some insights on that.",
  "That's a wonderful way to think about it! Here's what I would add...",
  "I appreciate you asking. This is something I find quite fascinating.",
  "Great point! I think there are several ways to approach this...",
];

const welcomeMessages: Message[] = [
  {
    id: "welcome",
    content: "Hello! I'm FriendlyBot, your AI companion. I'm here to chat, help, and make your day a little brighter. What would you like to talk about today?",
    isUser: false,
    timestamp: new Date(),
  },
];

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>(welcomeMessages);
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load messages from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem("friendlybot-messages");
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        })));
      } catch (error) {
        console.error("Failed to load saved messages:", error);
      }
    }
  }, []);

  // Save messages to localStorage when they change
  useEffect(() => {
    if (messages.length > welcomeMessages.length) {
      localStorage.setItem("friendlybot-messages", JSON.stringify(messages));
    }
  }, [messages]);

  // Auto scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const generateAIResponse = useCallback((): string => {
    return mockResponses[Math.floor(Math.random() * mockResponses.length)];
  }, []);

  const handleSendMessage = useCallback(async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate AI thinking time
    const thinkingTime = Math.random() * 2000 + 1000; // 1-3 seconds
    
    setTimeout(() => {
      const aiResponse: Message = {
        id: `ai-${Date.now()}`,
        content: generateAIResponse(),
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, thinkingTime);
  }, [generateAIResponse]);

  const handleClearChat = useCallback(() => {
    setMessages(welcomeMessages);
    localStorage.removeItem("friendlybot-messages");
  }, []);

  const isEmpty = messages.length === welcomeMessages.length;

  return (
    <div className="flex h-screen flex-col bg-gradient-main">
      <ChatHeader onClearChat={handleClearChat} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <ScrollArea className="flex-1" ref={scrollAreaRef}>
          <div className="mx-auto max-w-4xl">
            {/* Welcome Section */}
            {isEmpty && (
              <div className="flex flex-col items-center justify-center p-8 text-center space-y-6">
                <div className="relative">
                  <div className="h-20 w-20 rounded-full bg-gradient-user flex items-center justify-center shadow-lg">
                    <Sparkles className="h-8 w-8 text-chat-user-foreground" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-accent border-2 border-background flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse-soft" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Welcome to FriendlyBot
                  </h2>
                  <p className="text-muted-foreground max-w-md">
                    Your safe, friendly AI companion. I'm here to chat, answer questions, 
                    and help make your day better. What's on your mind?
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {[
                    "Tell me a joke",
                    "What's the weather like?",
                    "Help me brainstorm",
                    "Let's have a conversation"
                  ].map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSendMessage(suggestion)}
                      className="rounded-full border-border hover:bg-secondary transition-colors"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <ChatMessage
                message={{
                  id: "typing",
                  content: "",
                  isUser: false,
                  timestamp: new Date(),
                }}
                isTyping
              />
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
      </div>
    </div>
  );
}