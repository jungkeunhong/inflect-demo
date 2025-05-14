import type { ToolInterface } from "@/lib/types"
import { Badge } from "@/components/ui/badge"

export default function ClearbitInterface({ isActive }: ToolInterface) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="font-medium">Company Enrichment</div>
        {isActive && (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Processing
          </Badge>
        )}
      </div>

      <div className="border rounded-md p-3 bg-white">
        <div className="space-y-3 text-sm">
          <div>
            <div className="text-gray-500 text-xs">Company</div>
            <div className="font-medium">TechCorp Inc.</div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-gray-500 text-xs">Size</div>
              <div>150 employees</div>
            </div>
            <div>
              <div className="text-gray-500 text-xs">Industry</div>
              <div>Technology</div>
            </div>
            <div>
              <div className="text-gray-500 text-xs">Funding</div>
              <div>$28M Series B</div>
            </div>
            <div>
              <div className="text-gray-500 text-xs">Location</div>
              <div>San Francisco, CA</div>
            </div>
          </div>

          <div>
            <div className="text-gray-500 text-xs">Tech Stack</div>
            <div className="flex flex-wrap gap-1 mt-1">
              <Badge variant="secondary" className="text-xs">
                React
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Node.js
              </Badge>
              <Badge variant="secondary" className="text-xs">
                AWS
              </Badge>
              <Badge variant="secondary" className="text-xs">
                MongoDB
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {isActive && <div className="text-xs text-green-600 animate-pulse">Enriching company data...</div>}
    </div>
  )
}
