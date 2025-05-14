"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { HeroSection } from "@/components/hero-section"

export default function Home() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // 메시지 처리 - 데모용 지연 추가
  const handleSubmit = (message: string) => {
    setIsLoading(true)
    
    // 데모용 지연 효과
    setTimeout(() => {
      const encoded = encodeURIComponent(message)
      router.push(`/builder?message=${encoded}`)
    }, 800) // 약간의 지연으로 사용자 경험 향상
  }

  // 에이전트 빌더로 이동
  const handleBuildAgent = () => {
    setIsLoading(true)
    
    // 데모용 지연 효과
    setTimeout(() => {
      router.push("/builder?mode=demo")
    }, 600)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection 
          onSubmit={handleSubmit}
          onBuildAgentClick={handleBuildAgent}
          isLoading={isLoading}
        />
      </main>
      <Footer />
    </div>
  )
}
