import { ActionType, DataType, Entry, EntryType } from "../interfaces"
import axios, { AxiosResponse } from "axios"
import { ObjectId } from "mongodb"

async function EntryCreate(formValues: Entry, fetchedEntryType: EntryType) {
  try {
    return await axios.post(
      `${process.env.baseUrl}/api/v1/entry/create?apikey=${process.env.apiKey}&secretkey=${process.env.secretKey}`,
      {
        ...formValues,
        slug: formValues.name.split(" ").join("-").toLowerCase(),
        namespace: fetchedEntryType.namespace
      }
    )
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.log("ENTRY_CREATE_ERROR", e.message) //TODO: Better logging
    }
  }
}

async function EntryUpdate(
  formValues: { _id: ObjectId } & Entry,
  fetchedEntryType: EntryType,
  slug: string | string[]
) {
  try {
    const { _id: undefined, ...restOfFormValues } = formValues
    return await axios.put(
      `${process.env.baseUrl}/api/v1/entry/update/${slug}?apikey=${process.env.apiKey}&secretkey=${process.env.secretKey}`,
      {
        ...restOfFormValues,
        slug: formValues.name.split(" ").join("-").toLowerCase(),
        namespace: fetchedEntryType.namespace
      }
    )
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.log("ENTRY_UPDATE_ERROR", e.message) //TODO: Better logging
    }
  }
}

async function EntryTypeCreate(entryType: EntryType, formFields) {
  try {
    let formatedEntryType: object
    if (entryType["namespace"] === "itself" || entryType["namespace"] === entryType["name"].toLowerCase()) {
      formatedEntryType = { name: entryType["name"], namespace: entryType["name"].toLowerCase() }
    } else {
      formatedEntryType = {
        name: entryType["name"],
        namespace: `${entryType["namespace"].toLowerCase()}.${entryType["name"].toLowerCase()}`
      }
    }

    let formatedFields = formFields.map((field) => {
      if ("field_accepted_types" in field) {
        return {
          [field.field_name]: {
            value_type: field.field_value_type,
            form_type: field.field_form_type,
            length: field.field_length,
            accepted_formats: field.field_accepted_types
          }
        }
      } else {
        return {
          [field.field_name]: {
            value_type: field.field_value_type,
            form_type: field.field_form_type,
            length: field.field_length
          }
        }
      }
    })

    return await axios.post(
      `${process.env.baseUrl}/api/v1/entry-type/create?apikey=${process.env.apiKey}&secretkey=${process.env.secretKey}`,
      {
        ...formatedEntryType,
        slug: formatedEntryType["name"].split(" ").join("-").toLowerCase(),
        fields: formatedFields
      }
    )
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.log("ENTRY_TYPE_CREATE_ERROR", e.message) //TODO: Better logging
    }
  }
}

async function EntryTypeUpdate(entryType: EntryType, formFields, slug) {
  try {
    let formatedEntryType: object

    if (entryType[0].namespace === "itself" || entryType[0].namespace === entryType[0].name.toLowerCase()) {
      formatedEntryType = {
        name: entryType[0].name,
        namespace: entryType[0].name.toLowerCase()
      }
    } else if (entryType[0].namespace.includes(entryType[0].name.toLowerCase())) {
      formatedEntryType = { name: entryType[0].name, namespace: entryType[0].namespace }
    } else {
      formatedEntryType = {
        name: entryType[0].name,
        namespace: `${entryType[0].namespace.toLowerCase()}.${entryType[0].name.toLowerCase()}`
      }
    }

    let formatedFields = formFields.map((field, index) => {
      if ("field_accepted_types" in field) {
        return {
          [field.field_name]: {
            value_type: field.field_value_type,
            form_type: field.field_form_type,
            length: field.field_length,
            accepted_formats: field.field_accepted_types
          }
        }
      } else {
        return {
          [field.field_name]: {
            value_type: field.field_value_type,
            form_type: field.field_form_type,
            length: field.field_length
          }
        }
      }
    })

    return await axios.put(
      `${process.env.baseUrl}/api/v1/entry-type/update/${slug}?apikey=${process.env.apiKey}&secretkey=${process.env.secretKey}`,
      {
        ...formatedEntryType,
        slug: formatedEntryType["name"].split(" ").join("-").toLowerCase(),
        fields: formatedFields
      }
    )
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.log("ENTRY_TYPE_UPDATE_ERROR", e.message) //TODO: Better logging
    }
  }
}

async function permGroupCreate(formValues) {
  try {
    return await axios.post(
      `${process.env.baseUrl}/api/v1/permission-group/create?apikey=${process.env.apiKey}&secretkey=${process.env.secretKey}`,
      {
        ...formValues,
        slug: formValues["name"].split(" ").join("-").toLowerCase()
      }
    )
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.log("PERM_GROUP_CREATE_ERROR", e.message) //TODO: Better logging
    }
  }
}

async function permGroupUpdate(formValues, slug) {
  try {
    return await axios.put(
      `${process.env.baseUrl!}/api/v1/permission-group/update/${slug}?apikey=${process.env.apiKey!}&secretkey=${process
        .env.secretKey!}`,
      {
        name: formValues[0].name,
        privileges: formValues[0].privileges,
        slug: formValues[0].name.split(" ").join("-").toLowerCase()
      }
    )
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.log("PERM_GROUP_CREATE_ERROR", e.message) //TODO: Better logging
    }
  }
}

const useSaveData = (dataType: DataType, actionType: ActionType) => {
  const saveData = async (payload) => {
    try {
      let response: AxiosResponse

      // ENTRY
      if (dataType === "ENTRY") {
        switch (actionType) {
          case "CREATE":
            response = await EntryCreate(payload.formValues, payload.fetchedEntryType)
            break
          case "UPDATE":
            response = await EntryUpdate(payload.formValues, payload.fetchedEntryType, payload.slug)
            break
          default:
            throw new Error("INVALID_ENTRY_ACTION_TYPE")
        }
      } else if (dataType === "ENTRY_TYPE") {
        switch (actionType) {
          case "CREATE":
            response = await EntryTypeCreate(payload.entryType, payload.formFields)
            break
          case "UPDATE":
            response = await EntryTypeUpdate(payload.entryType, payload.formFields, payload.slug)
            break
          default:
            throw new Error("INVALID_ENTRY_TYPE_ACTION_TYPE")
        }
      } else if (dataType === "PERM_GROUP") {
        switch (actionType) {
          case "CREATE":
            response = await permGroupCreate(payload.formValues)
            break
          case "UPDATE":
            response = await permGroupUpdate(payload.formValues, payload.slug)
            break
          default:
            throw new Error("INVALID_ENTRY_TYPE_ACTION_TYPE")
        }
      }

      return response.data
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
