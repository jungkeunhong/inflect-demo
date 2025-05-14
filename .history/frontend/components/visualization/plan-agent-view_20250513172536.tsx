"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BadgeDelta } from "@/components/ui/badge-delta"
import { Users, Zap, RefreshCw, ChevronUp, ChevronDown, Target } from "lucide-react"

interface PlanAgentViewProps {
  isActive: boolean
}

export default function PlanAgentView({ isActive }: PlanAgentViewProps) {
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
                📊 Plan Agent
              </CardTitle>
              <p className="text-gray-600 font-medium text-sm mt-1 italic">
                "I create targeted strategies to win back at-risk customers."
              </p>
            </div>
            <BadgeDelta deltaType="neutral" value="Active" variant="outline" />
          </div>
        </CardHeader>
        <CardContent>
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            User Segmentation & Win-back Strategies
          </h3>        
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            {/* High-risk users segment */}
            <Card className="bg-white border border-red-100">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-red-50 rounded-full">
                      <ChevronDown className="h-4 w-4 text-red-600" />
                    </div>
                    <h3 className="font-medium text-base">High-risk Users</h3>
                  </div>
                  <BadgeDelta deltaType="decrease" value="24%" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  Users showing significant drop-off in activity metrics.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Zap className="h-5 w-5 text-amber-500" />
                    <span className="text-sm">Offer personalized discounts on next purchase</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <RefreshCw className="h-5 w-5 text-green-500" />
                    <span className="text-sm">Re-engagement email campaign with exclusive benefits</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Power users segment */}
            <Card className="bg-white border border-green-100">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-green-50 rounded-full">
                      <ChevronUp className="h-4 w-4 text-green-600" />
                    </div>
                    <h3 className="font-medium text-base">Power Users</h3>
                  </div>
                  <BadgeDelta deltaType="increase" value="12%" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  Highly engaged users with consistent platform activity.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Target className="h-5 w-5 text-blue-500" />
                    <span className="text-sm">Introduce loyalty program with tiered rewards</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-5 w-5 text-indigo-500" />
                    <span className="text-sm">Early access to new features and product updates</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Insights and recommendations */}
          <Card className="bg-blue-50 border-0">
            <CardContent className="p-4">
              <h3 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Strategic Insights
              </h3>
              <p className="text-sm leading-relaxed text-blue-700">
                Focusing on high-risk users can generate 42% better ROI than acquiring new customers. 
                Our analysis suggests implementing win-back campaigns for users who haven't engaged in 14+ days.
              </p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
} 