"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => {
  const clampedValue = Math.min(100, Math.max(0, value || 0))
  
  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-4 w-full overflow-visible rounded-full bg-gray-200 dark:bg-gray-700",
        className
      )}
      {...props}
    >
      <div className="relative h-full w-full overflow-hidden rounded-full">
        {/* Background bar */}
        <div className="absolute h-full w-full bg-gray-300 dark:bg-gray-600" />
        {/* Progress bar */}
        <ProgressPrimitive.Indicator
          className="h-full w-full flex-1 bg-green-500 dark:bg-green-500 transition-all ease-out"
          style={{ transform: `translateX(-${100 - clampedValue}%)` }}
        />
      </div>
      {/* Circle indicator */}
      <div 
        style={{ 
          position: 'absolute',
          left: `${clampedValue}%`,
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: '20px',
          height: '20px',
          borderRadius: '9999px',
          backgroundColor: 'white',  // Force white background in both modes
          border: '2px solid #22c55e',  // Force green border in both modes
          transition: 'all ease-out',
          outline: 'none',
          zIndex: 10  // Ensure circle stays on top
        }}
      />
    </ProgressPrimitive.Root>
  )
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
