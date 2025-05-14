import type { ToolInterface } from "@/lib/types"
import { BarChart } from "lucide-react"

export default function TrackerInterface({ isActive }: ToolInterface) {
  return (
    <div className="space-y-3">
      <div className="font-medium">Engagement Tracking</div>

      <div className="border rounded-md p-3 bg-white">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm">Tracking Configuration</div>
            {isActive && <div className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">Setting Up</div>}
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="border rounded p-2">
              <div className="font-medium mb-1">Email Engagement</div>
              <div className="flex items-center text-xs text-gray-500">
                <div className="h-2 w-2 rounded-full bg-green-500 mr-1"></div>
                <span>Opens</span>
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <div className="h-2 w-2 rounded-full bg-blue-500 mr-1"></div>
                <span>Clicks</span>
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <div className="h-2 w-2 rounded-full bg-purple-500 mr-1"></div>
                <span>Replies</span>
              </div>
            </div>

            <div className="border rounded p-2">
              <div className="font-medium mb-1">In-App Engagement</div>
              <div className="flex items-center text-xs text-gray-500">
                <div className="h-2 w-2 rounded-full bg-green-500 mr-1"></div>
                <span>Views</span>
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <div className="h-2 w-2 rounded-full bg-blue-500 mr-1"></div>
                <span>Button Clicks</span>
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <div className="h-2 w-2 rounded-full bg-purple-500 mr-1"></div>
                <span>Dismissals</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center items-center p-4 border-t border-gray-100">
            <div className="text-gray-400 flex items-center">
              <BarChart className="h-5 w-5 mr-2" />
              <span className="text-sm">Engagement data will appear here</span>
            </div>
          </div>
        </div>
      </div>

      {isActive && <div className="text-xs text-green-600 animate-pulse">Setting up engagement tracking...</div>}
    </div>
  )
}
