"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
  variant: "build" | "test"
}

export default function ChatInput({ value, onChange, onSubmit, variant }: ChatInputProps) {
  return (
    <form onSubmit={onSubmit} className="border-t border-gray-200 p-4">
      <div className="flex items-center gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
        />
        <Button
          type="submit"
          size="icon"
          className={cn(variant === "build" ? "bg-blue-500 hover:bg-blue-600" : "bg-emerald-500 hover:bg-emerald-600")}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  )
}
