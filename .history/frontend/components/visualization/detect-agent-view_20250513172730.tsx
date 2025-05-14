"use client"

import React, { useState, useEffect } from "react"
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
        "w-full max-w-5xl mx-auto opacity-0 translate-y-4 transition-all duration-500 ease-in-out",
        fadeInClass
      )}
    >
      <Card className="w-full bg-white rounded-lg shadow-sm border-0">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 mb-1">
            <CardTitle className="text-xl font-bold text-gray-800">🔍 Detect Agent</CardTitle>
          </div>          
          <p className="text-gray-600 font-medium text-sm mt-1 italic">
            "I analyze behavioral data and flag anomalies before customers disappear."
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
                  <div className="h-[240px] w-full relative bg-gray-50 rounded-md p-4">
                    {/* Y-axis labels */}
                    <div className="absolute left-2 top-0 h-full flex flex-col justify-between pb-8">
                      <span className="text-xs text-gray-500">20</span>
                      <span className="text-xs text-gray-500">15</span>
                      <span className="text-xs text-gray-500">10</span>
                      <span className="text-xs text-gray-500">5</span>
                      <span className="text-xs text-gray-500">0</span>
                    </div>
                    
                    {/* Chart grid */}
                    <div className="absolute left-8 right-4 top-0 bottom-8 flex flex-col justify-between">
                      <div className="border-b border-gray-200 border-dashed h-0"></div>
                      <div className="border-b border-gray-200 border-dashed h-0"></div>
                      <div className="border-b border-gray-200 border-dashed h-0"></div>
                      <div className="border-b border-gray-200 border-dashed h-0"></div>
                      <div className="border-b border-gray-200 h-0"></div>
                    </div>
                    
                    {/* Chart area */}
                    <div className="absolute left-8 right-4 top-0 bottom-8 flex items-end">
                      {/* Area for anomaly scores */}
                      <svg className="w-full h-full overflow-hidden" viewBox="0 0 618 200" preserveAspectRatio="none">
                        {/* Baseline area */}
                        <path 
                          d="M0,180 L103,180 L206,180 L309,180 L412,180 L515,180 L618,180 L618,200 L0,200 Z" 
                          fill="#f5f5f5" 
                          strokeWidth="2"
                          stroke="#e0e0e0"
                        />
                        
                        {/* Anomaly score area */}
                        <path 
                          d="M0,175 L103,160 L206,140 L309,120 L412,95 L515,110 L618,75 L618,200 L0,200 Z" 
                          fill="#dbeafe" 
                          strokeWidth="0"
                        />

                        {/* Anomaly score line */}
                        <path 
                          d="M0,175 L103,160 L206,140 L309,120 L412,95 L515,110 L618,75" 
                          fill="none" 
                          strokeWidth="2"
                          stroke="#3b82f6"
                        />
                        
                        {/* Data points */}
                        <circle cx="0" cy="175" r="4" fill="white" stroke="#3b82f6" strokeWidth="2" />
                        <circle cx="103" cy="160" r="4" fill="white" stroke="#3b82f6" strokeWidth="2" />
                        <circle cx="206" cy="140" r="4" fill="white" stroke="#3b82f6" strokeWidth="2" />
                        <circle cx="309" cy="120" r="4" fill="white" stroke="#3b82f6" strokeWidth="2" />
                        <circle cx="412" cy="95" r="4" fill="white" stroke="#3b82f6" strokeWidth="2" />
                        <circle cx="515" cy="110" r="4" fill="white" stroke="#3b82f6" strokeWidth="2" />
                        <circle cx="618" cy="75" r="4" fill="white" stroke="#3b82f6" strokeWidth="2" />
                      </svg>
                    </div>
                    
                    {/* X-axis labels */}
                    <div className="absolute left-8 right-4 bottom-0 h-8 flex justify-between">
                      <span className="text-xs text-gray-500">May 1</span>
                      <span className="text-xs text-gray-500">May 2</span>
                      <span className="text-xs text-gray-500">May 3</span>
                      <span className="text-xs text-gray-500">May 4</span>
                      <span className="text-xs text-gray-500">May 5</span>
                      <span className="text-xs text-gray-500">May 6</span>
                      <span className="text-xs text-gray-500">May 7</span>
                    </div>
                    
                    {/* Legend */}
                    <div className="absolute top-2 right-2 flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-blue-400 border border-blue-600"></div>
                        <span className="text-xs">Anomaly Score</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-gray-200 border border-gray-400"></div>
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