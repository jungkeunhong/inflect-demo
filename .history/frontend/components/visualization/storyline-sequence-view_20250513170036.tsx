"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
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
    <Card className="w-full rounded-lg overflow-hidden border-0 shadow-md">
      <CardContent className="p-0">
        <div
          className="px-6 py-8 rounded-lg relative w-full"
          style={{
            background: "linear-gradient(to right, #f0f9ff, #e0f2fe)",
          }}
        >
          <div 
            className={cn(
              "opacity-0 translate-y-4 transition-all duration-500 ease-in-out relative z-20 max-w-4xl mx-auto",
              fadeInClass
            )}
          >
            <div className="flex items-center gap-4 mb-6">
              {/* Simple avatar implementation without using shadcn/ui Avatar */}
              <div className="h-12 w-12 rounded-full flex items-center justify-center bg-blue-500 text-white border-2 border-blue-500">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-blue-800">Root Agent</h1>
                <p className="text-blue-600">👋 Hey! I'm your Root Agent.</p>
              </div>
            </div>

            <div className="mb-8">
              <p className="text-lg text-gray-700">
                Think of me as your agent team lead — I coordinate everything.<br />
                You give the goal, and I'll dispatch the right agents to handle it.<br />
                Ready when you are! 🚀
              </p>
            </div>

            <div 
              className={cn(
                "bg-white/70 backdrop-blur-sm p-4 rounded-lg border border-blue-100 mb-6 transition-all duration-500 ease-in-out delay-100",
                fadeInClass
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                <h2 className="text-lg font-semibold text-gray-800">Tip</h2>
              </div>
              <p className="text-gray-700">
                No idea where to start? Just describe the problem in your words — I'll handle the rest.
              </p>
            </div>

            <div 
              className={cn(
                "flex justify-center mt-6 transition-all duration-500 ease-in-out delay-200",
                fadeInClass
              )}
            >
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
