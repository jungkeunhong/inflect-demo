"use client"

import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import { type Message, type Agent } from "@/lib/types"
import { Navbar } from "@/components/layout/navbar"
import { AgentVisualizationContainer } from "@/components/builder/AgentVisualizationContainer"
import { v4 as uuidv4 } from 'uuid'
import { ChatContainer } from "@/components/builder/ChatContainer"
import { cn } from "@/lib/utils";
import {
  mockAgents,
  initialUserPrompt,
  welcomeMessage,
  demoConversationSteps
} from "@/lib/demo-data";

export default function BuilderPage() {
  const searchParams = useSearchParams()
  const urlMessageProcessed = useRef(false)
  
  const [showAgents, setShowAgents] = useState(false)
  const [currentStep, setCurrentStep] = useState(0) 
  const [messages, setMessages] = useState<Message[]>([]) 

  useEffect(() => {
    if (urlMessageProcessed.current) return;
    urlMessageProcessed.current = true;
    
    setMessages([initialUserPrompt]);
    
    const timer = setTimeout(() => {
      setMessages(prev => [...prev, welcomeMessage]);
      setCurrentStep(1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const addMessage = (message: Omit<Message, 'id' | 'createdAt'>) => {
    const newMessage: Message = {
      id: uuidv4(),
      createdAt: new Date(),
      ...message,
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };

  const handleSendMessage = async (input: string): Promise<void> => {
    if (!input.trim()) {
      return;
    }
    
    addMessage({ role: "user", content: input });
    
    const typingIndicator = addMessage({
      role: "assistant",
      content: "...", 
    });
    
    setTimeout(() => {
      setMessages(prev => prev.filter(msg => msg.id !== typingIndicator.id)); 
      
      const responseGenerator = demoConversationSteps[currentStep];
      if (responseGenerator) {
        const responseDraft = responseGenerator();
        addMessage(responseDraft);
        setCurrentStep(prev => prev + 1);
      } else {
        addMessage({ role: "assistant", content: "I've completed the current flow. What's next?" });
      }
      
      if (currentStep >= 2 && !showAgents) { 
        setShowAgents(true);
      }
    }, 1500);
  };
  
  const handleToolSelect = async (tools: string[]): Promise<void> => {
    console.log("Tools selected in page.tsx:", tools);
    addMessage({
      role: "user", 
      content: `Selected tools: ${tools.join(', ')}`,
      type: 'text' 
    });
    
    const responseGenerator = demoConversationSteps[currentStep]; 
    if (responseGenerator) {
      const responseDraft = responseGenerator();
      addMessage(responseDraft);
      setCurrentStep(prev => prev + 1);
    }
  };
  
  const handleApiKeySubmit = (key: string, service: string): void => {
    console.log(`API key for ${service} submitted in page.tsx`);
    addMessage({
      role: "user", 
      content: `API key for ${service} submitted.`,
      type: 'text'
    });

    const responseGenerator = demoConversationSteps[currentStep]; 
    if (responseGenerator) {
      const responseDraft = responseGenerator();
      addMessage(responseDraft);
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleAgentClick = (agent: Agent) => {
    console.log("Agent clicked:", agent.name);
    // Placeholder: you might want to set this as the active agent or open details
  };

  const handleAgentsUpdate = (updatedAgents: Agent[]) => {
    console.log("Agents updated:", updatedAgents);
    // Placeholder: if the visualization allows editing agents, this would handle state updates
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 flex flex-col md:flex-row p-4 md:p-6 gap-6">
        {showAgents && (
          <div className="md:w-3/5 lg:w-2/3 order-1 md:order-2">
            <AgentVisualizationContainer 
              agents={mockAgents} 
              activeAgent={mockAgents[0]} 
              onAgentClick={handleAgentClick} 
              isBuilding={false} 
              onAgentsUpdate={handleAgentsUpdate} 
            />
          </div>
        )}
        <div
          className={cn(
            "order-2 md:order-1 transition-all duration-500 ease-in-out",
            showAgents ? "md:w-2/5 lg:w-1/3" : "w-full max-w-2xl mx-auto"
          )}
        >
          <ChatContainer
            initialMessages={messages} 
            onSendMessage={handleSendMessage} 
            placeholder="Describe your automation goal..."
            chatUIClassName="h-[calc(100vh-150px)] md:h-[calc(100vh-120px)]" 
          />
        </div>
      </main>
    </div>
  )
}
