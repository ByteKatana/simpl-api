import React from "react"
import getUsers from "@/lib/actions/dashboard/users/get-users"
import UsersIndexPage from "@/components/pages/users/users-index-page.component"

export default async function Page() {
  const fetchedUsers = await getUsers()
  return <UsersIndexPage fetchedUsers={fetchedUsers.data} />
}
