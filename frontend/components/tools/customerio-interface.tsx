import type { ToolInterface } from "@/lib/types"

export default function CustomerioInterface({ isActive }: ToolInterface) {
  return (
    <div className="space-y-3">
      <div className="font-medium">Email Sequence</div>

      <div className="border rounded-md p-3 bg-white">
        <div className="space-y-3">
          <div className="text-sm font-medium">Tech Growth - 5-part sequence</div>

          <div className="space-y-2">
            {[
              { day: "Day 1", subject: "Welcome to Our Platform - Get Started with API Integration" },
              { day: "Day 3", subject: "Unlock Team Collaboration Features" },
              { day: "Day 5", subject: "Performance Analytics: Track Your Success" },
              { day: "Day 8", subject: "Case Study: How Tech Companies Scale with Our Platform" },
              { day: "Day 12", subject: "Book Your Technical Onboarding Session" },
            ].map((email, index) => (
              <div
                key={index}
                className={`p-2 border rounded ${
                  isActive && index === 0 ? "border-green-500 bg-green-50" : "border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-xs font-medium">{email.day}</div>
                  {isActive && index === 0 && (
                    <div className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">Creating</div>
                  )}
                </div>
                <div className="text-sm mt-1">{email.subject}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isActive && <div className="text-xs text-green-600 animate-pulse">Preparing personalized email sequence...</div>}
    </div>
  )
}
