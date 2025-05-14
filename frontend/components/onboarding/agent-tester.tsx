"use client"

import { useState, useEffect } from "react"
import { v4 as uuidv4 } from 'uuid'
import { updateAgentStatus } from "@/lib/agent-utils"
import { type Agent, type Message } from "@/lib/types"

interface AgentTesterProps {
  agents: Agent[]
  onAgentsChange: (agents: Agent[]) => void
  onMessagesChange: (updater: (messages: Message[]) => Message[]) => void
}

export function AgentTester({ agents, onAgentsChange, onMessagesChange }: AgentTesterProps) {
  const [isExecuting, setIsExecuting] = useState(false)

  // Execute the agent workflow sequentially
  const executeWorkflow = async (input: string) => {
    if (isExecuting || agents.length < 4) return
    setIsExecuting(true)

    // Add thinking message
    const thinkingMsg: Message = {
      id: uuidv4(),
      role: "assistant",
      content: "Starting the onboarding process. I'll retrieve your customer data and build personalized sequences...",
      createdAt: new Date()
    }
    onMessagesChange((messages: Message[]) => [...messages, thinkingMsg])

    // Step 1: Root Agent
    onAgentsChange(updateAgentStatus(agents, "Root", "running"))
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Complete Root Agent and update
    onAgentsChange(updateAgentStatus(agents, "Root", "completed"))
    onMessagesChange((messages: Message[]) => [...messages, {
      id: uuidv4(),
      role: "assistant",
      content: "Root Agent: Successfully retrieved customer data from Google Sheets.",
      createdAt: new Date()
    }])

    // Step 2: Analyst Agent
    onAgentsChange(updateAgentStatus(agents, "Analyst", "running"))
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Complete Analyst Agent and update
    onAgentsChange(updateAgentStatus(agents, "Analyst", "completed"))
    onMessagesChange((messages: Message[]) => [...messages, {
      id: uuidv4(),
      role: "assistant",
      content: "Analyst Agent: Segmented customers into 3 groups and developed targeted strategies.",
      createdAt: new Date()
    }])

    // Step 3: Storyline Agent
    onAgentsChange(updateAgentStatus(agents, "Storyline", "running"))
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Complete Storyline Agent and update
    onAgentsChange(updateAgentStatus(agents, "Storyline", "completed"))
    onMessagesChange((messages: Message[]) => [...messages, {
      id: uuidv4(),
      role: "assistant",
      content: "Storyline Agent: Created personalized onboarding sequences for each segment.",
      createdAt: new Date()
    }])

    // Step 4: Delivery Agent
    onAgentsChange(updateAgentStatus(agents, "Delivery", "running"))
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Complete Delivery Agent and update
    onAgentsChange(updateAgentStatus(agents, "Delivery", "completed"))
    onMessagesChange((messages: Message[]) => [...messages, {
      id: uuidv4(),
      role: "assistant",
      content: "Delivery Agent: Successfully scheduled personalized onboarding emails for all customer segments!\n\nProcess completed! All customers will receive their personalized onboarding sequences via email over the next 7 days.",
      createdAt: new Date()
    }])

    setIsExecuting(false)
  }

  return { executeWorkflow, isExecuting }
} 