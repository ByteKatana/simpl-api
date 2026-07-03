import React from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const InfoTooltip = ({ icon, message, animate }: { icon: React.ReactNode; message: string; animate?: boolean }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={`${animate ? "animate-pulse" : ""}`}>{icon}</span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{message}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
export default InfoTooltip
