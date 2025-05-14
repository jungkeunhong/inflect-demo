"use client"

import { useState } from "react"
import { ChatInput } from "@/components/ui/chat-input"
import { Button } from "@/components/ui/button"
import { Paperclip, CornerDownLeft } from "lucide-react"

interface ChatInputWithActionsProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  placeholder?: string
  disabled?: boolean
  showAttach?: boolean
  actionLabel?: string
  actionButtons?: React.ReactNode[]
}

export function ChatInputWithActions({
  value,
  onChange,
  onSubmit,
  placeholder = "Type your message here...",
  disabled = false,
  showAttach = true,
  actionLabel = "Send",
  actionButtons = []
}: ChatInputWithActionsProps) {
  return (
    <form 
      className="relative focus-within:ring-0"
      onSubmit={onSubmit}
    >
      <ChatInput
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="font-satoshimin-h-12 resize-none bg-background focus-visible:ring-0 focus:border-0 focus-visible:border-0 border-0 px-4 py-3"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            const form = e.currentTarget.form
            if (form) form.requestSubmit()
          }
        }}
      />
      
      <div className="flex items-center pt-2 px-1">
        <div className="flex items-center gap-2">
          {actionButtons.map((button, index) => (
            <div key={index}>{button}</div>
          ))}
        </div>
        
        {showAttach && (
          <Button variant="ghost" size="icon" type="button" disabled={disabled} className="text-gray-400">
            <Paperclip className="size-5" />
            <span className="sr-only">Attach file</span>
          </Button>
        )}

        <Button
          type="submit"
          size="sm"
          className="ml-auto gap-1.5 rounded-md"
          disabled={!value.trim() || disabled}
          variant="secondary"
        >
          {actionLabel}
          <CornerDownLeft className="size-3.5" />
        </Button>
      </div>
    </form>
  )
} 