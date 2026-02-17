"use client"
import { ActionType, DataType, Entry, EntryType, User, UserCreateActionResponse } from "../interfaces"
import { ObjectId } from "mongodb"
import createEntry from "@/lib/actions/dashboard/entries/create-entry"
import updateEntry from "@/lib/actions/dashboard/entries/update-entry"
import createEntryType from "@/lib/actions/dashboard/entry-types/create-entry-type"
import updateEntryType from "@/lib/actions/dashboard/entry-types/update-entry-type"
import createPermissionGroup from "@/lib/actions/dashboard/permission-groups/create-permission-group"
import updatePermissionGroup from "@/lib/actions/dashboard/permission-groups/update-permission-group"
import createUser from "@/lib/actions/dashboard/users/create-user"
import updateUser from "@/lib/actions/dashboard/users/update-user"

const useSaveData = (dataType: DataType, actionType: ActionType) => {
  const saveData = async (payload) => {
    try {
      let response: any

      // ENTRY
      if (dataType === "ENTRY") {
        switch (actionType) {
          case "CREATE":
            response = await createEntry(payload.formValues, payload.fetchedEntryType)
            break
          case "UPDATE":
            response = await updateEntry(payload.formValues, payload.fetchedEntryType, payload.slug)
            break
          default:
            throw new Error("INVALID_ENTRY_ACTION_TYPE")
        }
      } else if (dataType === "ENTRY_TYPE") {
        switch (actionType) {
          case "CREATE":
            response = await createEntryType(payload.entryType, payload.formFields, payload.permGroup)
            break
          case "UPDATE":
            response = await updateEntryType(payload.entryType, payload.formFields, payload.slug)
            break
          default:
            throw new Error("INVALID_ENTRY_TYPE_ACTION_TYPE")
        }
      } else if (dataType === "PERM_GROUP") {
        switch (actionType) {
          case "CREATE":
            response = await createPermissionGroup(payload.formValues)
            break
          case "UPDATE":
            response = await updatePermissionGroup(payload.formValues, payload.slug)
            break
          default:
            throw new Error("INVALID_PERM_GROUP_ACTION_TYPE")
        }
      } else if (dataType === "USER") {
        switch (actionType) {
          case "CREATE":
            response = await createUser(payload.formValues)
            break
          case "UPDATE":
            response = await updateUser(payload.formValues, payload.slug, payload.currentPw)
            break
          default:
            throw new Error("INVALID_USER_ACTION_TYPE")
        }
      }

      // Server actions return response objects directly, not wrapped in .data
      // Check if response has success property (server action response)
      if (response && typeof response === "object" && "success" in response) {
        return response
      }

      // Fallback for any other response format
      return response
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.log(e.message) // Better logging
      } else {
        console.log("UNKOWN_ERR_USE_SAVE_DATA")
      }
    }
  }

  return saveData
}

export default useSaveData
