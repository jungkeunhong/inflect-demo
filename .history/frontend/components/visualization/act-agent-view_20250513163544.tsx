"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Mail, MessageSquare, MonitorSmartphone, Clock, CheckCircle2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

// Sample message data
const messageData = [
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

// Channel cards data
const channelCards = [
  {
    title: "Email",
    icon: Mail,
    emoji: "📧",
    subject: "We miss you — enjoy 7 more days free",
    description: "Personalized emails with discounts, offers, or helpful resources based on usage patterns",
    preview: "Hi Jane, We noticed you haven't been using our product lately. We've added 7 days to your account!"
  },
  {
    title: "Slack (Internal Alert)",
    icon: MessageSquare,
    emoji: "💬",
    subject: "Monica Alvarez shows 85% churn risk. Offer trial extension?",
    description: "Alert your customer success team about high-risk users so they can take immediate action",
    preview: "CS Alert: High-risk user detected. Monica Alvarez (monica@example.com) hasn't logged in for 14 days."
  },
  {
    title: "In-app Banner",
    icon: MonitorSmartphone,
    emoji: "🖥️",
    subject: "Need help getting started? Book a 1:1 session",
    description: "Contextual messages shown to users while they're actively using your product",
    preview: "Hi David, Looking for help with our advanced features? Book a free 30-minute session with our team."
  }
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Ready":
      return <CheckCircle2 className="h-4 w-4 text-green-500" />
    case "Scheduled":
      return <Clock className="h-4 w-4 text-blue-500" />
    default:
      return <AlertCircle className="h-4 w-4 text-amber-500" />
  }
}

interface ActAgentViewProps {
  isActive: boolean
}

export default function ActAgentView({ isActive }: ActAgentViewProps) {
  if (!isActive) return null
  
  return (
    <div className="w-full max-w-5xl mx-auto">
      <Card className="w-full bg-white rounded-lg shadow-sm border-0">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 mb-1">
            <CardTitle className="text-2xl font-bold text-gray-800">🚀 Act Agent</CardTitle>
          </div>
          <p className="text-lg text-gray-700 font-medium">I deliver the plan — right message, right place, right time.</p>
          <p className="mt-2 text-gray-600">
            Once the strategy is ready, I send the actual message — whether it's a coupon email, 
            a Slack alert to your CS team, or a personalized in-app nudge.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-8 pt-2">
          {/* Channel Use Case Cards */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Delivery Channels</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {channelCards.map((channel, index) => (
                <Card key={index} className="border border-gray-100">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 p-2 rounded-full bg-blue-50">
                        <channel.icon className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-800">{channel.title}</h4>
                          <span className="text-xl">{channel.emoji}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{channel.description}</p>
                      </div>
                    </div>
                    <div className="mt-3 p-3 bg-gray-50 rounded-md border border-gray-100 text-sm">
                      <p className="font-medium text-gray-700">{channel.subject}</p>
                      <p className="text-gray-600 mt-1 text-xs">{channel.preview}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Execution Summary Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Execution Summary</h3>
            <Card className="border border-gray-100">
              <CardContent className="p-4">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Channel
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Message
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {messageData.map((message, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {message.user}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {message.channel}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 max-w-md truncate">
                            {message.message}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center gap-1.5">
                              {getStatusIcon(message.status)}
                              <span className={cn(
                                message.status === "Ready" ? "text-green-700" : 
                                message.status === "Scheduled" ? "text-blue-700" : 
                                "text-amber-700"
                              )}>
                                {message.status}
                              </span>
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
          
          {/* Activity Feed */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Activity Feed</h3>
            <Card className="border border-gray-100">
              <CardContent className="p-4">
                <div className="relative">
                  {/* Timeline track */}
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                  
                  {/* Timeline items */}
                  <div className="space-y-4 relative ml-12">
                    <div>
                      <div className="absolute -left-12 mt-1 rounded-full bg-green-500 p-1">
                        <div className="h-2 w-2 rounded-full bg-white"></div>
                      </div>
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Just now</span> - Message to David Lee was marked as ready
                      </p>
                    </div>
                    
                    <div>
                      <div className="absolute -left-12 mt-1 rounded-full bg-blue-500 p-1">
                        <div className="h-2 w-2 rounded-full bg-white"></div>
                      </div>
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">5 minutes ago</span> - Slack alert for Monica Alvarez scheduled
                      </p>
                    </div>
                    
                    <div>
                      <div className="absolute -left-12 mt-1 rounded-full bg-amber-500 p-1">
                        <div className="h-2 w-2 rounded-full bg-white"></div>
                      </div>
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">20 minutes ago</span> - Email to Jane Kim pending API key
                      </p>
                    </div>
                    
                    <div>
                      <div className="absolute -left-12 mt-1 rounded-full bg-gray-500 p-1">
                        <div className="h-2 w-2 rounded-full bg-white"></div>
                      </div>
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">1 hour ago</span> - Received 3 new messages from Plan Agent
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 