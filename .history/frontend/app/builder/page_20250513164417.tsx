"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { Navbar } from "@/components/layout/navbar"; 
import { ChatContainer } from "@/components/builder/ChatContainer";
import AgentVisualization from "@/components/visualization/agent-visualization"; 
import StorylineSequenceView from "@/components/visualization/storyline-sequence-view"; 
import { type Message, type Agent } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  mockAgents,
  initialUserPrompt, 
  welcomeMessage,
  demoConversationSteps,
  mockTools, 
} from "@/lib/demo-data";
import { ToolSelector } from "@/components/ui/tool-selector";
import { ApiKeyInput } from "@/components/ui/api-key-input"; 
import { ApiKeyEntryRow } from "@/components/ui/api-key-entry-row"; 
import { Button } from "@/components/ui/button";
import DetectAgentView from "@/components/visualization/detect-agent-view";
import PlanAgentView from "@/components/visualization/plan-agent-view";

export default function BuilderPage() {
  const searchParams = useSearchParams();
  const agentId = searchParams.get('agentId');

  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [showAgents, setShowAgents] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isLoadingNextStep, setIsLoadingNextStep] = useState(false);
  const [toolsRequiringApiKeys, setToolsRequiringApiKeys] = useState<string[]>([]);
  const [enteredApiKeys, setEnteredApiKeys] = useState<Record<string, string>>({});

  useEffect(() => {
    if (agentId) {
      const agent = mockAgents.find(a => a.id === agentId);
      setSelectedAgent(agent || mockAgents[0] || null);
    } else {
      setSelectedAgent(mockAgents[0] || null);
    }
  }, [agentId]);

  const addMessage = useCallback((message: Omit<Message, 'id' | 'createdAt'>) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { ...message, id: uuidv4(), createdAt: new Date() },
    ]);
  }, []);

  useEffect(() => {
    if (messages.length === 0 && !agentId) { 
      addMessage(initialUserPrompt);
      setTimeout(() => {
        addMessage(welcomeMessage);
      }, 1000);
    }
  }, [addMessage, messages.length, agentId]);

  const proceedToNextDemoStep = useCallback(() => {
    if (currentStep < demoConversationSteps.length) {
      setIsLoadingNextStep(true);
      setTimeout(() => {
        const nextStepMessage = demoConversationSteps[currentStep]();
        addMessage(nextStepMessage);

        // Show agents visualization when the "Great, all set up!" message is displayed
        // This corresponds to demoConversationSteps[2] (index 2)
        if (currentStep === 2) { 
          if (!showAgents) {
            setShowAgents(true);
          }
        }

        setCurrentStep(prev => prev + 1);
        setIsLoadingNextStep(false);
      }, 500); 
    }
  }, [currentStep, addMessage, showAgents]);

  const handleSendMessage = async (content: string) => {
    addMessage({ role: 'user', content });

    // Initial interaction to trigger demo flow
    if (messages.length < 4 && (content.toLowerCase().includes('yes') || content.toLowerCase().includes('okay') || content.toLowerCase().includes('ok') || content.toLowerCase().includes('proceed'))) {
      proceedToNextDemoStep();
      return;
    }

    const lastMessage = messages[messages.length - 1];
    if (currentStep > 0 && currentStep < demoConversationSteps.length && 
        lastMessage?.type !== 'tool_selection' && lastMessage?.type !== 'api_keys_group') {
      proceedToNextDemoStep();
    } else if (currentStep >= demoConversationSteps.length && messages.length > 3) {
        addMessage({
            role: 'assistant',
            content: "The demo flow has concluded. You can restart or explore other options!"
        });
    } 
  };

  const handleToolSelection = (selectedTools: string[]) => {
    addMessage({
      role: 'user',
      content: `Selected tools: ${selectedTools.join(', ')}`,
      type: 'user_tool_selection_response'
    });
    setToolsRequiringApiKeys(selectedTools);
    proceedToNextDemoStep();
  };

  const handleApiKeyChange = (serviceName: string, value: string) => {
    setEnteredApiKeys(prev => ({ ...prev, [serviceName]: value }));
  };

  const handleBulkApiKeySubmit = () => {
    const submittedServices = Object.entries(enteredApiKeys)
      .filter(([_, apiKey]) => apiKey.trim() !== '') // Consider only non-empty keys
      .map(([serviceName, _]) => serviceName);

    if (submittedServices.length === 0) {
      addMessage({
        role: 'user',
        content: 'Proceeding without new API keys.',
        type: 'user_api_key_response'
      });
    } else {
      addMessage({
        role: 'user',
        content: `API Key submitted for ${submittedServices.join(', ')}.`, 
        type: 'user_api_key_response'
      });
    }
    proceedToNextDemoStep();
  };

  const renderMessageContent = (message: Message): React.ReactNode | null => {
    if (isLoadingNextStep && messages.length > 0 && messages[messages.length - 1]?.id === message.id && currentStep < demoConversationSteps.length ) {
        const nextPotentialStepType = demoConversationSteps[currentStep]().type;
        if (nextPotentialStepType === 'tool_selection' || nextPotentialStepType === 'api_keys_group') {
             return <p className="whitespace-pre-wrap text-sm">{message.content}</p>;
        }
    }

    if (message.role === 'assistant') {
      if (message.type === 'tool_selection' && message.meta?.services) {
        return (
          <ToolSelector 
            availableTools={message.meta.services.map((s: any) => s.name || s) || mockTools} 
            onToolSelect={handleToolSelection} 
            title={message.content}
          />
        );
      }
      if (message.type === 'api_keys_group') {
        // If there are tools specifically selected by the user for API key input, use them.
        if (toolsRequiringApiKeys.length > 0) {
          return (
            <div className="p-1 space-y-3 w-full max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-center">API Keys</h3>
              <p className="text-sm text-muted-foreground text-center mb-3">{message.content}</p> 
              <div className="space-y-2">
                {toolsRequiringApiKeys.map(toolName => (
                  <ApiKeyEntryRow 
                    key={toolName} 
                    serviceName={toolName}
                    value={enteredApiKeys[toolName] || ''} 
                    onValueChange={(value) => handleApiKeyChange(toolName, value)} 
                  />
                ))}
              </div>
              {toolsRequiringApiKeys.length > 0 && (
                <Button 
                  onClick={handleBulkApiKeySubmit} 
                  className="w-full mt-4"
                >
                  Submit All API Keys
                </Button>
              )}
              <p className="text-xs text-muted-foreground text-center pt-2">
                Your API keys will be handled securely.
              </p>
            </div>
          );
        } else if (message.meta?.services && message.meta.services.length > 0) {
          // Fallback to original behavior if no tools were specifically set from selection
          const serviceName = message.meta.services[0]; 
          return (
            <ApiKeyInput // Original component with Card styling for single/fallback case
              serviceName={serviceName}
              onApiKeySubmit={(apiKey) => addMessage({
                role: 'user',
                content: `API Key submitted for ${serviceName}.`,
                type: 'user_api_key_response'
              })}
              description={message.content} 
            />
          );
        }
      }
    }
    return null; 
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <div
          className={cn(
            "md:order-2 bg-muted/30 p-4 md:p-6 transition-all duration-500 ease-in-out flex flex-col overflow-y-auto", 
            showAgents ? "md:w-3/5 lg:w-2/3" : "md:w-0 md:p-0 hidden"
          )}
        >
          {/* Conditional rendering for AgentVisualization and StorylineSequenceView */}
          {showAgents && (
            <div className="flex flex-col space-y-6"> 
              {selectedAgent && ( 
                <div className="flex-shrink-0"> 
                  <AgentVisualization 
                    agents={mockAgents} 
                    activeAgent={selectedAgent} 
                    onAgentClick={(agent) => {
                      console.log('Agent clicked:', agent.name);
                      setSelectedAgent(agent); // Set the selected agent when clicked
                    }} 
                    isBuilding={true} 
                    isTesting={false}
                    onAgentsUpdate={(updatedAgents) => console.log('Agents updated:', updatedAgents)} 
                  />
                </div>
              )}
              {/* Agent-specific content */}
              <div className={selectedAgent ? "flex-grow" : "w-full"}> 
                {selectedAgent && selectedAgent.name.includes("Detect") ? (
                  <DetectAgentView isActive={true} />
                ) : selectedAgent && selectedAgent.name.includes("Root") ? (
                  <StorylineSequenceView isActive={showAgents} />
                ) : selectedAgent && selectedAgent.name.includes("Plan") ? (
                  <PlanAgentView isActive={true} />
                ) : null}
              </div>
            </div>
          )}
        </div>

        <div 
          className={cn(
            "flex-1 flex flex-col ",
            "order-2 md:order-1 transition-all duration-500 ease-in-out",
            showAgents ? "md:w-2/5 lg:w-1/3" : "w-full max-w-2xl mx-auto"
          )}
        >
          <ChatContainer
            initialMessages={messages} 
            onSendMessage={handleSendMessage} 
            placeholder="Describe your automation goal..."
            chatUIClassName="h-[calc(100vh-150px)] md:h-[calc(100vh-120px)]" 
            renderMessageContent={renderMessageContent}
          />
        </div>
      </main>
    </div>
  )
}
