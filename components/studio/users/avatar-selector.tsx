"use client"

import { useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Field, FieldLabel } from "@/components/ui/field"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { AvatarProvider } from "../avatar-provider"

const DICEBEAR_STYLES = [
  "adventurer",
  "avataaars",
  "bottts",
  "fun-emoji",
  "notionists",
  "lorelei",
  "micah",
  "miniavs",
  "open-peeps",
  "personas",
  "pixel-art"
]

const ROBOHASH_SETS = [
  { label: "Robots (Default)", value: "set1" },
  { label: "Monsters", value: "set2" },
  { label: "Disembodied Heads", value: "set3" },
  { label: "Kittens", value: "set4" }
]

const ROBOHASH_BACKGROUNDS = [
  { label: "None", value: "none" },
  { label: "City", value: "bg1" },
  { label: "Desert", value: "bg2" }
]

async function sha256(message: string) {
  const msgUint8 = new TextEncoder().encode(message.trim().toLowerCase())
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

export function AvatarSelector({
  provider: initialProvider,
  username,
  email,
  value,
  onChange
}: {
  provider: string
  username: string
  email?: string
  value: string
  onChange: (val: string) => void
}) {
  const [selectedProvider, setSelectedProvider] = useState(initialProvider)
  const [params, setParams] = useState<Record<string, string>>({})
  const seed = username || "default"

  // Sync internal provider state if the prop changes (e.g., from settings)
  useEffect(() => {
    if (initialProvider !== "no-default") {
      setSelectedProvider(initialProvider)
    }
  }, [initialProvider])

  // Auto-update Gravatar when email changes
  useEffect(() => {
    if (selectedProvider === "gravatar" && email) {
      sha256(email).then((hash) => {
        onChange(`https://www.gravatar.com/avatar/${hash}?d=identicon`)
      })
    }
  }, [email, selectedProvider])

  // Auto-update URL when username (seed) changes for DiceBear and RoboHash
  useEffect(() => {
    if (selectedProvider === "dicebear" && params.style) {
      onChange(`https://api.dicebear.com/9.x/${params.style}/svg?seed=${seed}`)
    } else if (selectedProvider === "robohash") {
      let url = `https://robohash.org/${seed}?set=${params.set || "set1"}`
      if (params.bgset && params.bgset !== "none") {
        url += `&bgset=${params.bgset}`
      }
      onChange(url)
    } else if (selectedProvider === "monogram") {
      onChange(seed)
    }
  }, [seed, selectedProvider])

  // Parse existing URL to restore parameters on load
  useEffect(() => {
    if (value) {
      try {
        const url = new URL(value)
        if (selectedProvider === "dicebear") {
          const style = url.pathname.split("/")[2]
          setParams({ style })
        } else if (selectedProvider === "robohash") {
          const set = url.searchParams.get("set") || "set1"
          const bgset = url.searchParams.get("bgset") || "none"
          setParams({ set, bgset })
        }
      } catch (e) {}
    }
  }, [selectedProvider])

  const updateDicebear = (style: string) => {
    const url = `https://api.dicebear.com/9.x/${style}/svg?seed=${seed}`
    setParams({ style })
    onChange(url)
  }

  const updateRobohash = (newParams: Record<string, string>) => {
    const updated = { ...params, ...newParams }
    let url = `https://robohash.org/${seed}?set=${updated.set || "set1"}`
    if (updated.bgset && updated.bgset !== "none") {
      url += `&bgset=${updated.bgset}`
    }
    setParams(updated)
    onChange(url)
  }

  const isNoDefault = initialProvider === "no-default"

  return (
    <div className="space-y-6">
      {/* Show Provider Selection if no default is set */}
      {isNoDefault && (
        <div className="space-y-2">
          <FieldLabel>Select Avatar Provider</FieldLabel>
          <AvatarProvider
            value={selectedProvider === "no-default" ? "" : selectedProvider}
            onChange={setSelectedProvider}
          />
        </div>
      )}

      {/* DiceBear Form */}
      {selectedProvider === "dicebear" && (
        <div className="space-y-4">
          <Field>
            <FieldLabel>
              Avatar Style <span className="text-muted-foreground">(PREVIEW)</span>
            </FieldLabel>
            <RadioGroup
              value={params.style}
              onValueChange={updateDicebear}
              className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {DICEBEAR_STYLES.map((style) => (
                <div key={style} className="flex items-center space-x-2">
                  <RadioGroupItem value={style} id={`style-${style}`} className="sr-only" />
                  <Label
                    htmlFor={`style-${style}`}
                    className={`flex flex-1 items-center gap-3 p-2 rounded-md border-2 cursor-pointer transition-all hover:bg-muted ${
                      params.style === style ? "border-primary bg-primary/5" : "border-transparent bg-background"
                    }`}>
                    <Avatar size="lg" className="shrink-0 border">
                      <AvatarImage
                        alt={`User's profile image`}
                        src={`https://api.dicebear.com/9.x/${style}/svg?seed=${seed}`}
                      />
                      <AvatarFallback>{style[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium capitalize">{style.replace("-", " ")}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </Field>
        </div>
      )}

      {/* RoboHash Form */}
      {selectedProvider === "robohash" && (
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <b className="font-normal text-xs uppercase text-muted-foreground">Preview</b>
            {value && (
              <Avatar size="lg" className="bg-slate-100 border">
                <AvatarImage alt={`User's profile image`} src={value} />
              </Avatar>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Character Set</FieldLabel>
              <Select value={params.set} onValueChange={(v) => updateRobohash({ set: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROBOHASH_SETS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>Background</FieldLabel>
              <Select value={params.bgset} onValueChange={(v) => updateRobohash({ bgset: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROBOHASH_BACKGROUNDS.map((b) => (
                    <SelectItem key={b.value} value={b.value}>
                      {b.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
        </div>
      )}

      {/* Gravatar and Monogram Preview */}
      {(selectedProvider === "gravatar" || selectedProvider === "monogram") && (
        <div className="flex flex-col gap-4">
          <b className="font-normal text-xs uppercase text-muted-foreground">Preview</b>
          <div className="flex items-center gap-4">
            <Avatar size="lg" className="border">
              {value && <AvatarImage alt={`User's profile image`} src={value} />}
              <AvatarFallback>{(username || "??").substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="text-sm text-muted-foreground italic">
              {selectedProvider === "gravatar"
                ? "Gravatar is synced with the email address above."
                : "Default monogram based on your username."}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
