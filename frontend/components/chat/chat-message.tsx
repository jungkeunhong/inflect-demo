import type { Message } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface ChatMessageProps {
  message: Message
  variant: "build" | "test"
}

export default function ChatMessage({ message, variant }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[80%] rounded-lg p-3",
          isUser
            ? "bg-blue-500 text-white"
            : variant === "build"
              ? "bg-gray-100 text-gray-800"
              : "bg-emerald-50 text-gray-800",
        )}
      >
        <div className="whitespace-pre-line">
          {message.isThinking ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Thinking...</span>
            </div>
          ) : (
            <div
              className="prose prose-sm"
              dangerouslySetInnerHTML={{
                __html: message.content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br />"),
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}
