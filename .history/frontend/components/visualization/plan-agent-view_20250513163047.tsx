"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Users, Target, BarChart3, ArrowUpCircle } from "lucide-react"
import { BadgeDelta } from "@/components/ui/badge-delta"
import { cn } from "@/lib/utils"

// Sample data for user segments
const userSegments = [
  { 
    id: "seg_1", 
    name: "High-Value At Risk", 
    count: 82,
    change: "+12%",
    status: "increase" as const
  },
  { 
    id: "seg_2", 
    name: "Recent Drop-offs", 
    count: 147,
    change: "+8%",
    status: "increase" as const
  },
  { 
    id: "seg_3", 
    name: "Long-term Inactive", 
    count: 215,
    change: "-5%",
    status: "decrease" as const
  },
  { 
    id: "seg_4", 
    name: "Feature Underutilizers", 
    count: 176,
    change: "+3%",
    status: "increase" as const
  },
]

// Win-back strategies
const winBackStrategies = [
  {
    icon: Target,
    title: "Personalized Re-engagement",
    description: "Targeted emails with personalized content based on past behavior",
    effectiveness: "High",
    deltaType: "increase" as const
  },
  {
    icon: BarChart3,
    title: "Usage Incentives",
    description: "Special offers to encourage product feature adoption",
    effectiveness: "Medium",
    deltaType: "neutral" as const
  },
  {
    icon: ArrowUpCircle,
    title: "Upgrade Path",
    description: "Clear upgrade benefits for users nearing plan limits",
    effectiveness: "High",
    deltaType: "increase" as const
  },
  {
    icon: Users,
    title: "Community Connection",
    description: "Invitations to user communities and events",
    effectiveness: "Medium",
    deltaType: "neutral" as const
  }
]

interface PlanAgentViewProps {
  isActive: boolean
}

export default function PlanAgentView({ isActive }: PlanAgentViewProps) {
  if (!isActive) return null
  
  return (
    <div className="w-full max-w-5xl mx-auto">
      <Card className="w-full bg-white rounded-lg shadow-sm border-0">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 mb-1">
            <CardTitle className="text-2xl font-bold text-gray-800">📋 Plan Agent</CardTitle>
          </div>          
          <p className="mt-2 text-gray-600">
            I categorize at-risk customers and recommend personalized win-back strategies.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-8 pt-2">
          {/* User Segmentation Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">User Segmentation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userSegments.map((segment) => (
                <Card key={segment.id} className="border border-gray-100">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-800">{segment.name}</h4>
                      <BadgeDelta 
                        deltaType={segment.status} 
                        value={segment.change} 
                        iconStyle="arrow"
                      />
                    </div>
                    <div className="mt-2">
                      <span className="text-2xl font-bold text-gray-900">{segment.count}</span>
                      <span className="text-sm text-gray-500 ml-1">users</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Win-back Strategies Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Win-back Strategies</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {winBackStrategies.map((strategy, index) => (
                <Card key={index} className="border border-gray-100">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 p-2 rounded-full bg-blue-50">
                        <strategy.icon className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-800">{strategy.title}</h4>
                          <BadgeDelta 
                            deltaType={strategy.deltaType}
                            value={strategy.effectiveness} 
                            variant="outline"
                            className="ml-2"
                          />
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{strategy.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Implementation Timeline */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Implementation Timeline</h3>
            <Card className="border border-gray-100">
              <CardContent className="p-4">
                <div className="relative">
                  {/* Timeline track */}
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                  
                  {/* Timeline items */}
                  <div className="space-y-6 relative ml-12">
                    <div>
                      <div className="absolute -left-12 mt-1.5 rounded-full bg-blue-600 p-1">
                        <div className="h-2 w-2 rounded-full bg-white"></div>
                      </div>
                      <h4 className="text-md font-medium text-gray-800">Immediate (1-2 days)</h4>
                      <p className="mt-1 text-sm text-gray-600">
                        Begin personalized re-engagement campaigns for high-value at-risk users
                      </p>
                    </div>
                    
                    <div>
                      <div className="absolute -left-12 mt-1.5 rounded-full bg-blue-400 p-1">
                        <div className="h-2 w-2 rounded-full bg-white"></div>
                      </div>
                      <h4 className="text-md font-medium text-gray-800">Short-term (1 week)</h4>
                      <p className="mt-1 text-sm text-gray-600">
                        Deploy usage incentives to recent drop-offs and feature underutilizers
                      </p>
                    </div>
                    
                    <div>
                      <div className="absolute -left-12 mt-1.5 rounded-full bg-blue-300 p-1">
                        <div className="h-2 w-2 rounded-full bg-white"></div>
                      </div>
                      <h4 className="text-md font-medium text-gray-800">Medium-term (2-4 weeks)</h4>
                      <p className="mt-1 text-sm text-gray-600">
                        Launch upgrade path communications and community connection initiatives
                      </p>
                    </div>
                    
                    <div>
                      <div className="absolute -left-12 mt-1.5 rounded-full bg-blue-200 p-1">
                        <div className="h-2 w-2 rounded-full bg-white"></div>
                      </div>
                      <h4 className="text-md font-medium text-gray-800">Long-term (1-2 months)</h4>
                      <p className="mt-1 text-sm text-gray-600">
                        Evaluate strategy effectiveness and refine targeting based on response data
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