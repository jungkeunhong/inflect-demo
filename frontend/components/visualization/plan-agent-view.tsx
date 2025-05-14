"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BadgeDelta } from "@/components/ui/badge-delta"
import { 
  Users, 
  Zap, 
  RefreshCw, 
  ChevronUp, 
  ChevronDown, 
  Target, 
  MailIcon, 
  MessageSquare, 
  AlertCircle, 
  CheckCircle2, 
  Clock,
  Award
} from "lucide-react"

interface PlanAgentViewProps {
  isActive: boolean
}

interface UserType {
  name: string;
  context: string;
  riskScore?: number;
}

interface StrategyType {
  icon: React.ElementType;
  text: string;
  iconColor: string;
}

interface SegmentType {
  title: string;
  pattern: string;
  users: string;
  badgeType: "increase" | "decrease" | "neutral";
  badgeValue: string;
  accentColor: string;
  bgColor: string;
  icon: React.ElementType;
  strategies: StrategyType[];
  userList: UserType[];
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
  
  const segments: SegmentType[] = [
    {
      title: "High-risk Drop-offs",
      pattern: "Users who haven't logged in in 14+ days",
      users: "24% of active users",
      badgeType: "decrease",
      badgeValue: "24%",
      accentColor: "red",
      bgColor: "red-50",
      icon: ChevronDown,
      strategies: [
        { icon: MailIcon, text: "Send \"We miss you\" email with 7-day trial extension", iconColor: "text-blue-500" },
        { icon: Zap, text: "Offer 20% discount for reactivation", iconColor: "text-amber-500" },
        { icon: MessageSquare, text: "Slack alert to CSM for personal follow-up", iconColor: "text-violet-500" }
      ],
      userList: [
        { name: "Jane Kim", context: "risk: 88%", riskScore: 88 },
        { name: "Raj Patel", context: "hasn't logged in since May 1" },
        { name: "Emily Zhang", context: "skipped onboarding" }
      ]
    },
    {
      title: "Onboarding Drop-offs",
      pattern: "Users who signed up but didn't complete key onboarding actions",
      users: "15% of new users",
      badgeType: "decrease",
      badgeValue: "15%",
      accentColor: "amber",
      bgColor: "amber-50",
      icon: AlertCircle,
      strategies: [
        { icon: Target, text: "Trigger in-app tooltip or checklist reminder", iconColor: "text-blue-500" },
        { icon: MessageSquare, text: "Slack message to CS team: \"Offer onboarding help?\"", iconColor: "text-violet-500" },
        { icon: MailIcon, text: "Email with link to schedule live walkthrough", iconColor: "text-green-500" }
      ],
      userList: [
        { name: "Lucas Hernandez", context: "completed only 1/5 steps" },
        { name: "Ava Lee", context: "abandoned during step 2" },
        { name: "David Chen", context: "no activity after signup" }
      ]
    },
    {
      title: "Power Users",
      pattern: "Active users with >10 sessions/week",
      users: "12% of user base",
      badgeType: "increase",
      badgeValue: "12%",
      accentColor: "green",
      bgColor: "green-50",
      icon: ChevronUp,
      strategies: [
        { icon: Award, text: "Send invite to loyalty program with rewards", iconColor: "text-amber-500" },
        { icon: Zap, text: "Early access to beta features", iconColor: "text-blue-500" },
        { icon: Target, text: "Celebrate milestone: \"100th session!\"", iconColor: "text-green-500" }
      ],
      userList: [
        { name: "Monica Alvarez", context: "used 4 features daily" },
        { name: "Tom Becker", context: "logged in 17x last week" },
        { name: "Yuna Saito", context: "top 5% engagement" }
      ]
    }
  ];
  
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
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            User Segmentation & Win-back Strategies
          </h3>
          
          <div className="space-y-6 mb-6">
            {segments.map((segment, idx) => (
              <Card key={idx} className={
                segment.accentColor === "red" ? "bg-white border border-red-100" :
                segment.accentColor === "amber" ? "bg-white border border-amber-100" :
                segment.accentColor === "green" ? "bg-white border border-green-100" :
                "bg-white border border-gray-100"
              }>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className={
                        segment.bgColor === "red-50" ? "p-2 bg-red-50 rounded-full" :
                        segment.bgColor === "amber-50" ? "p-2 bg-amber-50 rounded-full" :
                        segment.bgColor === "green-50" ? "p-2 bg-green-50 rounded-full" :
                        "p-2 bg-gray-50 rounded-full"
                      }>
                        <segment.icon className={
                          segment.accentColor === "red" ? "h-4 w-4 text-red-600" :
                          segment.accentColor === "amber" ? "h-4 w-4 text-amber-600" :
                          segment.accentColor === "green" ? "h-4 w-4 text-green-600" :
                          "h-4 w-4 text-gray-600"
                        } />
                      </div>
                      <h3 className="font-medium text-base">
                        {segment.title}
                      </h3>
                    </div>
                    <BadgeDelta deltaType={segment.badgeType} value={segment.badgeValue} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Pattern:</span> {segment.pattern}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <Users className="h-4 w-4 text-gray-400" />
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Affects:</span> {segment.users}
                        </p>
                      </div>
                      
                      <h4 className="text-sm font-semibold mb-2 border-b pb-1">Recommended Strategy</h4>
                      <div className="space-y-2">
                        {segment.strategies.map((strategy, sIdx) => (
                          <div key={sIdx} className="flex items-center gap-2 text-sm">
                            <strategy.icon className={`h-4 w-4 ${strategy.iconColor}`} />
                            <span>{strategy.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold mb-2 border-b pb-1">Users in this Segment</h4>
                      <div className="space-y-2">
                        {segment.userList.map((user, uIdx) => (
                          <div 
                            key={uIdx}
                            className="flex items-center justify-between p-2 rounded-md bg-gray-50 border border-gray-100"
                          >
                            <div className="flex items-center gap-2">
                              <div className={
                                segment.accentColor === "red" && user.riskScore && user.riskScore > 80 ? "w-2 h-2 rounded-full bg-red-500" :
                                segment.accentColor === "red" ? "w-2 h-2 rounded-full bg-red-400" :
                                segment.accentColor === "amber" ? "w-2 h-2 rounded-full bg-amber-400" :
                                segment.accentColor === "green" ? "w-2 h-2 rounded-full bg-green-400" :
                                "w-2 h-2 rounded-full bg-gray-400"
                              } />
                              <span className="font-medium text-sm">{user.name}</span>
                            </div>
                            <div className="text-xs text-gray-500">
                              {user.context}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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