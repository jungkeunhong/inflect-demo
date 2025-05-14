"use client"

import { Bot, Copy, ArrowUpRight } from "lucide-react"
import { WavyBackground } from "@/components/ui/wavy-background"
import { ChatInputWithActions } from "@/components/chat-input-with-actions"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import Link from "next/link"

interface HeroSectionProps {
  onSubmit: (message: string) => void
  onBuildAgentClick: () => void
}

// Define use cases with names and explanations
const useCases = [
  {
    name: "Personalized Onboarding",
    explanation: "Premium customers → VIP workflow",
    link: "/builder?case=onboarding"
  },
  {
    name: "Automated Lead Scoring Alerts",
    explanation: "HubSpot lead score 50+ → Gmail alert",
    link: "/builder?case=lead-scoring"
  },
  {
    name: "Dynamic Client Report Generation",
    explanation: "Google Analytics → HubSpot → Report",
    link: "/builder?case=report-generation"
  },
  {
    name: "Smart Ticket Routing Automation",
    explanation: "Intercom query → Keyword-based → Slack routing",
    link: "/builder?case=ticket-routing"
  },
  {
    name: "Project Milestone Invoicing",
    explanation: "Trello card moved → QuickBooks invoice",
    link: "/builder?case=milestone-invoicing"
  },
  {
    name: "Tailored Campaign Automation",
    explanation: "Lead score 50+ → Email campaign",
    link: "/builder?case=campaign-automation"
  },
  {
    name: "Client-Specific Workflow Creation",
    explanation: "Client type → Trello board setup",
    link: "/builder?case=custom-workflow"
  },
  {
    name: "PPC Campaign Performance Report",
    explanation: "PPC campaign → Dynamic report in Google Docs",
    link: "/builder?case=ppc-reports"
  },
  {
    name: "Efficient Team Task Syncing",
    explanation: "Intercom → Google Sheets → Slack notification",
    link: "/builder?case=task-syncing"
  }
];

// Use Case Button component with hover effect
function UseCaseButton({ useCase }: { useCase: typeof useCases[0] }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Link href={useCase.link} className="block">
      <Card 
        className="relative group bg-opacity-80 backdrop-blur-sm transition-all duration-300 hover:shadow-md hover:scale-105 overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex justify-between items-center p-4 align-items">
          <h3 className="text-sm font-base text-gray-800">{useCase.name}</h3>
          <ArrowUpRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
        </div>
        
        <div 
          className={`absolute inset-0 bg-primary/90 text-white flex items-center justify-center p-4 transition-all duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <p className="text-sm">{useCase.explanation}</p>
        </div>
      </Card>
    </Link>
  );
}

export function HeroSection({ onSubmit, onBuildAgentClick }: HeroSectionProps) {
  const [inputValue, setInputValue] = useState("")
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (inputValue.trim()) {
      onSubmit(inputValue.trim())
      setInputValue("")
    }
  }
  
  return (
    <WavyBackground 
      className="w-full max-w-4xl space-y-8 px-4"
      containerClassName="min-h-[calc(100vh-4rem)]"
      colors={["#e879f9", "#c084fc", "#818cf8", "#38bdf8", "#22d3ee"]}
      waveWidth={70}
      backgroundFill="white"
      blur={8}
      speed="slow"
      waveOpacity={0.6}
    >
      <h1 className="text-5xl font-bold text-center tracking-tighter font-switzer text-gray-900">
        What agent do you want to build?
      </h1>
      <h2 className="text-lg text-center tracking-tighter font-switzer font-medium text-gray-700">
        Automate your workflow easier than Zapier and Make.com
        <br />
        No code, No flowchart, No stress.
      </h2>

      <div className="w-full max-w-2xl mx-auto">
        <Card className="bg-white rounded-xl p-4">
          <ChatInputWithActions
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onSubmit={handleSubmit}
            placeholder="Ask Inflect to automate your mundane tasks"
            actionLabel="Send"
            showAttach={false}
            actionButtons={[
              <Button 
                key="build-agent"
                variant="ghost" 
                size="sm" 
                onClick={onBuildAgentClick}
                className="text-gray-500 hover:text-gray-700 hover:bg-transparent"
              >
                <Bot className="h-4 w-4 mr-1" />
                Builder mode
              </Button>,
              <Button 
                key="copy" 
                variant="ghost" 
                size="sm" 
                className="text-gray-500 hover:text-gray-700 hover:bg-transparent"
              >
                <Copy className="h-4 w-4" />                
              </Button>
            ]}
          />
        </Card>
      </div>

      {/* Use Cases Grid */}
      <div className="w-full max-w-5xl mx-auto mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {useCases.map((useCase) => (
            <UseCaseButton key={useCase.name} useCase={useCase} />
          ))}
        </div>
      </div>
    </WavyBackground>
  )
} 