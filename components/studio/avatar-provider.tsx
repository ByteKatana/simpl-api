// "use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Mail, Bot, Box } from "lucide-react"

const PROVIDERS = [
  { id: "monogram", name: "Monogram", icon: User, preview: "" },
  {
    id: "gravatar",
    name: "Gravatar",
    icon: Mail,
    preview: "https://gravatar.com/images/favicon-32x32.png"
  },
  { id: "dicebear", name: "DiceBear", icon: Bot, preview: "https://www.dicebear.com/favicon.svg" },
  { id: "robohash", name: "RoboHash", icon: Box, preview: "https://robohash.org/favicon.ico" }
]

export function AvatarProvider({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  return (
    <RadioGroup value={value} onValueChange={onChange} className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {PROVIDERS.map((prov) => (
        <div key={prov.id} className="flex items-center space-x-2">
          <RadioGroupItem value={prov.id} id={`prov-${prov.id}`} className="sr-only" />
          <Label
            htmlFor={`prov-${prov.id}`}
            className={`flex flex-col items-center gap-2 p-4 rounded-md border-2 cursor-pointer transition-all hover:bg-muted ${
              value === prov.id ? "border-primary bg-primary/5" : "border-transparent bg-background"
            }`}>
            <Avatar size="lg" className="border">
              {prov.preview ? (
                <AvatarImage src={prov.preview} alt={prov.name} />
              ) : (
                <AvatarFallback>
                  <prov.icon size={20} />
                </AvatarFallback>
              )}
            </Avatar>
            <span className="text-xs font-medium">{prov.name}</span>
          </Label>
        </div>
      ))}
    </RadioGroup>
  )
}
