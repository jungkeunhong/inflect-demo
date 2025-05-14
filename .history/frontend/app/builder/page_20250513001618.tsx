"use client"

import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { type Message, type Agent } from "@/lib/types"
import { Navbar } from "@/components/layout/navbar"
import { ChatUI } from "@/components/chat-ui"
import { AgentVisualizationContainer } from "@/components/builder/AgentVisualizationContainer"
import { v4 as uuidv4 } from 'uuid'
import { MessageSquare } from "lucide-react"

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
  "Voucherify",
  "Slack",
  "Retool"
]

// Initial user prompt - automatically inserted as first message
const initialUserPrompt: Message = {
  id: uuidv4(),
  role: "user",
  content: "I want to build an agent that detects and prevents churn.",
  createdAt: new Date()
}

// Initial AI response
const welcomeMessage: Message = {
  id: uuidv4(),
  role: "assistant",
  content: "Great! Here's a draft agent setup:\n**Root → Detect → Plan → Act**\n\n(You may use short & catchy agent names like: Root → Radar → Strategy → Pulse)\n\nShall we proceed?",
  createdAt: new Date()
}

export default function BuilderPage() {
  const searchParams = useSearchParams()
  
  // Set initial messages with both user prompt and AI response
  const initialMessages = [initialUserPrompt, welcomeMessage]
  const urlMessageProcessed = useRef(false)
  
  // Chat UI state management
  const [chatOpen, setChatOpen] = useState(true)
  const [showAgents, setShowAgents] = useState(false)
  const [currentStep, setCurrentStep] = useState(1) // Start at step 1 since we already have the initial prompt and response
  const [selectedTools, setSelectedTools] = useState<string[]>([]) // Selected tools
  const [messages, setMessages] = useState<Message[]>(initialMessages)

  // Handle URL "message" parameter on mount - we'll ignore this for the demo flow
  useEffect(() => {
    // No need to process URL params for this demo as we're starting with fixed messages
    urlMessageProcessed.current = true;
    
    // In the guided demo mode, we don't show agents until later step
    if (searchParams.get("mode") === "demo") {
      // Keep agents hidden until the appropriate step
      setShowAgents(false);
    }
  }, [searchParams]);

  // Main submit handler for user messages
  const handleSubmit = (input: string) => {
    if (!input.trim()) return; // Skip empty messages
    console.log("Message submitted:", input);
    
    // Add user message immediately to the chat
    const userMessage: Message = {
      id: uuidv4(),
      role: "user",
      content: input,
      createdAt: new Date()
    };
    
    // Update messages with user input right away
    setMessages(prev => [...prev, userMessage]);
    
    // Show "typing" indicator
    const typingIndicator: Message = {
      id: uuidv4(),
      role: "assistant",
      content: "...",
      createdAt: new Date()
    };
    
    // Add typing indicator
    setMessages(prev => [...prev, typingIndicator]);
    
    // Generate response after a short delay
    setTimeout(() => {
      // Remove typing indicator
      setMessages(prev => prev.filter(msg => msg.id !== typingIndicator.id));
      
      // Get appropriate response based on conversation flow
      const response = getAutoResponse(input);
      
      // Handle different response types
      if ('role' in response) {
        // If it's a standard Message object
        setMessages(prev => [...prev, response as Message]);
      } else {
        // If it's a special message type (tool_selection, api_keys_group, etc)
        const assistantMessage: Message = {
          id: uuidv4(),
          role: "assistant",
          content: response.content,
          type: response.type as "text" | "api_key_input" | "api_keys_group" | "tool_selection" | undefined,
          meta: response.meta,
          createdAt: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
      
      // Show agent visualization if we're at the appropriate step
      if (currentStep >= 3 && !showAgents) {
        setShowAgents(true);
      }
    }, 1500);
  }
  
  // Auto-response generator - follows the guided conversation flow
  const getAutoResponse = (input: string): Message | { type: string, content: string, meta?: any } => {
    const lowerInput = input.toLowerCase();
    
    // Step 1: User says "yes" to proceed with agent setup
    if (currentStep === 1 && (
        lowerInput.includes("yes") || 
        lowerInput.includes("ok") || 
        lowerInput.includes("sure") ||
        lowerInput.includes("proceed") ||
        lowerInput.includes("let's go")
      )) {
      setCurrentStep(2);
      return {
        id: uuidv4(),
        role: "assistant",
        content: "Awesome. These are commonly used tools for churn prevention.\nClick any that you already use—we'll auto-connect them for you:",
        type: "tool_selection",
        createdAt: new Date()
      };
    }
    
    // Step 2: After tool selection - building the agent
    if (currentStep === 2 && selectedTools.length > 0) {
      setCurrentStep(3);
      setTimeout(() => setShowAgents(true), 1000); // Show agent visualization after 1 second
      return {
        id: uuidv4(),
        role: "assistant",
        content: "Thanks! Starting to build your agent now...",
        createdAt: new Date()
      };
    }
    
    // Step 3: After agent visualization is shown - request API keys
    if (currentStep === 3 && showAgents) {
      setCurrentStep(4);
      return {
        id: uuidv4(),
        role: "assistant",
        content: "One last step! Please enter your API keys here.\nJust in case, I've linked the help docs for each tool 😉",
        type: "api_keys_group",
        meta: { services: selectedTools.length > 0 ? selectedTools : ["Intercom", "Slack"] },
        createdAt: new Date()
      };
    }
    
    // Step 4: After API key entry - invite user to test
    if (currentStep === 4) {
      setCurrentStep(5);
      return {
        id: uuidv4(),
        role: "assistant",
        content: "All set! Let's run a quick test 🎬",
        createdAt: new Date()
      };
    }
    
    // Step 5: User runs test scenario
    if (currentStep === 5 && (
        lowerInput.includes("run") || 
        lowerInput.includes("test") || 
        lowerInput.includes("nyc") ||
        lowerInput.includes("churn prevention") ||
        lowerInput.includes("risk")
      )) {
      setCurrentStep(6);
      return {
        id: uuidv4(),
        role: "assistant",
        content: "Done! We found **47 at-risk users**.\n\nMain causes: low product engagement and no recent purchases.\n\nWe're ready to send a Slack alert and coupon offer on **Monday, May 20**.\nShall I proceed?",
        createdAt: new Date()
      };
    }
    
    // Default responses based on current step
    if (currentStep === 6) {
      return {
        id: uuidv4(),
        role: "assistant",
        content: "Great! I've scheduled the actions. The system will automatically send alerts and coupons to the identified users on Monday, May 20.",
        createdAt: new Date()
      };
    } else {
      // Generic response for any other input to keep conversation going
      if (currentStep === 1) {
        return {
          id: uuidv4(),
          role: "assistant",
          content: "I'd like to help you build a churn prevention agent. Shall we use the Root → Detect → Plan → Act structure as a starting point?",
          createdAt: new Date()
        };
      } else if (currentStep === 5) {
        return {
          id: uuidv4(),
          role: "assistant",
          content: "To test the agent, try typing something like: 'Run churn prevention for NYC users with high churn risk over the last 3 months.'",
          createdAt: new Date()
        };
      } else {
        return {
          id: uuidv4(),
          role: "assistant",
          content: "I'm here to help you build your churn prevention agent. Let's continue with the next steps.",
          createdAt: new Date()
        };
      }
    }
  }

  const handleToolSelect = (tools: string[]) => {
    console.log("Tools selected:", tools);
    setSelectedTools(tools);
    
    // 도구 선택 후 바로 다음 단계로 자동 진행
    if (currentStep === 2 && tools.length > 0) {
      setTimeout(() => {
        const response = getAutoResponse("");
        if ('role' in response) {
          setMessages(prev => [...prev, response as Message]);
        } else {
          const assistantMessage: Message = {
            id: uuidv4(),
            role: "assistant",
            content: response.content,
            type: response.type as "text" | "api_key_input" | "api_keys_group" | "tool_selection" | undefined,
            meta: response.meta,
            createdAt: new Date()
          };
          setMessages(prev => [...prev, assistantMessage]);
        }
      }, 500);
    }
  }

  const handleApiKeySubmit = (key: string, service: string) => {
    console.log(`API key for ${service} submitted`);
  }

  const handleAgentClick = (agent: Agent) => {
    console.log("Agent clicked:", agent.name);
  }

  const handleMessagesChange = (updatedMessages: Message[]) => {
    console.log("Messages updated:", updatedMessages.length);
    setMessages(updatedMessages);
  }

  return (
    <div className="relative min-h-screen bg-background flex flex-col">
      {/* Navbar */}
      <Navbar />
      
      {/* Top: Agent Visualization - 조건부 렌더링 */}
      {showAgents && (
        <div className="w-full max-w-5xl mx-auto pt-8 pb-4">
          <AgentVisualizationContainer
            agents={mockAgents}
            activeAgent={mockAgents[0]}
            onAgentClick={handleAgentClick}
            isBuilding={false}
            onAgentsUpdate={() => {}}
          />
        </div>
      )}
      
      {/* 채팅창: 항상 고정된 크기로 표시 */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {chatOpen ? (
          <Card className="w-[400px] min-w-[400px] max-w-[400px] mb-4 shadow-xl h-[600px] min-h-[600px] flex flex-col">
            <div className="flex justify-between items-center p-3 border-b">
              <span className="font-switzer font-base text-base">Internal Agent builder</span>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setChatOpen(false)} 
                aria-label="Close chat"
              >
                <span className="text-xl">×</span>
              </Button>
            </div>
            <div className="p-3 flex-1 overflow-hidden">
              <ChatUI
                messages={messages}
                onMessagesChange={handleMessagesChange}
                placeholder="Type your automation goal..."
                className="h-full flex flex-col"
                onSubmit={handleSubmit}
                availableTools={mockTools}
                onToolSelect={handleToolSelect}
                onApiKeySubmit={handleApiKeySubmit}
              />
            </div>
          </Card>
        ) : (
          <Button 
            onClick={() => setChatOpen(true)}
            className="rounded-full h-12 w-12 bg-primary shadow-lg hover:shadow-xl transition-all duration-200"
            aria-label="Open chat"
          >
            <MessageSquare className="h-6 w-6 text-white" />
          </Button>
        )}
      </div>
    </div>
  );
}
