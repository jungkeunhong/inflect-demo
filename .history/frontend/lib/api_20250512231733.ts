import type { Agent, Message } from "./types";
import { v4 as uuidv4 } from 'uuid';

// 목(Mock) 데이터
const MOCK_TOOLS = [
  "Google Sheets", 
  "Gmail", 
  "Slack", 
  "Google Docs", 
  "Google Sheets Write", 
  "Google Docs Read"
];

// 에이전트 목 응답 생성
const AGENT_RESPONSES: Record<string, string[]> = {
  "customer_data": [
    "I've analyzed your customer data. We have 120 customers, with 15% showing signs of potential churn.",
    "Based on usage patterns, I've identified 3 customer segments that need personalized onboarding.",
    "The most common reason for churn appears to be insufficient product adoption in the first 30 days."
  ],
  "onboarding": [
    "I've created personalized onboarding sequences for each segment. Would you like to review them?",
    "The high-touch enterprise customers will receive a guided tour with a customer success manager.",
    "SMB customers will get an automated email sequence with tutorial videos and case studies."
  ],
  "default": [
    "I've processed your request and created a solution. Is there anything specific you'd like to know?",
    "Based on my analysis, here are some recommendations for your workflow.",
    "I can help you automate this process. Would you like me to set up the necessary integrations?"
  ]
};

/**
 * 에이전트에게 메시지를 보내는 함수 (목 데이터 반환)
 */
export async function sendChatMessage(message: string): Promise<ReadableStream<Uint8Array>> {
  console.log("[MOCK API] Sending chat message");
  
  // 텍스트를 스트림으로 변환하는 함수
  const streamResponse = (text: string): ReadableStream<Uint8Array> => {
    const encoder = new TextEncoder();
    let position = 0;
    const chunkSize = 10;
    
    return new ReadableStream({
      start(controller) {
        function push() {
          if (position >= text.length) {
            controller.close();
            return;
          }
          
          const chunk = text.slice(position, position + chunkSize);
          position += chunkSize;
          
          // OpenAI 형식의 스트리밍 응답 시뮬레이션
          const data = JSON.stringify({ output: chunk });
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          
          setTimeout(push, 50); // 타이핑 효과를 위한 지연
        }
        
        push();
      }
    });
  };
  
  // 메시지 키워드에 따른 응답 선택
  let responseCategory = "default";
  if (message.toLowerCase().includes("customer") && message.toLowerCase().includes("data")) {
    responseCategory = "customer_data";
  } else if (message.toLowerCase().includes("onboard")) {
    responseCategory = "onboarding";
  }
  
  // 카테고리에서 랜덤 응답 선택
  const responses = AGENT_RESPONSES[responseCategory];
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  
  // 인위적 지연 후 응답 반환
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(streamResponse(randomResponse));
    }, 1000);
  });
}

/**
 * 에이전트 빌더로 에이전트를 생성하는 함수 (목 데이터 반환)
 */
export async function createAgent(
  task: string,
  tools: string[]
): Promise<Agent | null> {
  console.log("[MOCK API] Creating agent with tools:", tools);
  
  // 인위적 지연 후 목 에이전트 반환
  return new Promise((resolve) => {
    setTimeout(() => {
      // 에이전트 이름 생성
      const namePrefix = task.toLowerCase().includes("customer") 
        ? "Customer Success" 
        : task.toLowerCase().includes("data") 
          ? "Data Analysis" 
          : "Automation";
      
      resolve({
        id: uuidv4(),
        name: `${namePrefix} Agent`,
        description: `Agent to ${task}`,
        tools: tools,
        created_at: new Date().toISOString()
      });
    }, 1500);
  });
}

/**
 * 사용 가능한 도구 목록을 가져오는 함수 (목 데이터 반환)
 */
export async function getAvailableTools(): Promise<string[]> {
  console.log("[MOCK API] Getting available tools");
  
  // 인위적 지연 후 목 도구 목록 반환
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_TOOLS);
    }, 500);
  });
}

/**
 * 백엔드 연결 상태 확인 함수 (항상 성공 반환)
 */
export async function checkBackendStatus(): Promise<boolean> {
  console.log("[MOCK API] Checking backend status");
  return true;
}

/**
 * Start the workflow execution (목 데이터 반환)
 */
export async function startWorkflow(
  agents: Agent[],
  input: { [key: string]: any }
): Promise<string> {
  console.log("[MOCK API] Starting workflow with agents:", agents.map(a => a.name));
  
  // 인위적 지연 후 목 워크플로우 ID 반환
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(uuidv4());
    }, 1000);
  });
}

/**
 * Get the current status of a workflow (목 데이터 반환)
 */
export async function getWorkflowStatus(workflowId: string): Promise<{
  status: "running" | "completed" | "error";
  agents: Agent[];
  currentStep?: {
    agentId: string;
    status: "running" | "completed" | "error";
  };
  results?: any;
}> {
  console.log("[MOCK API] Getting workflow status for ID:", workflowId);
  
  // 인위적 지연 후 목 워크플로우 상태 반환
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: "completed",
        agents: [],
        results: {
          summary: "Workflow completed successfully"
        }
      });
    }, 800);
  });
}

/**
 * Run an agent with a specific query (목 데이터 반환)
 */
export async function runAgent(
  agentId: string,
  query: string
): Promise<{ status: string; message: string; agent_id: string }> {
  console.log("[MOCK API] Running agent with ID:", agentId, "and query:", query);
  
  // 워크플로우 WebSocket 메시지를 시뮬레이션하는 이벤트 디스패치
  // 실제 구현에서는 WebSocket으로 응답을 보내는 대신 이벤트를 디스패치
  setTimeout(() => {
    const event = new CustomEvent("mock-agent-response", {
      detail: {
        type: "agent_response",
        data: {
          agentId: agentId,
          response: "I've processed your request and here are the results...",
        }
      }
    });
    window.dispatchEvent(event);
    
    // 상태 업데이트 이벤트도 디스패치
    const statusEvent = new CustomEvent("mock-agent-status", {
      detail: {
        type: "agent_status_update",
        data: {
          agentId: agentId,
          status: "completed"
        }
      }
    });
    window.dispatchEvent(statusEvent);
  }, 2000);
  
  // 인위적 지연 후 에이전트 실행 성공 반환
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: "success",
        message: "Agent executed successfully",
        agent_id: agentId
      });
    }, 500);
  });
}

/**
 * Stop a running workflow (목 함수)
 */
export async function stopWorkflow(workflowId: string): Promise<void> {
  console.log("[MOCK API] Stopping workflow with ID:", workflowId);
  
  // 인위적 지연 후 성공 반환
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 500);
  });
}