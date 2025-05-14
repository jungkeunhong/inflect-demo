import type { ToolInterface } from "@/lib/types"
import { Progress } from "@/components/ui/progress"

export default function MixpanelInterface({ isActive }: ToolInterface) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="font-medium">Analytics Profile</div>
        {isActive && <div className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Creating</div>}
      </div>

      <div className="border rounded-md p-3 bg-white">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div>Profile Completeness</div>
            <div className="font-medium">15 data points</div>
          </div>
          <Progress value={isActive ? 65 : 100} className="h-2" />

          <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
            <div>
              <div className="text-gray-500 text-xs">User ID</div>
              <div>user_tc_12345</div>
            </div>
            <div>
              <div className="text-gray-500 text-xs">First Seen</div>
              <div>May 9, 2025</div>
            </div>
            <div>
              <div className="text-gray-500 text-xs">Initial Interest</div>
              <div>API Integration</div>
            </div>
            <div>
              <div className="text-gray-500 text-xs">Referral Source</div>
              <div>Google Search</div>
            </div>
          </div>
        </div>
      </div>

      {isActive && <div className="text-xs text-green-600 animate-pulse">Creating comprehensive profile...</div>}
    </div>
  )
}
