"use client"

import { Table } from "@tanstack/react-table"
import { Check, Trash2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "./data-table-view-options"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { useState } from "react"
import { ConfirmDialog } from "@/components/studio/confirm-dialog"
import { toast } from "sonner"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  searchKey?: string
  filters?: {
    columnId: string
    title: string
    options: {
      label: string
      value: string
      icon?: React.ComponentType<{ className?: string }>
    }[]
  }[]
  onDelete?: (rows: TData[]) => void
  onPublish?: (rows: TData[]) => void
}

export function DataTableToolbar<TData>({
  table,
  searchKey,
  filters,
  onDelete,
  onPublish
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center gap-2">
        {searchKey && (
          <Input
            placeholder="Filter..."
            value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn(searchKey)?.setFilterValue(event.target.value)}
            className="h-8 w-[150px] lg:w-[250px]"
          />
        )}
        {filters?.map(
          (filter) =>
            table.getColumn(filter.columnId) && (
              <DataTableFacetedFilter
                key={filter.columnId}
                column={table.getColumn(filter.columnId)}
                title={filter.title}
                options={filter.options}
              />
            )
        )}
        {isFiltered && (
          <Button variant="ghost" onClick={() => table.resetColumnFilters()} className="h-8 px-2 lg:px-3">
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        {selectedRows.length > 0 && (
          <div className="flex items-center gap-2">
            {onPublish && (
              <Button
                variant="outline"
                size="sm"
                className="h-8"
                onClick={() => {
                  onPublish(selectedRows.map((row) => row.original))
                  table.resetRowSelection()
                  toast.success(`${selectedRows.length} item(s) published successfully`)
                }}>
                <Check className="mr-2 h-4 w-4" />
                Publish
              </Button>
            )}
            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-rose-500"
                onClick={() => setShowDeleteDialog(true)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            )}
          </div>
        )}
        <DataTableViewOptions table={table} />
      </div>

      {onDelete && (
        <ConfirmDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          title="Are you sure?"
          desc={`This action cannot be undone. This will permanently delete ${selectedRows.length} item(s).`}
          destructive
          confirmText="Delete"
          handleConfirm={() => {
            onDelete(selectedRows.map((row) => row.original))
            table.resetRowSelection()
            setShowDeleteDialog(false)
            toast.success(`${selectedRows.length} item(s) deleted successfully`)
          }}
        />
      )}
    </div>
  )
}
