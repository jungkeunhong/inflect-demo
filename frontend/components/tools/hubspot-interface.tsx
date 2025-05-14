import type { ToolInterface } from "@/lib/types"

export default function HubSpotInterface({ isActive }: ToolInterface) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="font-medium">New Signup Detected</div>
        <div className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">New</div>
      </div>

      <div className="border rounded-md p-3 bg-white">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <div className="text-gray-500 text-xs">Email</div>
            <div>tech@techcorp.com</div>
          </div>
          <div>
            <div className="text-gray-500 text-xs">Company</div>
            <div>TechCorp Inc.</div>
          </div>
          <div>
            <div className="text-gray-500 text-xs">Signup Date</div>
            <div>May 9, 2025</div>
          </div>
          <div>
            <div className="text-gray-500 text-xs">Source</div>
            <div>Website Demo</div>
          </div>
        </div>
      </div>

      {isActive && <div className="text-xs text-green-600 animate-pulse">Processing new signup data...</div>}
    </div>
  )
}
