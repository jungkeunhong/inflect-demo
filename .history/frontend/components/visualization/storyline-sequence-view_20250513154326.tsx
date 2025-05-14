"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import MarkdownTyping from "./markdown-typing"
import { Book, RefreshCw } from "lucide-react"

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
  const [content, setContent] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [typingComplete, setTypingComplete] = useState(false)
  
  // 컴포넌트가 활성화되면 시퀀스 콘텐츠 처리
  useEffect(() => {
    if (!isActive) return
    
    if (sequenceContent) {
      // 객체 타입과 문자열 타입 구분
      if (typeof sequenceContent === 'string') {
        setContent(sequenceContent)
      } else {
        // 객체를 마크다운 포맷으로 변환
        const { title, steps } = sequenceContent
        const stepsContent = steps
          .map(step => (
            `## ${step.order}. ${step.title}\n\n${step.description}\n`
          ))
          .join('\n')
        
        const formattedContent = `# ${title}\n\n${stepsContent}`
        setContent(formattedContent)
      }
      setIsLoading(false)
    } else {
      // 기본 콘텐츠 설정
      setContent("# 온보딩 시퀀스\n\n데이터를 로드하는 중입니다...")
      setIsLoading(false)
    }
  }, [isActive, sequenceContent])
  
  // 타이핑 완료 이벤트 핸들러
  const handleTypingComplete = () => {
    setTypingComplete(true)
  }
  
  return (
    <Card className="w-full bg-white rounded-lg shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-xl font-medium">
          <Book className="w-5 h-5 inline-block mr-2" />
          Root Agent
        </CardTitle>
        <Badge 
          variant="outline" 
          className="bg-green-50 text-green-700 hover:bg-green-100"
        >
          Ready
        </Badge>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700 mb-2"></div>
              <p className="text-gray-500">시퀀스 데이터 로딩 중...</p>
            </div>
          </div>
        ) : (
          <div className="prose prose-sm max-w-none">
            <MarkdownTyping
              content={content}
              speed={30}
              onTypingComplete={handleTypingComplete}
            />
            
            {typingComplete && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">자동화 가능 여부</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Card className="bg-green-50 border-green-100">
                    <CardContent className="p-3">
                      <p className="text-sm text-green-700">이메일 자동화: 가능</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-blue-50 border-blue-100">
                    <CardContent className="p-3">
                      <p className="text-sm text-blue-700">웨비나 알림: 가능</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
