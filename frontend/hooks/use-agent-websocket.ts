import { useEffect } from "react"
import { v4 as uuidv4 } from 'uuid'
import { Message, ExtendedAgent } from "@/lib/types"
import { agentWebSocket } from "@/lib/websocket"
import { toast } from "sonner"

// Message types
interface AgentResponseMessage {
  type: "agent_response"
  data: {
    agentId: string
    response: string
  }
}

interface AgentStatusMessage {
  type: "agent_status_update"
  data: {
    agentId: string
    status: "idle" | "running" | "completed" | "error"
  }
}

interface ErrorMessage {
  type: "error"
  data: {
    error: string
  }
}

type WebSocketMessage = AgentResponseMessage | AgentStatusMessage | ErrorMessage

// Check if a message is an agent response
function isAgentResponseMessage(message: any): message is AgentResponseMessage {
  return message.type === "agent_response" && 
         message.data && 
         typeof message.data.response === "string"
}

// Check if a message is a status update
function isAgentStatusMessage(message: any): message is AgentStatusMessage {
  return message.type === "agent_status_update" && 
         message.data && 
         typeof message.data.status === "string"
}

// Check if a message is an error
function isErrorMessage(message: any): message is ErrorMessage {
  return message.type === "error" && 
         message.data && 
         typeof message.data.error === "string"
}

interface UseAgentWebSocketProps {
  messages: Message[]
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  agents: ExtendedAgent[]
  setAgents: React.Dispatch<React.SetStateAction<ExtendedAgent[]>>
  setIsBuilding: React.Dispatch<React.SetStateAction<boolean>>
  setIsCreatingAgent: React.Dispatch<React.SetStateAction<boolean>>
}

export function useAgentWebSocket({
  messages,
  setMessages,
  agents,
  setAgents,
  setIsBuilding,
  setIsCreatingAgent
}: UseAgentWebSocketProps) {
  useEffect(() => {
    // Subscribe to WebSocket updates
    const unsubscribe = agentWebSocket.subscribe((message: any) => {
      if (isAgentResponseMessage(message)) {
        // Handle agent responses
        handleAgentResponse(message)
      } else if (isAgentStatusMessage(message)) {
        // Handle agent status updates
        handleAgentStatus(message)
      } else if (isErrorMessage(message)) {
        // Handle errors
        handleError(message)
      }
    })
    
    return () => {
      // Clean up on unmount
      if (unsubscribe) unsubscribe()
    }
  }, [messages, agents])

  // Handle agent responses (update chat messages)
  const handleAgentResponse = (message: AgentResponseMessage) => {
    setMessages((prev) => {
      // Find the most recent "..." thinking message
      const lastThinkingIndex = [...prev].reverse().findIndex(msg => 
        msg.role === "assistant" && msg.content === "..."
      )
      
      if (lastThinkingIndex >= 0) {
        // Replace the thinking message with the actual response
        const newMessages = [...prev]
        const actualIndex = prev.length - 1 - lastThinkingIndex
        newMessages[actualIndex] = {
          ...newMessages[actualIndex],
          content: message.data.response,
        }
        return newMessages
      } else {
        // If no thinking message found, add a new response
        return [...prev, {
          id: uuidv4(),
          role: "assistant",
          content: message.data.response,
          createdAt: new Date(),
        }]
      }
    })
  }

  // Handle agent status updates
  const handleAgentStatus = (message: AgentStatusMessage) => {
    // Update agent status in state
    setAgents((prevAgents) => {
      const updatedAgents = prevAgents.map((agent) => 
        agent.id === message.data.agentId 
          ? { ...agent, status: message.data.status }
          : agent
      )
      return updatedAgents
    })
    
    // If agent completes or errors, reset building states
    if (message.data.status === "completed" || message.data.status === "error") {
      setIsBuilding(false)
      setIsCreatingAgent(false)
    }
  }

  // Handle error messages
  const handleError = (message: ErrorMessage) => {
    // Show error toast
    toast.error(message.data.error)
    
    // Reset building states
    setIsBuilding(false)
    setIsCreatingAgent(false)
  }
} 