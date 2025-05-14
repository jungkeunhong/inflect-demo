import { useState, useRef } from "react"
import { v4 as uuidv4 } from 'uuid'
import { ExtendedAgent } from "@/lib/types"
import { runAgent } from "@/lib/api"
import { isOnboardingRequest, extractTaskDescription } from "@/lib/agent-utils"

type ChatHandlerProps = {
  agents: ExtendedAgent[]
  activeAgent: ExtendedAgent | null
  setActiveAgent: (agent: ExtendedAgent | null) => void
  setAgents: React.Dispatch<React.SetStateAction<ExtendedAgent[]>>
  availableTools: string[]
  setIsBuilding: React.Dispatch<React.SetStateAction<boolean>>
  setIsCreatingAgent: React.Dispatch<React.SetStateAction<boolean>>
  addUserMessageWithThinking: (input: string) => { userMessageId: string, thinkingMessageId: string }
  streamResponse: (input: string, thinkingMessageId: string) => Promise<string>
  agentTester: {
    executeWorkflow: (input: string) => Promise<void>
  }
  completeAgentCreation: (selectedTools: string[]) => Promise<void>
  handleGroupedApiKeys: (selectedTools: string[]) => void
  messages: any[]
  setMessages: React.Dispatch<React.SetStateAction<any[]>>
}

export function useChatHandler({
  agents,
  activeAgent,
  setActiveAgent,
  setAgents,
  availableTools,
  setIsBuilding,
  setIsCreatingAgent,
  addUserMessageWithThinking,
  streamResponse,
  agentTester,
  completeAgentCreation,
  handleGroupedApiKeys,
  messages,
  setMessages
}: ChatHandlerProps) {
  // Tool selection prompt tracking
  const toolSelectionMessageId = useRef<string | null>(null)
  
  // Detect if the message is intended for agent testing
  const isTestingIntent = (input: string, existingAgents: ExtendedAgent[]): boolean => {
    if (existingAgents.length === 0) return false
    
    // Build-related keywords
    const buildKeywords = ['build agent', 'create agent', 'make agent', 'new agent']
    const hasBuildIntent = buildKeywords.some(keyword => input.toLowerCase().includes(keyword))
    
    // If explicitly asking to build, it's not a testing intent
    if (hasBuildIntent) return false
    
    // Check if the message seems to be addressed to a specific agent
    const isAddressingAgent = existingAgents.some(agent => {
      // If agent name is mentioned
      if (input.toLowerCase().includes(agent.name.toLowerCase())) return true
      
      // Check for task-related keywords
      if (agent.task && typeof agent.task === 'string') {
        const taskKeywords = agent.task.toLowerCase().split(' ')
          .filter((word: string) => word.length > 4) // Only consider significant words
          .slice(0, 3) // Take first few keywords
        
        return taskKeywords.some((keyword: string) => input.toLowerCase().includes(keyword))
      }
      
      return false
    })
    
    return isAddressingAgent
  }

  // Find the most relevant agent for a query
  const findRelevantAgent = (input: string, existingAgents: ExtendedAgent[]): ExtendedAgent | null => {
    if (existingAgents.length === 0) return null
    if (existingAgents.length === 1) return existingAgents[0]
    
    // Start with the active agent if one is selected
    if (activeAgent) return activeAgent
    
    // Otherwise, try to find the most relevant agent by task/name match
    let bestMatch: ExtendedAgent | null = null
    let bestScore = -1
    
    existingAgents.forEach(agent => {
      let score = 0
      
      // Direct name mention is a strong signal
      if (input.toLowerCase().includes(agent.name.toLowerCase())) {
        score += 100
      }
      
      // Check task relevance
      if (agent.task && typeof agent.task === 'string') {
        const taskWords = agent.task.toLowerCase().split(' ')
          .filter((word: string) => word.length > 4)
        
        taskWords.forEach((word: string) => {
          if (input.toLowerCase().includes(word)) {
            score += 10
          }
        })
      }
      
      if (score > bestScore) {
        bestScore = score
        bestMatch = agent
      }
    })
    
    return bestScore > 0 ? bestMatch : existingAgents[0]
  }

  // Handle tool selection
  const handleToolSelection = async (selectedTools: string[]) => {
    // Cleanup previous tool-selection prompt
    if (toolSelectionMessageId.current) {
      setMessages(prev => prev.filter(m => m.id !== toolSelectionMessageId.current))
      toolSelectionMessageId.current = null
    }
    
    // Get task description
    const taskDescription = extractTaskDescription(messages)
    
    // Check if this is an onboarding agent request
    const isOnboardingReq = isOnboardingRequest(taskDescription)
    
    // Set states
    setIsCreatingAgent(true)
    setIsBuilding(true)
    
    // Handle agent creation based on type
    if (isOnboardingReq) {
      handleGroupedApiKeys(selectedTools)
    } else {
      completeAgentCreation(selectedTools)
    }
  }

  // Unified chat handler
  const handleChat = async (input: string) => {
    // Skip empty input
    if (!input || !input.trim()) {
      return
    }

    // Add user message and thinking indicator
    const { thinkingMessageId } = addUserMessageWithThinking(input)

    try {
      // Check if this is a testing intent
      if (isTestingIntent(input, agents)) {
        // Find the relevant agent
        const targetAgent = findRelevantAgent(input, agents)
        
        if (targetAgent) {
          // Set the agent as active
          setActiveAgent(targetAgent)
          
          // Update agent status to running
          setAgents(prev => prev.map(agent => 
            agent.id === targetAgent.id 
              ? { ...agent, status: "running" } 
              : agent
          ))
          
          // Execute the agent with the query
          await runAgent(targetAgent.id, input)
          // Response will be handled by WebSocket
          return
        }
      }
      
      // If not a testing intent or no relevant agent, proceed with build flow
      
      // Check if this is a request to test the onboarding agent with customer data
      const isTestingOnboardingRequest = 
        input.toLowerCase().includes('customer') && 
        input.toLowerCase().includes('sheet') && 
        agents.some(a => a.name.includes("Root"))
      
      if (isTestingOnboardingRequest) {
        // Use AgentTester to execute the workflow
        await agentTester.executeWorkflow(input)
        return
      }
      
      // Check for onboarding agent request
      const isOnboardingReq = 
        isOnboardingRequest(input) && 
        (input.toLowerCase().includes('build agent') || 
         input.toLowerCase().includes('create agent'))
      
      if (isOnboardingReq) {
        setIsBuilding(true)
        // Provide specialized onboarding agent architecture response
        const onboardingResponse = `Okay! I recommend below architecture:
        
1. Root Agent: Coordinates the entire workflow and handles initial data retrieval
2. Analyst Agent: Segments customers and determines appropriate strategies
3. Storyline Agent: Creates tailored onboarding sequences for each segment
4. Delivery Agent: Sends the content through appropriate channels (email, Slack)

To build this, I need access to your tools.`
        
        // Update thinking message with the onboarding response
        setMessages((prev) => prev.map((msg) =>
          msg.id === thinkingMessageId ? { ...msg, content: onboardingResponse } : msg
        ))
        
        // Prompt for tool selection
        if (!toolSelectionMessageId.current) {
          const id = uuidv4()
          toolSelectionMessageId.current = id
          setTimeout(() => {
            setMessages(prev => [...prev, { id, type: "tool_selection", role: "assistant", content: `Which tools would you like to connect?`, createdAt: new Date() }])
            setIsBuilding(false)
          }, 1000)
        }
        return
      }
      
      // Step 1: Handle regular build agent intent (non-onboarding specific)
      const isBuildAgentRequest = input.toLowerCase().includes('build agent') || input.toLowerCase().includes('create agent')
      if (isBuildAgentRequest && !isOnboardingReq) {
        setIsBuilding(true)
        // Get backend response (simulate streaming)
        const responseText = await streamResponse(input, thinkingMessageId)
        
        // Prompt for tool selection
        if (!toolSelectionMessageId.current) {
          const id = uuidv4()
          toolSelectionMessageId.current = id
          setTimeout(() => {
            setMessages(prev => [...prev, { id, type: "tool_selection", role: "assistant", content: `Which tools would you like to use? Available: ${availableTools.join(", ")}`, createdAt: new Date() }])
            setIsBuilding(false)
          }, 1000)
        }
        return
      }
      
      // Step 2: Tool selection and agent creation
      if (availableTools.length > 0 && availableTools.some(tool => input.toLowerCase().includes(tool.toLowerCase()))) {
        setIsCreatingAgent(true)
        const selectedTools = availableTools.filter(tool => input.toLowerCase().includes(tool.toLowerCase()))
        setMessages((prev) => prev.map((msg) =>
          msg.id === thinkingMessageId ? { ...msg, content: `Creating your agent with: ${selectedTools.join(", ")}` } : msg
        ))
        
        // Check if this is a response to an onboarding suggestion
        const isOnboardingResponse = messages.some(msg => 
          msg.role === "assistant" && 
          typeof msg.content === "string" && 
          msg.content.includes("For personalized customer onboarding")
        )
        
        // Handle onboarding agent creation
        if (isOnboardingReq || isOnboardingResponse) {
          // Use grouped API key request
          handleGroupedApiKeys(selectedTools)
          return
        } else {
          // Use regular agent creation
          completeAgentCreation(selectedTools)
          return
        }
      }
      
      // Step 3: General chat - just stream the response
      await streamResponse(input, thinkingMessageId)
      
    } catch (error) {
      console.error("Error in handleChat:", error)
      setMessages((prev) => prev.map((msg) =>
        msg.id === thinkingMessageId ? { ...msg, content: "Sorry, there was an error processing your request. Please try again." } : msg
      ))
      setIsBuilding(false)
    }
  }

  return {
    handleChat,
    handleToolSelection,
    toolSelectionMessageId
  }
} 