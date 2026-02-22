"use client"
import React from "react"
import { DataTable } from "@/components/studio/data-table/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableRowActions } from "./data-table/data-table-row-actions"
import { Entry, EntryType } from "@/interfaces"
import { Check, CircleDotDashed } from "lucide-react"

const columns: ColumnDef<EntryType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "namespace", header: "Namespace" },
  { accessorKey: "entries", header: "Number of Entries" },
  { accessorKey: "status", header: "Status" },
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions
        row={row}
        onEdit={(row) => console.log("Edit", row.original)}
        onDelete={(row) => console.log("Delete", row.original)}
      />
    )
  }
]

type DataTableFilters = DataTableFilterObject[]
type DataTableFilterObject = {
  columnId: string
  title: string
  options: {
    label: string
    value: string
    icon?:
      | React.ComponentType<{
          className?: string | undefined
        }>
      | undefined
  }[]
}

export default function EntryTypeDataTable({ data }: { data: EntryType[] }) {
  const getNameSpaceFilterOptions = () => {
    return data
      .filter(
        (entryType: EntryType, index: number) =>
          data.findIndex((entryType2: EntryType) => entryType2.namespace === entryType.namespace) === index
      )
      .map((entryType: EntryType) => {
        return {
          label: entryType.name,
          value: entryType.namespace
        }
      })
  }

  const filters: DataTableFilters = [
    {
      columnId: "namespace",
      title: "Namespace",
      options: getNameSpaceFilterOptions()
    },
    {
      columnId: "status",
      title: "Status",
      options: [
        {
          icon: Check,
          label: "Published",
          value: "Published"
        },
        {
          icon: CircleDotDashed,
          label: "Draft",
          value: "Draft"
        }
      ]
    }
  ]

  return (
    <DataTable<EntryType, unknown>
      columns={columns}
      data={data}
      searchKey="name"
      filters={filters}
      onDelete={(rows) => console.log("Bulk Delete", rows)}
      onPublish={(rows) => console.log("Bulk Publish", rows)}
    />
  )
}
