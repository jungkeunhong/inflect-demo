import { useState, useEffect, useRef } from "react"
import { v4 as uuidv4 } from 'uuid'
import { ExtendedAgent, Message } from "@/lib/types"
import { getAvailableTools, checkBackendStatus, runAgent, createAgent } from "@/lib/api"
import { useApiKeys } from "@/hooks/use-api-keys"
import { createOnboardingAgents, isOnboardingRequest, extractTaskDescription } from "@/lib/agent-utils"
import { AgentTester } from "@/components/onboarding/agent-tester"
import { agentWebSocket } from "@/lib/websocket"
import { toast } from "sonner"

export function useBuilder() {
  // Initialize with welcome message
  const welcomeMessage: Message = {
    id: uuidv4(),
    role: "assistant",
    content: "Hi! Tell me what you want to automate, and I'll build an agent for you.",
    createdAt: new Date(),
  }
  
  // State
  const [messages, setMessages] = useState<Message[]>([welcomeMessage])
  const [agents, setAgents] = useState<ExtendedAgent[]>([])
  const [activeAgent, setActiveAgent] = useState<ExtendedAgent | null>(null)
  const [availableTools, setAvailableTools] = useState<string[]>([])
  const [isBuilding, setIsBuilding] = useState(false)
  const [isCreatingAgent, setIsCreatingAgent] = useState(false)
  
  // Refs
  const toolSelectionMessageId = useRef<string | null>(null)
  const urlMessageProcessed = useRef(false)

  // Initialize API key handling
  const { 
    createGroupedApiKeyMessage,
    markKeyAsSubmitted, 
    resetKeyTracking
  } = useApiKeys({
    onAllKeysSubmitted: (selectedTools) => {
      // Create onboarding agent workflow
      const onboardingAgents = createOnboardingAgents(selectedTools)
      
      // Set status to idle
      const agentsWithStatus = onboardingAgents.map(agent => ({
        ...agent,
        status: "idle" as const
      }))
      
      // Update state
      setAgents(agentsWithStatus)
      setActiveAgent(agentsWithStatus[0])
      
      // Add completion message
      setMessages((prev) => [...prev, {
        id: uuidv4(),
        role: "assistant",
        content: "Your agent workflow is ready ✅ You can now test it by asking about your customer data directly in this chat.",
        createdAt: new Date(),
      }])
      
      // Reset states
      setIsCreatingAgent(false)
      setIsBuilding(false)
      
      // Reset API key tracking
      resetKeyTracking()
    }
  })

  // Initialize agent tester
  const agentTester = AgentTester({
    agents,
    onAgentsChange: setAgents,
    onMessagesChange: setMessages
  })

  // Initialize tools and backend status
  useEffect(() => {
    async function init() {
      await checkBackendStatus()
      setAvailableTools(await getAvailableTools())
    }
    init()
  }, [])

  // Initialize WebSocket connection for real-time updates
  useEffect(() => {
    // Connect to WebSocket
    const unsubscribe = agentWebSocket.subscribe((message) => {
      // Handle WebSocket messages
      if (isAgentResponseMessage(message)) {
        // Add response to messages
        setMessages((prev) => {
          // Find and replace the "thinking" message
          const lastThinkingIndex = [...prev].reverse().findIndex(msg => 
            msg.role === "assistant" && msg.content === "..."
          )
          
          if (lastThinkingIndex >= 0) {
            const newMessages = [...prev]
            const actualIndex = prev.length - 1 - lastThinkingIndex
            newMessages[actualIndex] = {
              ...newMessages[actualIndex],
              content: message.data.response,
            }
            return newMessages
          } else {
            // If no thinking message found, add a new one
            return [...prev, {
              id: uuidv4(),
              role: "assistant",
              content: message.data.response,
              createdAt: new Date(),
            }]
          }
        })
      } else if (message.type === "agent_status_update" && message.data) {
        // Update agent status
        setAgents((prevAgents) => {
          const updatedAgents = prevAgents.map((agent) => 
            agent.id === message.data.agentId 
              ? { ...agent, status: message.data.status || "idle" } // Provide default value
              : agent
          )
          return updatedAgents
        })
        
        // If agent finishes, update building/creating state
        if (message.data.status === "completed" || message.data.status === "error") {
          setIsBuilding(false)
          setIsCreatingAgent(false)
        }
      } else if (message.type === "error" && message.data) {
        // Show error notification
        toast.error(message.data.error)
        
        // Reset building states on error
        setIsBuilding(false)
        setIsCreatingAgent(false)
      }
    })
    
    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [])

  // Helper to check if a message is an agent response
  function isAgentResponseMessage(message: any): message is { type: string, data: { agentId: string, response: string } } {
    return message.type === "agent_response" && 
           message.data && 
           typeof message.data.response === "string"
  }

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

  // Process an initial message (used for URL parameters)
  const processInitialMessage = async (message: string) => {
    // Skip empty messages
    if (!message || !message.trim()) {
      return
    }
    
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

  // Create grouped API key messages and handle submission
  const handleGroupedApiKeys = (selectedTools: string[]) => {
    // Create list of required services
    const requiredServices = []
    
    // Google Sheets API key if needed
    if (selectedTools.includes("Google Sheets") || selectedTools.includes("Google Sheets Write")) {
      requiredServices.push("Google Sheets")
    }
    
    // Google Docs API key if needed
    if (selectedTools.includes("Google Docs") || selectedTools.includes("Google Docs Read")) {
      requiredServices.push("Google Docs")
    }
    
    // Gmail API key if needed
    if (selectedTools.includes("Gmail")) {
      requiredServices.push("Gmail")
    }
    
    // Slack API key if needed
    if (selectedTools.includes("Slack")) {
      requiredServices.push("Slack")
    }
    
    // Add API key message if services are required
    if (requiredServices.length > 0) {
      // Set building state while we collect API keys
      setIsBuilding(true)
      setIsCreatingAgent(true)
      
      const apiKeysMessage = createGroupedApiKeyMessage(requiredServices)
      setMessages((prev) => [...prev, apiKeysMessage])
    } else {
      // No API keys needed, proceed with agent creation
      completeAgentCreation(selectedTools)
    }
  }

  // Complete agent creation
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

  // Send chat message to the backend
  const sendChatMessage = async (message: string) => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    })
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }
    
    return response.body!
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

  // Handle API key submission
  const handleApiKeySubmit = (key: string, service: string) => {
    // Keep building state active during API key inputs
    setIsBuilding(true)
    setIsCreatingAgent(true)
    
    // Mark this API key as submitted
    markKeyAsSubmitted(service)
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

  // Handler for agent selection in visualization
  const handleAgentClick = (agent: ExtendedAgent) => {
    setActiveAgent(agent)
  }

  return {
    messages,
    setMessages,
    agents,
    setAgents,
    activeAgent,
    setActiveAgent,
    availableTools,
    isBuilding,
    isCreatingAgent,
    toolSelectionMessageId,
    urlMessageProcessed,
    processInitialMessage,
    addUserMessageWithThinking,
    streamResponse,
    handleGroupedApiKeys,
    completeAgentCreation,
    testAgent,
    handleToolSelection,
    handleApiKeySubmit,
    handleChat,
    handleAgentClick
  }
} 