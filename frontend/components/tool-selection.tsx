"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { type Message } from "@/lib/types"
import React from "react"

interface ToolSelectionProps {
  message: Message
  availableTools: string[]
  onToolSelect: (tools: string[]) => void
}

// Memoized Tool Selection component to prevent unnecessary re-renders
function ToolSelectionComponent({ message, availableTools, onToolSelect }: ToolSelectionProps) {
  const [selectedTools, setSelectedTools] = useState<string[]>([])
  
  return (
    <motion.div 
      key={message.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-start space-y-4"
    >
      <div className="bg-background text-foreground rounded-lg p-4">
        <div className="mb-4">{message.content}</div>
        <div className="flex flex-wrap gap-2">
          {availableTools.map((tool) => (
            <Button
              key={tool}
              variant={selectedTools.includes(tool) ? "default" : "outline"}
              size="sm"
              className={selectedTools.includes(tool) ? "" : "border-gray-200"}
              onClick={() => {
                setSelectedTools((prev) =>
                  prev.includes(tool)
                    ? prev.filter((t) => t !== tool)
                    : [...prev, tool]
                )
              }}
            >
              {tool}
            </Button>
          ))}
        </div>
      </div>
      <Button
        variant="secondary"
        size="sm"
        disabled={selectedTools.length === 0}
        onClick={() => {
          onToolSelect(selectedTools)
          setSelectedTools([])
        }}
      >
        Continue
      </Button>
    </motion.div>
  )
}

// Export memoized version to prevent re-renders
export const ToolSelection = React.memo(ToolSelectionComponent); 