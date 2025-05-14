"use client"

import { Navbar } from "@/components/layout/navbar"
import { BuilderChat } from "@/components/builder/BuilderChat"

export default function BuilderPage() {
  return (
    <div>
      <Navbar />
      <BuilderChat />
    </div>
  )
}