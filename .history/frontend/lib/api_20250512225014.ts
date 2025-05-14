import type { Agent, Message } from "./types";
import { APIError, withRetry } from "./error-handler";

// API 기본 URL (백엔드 서버 주소) - 직접 FastAPI 백엔드로 요청 전송
const API_BASE_URL = "http://localhost:8000";

/**
 * 에이전트에게 메시지를 보내는 함수 (스트리밍 지원)
 */
export async function sendChatMessage(message: string): Promise<ReadableStream<Uint8Array>> {
  return withRetry(async () => {
    try {
      console.log(`[API] Sending chat message to ${API_BASE_URL}/api/chat`);
      
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          input: message
        }),
      });

      console.log(`[API] Chat response status: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => "No error text");
        console.error(`[API] Chat error: ${response.status}, ${errorText}`);
        throw new APIError(
          `Error: ${response.status}`,
          response.status,
          response.status >= 500 ? 'BACKEND_ERROR' : undefined
        );
      }

      if (!response.body) {
        throw new APIError("No response body", 500, 'BACKEND_ERROR');
      }

      return response.body;
    } catch (error) {
      console.error("[API] sendChatMessage error:", error);
      if (error instanceof APIError) {
        throw error;
      }
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error("[API] Network error in sendChatMessage:", error.message);
        throw new APIError("Network error", 0, 'NETWORK_ERROR');
      }
      throw new APIError("Failed to send message", 500, 'BACKEND_ERROR');
    }
  });
}

/**
 * 에이전트 빌더로 에이전트를 생성하는 함수
 */
export async function createAgent(
  task: string,
  tools: string[]
): Promise<Agent | null> {
  return withRetry(async () => {
    try {
      console.log(`[API] Creating agent with tools: ${tools.join(", ")}`);
      
      const response = await fetch(`${API_BASE_URL}/api/create_agent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          task,
          tools,
        }),
      });

      console.log(`[API] Create agent response status: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => "No error text");
        console.error(`[API] Create agent error: ${response.status}, ${errorText}`);
        throw new APIError(
          `Error: ${response.status}`,
          response.status,
          response.status >= 500 ? 'BACKEND_ERROR' : undefined
        );
      }

      const data = await response.json();
      return data.agent;
    } catch (error) {
      console.error("[API] createAgent error:", error);
      if (error instanceof APIError) {
        throw error;
      }
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error("[API] Network error in createAgent:", error.message);
        throw new APIError("Network error", 0, 'NETWORK_ERROR');
      }
      throw new APIError("Failed to create agent", 500, 'BACKEND_ERROR');
    }
  });
}

/**
 * 사용 가능한 도구 목록을 가져오는 함수
 */
export async function getAvailableTools(): Promise<string[]> {
  return withRetry(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tools`);
      
      if (!response.ok) {
        throw new APIError(
          `Error: ${response.status}`,
          response.status,
          response.status >= 500 ? 'BACKEND_ERROR' : undefined
        );
      }

      const data = await response.json();
      return data.tools;
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new APIError("Network error", 0, 'NETWORK_ERROR');
      }
      throw new APIError("Failed to fetch tools", 500, 'BACKEND_ERROR');
    }
  });
}

/**
 * 백엔드 연결 상태 확인 함수
 */
export async function checkBackendStatus(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    return response.ok;
  } catch (error) {
    console.error("Backend connection error:", error);
    return false;
  }
}

/**
 * Start the workflow execution
 */
export async function startWorkflow(
  agents: Agent[],
  input: { [key: string]: any }
): Promise<string> {
  return withRetry(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/workflow/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agents: agents.map(a => ({
            id: a.id,
            name: a.name,
            tools: a.tools
          })),
          input
        }),
      });

      if (!response.ok) {
        throw new APIError(
          `Error: ${response.status}`,
          response.status,
          response.status >= 500 ? 'BACKEND_ERROR' : undefined
        );
      }

      const data = await response.json();
      return data.workflowId;
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new APIError("Network error", 0, 'NETWORK_ERROR');
      }
      throw new APIError("Failed to start workflow", 500, 'BACKEND_ERROR');
    }
  });
}

/**
 * Get the current status of a workflow
 */
export async function getWorkflowStatus(workflowId: string): Promise<{
  status: "running" | "completed" | "error";
  agents: Agent[];
  currentStep?: {
    agentId: string;
    step: string;
    details: string;
  };
}> {
  return withRetry(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/workflow/${workflowId}/status`);
      
      if (!response.ok) {
        throw new APIError(
          `Error: ${response.status}`,
          response.status,
          response.status >= 500 ? 'BACKEND_ERROR' : undefined
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new APIError("Network error", 0, 'NETWORK_ERROR');
      }
      throw new APIError("Failed to get workflow status", 500, 'BACKEND_ERROR');
    }
  });
}

/**
 * Run an agent with a specific query
 */
export async function runAgent(
  agentId: string,
  query: string
): Promise<{ status: string; message: string; agent_id: string }> {
  return withRetry(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/run_agent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agent_id: agentId,
          query,
        }),
      });

      if (!response.ok) {
        throw new APIError(
          `Error: ${response.status}`,
          response.status,
          response.status >= 500 ? 'BACKEND_ERROR' : undefined
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new APIError("Network error", 0, 'NETWORK_ERROR');
      }
      throw new APIError("Failed to run agent", 500, 'BACKEND_ERROR');
    }
  });
}

/**
 * Stop a running workflow
 */
export async function stopWorkflow(workflowId: string): Promise<void> {
  return withRetry(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/workflow/${workflowId}/stop`, {
        method: "POST"
      });
      
      if (!response.ok) {
        throw new APIError(
          `Error: ${response.status}`,
          response.status,
          response.status >= 500 ? 'BACKEND_ERROR' : undefined
        );
      }
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new APIError("Network error", 0, 'NETWORK_ERROR');
      }
      throw new APIError("Failed to stop workflow", 500, 'BACKEND_ERROR');
    }
  });
} 