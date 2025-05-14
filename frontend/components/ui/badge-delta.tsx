import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { TrendingDown, TrendingUp, Minus } from "lucide-react"

const badgeDeltaVariants = cva(
  "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
  {
    variants: {
      variant: {
        default: "",
        solid: "",
        outline: "",
      },
      deltaType: {
        increase: "",
        decrease: "",
        neutral: "",
      },
    },
    compoundVariants: [
      // Default variants
      {
        variant: "default",
        deltaType: "increase",
        className: "bg-green-50 text-green-700 ring-green-600/20",
      },
      {
        variant: "default",
        deltaType: "decrease",
        className: "bg-red-50 text-red-700 ring-red-600/20",
      },
      {
        variant: "default",
        deltaType: "neutral",
        className: "bg-gray-50 text-gray-700 ring-gray-600/20",
      },
      // Solid variants
      {
        variant: "solid",
        deltaType: "increase",
        className: "bg-green-500 text-white ring-green-600/20",
      },
      {
        variant: "solid",
        deltaType: "decrease",
        className: "bg-red-500 text-white ring-red-600/20",
      },
      {
        variant: "solid",
        deltaType: "neutral",
        className: "bg-gray-500 text-white ring-gray-600/20",
      },
      // Outline variants
      {
        variant: "outline",
        deltaType: "increase",
        className: "text-green-700 ring-1 ring-green-600/20",
      },
      {
        variant: "outline",
        deltaType: "decrease",
        className: "text-red-700 ring-1 ring-red-600/20",
      },
      {
        variant: "outline",
        deltaType: "neutral",
        className: "text-gray-700 ring-1 ring-gray-600/20",
      },
    ],
    defaultVariants: {
      variant: "default",
      deltaType: "neutral",
    },
  }
)

export interface BadgeDeltaProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeDeltaVariants> {
  value: string
  iconStyle?: "arrow" | "line"
}

function BadgeDelta({
  className,
  variant,
  deltaType,
  value,
  iconStyle = "arrow",
  ...props
}: BadgeDeltaProps) {
  const renderIcon = () => {
    if (iconStyle === "arrow") {
      if (deltaType === "increase") return <span className="mr-1">↑</span>
      if (deltaType === "decrease") return <span className="mr-1">↓</span>
      return null
    } else {
      if (deltaType === "increase") return <TrendingUp className="mr-1 h-3 w-3" />
      if (deltaType === "decrease") return <TrendingDown className="mr-1 h-3 w-3" />
      return <Minus className="mr-1 h-3 w-3" />
    }
  }

  return (
    <div
      className={cn(badgeDeltaVariants({ variant, deltaType }), className)}
      {...props}
    >
      {renderIcon()}
      {value}
    </div>
  )
}

export { BadgeDelta, badgeDeltaVariants } 