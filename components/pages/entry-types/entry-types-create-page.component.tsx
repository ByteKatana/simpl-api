"use client"

//Utility
import axios from "axios"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { useRouter } from "next/navigation"
//Icons
import { FiLoader, FiPlusSquare, FiX } from "react-icons/fi"
import { useSession } from "next-auth/react"
import handleValueChange from "../../../lib/ui/handle-value-change"
import checkFieldEmpty from "../../../lib/ui/check-field-empty"
import checkPermGroup from "../../../lib/ui/check-perm-group"
import addField from "../../../lib/ui/add-field"

//React
import { useEffect, useRef, useState } from "react"

//Components
import Menu from "../../../components/dashboard/menu"

//Interfaces
import { EntryType } from "../../../interfaces"
import removeField from "../../../lib/ui/remove-field"
import useSaveData from "../../../hooks/use-save-data"

//===============================================

export default function EntryTypesCreatePage({ fetchedEntryTypes }: { fetchedEntryTypes: EntryType[] }) {
  const [entryType, setEntryType] = useState({})
  const [formFields, setFormFields] = useState([])
  const [formErrors, setFormErrors] = useState({})
  const [showErrors, setShowErrors] = useState(false)
  const [showError, setShowError] = useState({})
  const [isCreateBtnClicked, setIsCreateBtnClicked] = useState(false)
  const saveData = useSaveData("ENTRY_TYPE", "CREATE")

  //router
  const router = useRouter()

  //sweetalert
  const resultSwal = withReactContent(Swal)

  //formRef
  const formRef = useRef([])

  //Auth Session
  const { data: session } = useSession()

  useEffect(() => {
    //Add form errors for required fields at first page render
    if (Object.keys(formErrors).length === 0) {
      setFormErrors({
        name: "empty-field",
        field_name_0: "empty-field",
        field_form_type_0: "empty-field",
        field_value_type_0: "empty-field"
      })
    }

    //Adding initial values at first page render
    if (formFields.length === 0) {
      setFormFields([...formFields, { field_name: "", field_value_type: "", field_form_type: "", field_length: 100 }])
    }

    if (Object.keys(entryType).length === 0) {
      setEntryType({ name: "", slug: "", namespace: "itself" })
    }
  }, [session])

  const submitData = async () => {
    if (Object.keys(formErrors).length > 0) {
      //If there is/are form error(s)
      const formFieldsWithErrors = Object.keys(formErrors)
      setShowErrors(true)
      setIsCreateBtnClicked(false)
      formRef.current[formFieldsWithErrors[0]].focus()
    } else {
      //If there is no form error
      const permGroup = session.user.permission_group
      const result = await saveData({ entryType, formFields, permGroup })
      if (result.success) {
        resultSwal
          .fire({
            title: `Do you want to create another one?`,
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
              ;(document.getElementById("entry_type_create_form") as HTMLFormElement).reset()
              setEntryType({ name: "", namespace: "itself" })
              setFormFields([{ field_name: "", field_value_type: "", field_form_type: "", field_length: 100 }])
              setIsCreateBtnClicked(false)
            } else if (result.isDenied) {
              router.push("/dashboard/entry-types")
            }
          })
      } else if (result.status === "failed") {
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
              router.push("/dashboard/entry-types")
            } else {
              setIsCreateBtnClicked(false)
            }
          })
      }
    }
  }

  return (
    <div className="container ">
      <div className="grid grid-flow-col auto-cols-max h-screen w-screen">
        <Menu />
        <div className="grid grid-col-6 ml-10 mt-10 content-start place-content-around w-screen">
          <div className="col-start-1 col-end-2 ">
            <h1 className="text-6xl font-josefin">New entry type</h1>
          </div>
          <div className="col-start-4 col-end-6 "></div>
          <div className="col-start-1 col-end-6 w-10/12 mt-10 ">
            {checkPermGroup(session, "admin") ? (
              <form id="entry_type_create_form" action="#">
                <div id="entry_type_name" className="flex flex-col justify-center border-2 border-slate-200 p-10 ">
                  <div className="w-11/12">
                    <label htmlFor="name" className="form-label inline-block mb-2 text-gray-700 text-xl">
                      Entry Type Name
                    </label>
                    <input
                      type="text"
                      className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-slate-600 focus:outline-none"
                      id="name"
                      name="name"
                      ref={(el) => (formRef.current[`name`] = el)}
                      placeholder="Eg: Articles"
                      defaultValue={entryType["name"]}
                      onChange={(e) => {
                        handleValueChange(
                          entryType,
                          formErrors,
                          showError,
                          showErrors,
                          setFormErrors,
                          setShowError,
                          setEntryType,
                          e,
                          "ENTRY_TYPE"
                        )
                      }}
                      onBlur={(e) => {
                        checkFieldEmpty(formErrors, showError, setFormErrors, setShowError, e, 0)
                      }}
                      required
                    />
                    {(showErrors || showError[`name`]) &&
                      formErrors[`name`] &&
                      formErrors[`name`] === "empty-field" && (
                        <span className="text-red-500 font-bold">This field is required</span>
                      )}
                  </div>
                  <div className="w-11/12 mt-5">
                    <label htmlFor="namespace" className="form-label inline-block mb-2 text-gray-700 text-xl">
                      Namespace
                    </label>
                    <select
                      id="namespace"
                      name="namespace"
                      ref={(el) => (formRef.current[`namespace`] = el)}
                      defaultValue={entryType["namespace"]}
                      onChange={(e) => {
                        handleValueChange(
                          entryType,
                          formErrors,
                          showError,
                          showErrors,
                          setFormErrors,
                          setShowError,
                          setEntryType,
                          e,
                          "ENTRY_TYPE"
                        )
                      }}
                      onBlur={(e) => {
                        checkFieldEmpty(formErrors, showError, setFormErrors, setShowError, e, 0)
                      }}
                      className="form-select form-select-lg mb-3 block w-full  px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300  rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-slate-600 focus:outline-none">
                      <option value="itself"> Itself</option>
                      {fetchedEntryTypes.map((entry_type) => {
                        return (
                          <option
                            value={`${entry_type.namespace}`}>{`${entry_type.name} (${entry_type.namespace})`}</option>
                        )
                      })}
                    </select>
                    {(showErrors || showError[`namespace`]) &&
                      formErrors[`namespace`] &&
                      formErrors[`namespace`] === "empty-field" && (
                        <span className="text-red-500 font-bold">This field is required</span>
                      )}
                  </div>
                </div>
                <div className=" mt-5">
                  <h1 className="text-3xl">Fields</h1>
                  <p className="text-slate-400">Add new fields to this entry type </p>
                </div>
                {formFields.map((field, index) => {
                  return (
                    <div
                      key={`div_field_${index}`}
                      id="entry_type_new_field"
                      className=" flex flex-row justify-between  border-2 border-slate-200 p-10 mt-5 ">
                      <div key={`field_block_${index}`} className="flex flex-col justify-center w-11/12">
                        <div>
                          <label
                            key={`label_field_name_${index}`}
                            htmlFor="field_name"
                            className="form-label inline-block mb-2 text-gray-700 text-xl">
                            Name
                          </label>
                          <input
                            key={`input_field_name_${index}`}
                            name="field_name"
                            data-testid={`input_field_name_${index}`}
                            ref={(el) => (formRef.current[`field_name_${index}`] = el)}
                            type="text"
                            className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-slate-600 focus:outline-none"
                            id="field_name"
                            placeholder="Eg: Title"
                            defaultValue={field.field_name}
                            onChange={(e) => {
                              handleValueChange(
                                formFields,
                                formErrors,
                                showError,
                                showErrors,
                                setFormErrors,
                                setShowError,
                                setFormFields,
                                e,
                                "FIELD",
                                index
                              )
                            }}
                            onBlur={(e) => {
                              checkFieldEmpty(formErrors, showError, setFormErrors, setShowError, e, index)
                            }}
                          />
                          {(showErrors || showError[`field_name_${index}`]) &&
                            formErrors[`field_name_${index}`] &&
                            formErrors[`field_name_${index}`] === "empty-field" && (
                              <span className="text-red-500 font-bold">This field is required</span>
                            )}
                        </div>
                        <div className="mt-5">
                          <label
                            key={`label_field_length_${index}`}
                            htmlFor="field_length"
                            className="form-label inline-block mb-2 text-gray-700 text-xl">
                            Maximum Length
                          </label>
                          <input
                            key={`input_field_length_${index}`}
                            name="field_length"
                            data-testid={`input_field_length_${index}`}
                            id="field_length"
                            type="number"
                            className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-slate-600 focus:outline-none"
                            placeholder="Eg: 100"
                            defaultValue={field.field_length}
                            onChange={(e) => {
                              handleValueChange(
                                formFields,
                                formErrors,
                                showError,
                                showErrors,
                                setFormErrors,
                                setShowError,
                                setFormFields,
                                e,
                                "FIELD",
                                index
                              )
                            }}
                            onBlur={(e) => {
                              checkFieldEmpty(formErrors, showError, setFormErrors, setShowError, e, index)
                            }}
                            min="1"
                            required
                          />
                          {(showErrors || showError[`field_length_${index}`]) &&
                            formErrors[`field_length_${index}`] &&
                            formErrors[`field_length_${index}`] === "empty-field" && (
                              <span className="text-red-500 font-bold">This field is required</span>
                            )}
                        </div>
                        <div className="mt-5">
                          <label
                            key={`label_field_value_type_${index}`}
                            htmlFor="field_value_type"
                            className="form-label inline-block mb-2 text-gray-700 text-xl">
                            Value Type
                          </label>
                          <select
                            key={`select_field_value_type_${index}`}
                            id="field_value_type"
                            name="field_value_type"
                            data-testid={`select_field_value_type_${index}`}
                            ref={(el) => (formRef.current[`field_value_type_${index}`] = el)}
                            onChange={(e) => {
                              handleValueChange(
                                formFields,
                                formErrors,
                                showError,
                                showErrors,
                                setFormErrors,
                                setShowError,
                                setFormFields,
                                e,
                                "FIELD",
                                index
                              )
                            }}
                            onBlur={(e) =>
                              checkFieldEmpty(formErrors, showError, setFormErrors, setShowError, e, index)
                            }
                            defaultValue={field.field_value_type}
                            className="form-select form-select-lg mb-3 block w-full  px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300  rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-slate-600 focus:outline-none"
                            required>
                            <option value="">Please select one</option>
                            <option value="string">String</option>
                            <option value="integer">Integer</option>
                            <option value="double">Double</option>
                            <option value="boolean">Boolean</option>
                          </select>
                          {(showErrors || showError[`field_value_type_${index}`]) &&
                            formErrors[`field_value_type_${index}`] &&
                            formErrors[`field_value_type_${index}`] === "empty-field" && (
                              <span className="text-red-500 font-bold">This field is required</span>
                            )}
                        </div>
                        <div className="mt-5">
                          <label
                            key={`label_field_form_type_${index}`}
                            htmlFor="field_form_type"
                            className="form-label inline-block mb-2 text-gray-700 text-xl">
                            Form Type
                          </label>
                          <select
                            key={`select_field_form_type_${index}`}
                            id="field_form_type"
                            name="field_form_type"
                            data-testid={`select_field_form_type_${index}`}
                            ref={(el) => (formRef.current[`field_form_type_${index}`] = el)}
                            defaultValue={field.field_form_type}
                            onChange={(e) => {
                              handleValueChange(
                                formFields,
                                formErrors,
                                showError,
                                showErrors,
                                setFormErrors,
                                setShowError,
                                setFormFields,
                                e,
                                "FIELD",
                                index
                              )
                            }}
                            onBlur={(e) =>
                              checkFieldEmpty(formErrors, showError, setFormErrors, setShowError, e, index)
                            }
                            className="form-select form-select-lg mb-3 block w-full  px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300  rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-slate-600 focus:outline-none"
                            required>
                            <option value="">Please select one</option>
                            <option value="input">Input Field</option>
                            <option value="textarea">Textarea</option>
                          </select>
                          {(showErrors || showError[`field_form_type_${index}`]) &&
                            formErrors[`field_form_type_${index}`] &&
                            formErrors[`field_form_type_${index}`] === "empty-field" && (
                              <span className="text-red-500 font-bold">This field is required</span>
                            )}
                        </div>
                      </div>

                      <div key={`field_name_block_${index}`}>
                        <a
                          href="#"
                          className="text-2xl text-slate-400 transition hover:text-slate-900"
                          onClick={() => {
                            removeField(formFields, formErrors, setFormFields, setFormErrors, index, "CREATE")
                          }}>
                          <FiX />
                        </a>
                      </div>
                    </div>
                  )
                })}
                <div
                  id="entry_type_new_field"
                  className="flex flex-row flex-nowrap justify-center border-2 border-dashed border-slate-200 mt-5 p-10 ">
                  <div className=" w-11/12">
                    <a
                      href="#"
                      className="flex flex-row justify-center text-slate-300 transition hover:text-slate-900"
                      onClick={() => {
                        addField(formFields, formErrors, setFormFields, setFormErrors, "CREATE")
                      }}>
                      <span className="text-4xl">
                        <FiPlusSquare />
                      </span>
                      <p className="text-2xl ml-5">Click here to add new field</p>
                    </a>
                  </div>
                </div>
                <div id="entry_type_submit" className="flex flex-row flex-nowrap justify-center  mt-5 p-10 ">
                  <div className=" w-11/12">
                    <button
                      type="button"
                      data-testid="create_entry_type_btn"
                      onClick={() => {
                        setIsCreateBtnClicked(true)
                        void submitData()
                      }}
                      className="mb-2 w-full inline-block px-6 py-2.5 bg-slate-700 text-white font-medium text-xs leading-normal uppercase rounded shadow-md hover:bg-slate-800 hover:shadow-lg focus:bg-slate-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-slate-800 active:shadow-lg transition duration-150 ease-in-out">
                      {isCreateBtnClicked ? (
                        <span className="flex flex-row justify-center">
                          <FiLoader className="animate-spin text-2xl" />
                          <span data-testid="create_entry_type_btn_processing" className="mt-1 ml-3">
                            Processing
                          </span>
                        </span>
                      ) : (
                        "Create"
                      )}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              "You don't have permission to do this"
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
