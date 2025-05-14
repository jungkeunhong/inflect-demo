"use client"

import React, { useState, useRef, useEffect } from "react";
import { Send, RefreshCw, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { type Message } from "@/lib/types";

export interface ChatUIProps {
  messages: Message[];
  input: string;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  placeholder?: string;
  className?: string;
  renderMessageContent?: (message: Message) => React.ReactNode | null;
}

export function ChatUI({
  messages,
  input,
  onInputChange,
  onSubmit,
  isLoading,
  placeholder = "Send a message...",
  className,
  renderMessageContent,
}: ChatUIProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isComposing, setIsComposing] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isComposing && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        const mockEvent = { preventDefault: () => {} } as React.FormEvent;
        onSubmit(mockEvent);
      }
    }
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const customContent = renderMessageContent ? renderMessageContent(msg) : null;
          return (
            <div
              key={msg.id}
              className={cn(
                "flex items-end gap-2",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {msg.role === "assistant" && (
                <Bot className="w-6 h-6 text-muted-foreground self-start flex-shrink-0" />
              )}
              <Card
                className={cn(
                  "p-3 rounded-lg max-w-[85%] break-words shadow-sm",
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {customContent !== null ? (
                  customContent
                ) : (
                  <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                )}
              </Card>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={onSubmit} className="p-4 border-t bg-background">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
            placeholder={placeholder}
            className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none disabled:opacity-50"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !input.trim()} className="px-4 py-2">
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
