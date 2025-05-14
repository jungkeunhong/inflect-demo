"use client"

import type React from "react"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ChatMessage from "./chat-message"
import ChatInput from "./chat-input"
import type { Message } from "@/lib/types"
import { MessageSquare, Play } from "lucide-react"

interface ChatInterfaceProps {
  activeTab: "build" | "test"
  onTabChange: (tab: "build" | "test") => void
  messages: Message[]
  onSendMessage: (content: string) => void
}

export default function ChatInterface({ activeTab, onTabChange, messages, onSendMessage }: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      onSendMessage(inputValue)
      setInputValue("")
    }
  }

  return (
    <div className="flex flex-col w-1/3 border-r border-gray-200 h-screen max-h-screen">
      <Tabs
        defaultValue={activeTab}
        value={activeTab}
        onValueChange={(value) => onTabChange(value as "build" | "test")}
        className="w-full h-full flex flex-col"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="build" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Build Agent
          </TabsTrigger>
          <TabsTrigger value="test" className="flex items-center gap-2">
            <Play className="h-4 w-4" />
            Test Agent
          </TabsTrigger>
        </TabsList>

        <TabsContent value="build" className="flex-1 flex flex-col overflow-hidden h-[calc(100vh-50px)]">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} variant="build" />
            ))}
          </div>
          <ChatInput value={inputValue} onChange={setInputValue} onSubmit={handleSubmit} variant="build" />
        </TabsContent>

        <TabsContent value="test" className="flex-1 flex flex-col overflow-hidden h-[calc(100vh-50px)]">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} variant="test" />
            ))}
          </div>
          <ChatInput value={inputValue} onChange={setInputValue} onSubmit={handleSubmit} variant="test" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
