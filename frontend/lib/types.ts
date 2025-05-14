export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
  type?: "text" | "api_key_input" | "api_keys_group" | "tool_selection" | "error" | "user_tool_selection_response" | "user_api_key_response";
  meta?: Record<string, any>;
};

export type Agent = {
  id: string;
  name: string;
  description: string;
  tools: string[];
  status: "idle" | "running" | "completed" | "error";
  createdAt: Date;
  updatedAt: Date;
};

export interface ExtendedAgent extends Agent {
  task?: string;
}

export enum AgentStatus {
  IDLE = "idle",
  BUILDING = "building",
  TESTING = "testing",
  ERROR = "error"
}

export interface ToolInterface {
  isActive: boolean
}
