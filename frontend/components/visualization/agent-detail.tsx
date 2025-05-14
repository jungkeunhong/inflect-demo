"use client"

import { type Agent } from "@/lib/types"
import ToolInterface from "./tool-interface"
import { getAgentSteps } from "@/lib/utils"
import { Circle, Timer, CheckCircle2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface AgentDetailProps {
  agent: Agent
  isTesting: boolean
  progress?: {
    step: string
    details: string
    timestamp?: string
    percentComplete?: number
  }
}

export default function AgentDetail({ agent, isTesting, progress }: AgentDetailProps) {
  const steps = getAgentSteps(agent.id)
  
  const getStatusDetails = (status: Agent["status"]) => {
    switch (status) {
      case "idle":
        return {
          icon: Circle,
          color: "text-gray-400",
          bgColor: "bg-gray-50",
          text: "Waiting"
        }
      case "running":
        return {
          icon: Timer,
          color: "text-blue-500",
          bgColor: "bg-blue-50",
          text: "Running"
        }
      case "completed":
        return {
          icon: CheckCircle2,
          color: "text-green-500",
          bgColor: "bg-green-50",
          text: "Completed"
        }
      case "error":
        return {
          icon: AlertCircle,
          color: "text-red-500",
          bgColor: "bg-red-50",
          text: "Error"
        }
      default:
        return {
          icon: Circle,
          color: "text-gray-400",
          bgColor: "bg-gray-50",
          text: "Unknown"
        }
    }
  }

  const status = getStatusDetails(agent.status)
  const StatusIcon = status.icon

  return (
    <div className="h-full p-6 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">{agent.name}</h2>
        <div className="flex items-center space-x-2">
          <StatusIcon className={cn("h-4 w-4", status.color)} />
          <span className={cn("text-sm", status.color)}>{status.text}</span>
          {progress?.percentComplete !== undefined && (
            <span className="text-sm text-gray-500">
              ({Math.round(progress.percentComplete)}% complete)
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-2">{agent.description}</p>
      </div>

      {/* Status indicator */}
      {isTesting && (
        <div className="mb-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium mb-2">Current Process</h3>
          <div className="flex flex-col space-y-4">
            {steps.map((step, index) => {
              const isCurrentStep = progress?.step === step
              const isCompleted = agent.status === "completed" || 
                (steps.indexOf(progress?.step || "") > index)
              
              return (
                <div key={index} className="flex items-start">
                  <div
                    className={cn(
                      "flex items-center justify-center h-8 w-8 rounded-full mt-1",
                      isCurrentStep ? "bg-blue-100 text-blue-600" :
                      isCompleted ? "bg-green-100 text-green-600" :
                      agent.status === "error" ? "bg-red-100 text-red-600" :
                      "bg-gray-100 text-gray-500"
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="text-sm font-medium">{step}</div>
                    {isCurrentStep && progress?.details && (
                      <div className="mt-1">
                        <div className="text-sm text-gray-500">{progress.details}</div>
                        {progress.timestamp && (
                          <div className="text-xs text-gray-400 mt-1">
                            {new Date(progress.timestamp).toLocaleTimeString()}
                          </div>
                        )}
                        {progress.percentComplete !== undefined && (
                          <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 transition-all duration-500"
                              style={{ width: `${progress.percentComplete}%` }}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={cn(
                      "border-l h-8 mx-4 my-2",
                      isCompleted ? "border-green-200" : "border-gray-200"
                    )} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Tool interfaces */}
      <div className="grid grid-cols-1 gap-6">
        {agent.tools.map((tool) => (
          <ToolInterface 
            key={tool} 
            tool={tool} 
            agentId={agent.id} 
            isActive={agent.status === "running" && isTesting} 
          />
        ))}
      </div>
    </div>
  )
}
