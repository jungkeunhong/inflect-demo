"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Home, Bot } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  url: string
  icon: React.ElementType
}

export function Navbar() {
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState("")
  const [isMobile, setIsMobile] = useState(false)
  
  const items: NavItem[] = [
    {
      name: "Home",
      url: "/",
      icon: Home
    },
    {
      name: "Builder",
      url: "/builder",
      icon: Bot
    }
  ]
  
  useEffect(() => {
    // Set active tab based on current path
    const currentItem = items.find(item => item.url === pathname)
    if (currentItem) {
      setActiveTab(currentItem.name)
    }
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [pathname, items])

  return (
    <header className="sticky top-0 z-50 w-full border-0 bg-white">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="ml-4 mr-4 md:flex">
          <Link href="/" className="flex items-center space-x-2">
            <Image 
              src="/assets/raw-intelligence-logo-black.png" 
              alt="Inflect Logo" 
              width={28} 
              height={28} 
              className="h-8 w-auto"
              priority
            />
            <span className="font-switzer text-2xl font-bold">Inflect</span>
          </Link>
        </div>
        
        {/* Navigation - centered */}
        <div className="fixed bottom-0 sm:bottom-auto sm:absolute sm:left-1/2 sm:-translate-x-1/2 z-50 mb-6 sm:mb-0">
          <div className="flex items-center gap-3 bg-white border border-gray-200 py-1 px-1 rounded-full shadow-md">
            {items.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.name

              return (
                <Link
                  key={item.name}
                  href={item.url}
                  onClick={() => setActiveTab(item.name)}
                  className={cn(
                    "relative cursor-pointer text-sm font-semibold px-6 py-2 rounded-full transition-colors",
                    "text-gray-600 hover:text-primary",
                    isActive && "bg-gray-50 text-primary",
                  )}
                >
                  <span className="hidden md:inline">{item.name}</span>
                  <span className="md:hidden">
                    <Icon size={18} />
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="lamp"
                      className="absolute inset-0 w-full bg-blue-50 rounded-full -z-10"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    >
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-blue-500 rounded-t-full">
                        <div className="absolute w-12 h-6 bg-blue-200/50 rounded-full blur-md -top-2 -left-2" />
                        <div className="absolute w-8 h-6 bg-blue-300/40 rounded-full blur-md -top-1" />
                        <div className="absolute w-4 h-4 bg-blue-400/30 rounded-full blur-sm top-0 left-2" />
                      </div>
                    </motion.div>
                  )}
                </Link>
              )
            })}
          </div>
        </div>
        
        {/* Empty div to balance the logo and maintain layout */}
        <div className="w-[180px]"></div>
      </div>
    </header>
  )
} 