"use client"

import { useState, useEffect } from 'react'
import { Agent } from '@/lib/types'
import fs from 'fs'
import path from 'path'

export interface MarkdownViewState {
  isAnalystActive: boolean
  isStorylineActive: boolean
  segmentContent: string
  sequenceContent: string
  currentTestingStep: string
  testingStarted: boolean
}

export function useMarkdownViewer() {
  const [state, setState] = useState<MarkdownViewState>({
    isAnalystActive: false,
    isStorylineActive: false,
    segmentContent: '',
    sequenceContent: '',
    currentTestingStep: '',
    testingStarted: false
  })

  // 마크다운 내용 로드 함수
  const loadMarkdownContent = async () => {
    try {
      // 클라이언트 사이드에서는 fetch를 사용해 파일 내용을 가져옵니다
      const segmentResponse = await fetch('/api/markdown?file=segment')
      const sequenceResponse = await fetch('/api/markdown?file=sequence')
      
      if (segmentResponse.ok && sequenceResponse.ok) {
        const segmentContent = await segmentResponse.text()
        const sequenceContent = await sequenceResponse.text()
        
        setState(prev => ({
          ...prev,
          segmentContent,
          sequenceContent
        }))
      }
    } catch (error) {
      console.error('Failed to load markdown content:', error)
    }
  }

  // 테스트 시작 처리 함수
  const startTesting = () => {
    setState(prev => ({
      ...prev,
      testingStarted: true,
      currentTestingStep: 'analyst'
    }))
    
    // Analyst Agent 활성화
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        isAnalystActive: true
      }))
    }, 1000)
  }

  // Analyst 완료 처리 함수
  const completeAnalystStep = () => {
    setState(prev => ({
      ...prev,
      currentTestingStep: 'storyline'
    }))
    
    // Storyline Agent 활성화
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        isStorylineActive: true
      }))
    }, 1000)
  }

  // 마크다운 처리 함수
  const processOnboardingCommand = (message: string) => {
    // 'please do onboarding' 등의 명령어 인식
    if (
      message.toLowerCase().includes('please do onboarding') || 
      message.toLowerCase().includes('onboarding') ||
      message.toLowerCase().includes('start test') ||
      message.toLowerCase().includes('test the agent')
    ) {
      startTesting()
      return true
    }
    return false
  }

  // 특정 에이전트 타입인지 확인하는 함수
  const isAnalystAgent = (agent: Agent | null): boolean => {
    if (!agent) return false
    return agent.name.toLowerCase().includes('analyst') || 
           agent.description?.toLowerCase().includes('analyst') ||
           agent.tools.some(tool => tool.toLowerCase().includes('segment') || tool.toLowerCase().includes('analysis'))
  }

  const isStorylineAgent = (agent: Agent | null): boolean => {
    if (!agent) return false
    return agent.name.toLowerCase().includes('storyline') || 
           agent.description?.toLowerCase().includes('storyline') ||
           agent.tools.some(tool => tool.toLowerCase().includes('sequence') || tool.toLowerCase().includes('onboarding'))
  }

  // 초기 로드 시 마크다운 내용 가져오기
  useEffect(() => {
    loadMarkdownContent()
  }, [])

  return {
    state,
    startTesting,
    completeAnalystStep,
    processOnboardingCommand,
    isAnalystAgent,
    isStorylineAgent
  }
}
