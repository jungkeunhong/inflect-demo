import type { ToolInterface } from "@/lib/types"

export default function IntercomInterface({ isActive }: ToolInterface) {
  return (
    <div className="space-y-3">
      <div className="font-medium">In-App Messages</div>

      <div className="border rounded-md p-3 bg-white">
        <div className="space-y-3">
          <div className={`p-3 border rounded ${isActive ? "border-green-500 bg-green-50" : "border-gray-200"}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium">Welcome Message</div>
              {isActive && <div className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">Configuring</div>}
            </div>

            <div className="text-sm bg-white p-2 border rounded">
              <div className="font-medium mb-1">Welcome to Our Platform, TechCorp!</div>
              <div className="text-xs text-gray-600">
                We're excited to have you on board. Our API integration features will help you scale your operations
                efficiently. Would you like to schedule a technical onboarding call?
              </div>
            </div>

            <div className="flex gap-2 mt-2">
              <div className="text-xs bg-blue-500 text-white px-2 py-1 rounded text-center flex-1">Schedule Call</div>
              <div className="text-xs border border-gray-300 px-2 py-1 rounded text-center flex-1">
                Explore API Docs
              </div>
            </div>
          </div>

          <div className="p-3 border rounded border-gray-200">
            <div className="text-sm font-medium mb-2">Feature Announcement</div>
            <div className="text-sm bg-white p-2 border rounded">
              <div className="font-medium mb-1">Team Collaboration Tools Now Available</div>
              <div className="text-xs text-gray-600">
                Based on your company profile, we think you'll love our team collaboration features. Click below to
                enable them for your account.
              </div>
            </div>
          </div>
        </div>
      </div>

      {isActive && <div className="text-xs text-green-600 animate-pulse">Configuring in-app messaging...</div>}
    </div>
  )
}
