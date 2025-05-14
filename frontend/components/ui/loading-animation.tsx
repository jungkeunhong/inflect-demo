import { type Agent } from "@/lib/types"
import { Loader2 } from "lucide-react"

interface LoadingAnimationProps {
  type: "building" | "testing"
  agents: Agent[]
}

export default function LoadingAnimation({ type, agents }: LoadingAnimationProps) {
  // status 값을 문자열로 매핑하는 함수
  const getStatusClass = (status: string) => {
    console.log("Agent status in LoadingAnimation:", status);
    
    switch (status) {
      case "idle":
        return "bg-gray-300"; // 대기 중
      case "running":
        return "bg-blue-500"; // 실행 중
      case "completed":
        return "bg-green-500"; // 완료됨
      case "error":
        return "bg-red-500"; // 오류
      case "building":
        return "bg-blue-500"; // 빌딩 중
      default:
        return "bg-gray-300"; // 기본값
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case "idle":
        return "Waiting...";
      case "running":
        return "Connecting services...";
      case "completed":
        return "Ready";
      case "error":
        return "Error";
      case "building":
        return "Building...";
      default:
        return "Initializing...";
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="text-center max-w-md">
        <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-500" />
        <h2 className="text-2xl font-bold mb-4">
          {type === "building" ? "Building Your Workflow" : "Testing Your Workflow"}
        </h2>

        <div className="space-y-4 mt-8">
          {agents.map((agent) => (
            <div key={agent.id} className="flex items-center">
              <div
                className={`h-2 w-2 rounded-full mr-3 ${getStatusClass(agent.status)}`}
              ></div>
              <div className="text-left">
                <div className="font-medium">{agent.name}</div>
                <div className="text-sm text-gray-500">
                  {getStatusText(agent.status)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
