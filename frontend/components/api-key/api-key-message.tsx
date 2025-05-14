"use client"

import { useState, type FC } from "react"
import { ApiKeyInput } from "./api-key-input"
import { type Message } from "@/lib/types"

interface ApiKeyMessageProps {
  message: Message
  onSubmit?: (key: string, service: string) => void
}

export const ApiKeyMessage: FC<ApiKeyMessageProps> = ({ message, onSubmit }) => {
  const { meta } = message;
  const services = meta?.services || [];
  
  // API 키 컴포넌트 렌더링 직전에 상태 로깅
  console.log("[ApiKeyMessage] Rendering with services:", services);
  
  return (
    <div className="bg-background text-foreground rounded-lg p-4">
      <div className="mb-4">{message.content}</div>
      <div className="space-y-4">
        {services.map((service) => (
          <div key={service} className="w-full">
            <ApiKeyInput 
              service={service} 
              onSubmit={(key) => {
                console.log(`[ApiKeyMessage] API key for ${service} submitted`);
                onSubmit?.(key, service);
              }} 
            />
          </div>
        ))}
      </div>
    </div>
  )
} 