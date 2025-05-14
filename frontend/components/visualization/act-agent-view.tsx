"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, MessageSquare, MonitorSmartphone, Calendar, AlertCircle, CheckCircle2 } from "lucide-react"

interface ActAgentViewProps {
  isActive: boolean
}

// Sample data for execution summary
const executionSummary = [
  {
    user: "Monica Alvarez",
    channel: "Slack",
    message: "Monica Alvarez shows 85% churn risk. Offer trial extension?",
    status: "Scheduled"
  },
  {
    user: "Jane Kim",
    channel: "Email",
    message: "We miss you — enjoy 7 more days free",
    status: "Waiting on API Key"
  },
  {
    user: "David Lee",
    channel: "In-app",
    message: "Need help getting started? Book a 1:1 session",
    status: "Ready"
  }
]

export default function ActAgentView({ isActive }: ActAgentViewProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [fadeInClass, setFadeInClass] = useState("")
  
  useEffect(() => {
    if (isActive) {
      setIsVisible(true)
      setTimeout(() => {
        setFadeInClass("opacity-100 translate-y-0")
      }, 100)
    }
  }, [isActive])
  
  if (!isVisible) return null
  
  return (
    <div 
      className={cn(
        "opacity-0 translate-y-4 transition-all duration-500 ease-in-out",
        fadeInClass
      )}
    >
      <Card className="bg-white/80 mb-6 shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                🚀 Act Agent
              </CardTitle>
              <p className="text-gray-600 font-medium text-sm mt-1 italic">
                "I deliver the plan — right message, right place, right time."
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>

          
          <h3 className="text-md font-medium mb-3 text-gray-700">Channel Use Cases</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Email Channel Card */}
            <Card className="bg-white border border-blue-100">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-blue-50 p-2 rounded-full">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="font-medium text-blue-800">Email</h3>
                </div>
                <div className="border border-blue-50 rounded-md p-3 bg-blue-50/50 mt-2">
                  <p className="text-sm font-medium text-gray-700">Subject: "We miss you — enjoy 7 more days free"</p>
                  <p className="text-xs text-gray-500 mt-1">To: Jane Kim (jane@example.com)</p>
                  <p className="text-xs text-gray-500 mt-3">Preview: Click here to extend your trial...</p>
                </div>
              </CardContent>
            </Card>
            
            {/* Slack Channel Card */}
            <Card className="bg-white border border-purple-100">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-purple-50 p-2 rounded-full">
                    <MessageSquare className="h-5 w-5 text-purple-600" />
                  </div>
                  <h3 className="font-medium text-purple-800">Slack</h3>
                </div>
                <div className="border border-purple-50 rounded-md p-3 bg-purple-50/50 mt-2">
                  <p className="text-sm font-medium text-gray-700">
                    "Monica Alvarez shows 85% churn risk. Offer trial extension?"
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Channel: #customer-success</p>
                  <p className="text-xs text-gray-500 mt-3">Urgency: High</p>
                </div>
              </CardContent>
            </Card>
            
            {/* In-app Channel Card */}
            <Card className="bg-white border border-green-100">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-green-50 p-2 rounded-full">
                    <MonitorSmartphone className="h-5 w-5 text-green-600" />
                  </div>
                  <h3 className="font-medium text-green-800">In-app</h3>
                </div>
                <div className="border border-green-50 rounded-md p-3 bg-green-50/50 mt-2">
                  <p className="text-sm font-medium text-gray-700">
                    "Need help getting started? Book a 1:1 session"
                  </p>
                  <p className="text-xs text-gray-500 mt-1">User: David Lee</p>
                  <p className="text-xs text-gray-500 mt-3">Format: Banner notification</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <h3 className="text-md font-medium mb-3 text-gray-700">Execution Summary</h3>
          
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Channel
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Message
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {executionSummary.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.user}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{item.channel}</div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="text-sm text-gray-500 truncate max-w-xs">{item.message}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        {item.status === "Scheduled" && (
                          <span className="flex items-center px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                            <Calendar className="w-3 h-3 mr-1" />
                            {item.status}
                          </span>
                        )}
                        {item.status === "Waiting on API Key" && (
                          <span className="flex items-center px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            {item.status}
                          </span>
                        )}
                        {item.status === "Ready" && (
                          <span className="flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            {item.status}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 