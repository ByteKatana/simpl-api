"use client"

import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Row } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { ConfirmDialog } from "@/components/studio/confirm-dialog"
import { Eye, FilePlus, Shredder, SquarePen } from "lucide-react"
import { PreviewModal } from "@/components/studio/preview-modal"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
  onEdit?: (row: Row<TData>) => void
  onDelete?: (row: Row<TData>) => void
  onCreateEntry?: (row: Row<TData>) => void
}

export function DataTableRowActions<TData>({ row, onEdit, onDelete, onCreateEntry }: DataTableRowActionsProps<TData>) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  // Determine type based on properties (preview-modal)
  const isEntryType = "fieldsets" in (row.original as any)
  const dataType = isEntryType ? "entry-type" : "entry"

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="data-[state=open]:bg-muted flex h-8 w-8 p-0">
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={() => setShowPreview(true)}>
            <span className="flex flex-row w-full gap-x-2 py-2 cursor-pointer justify-start items-center text-slate-700 dark:text-slate-400">
              <Eye className="h-4 w-4" /> Preview
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onEdit?.(row)}>
            <span className="flex flex-row w-full gap-x-2 py-2 cursor-pointer justify-start items-centertext-slate-700 dark:text-slate-400">
              <SquarePen /> Edit
            </span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onCreateEntry?.(row)}>
            <span className="flex flex-row w-full gap-x-2 py-2 cursor-pointer justify-start items-centertext-slate-700 dark:text-slate-400">
              <FilePlus /> Create Entry
            </span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} variant="destructive">
            <span className="flex flex-row w-full gap-x-2 py-2 cursor-pointer justify-start items-center text-rose-500">
              <Shredder /> Delete
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Preview Modal */}
      <PreviewModal open={showPreview} onOpenChange={setShowPreview} data={row.original} type={dataType as any} />

      {onDelete && (
        <ConfirmDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          title="Are you sure?"
          desc="This action cannot be undone. This will permanently delete the item."
          destructive
          confirmText="Delete"
          handleConfirm={() => {
            onDelete(row)
            setShowDeleteDialog(false)
          }}
        />
      )}
    </>
  )
}
