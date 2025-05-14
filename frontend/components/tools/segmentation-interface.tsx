import type { ToolInterface } from "@/lib/types"
import { Check } from "lucide-react"

export default function SegmentationInterface({ isActive }: ToolInterface) {
  return (
    <div className="space-y-3">
      <div className="font-medium">Segmentation Rules</div>

      <div className="border rounded-md p-3 bg-white">
        <div className="space-y-4">
          <div>
            <div className="text-sm font-medium mb-2">Company Size</div>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className={`border rounded p-2 ${isActive ? "border-green-500 bg-green-50" : "border-gray-200"}`}>
                <div className="flex items-center">
                  {isActive && <Check className="h-4 w-4 text-green-500 mr-1" />}
                  <span>Mid-Market</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">50-500 employees</div>
              </div>
              <div className="border border-gray-200 rounded p-2">
                <span>SMB</span>
                <div className="text-xs text-gray-500 mt-1">&lt;50 employees</div>
              </div>
              <div className="border border-gray-200 rounded p-2">
                <span>Enterprise</span>
                <div className="text-xs text-gray-500 mt-1">&gt;500 employees</div>
              </div>
            </div>
          </div>

          <div>
            <div className="text-sm font-medium mb-2">Industry</div>
            <div className="grid grid-cols-4 gap-2 text-sm">
              <div className={`border rounded p-2 ${isActive ? "border-green-500 bg-green-50" : "border-gray-200"}`}>
                <div className="flex items-center">
                  {isActive && <Check className="h-4 w-4 text-green-500 mr-1" />}
                  <span>Tech</span>
                </div>
              </div>
              <div className="border border-gray-200 rounded p-2">
                <span>Healthcare</span>
              </div>
              <div className="border border-gray-200 rounded p-2">
                <span>Finance</span>
              </div>
              <div className="border border-gray-200 rounded p-2">
                <span>Other</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isActive && <div className="text-xs text-green-600 animate-pulse">Applying segmentation rules...</div>}
    </div>
  )
}
