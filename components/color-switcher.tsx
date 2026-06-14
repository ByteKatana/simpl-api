"use client"
import * as React from "react"
import { Check, Palette } from "lucide-react"
import { useAppStore, primaryColors, PrimaryColor } from "@/hooks/use-app-store"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function ColorSwitcher() {
  const { primaryColor, setPrimaryColor } = useAppStore()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Palette className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Change primary color</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {(Object.keys(primaryColors) as PrimaryColor[]).map((color) => {
          const config = primaryColors[color]
          return (
            <DropdownMenuItem
              key={color}
              onClick={() => setPrimaryColor(color)}
              className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="h-4 w-4 rounded-full border"
                  style={{
                    backgroundColor: `oklch(${config.l || "0.6"} ${config.c || "0.2"} ${config.hue})`
                  }}
                />
                <span className="capitalize">{color}</span>
              </div>
              {primaryColor === color && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
