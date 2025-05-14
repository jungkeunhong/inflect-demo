import type { ToolInterface } from "@/lib/types"
import { Badge } from "@/components/ui/badge"

export default function ContentInterface({ isActive }: ToolInterface) {
  return (
    <div className="space-y-3">
      <div className="font-medium">Content Recommendation</div>

      <div className="border rounded-md p-3 bg-white">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Selected Track</div>
            <Badge className={isActive ? "bg-green-500" : "bg-blue-500"}>Tech Growth</Badge>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">Recommended Features</div>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center p-2 border rounded bg-gray-50">
                <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                <div>
                  <div className="text-sm">API Integration</div>
                  <div className="text-xs text-gray-500">High relevance for tech companies</div>
                </div>
              </div>
              <div className="flex items-center p-2 border rounded bg-gray-50">
                <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                <div>
                  <div className="text-sm">Team Collaboration</div>
                  <div className="text-xs text-gray-500">Important for mid-market segment</div>
                </div>
              </div>
              <div className="flex items-center p-2 border rounded bg-gray-50">
                <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                <div>
                  <div className="text-sm">Performance Analytics</div>
                  <div className="text-xs text-gray-500">Matches tech stack preferences</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isActive && <div className="text-xs text-green-600 animate-pulse">Selecting optimal content approach...</div>}
    </div>
  )
}
