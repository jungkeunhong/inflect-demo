import { type Agent } from "./types"

// WebSocket 메시지 타입 정의
type WebSocketMessageType = 
  | "agent_status_update"
  | "agent_progress"
  | "workflow_complete"
  | "error"
  | "pong"
  | "agent_response"

interface WebSocketMessage {
  type: WebSocketMessageType
  data: {
    agentId?: string
    agentName?: string
    status?: Agent["status"]
    progress?: {
      step: string
      details: string
      timestamp?: string
      percentComplete?: number
    }
    error?: string
    message?: string
    response?: string
  }
}

// 목 WebSocket 클래스 구현
class AgentWebSocket {
  private static instance: AgentWebSocket;
  private subscribers: ((message: WebSocketMessage) => void)[] = []
  
  private constructor() {
    console.log("[MockWebSocket] Initializing mock websocket");
    
    // 목 에이전트 응답 이벤트 리스너 설정
    if (typeof window !== 'undefined') {
      window.addEventListener('mock-agent-response', ((event: CustomEvent) => {
        this.notifySubscribers(event.detail);
      }) as EventListener);
      
      window.addEventListener('mock-agent-status', ((event: CustomEvent) => {
        this.notifySubscribers(event.detail);
      }) as EventListener);
    }
  }

  // 싱글톤 패턴
  public static getInstance(): AgentWebSocket {
    if (!AgentWebSocket.instance) {
      AgentWebSocket.instance = new AgentWebSocket();
    }
    return AgentWebSocket.instance;
  }

  // 연결 시작 - 실제로는 아무것도 하지 않음
  connect() {
    console.log("[MockWebSocket] Mock connection ready");
    return this;
  }
  
  // 연결 해제 - 실제로는 아무것도 하지 않음
  disconnect() {
    console.log("[MockWebSocket] Mock disconnection");
    return this;
  }

  // 구독 - API 호환성을 위해 유지
  subscribe(callback: (message: WebSocketMessage) => void) {
    console.log("[MockWebSocket] New subscriber added");
    this.subscribers.push(callback);
    return () => this.unsubscribe(callback);
  }

  // 구독 해제 - API 호환성을 위해 유지
  unsubscribe(callback: (message: WebSocketMessage) => void) {
    this.subscribers = this.subscribers.filter(sub => sub !== callback);
    console.log("[MockWebSocket] Subscriber removed, remaining:", this.subscribers.length);
  }

  // 모든 구독자에게 메시지 전달
  private notifySubscribers(message: WebSocketMessage) {
    console.log("[MockWebSocket] Notifying subscribers with message:", message);
    this.subscribers.forEach(callback => {
      try {
        callback(message);
      } catch (error) {
        console.error("[MockWebSocket] Error in subscriber callback:", error);
      }
    });
  }

  // 메시지 수동 생성 (테스트용)
  mockMessage(message: WebSocketMessage) {
    console.log("[MockWebSocket] Manual message:", message);
    this.notifySubscribers(message);
  }
}

// 싱글톤 인스턴스 생성
export const agentWebSocket = AgentWebSocket.getInstance()