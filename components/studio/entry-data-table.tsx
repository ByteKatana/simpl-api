"use client"
import React from "react"
import { DataTable } from "@/components/studio/data-table/data-table"
import type { ColumnDef, Row } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableRowActions } from "./data-table/data-table-row-actions"
import { Entry } from "@/interfaces/entry"
import { Check, CircleDotDashed } from "lucide-react"
import { toast } from "sonner"
import deleteEntryAction from "@/lib/actions/studio/entry/delete-entry"
import { useRouter } from "next/navigation"
import { hasPermission } from "@/lib/actions/auth/has-permission"

const deleteEntry = async (row: Row<Entry>) => {
  try {
    const requiredPermissions = [
      "system.entries.delete",
      `${row.original.namespace}.delete`,
      `${row.original.namespace}.delete-entry`
    ]
    let isAllowed = false
    for (const permission of requiredPermissions) {
      const permType = permission.split(".")[0]
      isAllowed = await hasPermission(permission)
      // If the user has the system permission, they're always allowed
      if (permType === "system" && isAllowed) {
        isAllowed = true
        break
      }
    }
    if (!isAllowed) return toast.error("You don't have permission to delete this entry", { position: "top-center" })
    const deleteResult = await deleteEntryAction(row.original._id.toString())
    if (deleteResult.success) {
      toast.success("Item deleted successfully", { position: "top-center" })
    }
  } catch (error) {
    toast.error("Failed to delete Entry Type", { position: "top-center" })
  }
}

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
  {
    accessorKey: "namespace",
    id: "namespace",
    header: "Namespace",
    cell: ({ row }) => {
      const namespace = row.original.namespace
      return <div className="flex items-center gap-2">{namespace ? namespace.split("-").join(" ") : "Unknown"}</div>
    }
  },
  { accessorKey: "status", header: "Status" },
  {
    id: "actions",
    cell: ({ row }) => {
      const router = useRouter()
      return (
        <DataTableRowActions
          row={row}
          onEdit={(row) => router.push(`/studio/entries/edit/${row.original.slug}`)}
          onDelete={(row) => deleteEntry(row)}
        />
      )
    }
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
          entry.namespace && // Ensure namespace exists
          data.findIndex((entry2: Entry) => entry2.namespace === entry.namespace) === index
      )
      .map((entry: Entry) => {
        return {
          label: entry.namespace ? entry.namespace.split("-").join(" ") : "Unknown",
          value: entry.namespace || ""
        }
      })
  }

  const filters: DataTableFilters = [
    {
      columnId: "namespace",
      title: "Namespace",
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
