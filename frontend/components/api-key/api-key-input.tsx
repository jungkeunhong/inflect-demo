"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EyeIcon, EyeOffIcon, CheckCircle } from "lucide-react"

interface ApiKeyInputProps {
  service: string
  onSubmit: (key: string) => void
  description?: string
  placeholder?: string
  isValidated?: boolean
}

export function ApiKeyInput({
  service,
  onSubmit,
  description,
  placeholder = "Enter API key",
  isValidated = false
}: ApiKeyInputProps) {
  const [apiKey, setApiKey] = useState("")
  const [isVisible, setIsVisible] = useState(false)
  const [isSuccess, setIsSuccess] = useState(isValidated)
  
  // 컴포넌트 렌더링 로그
  console.log(`[ApiKeyInput] Rendering for ${service}, isValidated: ${isValidated}, isSuccess: ${isSuccess}`);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (apiKey.trim()) {
      console.log(`[ApiKeyInput] Submitting API key for ${service}`);
      onSubmit(apiKey.trim())
      setApiKey("")
      setIsSuccess(true)
      console.log(`[ApiKeyInput] Set success state for ${service} to true`);
    }
  }

  return (
    <div className="space-y-2">
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            type={isVisible ? "text" : "password"}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder={placeholder}
            className="pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full"
            onClick={() => setIsVisible(!isVisible)}
            aria-label={isVisible ? "Hide API key" : "Show API key"}
          >
            {isVisible ? (
              <EyeOffIcon className="h-4 w-4" />
            ) : (
              <EyeIcon className="h-4 w-4" />
            )}
          </Button>
        </div>
        <Button type="submit" size="sm" disabled={!apiKey.trim()}>
          Submit
        </Button>
      </form>
      
      {isSuccess && (
        <div className="flex items-center text-sm text-green-600 mt-1">
          <CheckCircle className="h-4 w-4 mr-1" />
          <span>Validated</span>
        </div>
      )}
    </div>
  )
} 