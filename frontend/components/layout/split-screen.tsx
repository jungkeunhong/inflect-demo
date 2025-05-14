import type { ReactNode } from "react"

interface SplitScreenProps {
  children: ReactNode
}

export default function SplitScreen({ children }: SplitScreenProps) {
  return <div className="flex h-screen w-full overflow-hidden bg-white">{children}</div>
}
