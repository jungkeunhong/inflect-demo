"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Send, RefreshCw, Copy, Bot, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { type Message } from "@/lib/types"
import { v4 as uuidv4 } from 'uuid'
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"

// 간소화된 ChatUI 프롭스 정의
export interface ChatUIProps {
  messages?: Message[]
  placeholder?: string
  className?: string
  onMessagesChange?: (messages: Message[]) => void
  onSubmit?: (message: string) => Promise<void>
  availableTools?: string[]
  onToolSelect?: (tools: string[]) => void
  onApiKeySubmit?: (key: string, service: string) => void
}

// 툴 선택 컴포넌트 타입
interface ToolSelectorProps {
  tools: string[]
  onSelect: (tools: string[]) => void
}

// API 키 메시지 컴포넌트 타입
interface ApiKeyInputProps {
  service: string
  onSubmit: (key: string, service: string) => void
}

// 타이핑 애니메이션 적용 텍스트 컴포넌트
const TypingText = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState("")
  
  useEffect(() => {
    if (text === "...") {
      setDisplayedText(text)
      return
    }
    
    setDisplayedText("")
    let index = 0
    
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(prev => prev + text[index])
        index++
      } else {
        clearInterval(interval)
      }
    }, 20)
    
    return () => clearInterval(interval)
  }, [text])
  
  return <span>{displayedText}</span>
}

// 도구 선택 컴포넌트
const ToolSelector = ({ tools, onSelect }: ToolSelectorProps) => {
  const [selectedTools, setSelectedTools] = useState<string[]>([])
  
  const toggleTool = (tool: string) => {
    if (selectedTools.includes(tool)) {
      setSelectedTools(prev => prev.filter(t => t !== tool))
    } else {
      setSelectedTools(prev => [...prev, tool])
    }
  }
  
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">사용할 도구를 선택하세요:</p>
      <div className="grid grid-cols-2 gap-2">
        {tools.map(tool => (
          <Button
            key={tool}
            variant={selectedTools.includes(tool) ? "default" : "outline"}
            size="sm"
            className="justify-start"
            onClick={() => toggleTool(tool)}
          >
            {selectedTools.includes(tool) && (
              <Check className="mr-2 h-4 w-4" />
            )}
            <span className="truncate">{tool}</span>
          </Button>
        ))}
      </div>
      <Button
        onClick={() => onSelect(selectedTools)}
        disabled={selectedTools.length === 0}
        className="w-full"
      >
        선택 완료
      </Button>
    </div>
  )
}

// API 키 입력 컴포넌트
const ApiKeyInput = ({ service, onSubmit }: ApiKeyInputProps) => {
  const [key, setKey] = useState("")
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (key.trim()) {
      onSubmit(key.trim(), service)
      setKey("")
      toast.success(`${service} API 키가 등록되었습니다`)
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-medium">{service} API 키를 입력해주세요</p>
        <p className="text-xs text-muted-foreground">
          API 키는 안전하게 처리됩니다
        </p>
        <input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          className="w-full rounded-md border p-2 text-sm"
          placeholder="API 키 입력..."
        />
      </div>
      <Button type="submit" disabled={!key.trim()} className="w-full">
        저장
      </Button>
    </form>
  )
}

// 메인 ChatUI 컴포넌트 - 간소화된 버전, 상태 관리는 모두 부모 컴포넌트에서 처리
export function ChatUI({
  messages = [],
  placeholder = "메세지 입력...",
  className,
  onMessagesChange,
  onSubmit,
  availableTools = [],
  onToolSelect,
  onApiKeySubmit,
}: ChatUIProps) {
  // 로컬 입력 상태만 관리 - 메시지 상태는 상위 컴포넌트에서 관리
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // 디버깅을 위한 로그
  console.log("ChatUI rendered with", messages.length, "messages")
  
  // 새 메시지 추가 시 스크롤 아래로 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])
  
  // 텍스트 영역 자동 확장
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    
    // 높이 자동 조절
    e.target.style.height = 'auto'
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`
  }

  // 특수 메시지 타입 (도구 선택, API 키 등) 처리
  const handleSpecialMessageTypes = (message: Message) => {
    if (message.type === "tool_selection") {
      return (
        <div className="bg-muted rounded-lg p-4">
          <p className="mb-2">{message.content}</p>
          {availableTools.length > 0 && onToolSelect && (
            <ToolSelector 
              tools={availableTools} 
              onSelect={onToolSelect} 
            />
          )}
        </div>
      )
    }
    
    if (message.type === "api_keys_group" && onApiKeySubmit) {
      const services = message.meta?.services as string[] || []
      return (
        <div className="bg-muted rounded-lg p-4 space-y-4">
          <p>{message.content}</p>
          {services.map(service => (
            <ApiKeyInput 
              key={service} 
              service={service} 
              onSubmit={onApiKeySubmit} 
            />
          ))}
        </div>
      )
    }
    
    return null
  }

  // 메시지 제출 처리
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    // 입력 처리를 부모 컴포넌트에 위임
    if (onSubmit) {
      setIsLoading(true)
      onSubmit(input)
        .then(() => {
          setInput("")
          setIsLoading(false)
        })
        .catch(() => {
          setIsLoading(false)
        })
    }
    
    // 텍스트 영역 높이 초기화
    const textarea = document.querySelector('textarea')
    if (textarea) {
      textarea.style.height = 'auto'
    }
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* 메시지 목록 영역 */}
      <div className="flex-1 overflow-y-auto pb-4 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={cn(
                "flex",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-lg px-4 py-2",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                {/* 특별 메시지 타입 처리 */}
                {message.type ? (
                  handleSpecialMessageTypes(message)
                ) : (
                  <div className="prose prose-sm">
                    {message.content === "..." ? (
                      <div className="flex space-x-1 items-center">
                        <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
                        <div className="w-2 h-2 rounded-full bg-current animate-pulse delay-150" />
                        <div className="w-2 h-2 rounded-full bg-current animate-pulse delay-300" />
                      </div>
                    ) : (
                      <TypingText text={message.content} />
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* 입력 영역 */}
      <div className="border-t pt-4">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={handleTextareaChange}
              placeholder={placeholder}
              className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[40px] max-h-[200px]"
              rows={1}
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
            className={cn(
              "shrink-0 transition-opacity",
              isLoading && "opacity-50"
            )}
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
