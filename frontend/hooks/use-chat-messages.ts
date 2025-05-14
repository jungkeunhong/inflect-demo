import { useState } from "react"
import { v4 as uuidv4 } from 'uuid'
import { Message } from "@/lib/types"
import { sendChatMessage } from "@/lib/api"

export function useChatMessages() {
  // Initialize with welcome message
  const welcomeMessage: Message = {
    id: uuidv4(),
    role: "assistant",
    content: "Hi! Tell me what you want to automate, and I'll build an agent for you.",
    createdAt: new Date(),
  }
  
  const [messages, setMessages] = useState<Message[]>([welcomeMessage])

  // Process an initial message (used for URL parameters)
  const processInitialMessage = async (message: string) => {
    // Skip empty messages
    if (!message || !message.trim()) {
      return
    }
    
    // Add user message
    setMessages(prev => [...prev, { 
      id: uuidv4(), 
      role: "user", 
      content: message, 
      createdAt: new Date() 
    }])
    
    // Add thinking message
    const thinkingMessageId = uuidv4()
    setMessages(prev => [...prev, { 
      id: thinkingMessageId, 
      role: "assistant", 
      content: "...", 
      createdAt: new Date() 
    }])
    
    try {
      // Process message and update with streaming response
      const response = await sendChatMessage(message)
      let responseText = ""
      const reader = response.getReader()
      const decoder = new TextDecoder()
      let buffer = ""
      
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split("\n")
        buffer = lines.pop() || ""
        
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6))
              if (data.output) {
                responseText += data.output
                setMessages((prev) => prev.map((msg) =>
                  msg.id === thinkingMessageId ? { ...msg, content: responseText } : msg
                ))
              }
            } catch (e) {
              console.error("Error parsing stream data:", e)
            }
          }
        }
      }
    } catch (error) {
      console.error("Error processing message:", error)
      setMessages((prev) => prev.map((msg) =>
        msg.id === thinkingMessageId ? { 
          ...msg, 
          content: "Sorry, there was an error processing your request. Please try again." 
        } : msg
      ))
    }
  }

  // Stream a response from the backend
  const streamResponse = async (
    input: string, 
    thinkingMessageId: string
  ): Promise<string> => {
    try {
      const response = await sendChatMessage(input)
      let responseText = ""
      const reader = response.getReader()
      const decoder = new TextDecoder()
      let buffer = ""
      
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split("\n")
        buffer = lines.pop() || ""
        
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6))
              if (data.output) {
                responseText += data.output
                setMessages((prev) => prev.map((msg) =>
                  msg.id === thinkingMessageId ? { ...msg, content: responseText } : msg
                ))
              }
            } catch {}
          }
        }
      }
      
      return responseText
    } catch (error) {
      console.error("Error streaming response:", error)
      setMessages((prev) => prev.map((msg) =>
        msg.id === thinkingMessageId ? { 
          ...msg, 
          content: "Sorry, there was an error processing your request. Please try again." 
        } : msg
      ))
      return ""
    }
  }

  // Add a user message and thinking indicator
  const addUserMessageWithThinking = (input: string): { 
    userMessageId: string, 
    thinkingMessageId: string 
  } => {
    const userMessageId = uuidv4()
    const userMessage: Message = {
      id: userMessageId,
      role: "user",
      content: input,
      createdAt: new Date()
    }
    
    const thinkingMessageId = uuidv4()
    const thinkingMessage: Message = {
      id: thinkingMessageId,
      role: "assistant",
      content: "...",
      createdAt: new Date()
    }
    
    setMessages(prev => [...prev, userMessage, thinkingMessage])
    
    return {
      userMessageId,
      thinkingMessageId
    }
  }

  return {
    messages,
    setMessages,
    processInitialMessage,
    streamResponse,
    addUserMessageWithThinking
  }
} 