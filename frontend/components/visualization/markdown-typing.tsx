"use client"

import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface MarkdownTypingProps {
  content: string
  typingSpeed?: number
  className?: string
  onComplete?: () => void
  isCompleted?: boolean
}

export default function MarkdownTyping({
  content,
  typingSpeed = 3, // Characters per frame, higher = faster
  className,
  onComplete,
  isCompleted = false,
}: MarkdownTypingProps) {
  const [displayedContent, setDisplayedContent] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const lastTimestampRef = useRef<number>(0)
  const contentRef = useRef(content)
  const currentIndexRef = useRef(0)
  
  // Reset when content changes
  useEffect(() => {
    contentRef.current = content
    currentIndexRef.current = 0
    if (isCompleted) {
      setDisplayedContent(content)
      setIsTyping(false)
      if (onComplete) onComplete()
    } else {
      setDisplayedContent("")
      setIsTyping(true)
    }
  }, [content, isCompleted, onComplete])
  
  // Typing animation
  useEffect(() => {
    if (!isTyping) return
    
    let animationFrameId: number
    
    const typeNextChars = (timestamp: number) => {
      if (!lastTimestampRef.current) lastTimestampRef.current = timestamp
      
      const deltaTime = timestamp - lastTimestampRef.current
      
      // Update roughly every 16ms (60fps)
      if (deltaTime > 16) {
        lastTimestampRef.current = timestamp
        
        if (currentIndexRef.current < contentRef.current.length) {
          // Add multiple characters per frame for faster typing
          const charsToAdd = Math.min(
            typingSpeed, 
            contentRef.current.length - currentIndexRef.current
          )
          
          const nextChars = contentRef.current.slice(
            currentIndexRef.current, 
            currentIndexRef.current + charsToAdd
          )
          
          setDisplayedContent(prev => prev + nextChars)
          currentIndexRef.current += charsToAdd
        } else {
          setIsTyping(false)
          if (onComplete) onComplete()
          return
        }
      }
      
      animationFrameId = requestAnimationFrame(typeNextChars)
    }
    
    animationFrameId = requestAnimationFrame(typeNextChars)
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [isTyping, typingSpeed, onComplete])
  
  // 간단한 구현을 위해 텍스트 내용을 화면에 표시할 때 마크다운 라이브러리를 사용하지 않고
  // 기본 스타일링만 적용하여 pre 태그로 렌더링합니다.
  // 이 방식은 마크다운 파싱 없이 타이핑 효과만 구현합니다.
  return (
    <div className={cn(
      "prose prose-gray dark:prose-invert max-w-none", 
      "font-sans leading-relaxed whitespace-pre-wrap",
      className
    )}>
      <pre className="font-sans text-base text-gray-800 p-4">
        {displayedContent}
      </pre>
    </div>
  )
}
