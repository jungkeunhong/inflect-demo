import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getToolIcon, getToolName, getToolInterface } from "@/lib/utils"

interface ToolInterfaceProps {
  tool: string
  agentId: string
  isActive: boolean
}

export default function ToolInterface({ tool, agentId, isActive }: ToolInterfaceProps) {
  const ToolIcon = getToolIcon(tool)
  const toolName = getToolName(tool)
  const ToolContent = getToolInterface(tool, agentId)

  return (
    <Card className={`overflow-hidden transition-all ${isActive ? "border-green-500 shadow-md" : ""}`}>
      <CardHeader className="bg-gray-50 py-3">
        <CardTitle className="text-sm font-medium flex items-center">
          <ToolIcon className="h-4 w-4 mr-2" />
          {toolName}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <ToolContent isActive={isActive} />
      </CardContent>
    </Card>
  )
}
