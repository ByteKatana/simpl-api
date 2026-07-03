"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  LayoutDashboard,
  FileText,
  Layers,
  Users,
  Settings,
  ShieldCheck,
  FilePlus,
  UserPlus,
  FolderPlus,
  ShieldPlus
} from "lucide-react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import getEntryTypes from "@/lib/actions/studio/entry-types/get-entry-types"

export function SearchCommand() {
  const [open, setOpen] = React.useState(false)
  const [selectionDialogOpen, setSelectionDialogOpen] = React.useState(false)
  const [entryTypes, setEntryTypes] = React.useState<any[]>([])
  const [selectedSlug, setSelectedSlug] = React.useState<string>("")
  const router = useRouter()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false)
    command()
  }, [])

  const handleCreateEntry = async () => {
    setOpen(false)
    const response = await getEntryTypes()
    if (response.success) {
      setEntryTypes(response.data)
      setSelectionDialogOpen(true)
    }
  }

  const handleContinueCreateEntry = () => {
    if (selectedSlug) {
      setSelectionDialogOpen(false)
      router.push(`/studio/entries/new?slug=${selectedSlug}`)
    }
  }

  const navigationItems = [
    { label: "Home", icon: LayoutDashboard, href: "/studio" },
    { label: "Entries", icon: FileText, href: "/studio/entries" },
    { label: "Entry Types", icon: Layers, href: "/studio/entry-types" },
    { label: "Users", icon: Users, href: "/studio/users" },
    { label: "Permission Groups", icon: ShieldCheck, href: "/studio/permission-groups" },
    { label: "Settings", icon: Settings, href: "/studio/settings" },
    { label: "General Settings", icon: Settings, href: "/studio/settings?tab=general" },
    { label: "Identity Settings", icon: Settings, href: "/studio/settings?tab=identity" },
    { label: "Permission Groups Settings", icon: Settings, href: "/studio/settings?tab=permission-groups" },
    { label: "API Settings", icon: Settings, href: "/studio/settings?tab=api" },
    { label: "Appearance Settings", icon: Settings, href: "/studio/settings?tab=appearance" }
  ]

  const actionItems = [
    {
      label: "Create Entry",
      icon: FilePlus,
      onSelect: handleCreateEntry
    },
    {
      label: "Create Entry Type",
      icon: FolderPlus,
      onSelect: () => runCommand(() => router.push("/studio/entry-types/new"))
    },
    {
      label: "Create User",
      icon: UserPlus,
      onSelect: () => runCommand(() => router.push("/studio/users/new"))
    },
    {
      label: "Create Permission Group",
      icon: ShieldPlus,
      onSelect: () => runCommand(() => router.push("/studio/permission-groups/new"))
    }
  ]

  return (
    <>
      <div className="relative w-full max-w-sm cursor-pointer" onClick={() => setOpen(true)}>
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search... (⌘K)" className="pl-8 cursor-pointer" readOnly />
      </div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            {navigationItems.map((item) => (
              <CommandItem
                key={item.href}
                value={item.label}
                onSelect={() => {
                  runCommand(() => router.push(item.href))
                }}>
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Actions">
            {actionItems.map((item) => (
              <CommandItem key={item.label} value={item.label} onSelect={item.onSelect}>
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      <Dialog open={selectionDialogOpen} onOpenChange={setSelectionDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Select Entry Type</DialogTitle>
            <DialogDescription>Choose the type of entry you want to create.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Select onValueChange={setSelectedSlug} value={selectedSlug}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an entry type" />
              </SelectTrigger>
              <SelectContent>
                {entryTypes.map((type) => (
                  <SelectItem key={type.slug} value={type.slug}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              onClick={handleContinueCreateEntry}
              disabled={!selectedSlug}
              className="bg-green-500 text-white hover:bg-green-600 w-full">
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
