"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lightbulb, ArrowRight, Bot } from "lucide-react"

// 시퀀스 콘텐츠 타입 정의
interface SequenceStepType {
  order: number
  title: string
  description: string
}

interface SequenceContentType {
  title: string
  steps: SequenceStepType[]
}

interface StorylineSequenceViewProps {
  isActive: boolean
  sequenceContent?: SequenceContentType | string
}

export default function StorylineSequenceView({ 
  isActive, 
  sequenceContent 
}: StorylineSequenceViewProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [fadeInClass, setFadeInClass] = useState("")
  
  useEffect(() => {
    if (isActive) {
      setIsVisible(true)
      // Small delay to trigger the fade-in animation
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
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full flex items-center justify-center bg-blue-500 text-white border-2 border-blue-500">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold text-gray-800">Root Agent</CardTitle>
                <p className="text-gray-600 font-medium text-sm mt-1">👋 Hey! I'm your Root Agent.</p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">
            Think of me as your agent team lead — I coordinate everything.<br />
            You give the goal, and I'll dispatch the right agents to handle it.<br />
            Ready when you are! 🚀
          </p>
          
          <Card className="bg-blue-50/50 border border-blue-100 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                <h3 className="font-medium text-gray-800">Tip</h3>
              </div>
              <p className="text-gray-700">
                No idea where to start? Just describe the problem in your words — I'll handle the rest.
              </p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}
