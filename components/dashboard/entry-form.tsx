// Utility
import handleValueChange from "../../lib/ui/handle-value-change"
import checkFieldEmpty from "../../lib/ui/check-field-empty"
import useSaveData from "../../hooks/use-save-data"
import Router, { useRouter } from "next/router"
import withReactContent from "sweetalert2-react-content"
import Swal from "sweetalert2"
import { FiLoader } from "react-icons/fi"

//React
import React, { useEffect, useRef, useState } from "react"

//Components
import EntryField from "./entry-field"

//Interfaces
import { ActionType, DataType, Entry, EntryType } from "../../interfaces"

function EntryForm({
  dataType,
  actionType,
  fetchedEntryType,
  fetchedEntry
}: {
  dataType: DataType
  actionType: ActionType
  fetchedEntryType: EntryType
  fetchedEntry?: Entry
}) {
  const initialFormValues = actionType === "CREATE" ? { name: "", slug: "", namespace: "" } : fetchedEntry

  const [formValues, setFormValues] = useState(initialFormValues)
  const [formErrors, setFormErrors] = useState({})
  const [showErrors, setShowErrors] = useState(false)
  const [showError, setShowError] = useState({})
  const [isSubmitClicked, setIsSubmitClicked] = useState(false)
  const saveData = useSaveData(dataType, actionType)

  //routing
  const router = useRouter()
  const { slug } = router.query

  //sweetalert
  const resultSwal = withReactContent(Swal)

  //formRef
  const formRef = useRef([])

  useEffect(() => {
    if (actionType === "CREATE") {
      const newFields = {}
      const newErrorFields = {}
      fetchedEntryType.fields.forEach((field) => {
        const fieldName = Object.keys(field).toString()
        newFields[fieldName] = ""
        newErrorFields[fieldName] = "empty-field"
      })
      setFormValues({ ...formValues, ...newFields })
      setFormErrors({ ...formErrors, ...newErrorFields })

      //Add form error for name field at first page render
      if (Object.keys(formErrors).length === 0) {
        setFormErrors({ name: "empty-field" })
      }
    }
  }, [fetchedEntryType])

  const submitData = async () => {
    if (Object.keys(formErrors).length > 0) {
      const formValuesWithErrors = Object.keys(formErrors)
      setShowErrors(true)
      setIsSubmitClicked(false)
      formRef.current[formValuesWithErrors[0]].focus()
    } else {
      let result
      switch (actionType) {
        case "CREATE":
          result = await saveData({ formValues, fetchedEntryType })
          break
        case "UPDATE":
          result = await saveData({ formValues, fetchedEntryType, slug })
          break
        default:
          console.log("INVALID_ACTION_TYPE_ENTRY_FORM")
      }
      if (result && result.status === "success") {
        resultSwal
          .fire({
            title: `${result.message} Do you want to create another one?`,
            icon: "success",
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "Yes",
            denyButtonText: "No",
            confirmButtonColor: "#10B981"
          })
          .then((result) => {
            if (result.isConfirmed) {
              //Clear form and set default if user want create another one
              ;(document.getElementById("new_entry_form") as any).reset()
              const newFields = {}
              const newErrorFields = {}
              fetchedEntryType.fields.forEach((field: object) => {
                const fieldName = Object.keys(field).toString()
                newFields[fieldName] = ""
                newErrorFields[fieldName] = "empty-field"
              })
              setFormValues({ name: "", slug: "", namespace: "", ...newFields })
              setFormErrors({ name: "empty-field", ...newErrorFields })
              setIsSubmitClicked(false)
            } else if (result.isDenied) {
              Router.push("/dashboard/entries")
            }
          })
      } else if (result && result.status === "failed") {
        resultSwal
          .fire({
            title: `${result.message} Do you want to change values and try again?`,
            icon: "error",
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "Yes",
            denyButtonText: "No",
            confirmButtonColor: "#10B981"
          })
          .then((result) => {
            if (result.isDenied) {
              Router.push("/dashboard/entries")
            } else {
              setIsSubmitClicked(false)
            }
          })
      }
    }
  }

  return (
    <form action="#" id="new_entry_form">
      <div className="flex flex-col justify-center border-2 border-slate-200 p-10 mb-5 ">
        <div className="w-11/12">
          <label htmlFor={`name`} className="form-label inline-block mb-2 text-gray-700 text-xl">
            Entry Name
          </label>
          <input
            type="text"
            className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            id={`name`}
            name={`name`}
            ref={(el) => (formRef.current[`name`] = el)}
            defaultValue={formValues[`name`]}
            onChange={(e) => {
              handleValueChange(
                formValues,
                formErrors,
                showError,
                showErrors,
                setFormErrors,
                setShowError,
                setFormValues,
                e,
                "ENTRY"
              )
            }}
            onBlur={(e) => {
              checkFieldEmpty(formErrors, showError, setFormErrors, setShowError, e)
            }}
            required
          />
          {(showErrors || showError[`name`]) && formErrors[`name`] && formErrors[`name`] === "empty-field" && (
            <span className="text-red-500 font-bold">This field is required</span>
          )}
        </div>
      </div>
      <div className="flex flex-col justify-center border-2 border-slate-200 p-10 ">
        <h3 className="text-3xl mb-3">Fields</h3>
        {fetchedEntryType.fields.map((field, index: number) => (
          <EntryField
            key={index}
            field={field}
            formRef={formRef}
            formValues={formValues}
            formErrors={formErrors}
            setFormValues={setFormValues}
            setFormErrors={setFormErrors}
            setShowError={setShowError}
            showError={showError}
            showErrors={showErrors}
          />
        ))}
      </div>
      <div id="user_submit" className="flex flex-row flex-nowrap justify-center  mt-5 p-10 ">
        <div className=" w-11/12">
          <button
            type="button"
            data-testid="submit_entry_button"
            onClick={() => {
              setIsSubmitClicked(true)
              void submitData()
            }}
            className="mb-2 w-full inline-block px-6 py-2.5 bg-slate-700 text-white font-medium text-xs leading-normal uppercase rounded shadow-md hover:bg-slate-800 hover:shadow-lg focus:bg-slate-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-slate-800 active:shadow-lg transition duration-150 ease-in-out">
            {isSubmitClicked ? (
              <span className="flex flex-row justify-center">
                <FiLoader className="animate-spin text-2xl" />
                <span data-testid="submit_entry_button_processing" className="mt-1 ml-3">
                  PROCESSING
                </span>
              </span>
            ) : (
              actionType
            )}
          </button>
        </div>
      </div>
    </form>
  )
}

export default EntryForm
