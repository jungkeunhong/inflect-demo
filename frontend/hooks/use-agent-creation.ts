import { v4 as uuidv4 } from 'uuid'
import { ExtendedAgent, Message } from "@/lib/types"
import { createAgent, runAgent } from "@/lib/api"
import { extractTaskDescription } from "@/lib/agent-utils"

type UseAgentCreationProps = {
  messages: Message[]
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  setAgents: React.Dispatch<React.SetStateAction<ExtendedAgent[]>>
  setActiveAgent: React.Dispatch<React.SetStateAction<ExtendedAgent | null>>
  resetKeyTracking: () => void
  setIsBuilding: React.Dispatch<React.SetStateAction<boolean>>
  setIsCreatingAgent: React.Dispatch<React.SetStateAction<boolean>>
}

export function useAgentCreation({
  messages,
  setMessages,
  setAgents,
  setActiveAgent,
  resetKeyTracking,
  setIsBuilding,
  setIsCreatingAgent
}: UseAgentCreationProps) {
  // Create a new agent with the selected tools
  const completeAgentCreation = async (selectedTools: string[]) => {
    const taskDescription = extractTaskDescription(messages)
    
    // Create agent through API
    const agent = await createAgent(taskDescription, selectedTools)
    
    if (agent) {
      // Add task to the agent for intent detection
      const agentWithTask: ExtendedAgent = {
        ...agent,
        task: taskDescription,
        status: "idle"
      }
      
      // Add to agents state
      setAgents((prev) => [...prev, agentWithTask])
      
      // Set as active agent
      setActiveAgent(agentWithTask)
      
      // Show success message
      setMessages((prev) => [...prev, {
        id: uuidv4(),
        role: "assistant",
        content: "✅ Your agent is ready! You can now talk to it directly in this chat. Try asking it something!",
        createdAt: new Date(),
      }])
      
      // Reset states
      setIsBuilding(false)
      setIsCreatingAgent(false)
    } else {
      // Handle error
      setMessages((prev) => [...prev, {
        id: uuidv4(),
        role: "assistant",
        content: "There was an error creating your agent. Please try again.",
        createdAt: new Date(),
      }])
      
      setIsBuilding(false)
      setIsCreatingAgent(false)
    }
    
    // Reset API key tracking
    resetKeyTracking()
  }

  // Test an existing agent
  const testAgent = async (agentId: string, input: string) => {
    try {
      await runAgent(agentId, input)
      return true
    } catch (error) {
      console.error("Error running agent:", error)
      setMessages((prev) => [...prev, {
        id: uuidv4(),
        role: "assistant",
        content: "There was an error running your agent. Please try again.",
        createdAt: new Date(),
      }])
      return false
    }
  }

  return {
    completeAgentCreation,
    testAgent
  }
} 