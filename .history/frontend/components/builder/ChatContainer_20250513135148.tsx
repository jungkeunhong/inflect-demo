"use client";

import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatUI } from '@/components/chat-ui'; 
import { type Message } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ChatContainerProps {
  initialMessages?: Message[];
  onSendMessage: (messageContent: string) => Promise<void>; 
  placeholder?: string;
  chatUIClassName?: string; 
  chatCardClassName?: string; 
  chatToggleButtonClassName?: string;
  initialChatOpen?: boolean;
  chatHeaderText?: string;
}

export function ChatContainer({
  initialMessages = [],
  onSendMessage, 
  placeholder = "Ask anything...",
  className, 
  chatUIClassName,
  chatCardClassName,
  chatToggleButtonClassName,
  initialChatOpen = true, 
  chatHeaderText = "Internal Agent Builder"
}: ChatContainerProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatOpen, setChatOpen] = useState(initialChatOpen);

  useEffect(() => {
    // Logic for persisting chatOpen state can be added here if needed
  }, []); 

  const handleInputChange = (value: string) => {
    setInput(value);
  };

  const addUserMessage = (content: string) => {
    const newMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content,
      createdAt: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    return newMessage;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userInput = input;
    addUserMessage(userInput); 
    setInput(""); 
    setIsLoading(true);

    try {
      await onSendMessage(userInput);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again.',
        createdAt: new Date(),
        type: 'error', 
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
    setIsLoading(false);
  };

  // addAssistantMessage is available if parent needs to push messages after onSendMessage resolves,
  // though typically onSendMessage in parent would update the state that flows into initialMessages or similar.
  const addAssistantMessage = (content: string, type?: Message['type'], meta?: Message['meta']) => {
    const newMessage: Message = {
      id: uuidv4(),
      role: 'assistant',
      content,
      createdAt: new Date(),
      type,
      meta
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  return (
    <div className={cn("fixed bottom-6 right-6 z-50 flex flex-col items-end", className)}>
      {chatOpen && (
        <Card className={cn("w-full min-w-[350px] max-w-sm mb-4 shadow-xl animate-in fade-in zoom-in-95 h-[600px] min-h-[600px] flex flex-col", chatCardClassName)}>
          <div className="flex justify-between items-center p-3 border-b">
            <span className="font-semibold text-base">{chatHeaderText}</span>
            <Button variant="ghost" size="icon" onClick={() => setChatOpen(false)} aria-label="Close chat">
              {/* Using a simple times icon for close */}
              <span className="text-2xl leading-none select-none">&times;</span>
            </Button>
          </div>
          <div className="p-3 flex-1">
            <ChatUI
              messages={messages}
              input={input}
              onInputChange={handleInputChange}
              onSubmit={handleFormSubmit}
              isLoading={isLoading}
              placeholder={placeholder}
              className={cn("h-full flex flex-col", chatUIClassName)} 
            />
          </div>
        </Card>
      )}
      <Button
        className={cn("rounded-full w-12 h-12 shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-transform", chatToggleButtonClassName)}
        onClick={() => setChatOpen((v) => !v)}
        aria-label={chatOpen ? "Minimize chat" : "Open chat"}
      >
        <span className="text-xl">💬</span>
      </Button>
    </div>
  );
}