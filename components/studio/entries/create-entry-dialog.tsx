"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CirclePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface EntryType {
  id: string
  name: string
  slug: string
}

interface CreateEntryDialogProps {
  entryTypes: EntryType[]
}

export function CreateEntryDialog({ entryTypes }: CreateEntryDialogProps) {
  const [selectedSlug, setSelectedSlug] = useState<string>("")
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleCreate = () => {
    if (selectedSlug) {
      //setOpen(false)
      router.push(`/studio/entries/new?slug=${selectedSlug}`)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex flex-row gap-2 items-center bg-green-500 text-white hover:bg-green-600">
          <CirclePlus />
          <span>New Entry</span>
        </Button>
      </DialogTrigger>
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
            onClick={handleCreate}
            disabled={!selectedSlug}
            className="bg-green-500 text-white hover:bg-green-600 w-full">
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
