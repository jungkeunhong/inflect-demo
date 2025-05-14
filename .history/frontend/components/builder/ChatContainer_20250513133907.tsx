"use client";

import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatUI, type ChatUIProps } from '@/components/chat-ui'; 
import { type Message } from "@/lib/types";

export interface ChatContainerProps {
  initialMessages?: Message[];
  onSendMessage: (messageContent: string) => Promise<void>; 
  placeholder?: string;
  className?: string; 
  chatUIClassName?: string; 
}

export function ChatContainer({
  initialMessages = [],
  onSendMessage, 
  placeholder = "Ask anything...",
  className,
  chatUIClassName,
}: ChatContainerProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
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
    <div className={className}>
      <ChatUI
        messages={messages}
        input={input}
        onInputChange={handleInputChange}
        onSubmit={handleFormSubmit}
        isLoading={isLoading}
        placeholder={placeholder}
        className={chatUIClassName} 
      />
    </div>
  );
}