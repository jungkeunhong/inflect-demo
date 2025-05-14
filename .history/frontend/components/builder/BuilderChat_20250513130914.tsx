"use client"

import { useState } from "react"
import { ChatCard, Message } from "@/components/ui/chat-card"

const CURRENT_USER = {
  name: "You",
  avatar: "https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-04-uuYHWIRvVPi01gEt6NwnGyjqLeeZhz.png"
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    content: "Hi! What kind of churn prevention agent would you like to build?",
    sender: {
      name: "Agent",
      avatar: "https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-03-n0x8HFv8EUetf9z6ht0wScJKoTHqf8.png",
      isOnline: true,
    },
    timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true }),
    status: "read",
  }
]

export function BuilderChat() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)

  const handleSendMessage = (message: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      content: message,
      sender: {
        ...CURRENT_USER,
        isOnline: true,
        isCurrentUser: true,
      },
      timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true }),
      status: "sent",
    }
    setMessages((prev) => [...prev, userMsg])
    // (Optional) Add auto-reply or API integration here
  }

  return (
    <div className="flex justify-center mt-8">
      <ChatCard
        chatName="Builder Chat"
        membersCount={2}
        onlineCount={1}
        initialMessages={messages}
        currentUser={CURRENT_USER}
        onSendMessage={handleSendMessage}
        theme="dark"
      />
    </div>
  )
}