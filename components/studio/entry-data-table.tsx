"use client"
import React from "react"
import { DataTable } from "@/components/studio/data-table/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableRowActions } from "./data-table/data-table-row-actions"
import { Entry } from "@/interfaces"
import { Check, CircleDotDashed } from "lucide-react"

const columns: ColumnDef<Entry>[] = [
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
  { accessorKey: "entry_type.name", id: "entry_type.name", header: "Entry Type" },
  { accessorKey: "entry_type.namespace", id: "entry_type.namespace", header: "Namespace" },
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

export default function EntryDataTable({ data }: { data: Entry[] }) {
  const getEntryTypeFilterOptions = () => {
    return data
      .filter(
        (entry: Entry, index: number) =>
          data.findIndex((entry2: Entry) => entry2.entry_type.name === entry.entry_type.name) === index
      )
      .map((entry: Entry) => {
        return {
          label: entry.entry_type.name,
          value: entry.entry_type.name
        }
      })
  }

  const filters: DataTableFilters = [
    {
      columnId: "entry_type.name",
      title: "Entry Type",
      options: getEntryTypeFilterOptions()
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
    <DataTable<Entry, unknown>
      columns={columns}
      data={data}
      searchKey="name"
      filters={filters}
      onDelete={(rows) => console.log("Bulk Delete", rows)}
      onPublish={(rows) => console.log("Bulk Publish", rows)}
    />
  )
}
