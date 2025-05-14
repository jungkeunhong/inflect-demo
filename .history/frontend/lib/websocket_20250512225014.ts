import { type Agent } from "./types"

// 글로벌 상태 관리 (모든 탭/창에서 공유)
let isGloballyConnecting = false;
let globalConnectionAttempts = 0;

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
    response?: string  // Add support for response from agent_response type
  }
}

class AgentWebSocket {
  private static instance: AgentWebSocket;
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 3 // 재연결 시도 횟수 줄임
  private reconnectDelay = 2000 // 재연결 지연 시간 늘림
  private subscribers: ((message: WebSocketMessage) => void)[] = []
  private pingInterval: NodeJS.Timeout | null = null
  private lastPongTime: number = Date.now()
  private isConnecting = false
  private url: string
  private connectionActive = false
  private reconnectTimeout: NodeJS.Timeout | null = null

  private constructor() {
    // WebSocket URL을 보다 명확하게 설정
    const protocol = typeof window !== 'undefined' && window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
    const port = '8000'; // 백엔드 포트 (프로세스 확인 결과 8000 포트가 맞음)
    
    // 명시적으로 URL 구성
    this.url = `${protocol}//${host}:${port}/ws`;
    console.log("[WebSocket] Initializing with URL:", this.url);
    
    // 브라우저 탭 visibility 변경 감지
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', this.handleVisibilityChange);
      window.addEventListener('beforeunload', this.cleanupConnection);
    }
  }

  // 싱글톤 패턴 강화
  public static getInstance(): AgentWebSocket {
    if (!AgentWebSocket.instance) {
      AgentWebSocket.instance = new AgentWebSocket();
    }
    return AgentWebSocket.instance;
  }

  private handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      // 탭이 보이는 상태가 되면 연결 복원
      if (!this.connectionActive) {
        console.log("Tab became visible, reconnecting WebSocket");
        this.connect();
      }
    } else {
      // 탭이 숨겨진 상태가 되면 연결 정리
      console.log("Tab became hidden, cleaning up WebSocket");
      this.cleanupConnection();
    }
  }

  private cleanupConnection = () => {
    console.log("Cleaning up WebSocket connection");
    this.stopPingInterval();
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    if (this.ws) {
      try {
        this.ws.close(1000, "Cleanup");
      } catch (error) {
        console.error("Error closing WebSocket during cleanup:", error);
      }
      this.ws = null;
    }
    this.connectionActive = false;
    this.isConnecting = false;
    isGloballyConnecting = false;
  }

  connect() {
    // 이미 연결 중이거나 연결된 상태라면 추가 연결 방지
    if (isGloballyConnecting || this.isConnecting || this.connectionActive) {
      console.log("WebSocket connection already in progress or active, skipping");
      return;
    }

    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log("WebSocket already connected");
      this.connectionActive = true;
      return;
    }

    // 전역 상태 업데이트
    isGloballyConnecting = true;
    this.isConnecting = true;

    try {
      console.log("Connecting to WebSocket at:", this.url);
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log("WebSocket connected successfully");
        this.reconnectAttempts = 0;
        globalConnectionAttempts = 0;
        this.isConnecting = false;
        isGloballyConnecting = false;
        this.connectionActive = true;
        this.lastPongTime = Date.now(); // Reset pong timer
        this.startPingInterval();
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          if (message.type === "pong") {
            this.lastPongTime = Date.now();
            return;
          }
          this.notifySubscribers(message);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      this.ws.onclose = (event) => {
        console.log(`WebSocket closed with code: ${event.code}, reason: ${event.reason || 'No reason provided'}`);
        this.stopPingInterval();
        this.isConnecting = false;
        isGloballyConnecting = false;
        this.connectionActive = false;
        
        // 정상 종료 코드가 아니고, 문서가 보이는 상태일 때만 재연결 시도
        if (event.code !== 1000 && 
            event.code !== 1001 && 
            typeof document !== 'undefined' && 
            document.visibilityState === 'visible') {
          this.attemptReconnect();
        }
      };

      this.ws.onerror = (error) => {
        // WebSocket 에러 개선된 처리
        console.error("[WebSocket] Connection error:", error);
        
        // 연결 상태 업데이트
        this.isConnecting = false;
        isGloballyConnecting = false;
        this.connectionActive = false;
        this.stopPingInterval();
        
        // ws 객체를 정리합니다
        if (this.ws) {
          try {
            // 연결을 강제로 닫습니다
            this.ws.close(3000, "Error occurred");
          } catch (closeError) {
            console.error("[WebSocket] Error closing connection after error:", closeError);
          }
          this.ws = null;
        }
        
        // 문서가 보이는 상태일 때만 재연결 시도
        if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
          console.log("[WebSocket] Will attempt to reconnect after error...");
          
          // 더 긴 타임아웃(5초)을 사용하여 백엔드가 복구될 시간을 줍니다
          if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
          this.reconnectTimeout = setTimeout(() => {
            console.log("[WebSocket] Attempting reconnect after error...");
            this.attemptReconnect();
          }, 5000);
        }
      };
    } catch (error) {
      console.error("Error creating WebSocket:", error);
      this.isConnecting = false;
      isGloballyConnecting = false;
      this.connectionActive = false;
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        this.attemptReconnect();
      }
    }
  }

  private startPingInterval() {
    this.stopPingInterval(); // Ensure no duplicate intervals
    
    this.pingInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        try {
          this.ws.send(JSON.stringify({ type: "ping" }));
          
          // Check if we haven't received a pong in 15 seconds
          if (Date.now() - this.lastPongTime > 15000) {
            console.log("No pong received in 15 seconds, reconnecting...");
            this.reconnect();
          }
        } catch (error) {
          console.error("Error sending ping:", error);
          this.reconnect();
        }
      }
    }, 10000); // 핑 간격 늘림 (10초)
  }

  private stopPingInterval() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  private reconnect() {
    if (this.isConnecting || isGloballyConnecting) {
      console.log("Reconnection already in progress");
      return;
    }
    
    if (this.ws) {
      try {
        this.ws.close();
      } catch (error) {
        console.error("Error closing WebSocket:", error);
      }
      this.ws = null;
    }
    
    this.connectionActive = false;
    this.attemptReconnect();
  }

  private attemptReconnect() {
    if (this.isConnecting || isGloballyConnecting) {
      console.log("[WebSocket] Reconnection already in progress, skipping");
      return;
    }
    
    // 최대 재연결 시도 횟수 증가 (3 → 5)
    if (this.reconnectAttempts >= 5 || globalConnectionAttempts >= 10) {
      console.error(`[WebSocket] Max reconnection attempts (${this.reconnectAttempts}/${globalConnectionAttempts}) reached, giving up`);
      this.notifySubscribers({
        type: "error",
        data: {
          error: "Failed to connect to the server after multiple attempts. Please refresh the page."
        }
      });
      return;
    }
    
    this.reconnectAttempts++;
    globalConnectionAttempts++;
    
    // 지수 백오프를 사용하여 재시도 간격을 점점 늘림
    const delay = Math.min(30000, this.reconnectDelay * Math.pow(1.5, this.reconnectAttempts - 1));
    console.log(`[WebSocket] Reconnect attempt ${this.reconnectAttempts} in ${delay}ms`);
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    
    this.reconnectTimeout = setTimeout(() => {
      console.log(`[WebSocket] Attempting reconnect #${this.reconnectAttempts}...`);
      this.connect();
    }, delay);
  }

  subscribe(callback: (message: WebSocketMessage) => void) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  private notifySubscribers(message: WebSocketMessage) {
    this.subscribers.forEach(callback => {
      try {
        callback(message);
      } catch (error) {
        console.error("Error in subscriber callback:", error);
      }
    });
  }

  disconnect() {
    this.cleanupConnection();
  }
}

// 싱글톤 인스턴스 생성
export const agentWebSocket = AgentWebSocket.getInstance() 