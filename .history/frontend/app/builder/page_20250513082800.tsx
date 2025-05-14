"use client"

import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import { type Message, type Agent } from "@/lib/types"
import { Navbar } from "@/components/layout/navbar"
import { AgentVisualizationContainer } from "@/components/builder/AgentVisualizationContainer"
import { v4 as uuidv4 } from 'uuid'
import { ChatContainer } from "@/components/builder/ChatContainer"

// Mock data for agents
const mockAgents: Agent[] = [
  {
    id: "agent-1",
    name: "Root Agent",
    description: "Coordinates the entire workflow and handles initial data retrieval",
    tools: ["Google Sheets"],
    status: "idle",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "agent-2",
    name: "Analyst Agent",
    description: "Segments customers and determines appropriate strategies",
    tools: [],
    status: "idle",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "agent-3",
    name: "Storyline Agent",
    description: "Creates tailored onboarding sequences for each segment",
    tools: ["Google Docs"],
    status: "idle",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

// Mock tools
const mockTools = [
  "Intercom",
  "Mixpanel",
  "Hubspot",
  "Looker",
  "Google Analytics",
  "Amplitude",
  "Segment",
  "Klaviyo", 
  "Slack",
  "Retool"
]

// Initial user prompt - automatically inserted as first message
const initialUserPrompt: Message = {
  id: uuidv4(),
  role: "user",
  content: "I want to build an agent that detects and prevents churn",
  createdAt: new Date()
}

// Initial AI response
const welcomeMessage: Message = {
  id: uuidv4(),
  role: "assistant",
  content: "Great! Here's a draft agent setup:\nRoot → Detect → Plan → Act\n\nShall we proceed?",
  createdAt: new Date()
}

export default function BuilderPage() {
  const searchParams = useSearchParams()
  
  // Start with an empty message array - we'll add messages during the animation sequence
  const initialMessages: Message[] = []
  const urlMessageProcessed = useRef(false)
  
  // Chat UI state management
  const [showAgents, setShowAgents] = useState(false)
  const [currentStep, setCurrentStep] = useState(0) // Start at step 0
  const [selectedTools, setSelectedTools] = useState<string[]>([]) // Selected tools
  const [messages, setMessages] = useState<Message[]>(initialMessages)

  // 즉시 초기 메시지 표시 - 로딩 후 바로 표시
  useEffect(() => {
    console.log("Setting initial messages - component mounted");
    
    // 바로 메시지 표시 시작
    setMessages([initialUserPrompt]);
    
    // 짧은 지연 후 AI 응답 표시
    const timer = setTimeout(() => {
      console.log("Adding AI welcome message");
      setMessages(prev => [...prev, welcomeMessage]);
      setCurrentStep(1); // Now we're in step 1
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Main submit handler for user messages - this will be passed to ChatContainer
  const handleSubmit = async (input: string): Promise<void> => {
    return new Promise((resolve) => {
      if (!input.trim()) {
        resolve();
        return;
      }
      
      console.log("Message submitted:", input, "Current messages:", messages.length);
      
      // Add user message immediately to the chat
      const userMessage: Message = {
        id: uuidv4(),
        role: "user",
        content: input,
        createdAt: new Date()
      };
      
      // 타이핑 인디케이터 메시지
      const typingIndicator: Message = {
        id: uuidv4(),
        role: "assistant",
        content: "...",
        createdAt: new Date()
      };
      
      // 직접 setMessages 호출 - prev 콜백 사용하여 최신 상태 보장
      setMessages(prev => [...prev, userMessage, typingIndicator]);
      
      // AI 응답 생성
      setTimeout(() => {
        // 적절한 응답 가져오기
        const response = getAutoResponse(input);
        
        // 최종 메시지 배열 구성 (타이핑 인디케이터 제거)
        setMessages(prev => {
          // 타이핑 인디케이터 제거
          const withoutTyping = prev.filter(msg => msg.id !== typingIndicator.id);
          
          // 응답 형식에 따라 처리
          if ('role' in response) {
            return [...withoutTyping, response as Message];
          } else {
            const assistantMessage: Message = {
              id: uuidv4(),
              role: "assistant",
              content: response.content,
              type: response.type as "text" | "api_key_input" | "api_keys_group" | "tool_selection" | undefined,
              meta: response.meta,
              createdAt: new Date()
            };
            return [...withoutTyping, assistantMessage];
          }
        });
        
        // 에이전트 시각화 표시
        if (currentStep >= 3 && !showAgents) {
          setShowAgents(true);
        }
        
        resolve();
      }, 1500);
    });
  }
  
  // Handle tool selection from the ChatUI component
  const handleToolSelect = async (tools: string[]): Promise<void> => {
    console.log("Tools selected:", tools)
    setSelectedTools(tools)
    
    // Pretend there was a submit with empty content to trigger next step
    setTimeout(() => {
      const response = getAutoResponse("")
      
      if ('role' in response) {
        setMessages(prev => [...prev, response as Message])
      } else {
        const assistantMessage: Message = {
          id: uuidv4(),
          role: "assistant",
          content: response.content,
          type: response.type as "text" | "api_key_input" | "api_keys_group" | "tool_selection" | undefined,
          meta: response.meta,
          createdAt: new Date()
        }
        setMessages(prev => [...prev, assistantMessage])
      }
    }, 1000)
  }
  
  // Handle API key submission
  const handleApiKeySubmit = (key: string, service: string): void => {
    console.log(`API key for ${service} submitted`)
    
    // Move to the next step
    if (currentStep === 4) {
      setTimeout(() => {
        const assistantMessage: Message = {
          id: uuidv4(),
          role: "assistant",
          content: "All set! Let's run a quick test 🎬",
          createdAt: new Date()
        }
        setMessages(prev => [...prev, assistantMessage])
        setCurrentStep(5)
      }, 1000)
    }
  }
  
  // Handle agent click
  const handleAgentClick = (agent: Agent) => {
    console.log("Agent clicked:", agent.name)
  }
  
  // Auto-response generator - follows the guided conversation flow
  const getAutoResponse = (input: string): Message | { type: string, content: string, meta?: any } => {
    const lowerInput = input.toLowerCase()
    
    // Step 1: User says "yes" to proceed with agent setup
    if (currentStep === 1 && (
        lowerInput.includes("yes") || 
        lowerInput.includes("ok") || 
        lowerInput.includes("sure") ||
        lowerInput.includes("proceed") ||
        lowerInput.includes("let's go")
      )) {
      setCurrentStep(2)
      return {
        id: uuidv4(),
        role: "assistant",
        content: "Awesome. These are commonly used tools for churn prevention.\nClick any that you already use—we'll auto-connect them for you:",
        type: "tool_selection",
        createdAt: new Date()
      }
    }
    
    // Step 2: After tool selection - building the agent
    if (currentStep === 2 && selectedTools.length > 0) {
      setCurrentStep(3)
      setTimeout(() => setShowAgents(true), 1000) // Show agent visualization after 1 second
      return {
        id: uuidv4(),
        role: "assistant",
        content: "Thanks! Starting to build your agent now...",
        createdAt: new Date()
      }
    }
    
    // Step 3: After agent visualization is shown - request API keys
    if (currentStep === 3 && showAgents) {
      setCurrentStep(4)
      return {
        id: uuidv4(),
        role: "assistant",
        content: "One last step! Please enter your API keys here.\nJust in case, I've linked the help docs for each tool 😉",
        type: "api_keys_group",
        meta: { services: selectedTools.length > 0 ? selectedTools : ["Intercom", "Slack"] },
        createdAt: new Date()
      }
    }
    
    // Step 4: After API key entry - invite user to test
    if (currentStep === 4) {
      setCurrentStep(5)
      return {
        id: uuidv4(),
        role: "assistant",
        content: "All set! Let's run a quick test 🎬",
        createdAt: new Date()
      }
    }
    
    // Step 5: User runs test scenario
    if (currentStep === 5 && (
        lowerInput.includes("run") || 
        lowerInput.includes("test") || 
        lowerInput.includes("nyc") ||
        lowerInput.includes("churn prevention") ||
        lowerInput.includes("risk")
      )) {
      setCurrentStep(6)
      return {
        id: uuidv4(),
        role: "assistant",
        content: "Done! We found **47 at-risk users**.\n\nMain causes: low product engagement and no recent purchases.\n\nWe're ready to send a Slack alert and coupon offer on **Monday, May 20**.\nShall I proceed?",
        createdAt: new Date()
      }
    }
    
    // Default responses based on current step
    if (currentStep === 6) {
      return {
        id: uuidv4(),
        role: "assistant",
        content: "Great! I've scheduled the actions. The system will automatically send alerts and coupons to the identified users on Monday, May 20.",
        createdAt: new Date()
      }
    } else {
      // Generic response for any other input to keep conversation going
      if (currentStep === 1) {
        return {
          id: uuidv4(),
          role: "assistant",
          content: "I'd like to help you build a churn prevention agent. Shall we use the Root → Detect → Plan → Act structure as a starting point?",
          createdAt: new Date()
        }
      } else if (currentStep === 5) {
        return {
          id: uuidv4(),
          role: "assistant",
          content: "To test the agent, try typing something like: 'Run churn prevention for NYC users with high churn risk over the last 3 months.'",
          createdAt: new Date()
        }
      } else {
        return {
          id: uuidv4(),
          role: "assistant",
          content: "I'm here to help you build your churn prevention agent. Let's continue with the next steps.",
          createdAt: new Date()
        }
      }
    }
  }
  
  // Handle messages change from the ChatUI component
  const handleMessagesChange = (newMessages: Message[]) => {
    setMessages(newMessages)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container mx-auto p-4 mt-4 flex flex-col">
        <div className="flex flex-col gap-8 h-full">
          <div className="flex-1 min-h-[500px] relative">
            {/* Agent visualization container */}
            <div className={`transition-opacity duration-700 ${showAgents ? 'opacity-100' : 'opacity-0'}`}>
              <AgentVisualizationContainer
                agents={mockAgents}
                activeAgent={mockAgents[0]}
                onAgentClick={handleAgentClick}
                isBuilding={false}
                onAgentsUpdate={() => {}}
              />
            </div>
          </div>
        </div>
      </main>
      
      {/* Chat container using the proper component */}
      <ChatContainer 
        messages={messages}
        onMessagesChange={handleMessagesChange}
        onSubmit={handleSubmit}
        availableTools={mockTools}
        onToolSelect={handleToolSelect}
        onApiKeySubmit={handleApiKeySubmit}
      />
    </div>
  )
}
