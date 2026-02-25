"use client"
import React from "react"
import { DataTable } from "@/components/studio/data-table/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableRowActions } from "./data-table/data-table-row-actions"
import { Entry, EntryType } from "@/interfaces"
import { Archive, Box, Check, CircleDotDashed } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const getLabelForStatus = (status: string) => {
  switch (status.toLowerCase()) {
    case "published":
      return (
        <Badge variant={"secondary"} className="bg-emerald-400 text-white">
          <Check data-icon="inline-start" />
          <span className="text-sm">Published</span>
        </Badge>
      )
    case "archived":
      return (
        <Badge variant={"secondary"} className="bg-gray-400 text-white">
          <Archive data-icon="inline-start" />
          <span className="text-sm">Archived</span>
        </Badge>
      )
    case "draft":
      return (
        <Badge variant={"secondary"} className="bg-amber-400 text-white">
          <CircleDotDashed data-icon="inline-start" />
          <span className="text-sm">Draft</span>
        </Badge>
      )
  }
}

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
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const entryType = row.original
      return <div className="flex items-center gap-2">{getLabelForStatus(entryType.status)}</div>
    }
  },
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
        },
        {
          icon: Archive,
          label: "Archived",
          value: "Archived"
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
