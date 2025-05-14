"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { AlertCircle, TrendingDown, Users, AlertTriangle, Search } from "lucide-react"
import { cn } from "@/lib/utils"

// Sample data for flagged users
const flaggedUsers = [
  { id: "usr_1", name: "Jane Kim", riskScore: 88 },
  { id: "usr_2", name: "David Lee", riskScore: 81 },
  { id: "usr_3", name: "Monica Alvarez", riskScore: 76 },
  { id: "usr_4", name: "Thomas Wright", riskScore: 72 },
]

// Detection use cases
const detectionUseCases = [
  {
    icon: AlertCircle,
    title: "Users who stop logging in",
    description: "Detects users who suddenly stop logging in after a product update"
  },
  {
    icon: TrendingDown,
    title: "Drop in session duration",
    description: "Identifies when users start spending less time on your platform"
  },
  {
    icon: Users,
    title: "Skipped onboarding steps",
    description: "Flags users who aren't completing crucial onboarding steps"
  },
  {
    icon: AlertTriangle,
    title: "Inactive free users",
    description: "Highlights free users who aren't activating key features"
  }
]

interface DetectAgentViewProps {
  isActive: boolean
}

export default function DetectAgentView({ isActive }: DetectAgentViewProps) {
  if (!isActive) return null
  
  return (
    <div className="w-full max-w-5xl mx-auto">
      <Card className="w-full bg-white rounded-lg shadow-sm border-0">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 mb-1">
            <Search className="h-6 w-6 text-blue-600" />
            <CardTitle className="text-2xl font-bold text-gray-800">🔍 Detect Agent</CardTitle>
          </div>
          <CardDescription className="text-base text-blue-600">
            "I scan your customer activity and spot unusual patterns before they churn."
          </CardDescription>
          <p className="mt-2 text-gray-600">
            Think: silent users, drop-offs, or sudden behavior shifts.
            I analyze behavioral data and flag anomalies before customers disappear.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-8 pt-2">
          {/* Detection Use Cases Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Detection Use Cases</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {detectionUseCases.map((useCase, index) => (
                <Card key={index} className="border border-gray-100">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 p-2 rounded-full bg-blue-50">
                        <useCase.icon className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">{useCase.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{useCase.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Sample Output Preview Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Sample Output Preview</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Simplified Chart (static visualization instead of Recharts) */}
              <Card className="border border-gray-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-md">Anomaly Trend Preview</CardTitle>
                  <CardDescription>Last 7 days of anomaly detection</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[240px] w-full relative bg-gray-50 rounded-md p-4 flex items-end">
                    {/* Static bars to represent anomaly data */}
                    <div className="flex items-end justify-between w-full h-full">
                      <div className="flex flex-col items-center">
                        <div className="flex gap-1 h-full items-end">
                          <div style={{height: '25%'}} className="w-6 bg-blue-200 rounded-t"></div>
                          <div style={{height: '20%'}} className="w-6 bg-gray-200 rounded-t"></div>
                        </div>
                        <span className="text-xs mt-2">May 1</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="flex gap-1 h-full items-end">
                          <div style={{height: '20%'}} className="w-6 bg-blue-200 rounded-t"></div>
                          <div style={{height: '20%'}} className="w-6 bg-gray-200 rounded-t"></div>
                        </div>
                        <span className="text-xs mt-2">May 2</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="flex gap-1 h-full items-end">
                          <div style={{height: '30%'}} className="w-6 bg-blue-200 rounded-t"></div>
                          <div style={{height: '20%'}} className="w-6 bg-gray-200 rounded-t"></div>
                        </div>
                        <span className="text-xs mt-2">May 3</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="flex gap-1 h-full items-end">
                          <div style={{height: '40%'}} className="w-6 bg-blue-200 rounded-t"></div>
                          <div style={{height: '20%'}} className="w-6 bg-gray-200 rounded-t"></div>
                        </div>
                        <span className="text-xs mt-2">May 4</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="flex gap-1 h-full items-end">
                          <div style={{height: '60%'}} className="w-6 bg-blue-200 rounded-t"></div>
                          <div style={{height: '20%'}} className="w-6 bg-gray-200 rounded-t"></div>
                        </div>
                        <span className="text-xs mt-2">May 5</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="flex gap-1 h-full items-end">
                          <div style={{height: '45%'}} className="w-6 bg-blue-200 rounded-t"></div>
                          <div style={{height: '20%'}} className="w-6 bg-gray-200 rounded-t"></div>
                        </div>
                        <span className="text-xs mt-2">May 6</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="flex gap-1 h-full items-end">
                          <div style={{height: '75%'}} className="w-6 bg-blue-200 rounded-t"></div>
                          <div style={{height: '20%'}} className="w-6 bg-gray-200 rounded-t"></div>
                        </div>
                        <span className="text-xs mt-2">May 7</span>
                      </div>
                    </div>
                    
                    {/* Legend */}
                    <div className="absolute top-2 right-2 flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-blue-200"></div>
                        <span className="text-xs">Anomaly Score</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-gray-200"></div>
                        <span className="text-xs">Baseline</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Flagged Users List */}
              <Card className="border border-gray-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-md">Flagged Users</CardTitle>
                  <CardDescription>Users at high risk of churning</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {flaggedUsers.map(user => (
                      <div 
                        key={user.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            user.riskScore > 80 ? "bg-red-500" : "bg-amber-500"
                          )} />
                          <span className="font-medium">{user.name}</span>
                        </div>
                        <div className={cn(
                          "text-sm font-semibold px-2 py-1 rounded-full",
                          user.riskScore > 80 
                            ? "bg-red-100 text-red-600" 
                            : "bg-amber-100 text-amber-600"
                        )}>
                          {user.riskScore}% risk
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 