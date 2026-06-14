"use client"
import React from "react"
import { DataTable } from "@/components/studio/data-table/data-table"
import type { ColumnDef, Row } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableRowActions } from "./data-table/data-table-row-actions"
import { PermissionGroup } from "@/interfaces/permission_group"
import deletePermissionGroupAction from "@/lib/actions/studio/permission-groups/delete-permission-group"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { hasPermission } from "@/lib/actions/auth/has-permission"

const deletePermGroup = async (row: Row<PermissionGroup>) => {
  try {
    const requiredPermissions = ["system.permission_groups.delete"]
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
      return toast.error("You don't have permission to delete a permission group", { position: "top-center" })
    const deleteResult = await deletePermissionGroupAction(row.original._id.toString())
    if (deleteResult.success) {
      toast.success("Item deleted successfully", { position: "top-center" })
    }
  } catch (error) {
    toast.error("Failed to delete Permission Group", { position: "top-center" })
  }
}

const columns: ColumnDef<PermissionGroup>[] = [
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
  {
    accessorKey: "name",
    header: "Name",
    meta: {
      style: {
        textAlign: "center"
      }
    },
    cell: ({ row }) => {
      const permGroup = row.original
      return (
        <div className="flex items-center gap-3">
          {/* <AvatarGroup>
            <AvatarGroupCount>{permGroup.icon}</AvatarGroupCount>
          </AvatarGroup>*/}
          <span className="mt-2.5 font-medium text-sm">{permGroup.name}</span>
        </div>
      )
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const route = useRouter()
      return (
        <DataTableRowActions
          row={row}
          onEdit={(row) => route.push(`/studio/permission-groups/edit/${row.original._id}`)}
          onDelete={(row) => deletePermGroup(row)}
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

export default function PermissionGroupDataTable({ data }: { data: PermissionGroup[] }) {
  const filters: DataTableFilters = []

  return (
    <DataTable<PermissionGroup, unknown>
      columns={columns}
      data={data}
      searchKey="name"
      filters={filters}
      onDelete={(rows) => console.log("Bulk Delete", rows)}
      onPublish={(rows) => console.log("Bulk Publish", rows)}
    />
  )
}
