"use client"

import { useEffect, useState } from "react"
import type { Agent } from "@/lib/types"
import AgentFlow from "./agent-flow"
import AnalystSegmentView from "./analyst-segment-view"
import StorylineSequenceView from "./storyline-sequence-view"
import { toast } from "sonner"

interface AgentVisualizationProps {
  agents: Agent[]
  activeAgent: Agent | null
  onAgentClick: (agent: Agent) => void
  isBuilding: boolean
  isTesting: boolean
  onAgentsUpdate: (updatedAgents: Agent[]) => void
}

// 진행 상태 상세 정보 타입
interface ProgressDetail {
  step: string
  details: string
  timestamp?: string
  percentComplete?: number
}

// 세그먼트 데이터 타입
interface SegmentContent {
  segments: {
    name: string
    count: number
    description: string
  }[]
}

// 시퀀스 데이터 타입
interface SequenceContent {
  title: string
  steps: {
    order: number
    title: string
    description: string
  }[]
}

// 테스트 단계 타입
type TestingPhase = 'analyst' | 'storyline' | 'general' | null

export default function AgentVisualization({
  agents,
  activeAgent,
  onAgentClick,
  isBuilding,
  isTesting,
  onAgentsUpdate,
}: AgentVisualizationProps) {
  // 상태 관리
  const [progress, setProgress] = useState<Record<string, ProgressDetail>>({})
  const [isUserCommandReceived, setIsUserCommandReceived] = useState(false)
  const [testingPhase, setTestingPhase] = useState<TestingPhase>(null)
  const [segmentContent, setSegmentContent] = useState<SegmentContent>({ segments: [] })
  const [sequenceContent, setSequenceContent] = useState<SequenceContent>({ title: "", steps: [] })
  const [generalResponse, setGeneralResponse] = useState("")

  // 에이전트 유형 판별 함수
  const isAnalystAgent = (agent: Agent | null): boolean => {
    if (!agent) return false
    return agent.name.toLowerCase().includes('analyst') || 
           agent.description?.toLowerCase().includes('analyst') ||
           agent.tools.some((tool: string) => tool.toLowerCase().includes('segment') || tool.toLowerCase().includes('analysis'))
  }

  // 스토리라인 에이전트 판별 함수
  const isStorylineAgent = (agent: Agent | null): boolean => {
    if (!agent) return false
    return agent.name.toLowerCase().includes('storyline') || 
           agent.description?.toLowerCase().includes('storyline') ||
           agent.tools.some((tool: string) => tool.toLowerCase().includes('sequence') || tool.toLowerCase().includes('onboarding'))
  }

  // 모의 데이터 초기화 및 간소화된 로직
  useEffect(() => {
    console.log("컴포넌트 마운트 - 데모 모드로 실행");
    
    // 데모용 타이머 - 에이전트가 작업중인 것처럼 보이는 애니메이션
    const demoTimer = setTimeout(() => {
      if (activeAgent) {
        // 활성 에이전트에 따라 모의 진행 상태 업데이트
        setProgress(prev => ({
          ...prev,
          [activeAgent.id]: {
            step: "processing",
            details: "데모 에이전트 처리 중...",
            timestamp: new Date().toISOString(),
            percentComplete: 75
          }
        }));
        
        // 에이전트 유형에 따라 다른 모의 데이터 표시
        if (isAnalystAgent(activeAgent)) {
          setSegmentContent({
            segments: [
              { name: "VIP 고객", count: 120, description: "높은 구매력을 가진 프리미엄 고객" },
              { name: "일반 고객", count: 450, description: "정기적인 구매 패턴을 보이는 고객" },
              { name: "이탈 위험군", count: 85, description: "최근 활동이 감소한 고객" }
            ]
          });
          setTestingPhase('analyst');
          setIsUserCommandReceived(true);
        } else if (isStorylineAgent(activeAgent)) {
          setSequenceContent({
            title: "VIP 고객 온보딩 시퀀스",
            steps: [
              { order: 1, title: "환영 이메일", description: "개인화된 VIP 환영 메시지" },
              { order: 2, title: "전담 매니저 배정", description: "담당자 소개 및 연락처 안내" },
              { order: 3, title: "제품 안내 웨비나", description: "전용 제품 사용법 안내" }
            ]
          });
          setTestingPhase('storyline');
          setIsUserCommandReceived(true);
        } else {
          setGeneralResponse("요청이 성공적으로 처리되었습니다. 추가 질문이 있으신가요?");
          setTestingPhase('general');
          setIsUserCommandReceived(true);
        }
      }
    }, 2000);
    
    // Cleanup on unmount
    return () => {
      console.log("컴포넌트 언마운트 - 데모 타이머 정리");
      clearTimeout(demoTimer);
    }
  }, [activeAgent]); // 활성 에이전트가 변경될 때마다 실행

  // 최종 렌더링 결정 함수
  const finalRenderDecision = () => {
    // 일반 응답이 있으면 표시
    if (generalResponse) {
      return (
        <div className="p-4 bg-white border rounded-lg shadow-sm">
          <h3 className="font-semibold mb-2">응답:</h3>
          <p className="text-gray-700">{generalResponse}</p>
        </div>
      );
    }
    
    // 에이전트 흐름도를 기본으로 표시
    return (
      <AgentFlow 
        agents={agents}
        activeAgent={activeAgent}
        onAgentClick={onAgentClick}
        progressDetails={progress}
      />
    );
  };

  // 테스트 중이거나 빌드 중인 상태에 따라 다른 UI 렌더링
  if (isBuilding) {
    return (
      <div className="w-full h-full flex flex-col">
        <div className="flex-1">
          <AgentFlow 
            agents={agents}
            activeAgent={activeAgent}
            onAgentClick={onAgentClick}
            progressDetails={progress}
          />
        </div>
      </div>
    );
  }

  // 테스트 단계에 따른 컴포넌트 결정
  const renderTestingPhaseContent = () => {
    // 에이전트 테스트 중이고, 사용자 명령어가 인식되었을 때
    if (isTesting && isUserCommandReceived) {
      switch (testingPhase) {
        case 'analyst':
          return <AnalystSegmentView isActive={true} segmentContent={segmentContent} />;
        case 'storyline':
          return <StorylineSequenceView isActive={true} sequenceContent={sequenceContent} />;
        default:
          return finalRenderDecision();
      }
    }
    
    // 에이전트 타입에 따른 전용 뷰 렌더링 (기본 decision 로직 이전)
    if (activeAgent) {
      if (isAnalystAgent(activeAgent)) {
        return <AnalystSegmentView isActive={true} segmentContent={segmentContent} />;
      } else if (isStorylineAgent(activeAgent)) {
        return <StorylineSequenceView isActive={true} sequenceContent={sequenceContent} />;
      }
    }
    
    // 기본 결정 로직으로 폴백
    return finalRenderDecision();
  };

  // 테스트 모드 렌더링
  if (isTesting) {
    return (
      <div className="w-full h-full flex flex-col">
        <div className="flex-1">
          {renderTestingPhaseContent()}
        </div>
      </div>
    );
  }

  // 기본 렌더링 (에이전트 흐름도)
  return (
    <div className="w-full h-[calc(100vh-100px)] flex flex-col">
      <div className="flex-1">
        <AgentFlow 
          agents={agents}
          activeAgent={activeAgent}
          onAgentClick={onAgentClick}
          progressDetails={progress}
        />
      </div>
    </div>
  );
}
