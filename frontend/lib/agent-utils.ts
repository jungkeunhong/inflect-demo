import { v4 as uuidv4 } from 'uuid'
import { type Agent } from "@/lib/types"

/**
 * Creates the full onboarding agent workflow with all four agents
 */
export function createOnboardingAgents(selectedTools: string[]): Agent[] {
  const rootAgent: Agent = {
    id: uuidv4(),
    name: "Root Agent",
    description: "Coordinates the entire workflow and handles initial data retrieval",
    tools: selectedTools.filter(tool => 
      tool.includes("Google Sheets") || tool.includes("google_sheets")
    ),
    status: "idle" as const,
    createdAt: new Date(),
    updatedAt: new Date()
  }
  
  const analystAgent: Agent = {
    id: uuidv4(),
    name: "Analyst Agent",
    description: "Segments customers and determines appropriate strategies",
    tools: [],
    status: "idle" as const,
    createdAt: new Date(),
    updatedAt: new Date()
  }
  
  const storylineAgent: Agent = {
    id: uuidv4(),
    name: "Storyline Agent",
    description: "Creates tailored onboarding sequences for each segment",
    tools: selectedTools.filter(tool => 
      tool.includes("Google Docs") || tool.includes("google_docs")
    ),
    status: "idle" as const,
    createdAt: new Date(),
    updatedAt: new Date()
  }
  
  const deliveryAgent: Agent = {
    id: uuidv4(),
    name: "Delivery Agent",
    description: "Sends the content through appropriate channels",
    tools: selectedTools.filter(tool => 
      tool.includes("Gmail") || tool.includes("gmail") || 
      tool.includes("Slack") || tool.includes("slack")
    ),
    status: "idle" as const,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  return [rootAgent, analystAgent, storylineAgent, deliveryAgent]
}

/**
 * Updates the status of a specific agent in a workflow
 */
export function updateAgentStatus(
  agents: Agent[], 
  agentNameFragment: string, 
  status: "idle" | "running" | "completed" | "error"
): Agent[] {
  return agents.map(agent => 
    agent.name.includes(agentNameFragment) 
      ? { ...agent, status }
      : agent
  )
}

/**
 * Determines if a message is an onboarding-related message
 */
export function isOnboardingRequest(messageContent: string): boolean {
  return messageContent.toLowerCase().includes('onboarding')
}

/**
 * Extract task description from user messages
 */
export function extractTaskDescription(
  messages: { role: string; content: string }[], 
  defaultDescription = "Custom Agent"
): string {
  const userTasks = messages.filter(
    msg => msg.role === "user" && (
      msg.content.toLowerCase().includes("build agent") ||
      msg.content.toLowerCase().includes("create agent")
    )
  )
  
  return userTasks.length > 0
    ? userTasks[userTasks.length - 1].content.replace(/build agent|create agent/gi, "").trim()
    : defaultDescription
} 