import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
  isTyping?: boolean;
}

export function ChatMessage({ message, isTyping = false }: ChatMessageProps) {
  const { content, isUser } = message;

  return (
    <div
      className={cn(
        "flex gap-3 p-4 animate-slide-up",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow-sm",
          isUser
            ? "bg-gradient-user text-chat-user-foreground"
            : "bg-gradient-ai text-chat-ai-foreground border border-border"
        )}
      >
        {isUser ? (
          <User className="h-4 w-4" />
        ) : (
          <Bot className="h-4 w-4" />
        )}
      </div>

      {/* Message Content */}
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 shadow-sm",
          isUser
            ? "bg-gradient-user text-chat-user-foreground rounded-br-md"
            : "bg-gradient-ai text-chat-ai-foreground rounded-bl-md border border-border"
        )}
      >
        <div
          className={cn(
            "text-sm leading-relaxed",
            isTyping && "animate-pulse-soft"
          )}
        >
          {isTyping ? (
            <div className="flex items-center gap-1">
              <span>Thinking</span>
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1 h-1 bg-current rounded-full animate-bounce"></div>
              </div>
            </div>
          ) : (
            content
          )}
        </div>
      </div>
    </div>
  );
}