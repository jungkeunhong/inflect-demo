"use client"

import React from "react"
import DetectAgentView from "@/components/visualization/detect-agent-view"
import { Navbar } from "@/components/layout/navbar"

export default function DetectAgentTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Detect Agent Test Page</h1>
        <DetectAgentView isActive={true} />
      </main>
    </div>
  )
} 