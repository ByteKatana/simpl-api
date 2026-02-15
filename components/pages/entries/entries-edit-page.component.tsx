"use client"
//Utility
import axios from "axios"
import { useSession } from "next-auth/react"
import checkPermission from "@/lib/ui/check-permission"

//Components
import Menu from "@/components/dashboard/menu"
import EntryForm from "@/components/dashboard/entry-form"

//Interfaces
import { Entry, EntryType, PermissionGroup } from "@/interfaces"

//===============================================

export default function EntryEditPage({
  fetchedEntry,
  fetchedEntryType,
  fetchedPermGroups,
  slug
}: {
  fetchedEntry: Entry
  fetchedEntryType: EntryType
  fetchedPermGroups: PermissionGroup[]
  slug: string
}) {
  //Auth Session
  const { data: session } = useSession()

  return (
    <div className="container ">
      <div className="grid grid-flow-col auto-cols-max h-screen w-screen">
        <Menu />
        <div className="grid grid-col-6 ml-10 mt-10 content-start place-content-around w-screen">
          <div className="col-start-1 col-end-2 ">
            <h1 className="text-6xl font-josefin">Edit Entry: {fetchedEntryType[0].name} </h1>
          </div>
          <div className="col-start-4 col-end-6 "></div>
          <div className="col-start-1 col-end-6 w-10/12 mt-10 ">
            {checkPermission(fetchedPermGroups, session, "update", fetchedEntryType[0].namespace) ? (
              <EntryForm
                dataType="ENTRY"
                actionType="UPDATE"
                fetchedEntryType={fetchedEntryType[0]}
                fetchedEntry={fetchedEntry[0]}
                slug={slug}
              />
            ) : (
              "You don't have permission to do this"
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
