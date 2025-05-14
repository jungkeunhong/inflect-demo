import AgentVisualization from "@/components/visualization/agent-visualization"
import { type ExtendedAgent } from "@/lib/types"

interface AgentVisualizationContainerProps {
  agents: ExtendedAgent[]
  activeAgent: ExtendedAgent | null
  onAgentClick: (agent: ExtendedAgent) => void
  isBuilding: boolean
  onAgentsUpdate: (agents: ExtendedAgent[]) => void
}

export function AgentVisualizationContainer({
  agents,
  activeAgent,
  onAgentClick,
  isBuilding,
  onAgentsUpdate
}: AgentVisualizationContainerProps) {
  return (
    <div className="w-full max-w-5xl mx-auto pt-8 pb-4">
      <AgentVisualization
        agents={agents}
        activeAgent={activeAgent}
        onAgentClick={onAgentClick}
        isBuilding={isBuilding}
        isTesting={false}
        onAgentsUpdate={onAgentsUpdate}
      />
    </div>
  )
} 