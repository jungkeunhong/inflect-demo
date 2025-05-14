"use client"

import { type Agent } from "@/lib/types"
import { cn } from "@/lib/utils"
import { getToolIcon } from "@/lib/utils"
import { ChevronRight, CheckCircle2, Circle, Timer, AlertCircle } from "lucide-react"

interface AgentFlowProps {
  agents: Agent[]
  activeAgent: Agent | null
  onAgentClick: (agent: Agent) => void
  progressDetails?: Record<string, any>
}

// Helper function to get status details
function getStatusDetails(status: Agent["status"]) {
  switch (status) {
    case "idle":
      return {
        icon: Circle,
        color: "text-gray-400",
        bgColor: "bg-gray-50",
        borderColor: "border-gray-200",
        text: "Waiting"
      }
    case "running":
      return {
        icon: Timer,
        color: "text-blue-500",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-500",
        text: "Running"
      }
    case "completed":
      return {
        icon: CheckCircle2,
        color: "text-green-500",
        bgColor: "bg-green-50",
        borderColor: "border-green-500",
        text: "Completed"
      }
    case "error":
      return {
        icon: AlertCircle,
        color: "text-red-500",
        bgColor: "bg-red-50",
        borderColor: "border-red-500",
        text: "Error"
      }
    default:
      return {
        icon: Circle,
        color: "text-gray-400",
        bgColor: "bg-gray-50",
        borderColor: "border-gray-200",
        text: "Unknown"
      }
  }
}

export default function AgentFlow({ agents, activeAgent, onAgentClick }: AgentFlowProps) {
  if (agents.length === 0) {
    return (
      <div className="flex items-center justify-center h-16">
        <p className="text-gray-500">No agents configured yet</p>
      </div>
    )
  }

  // Check if we have a workflow with specific agent names (Root, Analyst, Storyline, Delivery)
  const hasOnboardingWorkflow = 
    agents.some(a => a.name.includes("Root")) &&
    agents.some(a => a.name.includes("Analyst")) &&
    agents.some(a => a.name.includes("Storyline")) &&
    agents.some(a => a.name.includes("Delivery"));

  // If we have an onboarding workflow, display agents in a specific order
  if (hasOnboardingWorkflow) {
    // Create ordered array of agents
    const workflowAgents = [
      agents.find(a => a.name.includes("Root")),
      agents.find(a => a.name.includes("Analyst")),
      agents.find(a => a.name.includes("Storyline")),
      agents.find(a => a.name.includes("Delivery"))
    ].filter(Boolean) as Agent[];

    return (
      <div className="flex items-start justify-between max-w-5xl mx-auto space-x-2">
        {workflowAgents.map((agent, index) => {
          const status = getStatusDetails(agent.status);
          const StatusIcon = status.icon;
          
          return (
            <div key={agent.id} className="flex items-start flex-1">
              <div
                className={cn(
                  "w-full border rounded-lg p-3 cursor-pointer transition-all shadow-sm hover:shadow-md",
                  activeAgent?.id === agent.id && "ring-2 ring-primary ring-offset-2",
                  status.borderColor,
                  "bg-white"
                )}
                onClick={() => onAgentClick(agent)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium">{agent.name}</div>
                  <StatusIcon className={cn("h-4 w-4", status.color)} />
                </div>
                
                {/* Tools */}
                <div className="flex items-center space-x-1 mb-2">
                  {agent.tools.map((tool) => {
                    const ToolIcon = getToolIcon(tool)
                    return (
                      <div
                        key={tool}
                        className={cn(
                          "w-6 h-6 flex items-center justify-center rounded-full border",
                          "bg-white border-gray-200"
                        )}
                      >
                        <ToolIcon className="h-3 w-3" />
                      </div>
                    )
                  })}
                  {agent.tools.length === 0 && (
                    <div className="text-xs text-gray-500">No tools</div>
                  )}
                </div>
                
                {/* Status text */}
                <div className={cn("text-xs", status.color)}>
                  {status.text}
                </div>
                
                {/* Description */}
                <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {agent.description}
                </div>
              </div>
              
              {index < workflowAgents.length - 1 && (
                <div className="flex flex-col items-center mx-2 pt-6">
                  <ChevronRight className={cn(
                    "h-5 w-5",
                    agent.status === "completed" ? "text-green-500" : "text-gray-300"
                  )} />
                  <div className="text-[10px] text-gray-400">flow</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // Default rendering for non-workflow agents
  return (
    <div className="flex items-center justify-center space-x-4">
      {agents.map((agent, index) => {
        const status = getStatusDetails(agent.status);
        const StatusIcon = status.icon;
        
        return (
          <div key={agent.id} className="flex items-center">
            <div
              className={cn(
                "border rounded-lg p-3 cursor-pointer transition-all shadow-sm hover:shadow-md h-28",
                activeAgent?.id === agent.id && "ring-2 ring-primary ring-offset-2",
                status.borderColor,
                "bg-white"
              )}
              onClick={() => onAgentClick(agent)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium">{agent.name}</div>
                <StatusIcon className={cn("h-4 w-4", status.color)} />
              </div>
              
              <div className="flex flex-col space-y-2">
                {/* Tools */}
                <div className="flex items-center space-x-1">
                  {agent.tools.map((tool) => {
                    const ToolIcon = getToolIcon(tool)
                    return (
                      <div
                        key={tool}
                        className={cn(
                          "w-6 h-6 flex items-center justify-center rounded-full border",
                          "bg-white border-gray-200"
                        )}
                      >
                        <ToolIcon className="h-3 w-3" />
                      </div>
                    )
                  })}
                </div>
                
                {/* Status text */}
                <div className={cn("text-xs", status.color)}>
                  {status.text}
                </div>
              </div>
            </div>
            {index < agents.length - 1 && (
              <ChevronRight className={cn(
                "mx-2 h-5 w-5",
                agent.status === "completed" ? "text-green-500" : "text-gray-300"
              )} />
            )}
          </div>
        );
      })}
    </div>
  )
}
