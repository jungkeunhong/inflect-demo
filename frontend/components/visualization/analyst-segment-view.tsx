"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import MarkdownTyping from "./markdown-typing"
import { BarChart, User } from "lucide-react"

// 세그먼트 콘텐츠 타입 정의
interface SegmentType {
  name: string
  count: number
  description: string
}

interface SegmentContentType {
  segments: SegmentType[]
}

interface AnalystSegmentViewProps {
  isActive: boolean
  segmentContent?: SegmentContentType | string
}

export default function AnalystSegmentView({ 
  isActive, 
  segmentContent 
}: AnalystSegmentViewProps) {
  const [content, setContent] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [typingComplete, setTypingComplete] = useState(false)
  
  // 컴포넌트가 활성화되면 세그먼트 콘텐츠 처리
  useEffect(() => {
    if (!isActive) return
    
    if (segmentContent) {
      // 객체 타입과 문자열 타입 구분
      if (typeof segmentContent === 'string') {
        setContent(segmentContent)
      } else {
        // 객체를 마크다운 포맷으로 변환
        const formattedContent = segmentContent.segments
          .map(segment => (
            `## ${segment.name} (${segment.count}명)\n\n${segment.description}\n`
          ))
          .join('\n')
        setContent(formattedContent)
      }
      setIsLoading(false)
    } else {
      // 기본 콘텐츠 설정
      setContent("# 고객 세그먼트 분석\n\n데이터를 로드하는 중입니다...")
      setIsLoading(false)
    }
  }, [isActive, segmentContent])
  
  // 타이핑 완료 이벤트 핸들러
  const handleTypingComplete = () => {
    setTypingComplete(true)
  }
  
  return (
    <Card className="w-full bg-white rounded-lg shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-xl font-medium">
          <BarChart className="w-5 h-5 inline-block mr-2" />
          고객 세그먼트 분석
        </CardTitle>
        <Badge 
          variant="outline" 
          className="bg-blue-50 text-blue-700 hover:bg-blue-100"
        >
          분석 완료
        </Badge>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700 mb-2"></div>
              <p className="text-gray-500">세그먼트 데이터 로딩 중...</p>
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
                <h3 className="text-sm font-medium text-gray-500 mb-2">주요 인사이트</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Card className="bg-green-50 border-green-100">
                    <CardContent className="p-3">
                      <p className="text-sm text-green-700">VIP 고객 리텐션 15% 증가</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-amber-50 border-amber-100">
                    <CardContent className="p-3">
                      <p className="text-sm text-amber-700">이탈 위험군 30일내 조치 필요</p>
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
