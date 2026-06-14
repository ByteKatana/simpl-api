"use client"
import React from "react"
import { DataTable } from "@/components/studio/data-table/data-table"
import type { ColumnDef, Row } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableRowActions } from "./data-table/data-table-row-actions"
import { User, UserStatus } from "@/interfaces"
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ShieldCheck, Star, User as UserIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import deleteUserAction from "@/lib/actions/studio/users/delete-user"
import { useRouter } from "next/navigation"
import { hasPermission } from "@/lib/actions/auth/has-permission"
import { toast } from "sonner"

const getBadgeForPermissionGroup = (permissionGroup: string) => {
  switch (permissionGroup.toLowerCase()) {
    case "admin":
      return (
        <AvatarBadge className="bg-amber-400 border-white">
          <Star className="text-white" />
        </AvatarBadge>
      )
    case "editor":
      return (
        <AvatarBadge className="bg-blue-500 border-white">
          <ShieldCheck className="text-white" />
        </AvatarBadge>
      )
    case "viewer":
      return (
        <AvatarBadge className="w-10 h-10 bg-green-500 border-white">
          <UserIcon size={24} className="text-white" />
        </AvatarBadge>
      )
    default:
      return null
  }
}

const getLabelForStatus = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return (
        <Badge variant={"secondary"} className="bg-emerald-400 text-white">
          <span className="text-sm">Active</span>
        </Badge>
      )
    case "inactive":
      return (
        <Badge variant={"secondary"} className="bg-amber-400 text-white">
          <span className="text-sm">Inactive</span>
        </Badge>
      )
    case "disabled":
      return (
        <Badge variant={"secondary"} className="bg-red-400 text-white">
          <span className="text-sm">Disabled</span>
        </Badge>
      )
  }
}

const deleteUser = async (row: Row<User>) => {
  try {
    const requiredPermissions = ["system.users.delete"]
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
    if (!isAllowed) return toast.error("You don't have permission to delete a user", { position: "top-center" })
    const deleteResult = await deleteUserAction(row.original._id.toString())
    if (deleteResult.success) {
      toast.success("Item deleted successfully", { position: "top-center" })
    }
  } catch (error) {
    toast.error("Failed to delete Permission Group", { position: "top-center" })
  }
}

const columns: ColumnDef<User>[] = [
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
    accessorKey: "fullname",
    header: "Name",
    cell: ({ row }) => {
      const user = row.original
      return (
        <div className="flex items-center gap-3">
          <Avatar size="lg" className="overflow-visible">
            <AvatarImage src={user.profile_img} alt={user.username} />
            <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
            {getBadgeForPermissionGroup(user.permission_group)}
          </Avatar>
          <span className="mt-2.5 font-medium text-sm">{user.fullname || user.username}</span>
        </div>
      )
    }
  },
  { accessorKey: "username", header: "Username" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "permission_group", filterFn: "arrIncludes", header: "Group" },
  {
    accessorKey: "status",
    header: "Status",
    filterFn: "arrIncludes",
    cell: ({ row }) => {
      const user = row.original
      return <div className="flex items-center gap-2">{getLabelForStatus(user.status)}</div>
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const router = useRouter()
      return (
        <DataTableRowActions
          row={row}
          onEdit={(row) => router.push(`/studio/users/edit/${row.original._id.toString()}`)}
          onDelete={(row) => deleteUser(row)}
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

export default function UserDataTable({ data }: { data: User[] }) {
  const getPermGroupRoleFilterOptions = () => {
    return data
      .filter(
        (user: User, index: number) =>
          data.findIndex((user2: User) => user2.permission_group === user.permission_group) === index
      )
      .map((user: User) => {
        return {
          label: user.permission_group.charAt(0).toUpperCase() + user.permission_group.slice(1),
          value: user.permission_group
        }
      })
  }
  const getPermGroupStatusFilterOptions = () => {
    return data
      .filter(
        (user: User, index: number) =>
          data.findIndex((user2: User) => user2.status.toLowerCase() === user.status.toLowerCase()) === index
      )
      .map((user: User) => {
        const normalizedStatus = user.status.toLowerCase()
        return {
          label: normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1),
          value: user.status as UserStatus
        }
      })
  }
  const filters: DataTableFilters = [
    {
      columnId: "permission_group",
      title: "Role",
      options: getPermGroupRoleFilterOptions()
    },
    {
      columnId: "status",
      title: "Status",
      options: getPermGroupStatusFilterOptions()
    }
  ]

  return (
    <DataTable<User, unknown>
      columns={columns}
      data={data}
      searchKey="username"
      filters={filters}
      onDelete={(rows) => console.log("Bulk Delete", rows)}
      onPublish={(rows) => console.log("Bulk Publish", rows)}
    />
  )
}
