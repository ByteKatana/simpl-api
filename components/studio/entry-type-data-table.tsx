"use client"
import React from "react"
import { DataTable } from "@/components/studio/data-table/data-table"
import type { ColumnDef, Row } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableRowActions } from "./data-table/data-table-row-actions"
import { EntryType } from "@/interfaces/entry_type"
import { Archive, Check, CircleDotDashed } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { PublishStatus } from "@/interfaces"
import deleteEntryTypeAction from "@/lib/actions/studio/entry-types/delete-entry-type"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { hasPermission } from "@/lib/actions/auth/has-permission"

const getLabelForStatus = (status: string) => {
  switch (status) {
    case PublishStatus.Published:
      return (
        <Badge variant={"secondary"} className="bg-emerald-400 text-white">
          <Check data-icon="inline-start" />
          <span className="text-sm">Published</span>
        </Badge>
      )
    case PublishStatus.Archived:
      return (
        <Badge variant={"secondary"} className="bg-gray-400 text-white">
          <Archive data-icon="inline-start" />
          <span className="text-sm">Archived</span>
        </Badge>
      )
    case PublishStatus.Draft:
      return (
        <Badge variant={"secondary"} className="bg-amber-400 text-white">
          <CircleDotDashed data-icon="inline-start" />
          <span className="text-sm">Draft</span>
        </Badge>
      )
  }
}

const deleteEntryType = async (row: Row<EntryType>) => {
  try {
    const requiredPermissions = ["system.entry_types.delete", `${row.original.namespace}.delete`]
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
    if (!isAllowed)
      return toast.error("You don't have permission to delete this entry type", { position: "top-center" })
    if (!row.original._id)
      return toast.error("Failed to delete Entry Type. No Entry Type Id", { position: "top-center" })
    const deleteResult = await deleteEntryTypeAction(row.original.namespace)
    if (deleteResult.success) {
      toast.success("Item deleted successfully", { position: "top-center" })
    }
  } catch (error) {
    toast.error("Failed to delete Entry Type", { position: "top-center" })
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
  { accessorKey: "createdBy", header: "Created By" },
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
    cell: ({ row }) => {
      const route = useRouter()
      return (
        <DataTableRowActions
          row={row}
          onEdit={(row) => route.push(`/studio/entry-types/edit/${row.original.slug}`)}
          onCreateEntry={(row) => route.push(`/studio/entries/new?slug=${row.original.slug}`)}
          onDelete={(row) => deleteEntryType(row)}
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

export default function EntryTypeDataTable({ data }: { data: EntryType[] | undefined }) {
  if (!data) return <div>Loading...</div>

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
