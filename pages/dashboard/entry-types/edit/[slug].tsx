//Utility
import axios from "axios"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { useRouter } from "next/router"
import Router from "next/router"
import Tippy from "@tippyjs/react"
import { FiLoader } from "react-icons/fi"
import { useSession } from "next-auth/react"
import checkPermission from "../../../../lib/ui/check-permission"
import addField from "../../../../lib/ui/add-field"
import removeField from "../../../../lib/ui/remove-field"

//React
import { useState, useRef } from "react"

//Icons
import { FiPlusSquare, FiX } from "react-icons/fi"

//Components
import Menu from "../../../../components/dashboard/menu"

//Interfaces
import { EntryType } from "../../../../interfaces"

//Styles
import "tippy.js/dist/tippy.css"
import checkFieldEmpty from "../../../../lib/ui/check-field-empty"
import useSaveData from "../../../../hooks/use-save-data"

//===============================================

export async function getServerSideProps(req) {
  const { slug } = req.query

  const resEntryTypes = await axios.get(`${process.env.BASE_URL}/api/v1/entry-types?apikey=${process.env.API_KEY}`)
  const entryTypes: EntryType = await resEntryTypes.data

  const resEntryType = await axios.get(
    `${process.env.BASE_URL}/api/v1/entry-type/id/${slug}?apikey=${process.env.API_KEY}`
  )
  const entryType = await resEntryType.data
  const fields = []

  entryType[0].fields.map((field) => {
    const fieldKey: any = Object.keys(field)
    if ("accepted_types" in field) {
      fields.push({
        field_name: fieldKey[0],
        field_value_type: field[fieldKey]["value_type"],
        field_form_type: field[fieldKey]["form_type"],
        field_length: field[fieldKey]["length"],
        field_accepted_types: field[fieldKey]["accepted_types"]
      })
    } else {
      fields.push({
        field_name: fieldKey[0],
        field_value_type: field[fieldKey]["value_type"],
        field_form_type: field[fieldKey]["form_type"],
        field_length: field[fieldKey]["length"]
      })
    }
  })

  const resPermGroups = await axios.get(
    `${process.env.BASE_URL}/api/v1/permission-groups/?apikey=${process.env.API_KEY}`
  )
  const permGroups = await resPermGroups.data

  const filteredEntryTypes = entryTypes.filter((entry_type) => {
    const namespaceArr = entryType[0].namespace.split(".")
    const lenNamespaceArr = namespaceArr.length
    let parentNamespace: string
    if (lenNamespaceArr >= 2) {
      parentNamespace = namespaceArr
        .slice(0, lenNamespaceArr - 1)
        .join(".")
        .toString()
    } else {
      parentNamespace = namespaceArr.slice(-1)[0]
    }
    if (entry_type.namespace === entryType[0].namespace || entry_type.namespace === parentNamespace) {
      return false
    } else {
      return true
    }
  })

  return {
    props: {
      entryTypesData: filteredEntryTypes,
      entryTypeData: entryType,
      fieldsData: fields,
      fetchedPermGroups: permGroups
    }
  }
}

export default function EditEntryType({ entryTypesData, entryTypeData, fieldsData, fetchedPermGroups }) {
  //react states
  const [formFields, setFormFields] = useState(fieldsData)
  const [entryType, setEntryType] = useState(entryTypeData)
  const [currentNamespace, _] = useState(entryType[0].namespace)
  const [anyValueChanged, setAnyValueChanged] = useState(false)
  const [formErrors, setFormErrors] = useState({})
  const [showErrors, setShowErrors] = useState(false)
  const [showError, setShowError] = useState({})
  const [isUpdateBtnClicked, setIsUpdateBtnClicked] = useState(false)

  const saveData = useSaveData("ENTRY_TYPE", "UPDATE")

  //routing
  const router = useRouter()
  const { slug } = router.query

  //sweetalert
  const resultSwal = withReactContent(Swal)

  //formRef
  const formRef = useRef([])

  //Auth Session
  const { data: session } = useSession()

  const handleEntryTypeChange = (event) => {
    const entryTypeData = { ...entryType }
    entryTypeData[0][event.target.name] = event.target.value

    //Empty field validation
    checkFieldEmpty(formErrors, showError, setFormErrors, setShowError, event, 0)

    //If there is a change enable "update" button
    setAnyValueChanged(true)

    //Update entrytype state
    //setEntryType(entryTypeData)

    //Change namespace if name changes
    const slugName = entryTypeData[0].name.split(" ").join("-").toLowerCase()
    const prefixNamespace = entryTypeData[0].namespace
      .split(".")
      .splice(0, entryTypeData[0].namespace.split(".").length - 1)
      .join(".")
    console.log("entryTypeData", entryTypeData[0].namespace)
    console.log("prefixNamespaceX", prefixNamespace)
    if (slugName !== entryTypeData[0].namespace.split(".").slice(-1).toString()) {
      let newEntryType: object
      if (prefixNamespace) {
        console.log("prefixNamespaceT", prefixNamespace)
        newEntryType = {
          0: {
            name: entryTypeData[0].name,
            namespace: `${prefixNamespace}.${entryTypeData[0].namespace}`
          }
        }
      } else {
        newEntryType = {
          0: {
            name: entryTypeData[0].name,
            namespace: `${entryTypeData[0].namespace}.${slugName}`
          }
        }
      }
      setEntryType(newEntryType)
    }
  }

  const handleFieldChange = (index, event) => {
    const fieldData = [...formFields]
    fieldData[index][event.target.name] = event.target.value

    //Empty Field Validation
    checkFieldEmpty(formErrors, showError, setFormErrors, setShowError, event, index)

    //Update formField state
    setFormFields(fieldData)

    //Enable "update" button update if there is any change
    if (fieldData.length === fieldsData.length) setAnyValueChanged(true)
  }

  const submitData = async () => {
    //Form Error Handling
    if (Object.keys(formErrors).length > 0) {
      //If there is/are form error(s)
      const formFieldsWithErrors = Object.keys(formErrors)
      setShowErrors(true)
      setIsUpdateBtnClicked(false)
      formRef.current[formFieldsWithErrors[0]].focus()
    } else {
      //If there is no form error
      const result = await saveData({ entryType, formFields, slug })
      if (result.status === "success") {
        resultSwal
          .fire({
            title: `${result.message} Do you want to continue editing it?`,
            icon: "success",
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "Yes",
            denyButtonText: "No",
            confirmButtonColor: "#10B981"
          })
          .then((result) => {
            if (result.isDenied) {
              Router.push("/dashboard/entry-types")
            } else {
              setIsUpdateBtnClicked(false)
            }
          })
      } else if (result.status === "failed") {
        resultSwal
          .fire({
            title: `${result.message} Do you want to continue editing it?`,
            icon: "error",
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "Yes",
            denyButtonText: "No",
            confirmButtonColor: "#10B981"
          })
          .then((result) => {
            if (result.isDenied) {
              Router.push("/dashboard/entry-types")
            } else {
              setIsUpdateBtnClicked(false)
            }
          })
      } else {
        console.log("ERROR", result)
      }
    }
  }

  return (
    <div className="container ">
      <div className="grid grid-flow-col auto-cols-max h-screen w-screen">
        <Menu />
        <div className="grid grid-col-6 ml-10 mt-10 content-start place-content-around w-screen">
          <div className="col-start-1 col-end-2 ">
            <h1 className="text-6xl font-josefin">Edit entry type</h1>
          </div>
          <div className="col-start-4 col-end-6 "></div>

          <div className="col-start-1 col-end-6 w-10/12 mt-10 ">
            {checkPermission(fetchedPermGroups, session, "update", currentNamespace) ? (
              <form action="#">
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
                      defaultValue={entryType[0].name}
                      onChange={(e) => {
                        handleEntryTypeChange(e)
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
                      className="form-select form-select-lg mb-3 block w-full  px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300  rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-slate-600 focus:outline-none"
                      defaultValue={entryType[0].namespace}
                      onChange={(e) => {
                        handleEntryTypeChange(e)
                      }}
                      onBlur={(e) => {
                        checkFieldEmpty(formErrors, showError, setFormErrors, setShowError, e, 0)
                      }}
                      required>
                      <option key={0} value={entryType[0].namespace}>
                        Itself{" "}
                      </option>
                      {entryTypesData.map((entry_type, idx) => {
                        //TODO:Don't add entry type's own namespace
                        return (
                          <option key={idx} value={`${entry_type.namespace}`}>
                            {`${entry_type.name} (${entry_type.namespace})`}
                          </option>
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
                      key={index}
                      id="new_field"
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
                            ref={(el) => (formRef.current[`field_name_${index}`] = el)}
                            name="field_name"
                            type="text"
                            className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-slate-600 focus:outline-none"
                            id="field_name"
                            placeholder="Eg: Title"
                            defaultValue={field.field_name}
                            onChange={(e) => {
                              handleFieldChange(index, e)
                            }}
                            onBlur={(e) => {
                              checkFieldEmpty(formErrors, showError, setFormErrors, setShowError, e, index)
                            }}
                            required
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
                            ref={(el) => (formRef.current[`field_length_${index}`] = el)}
                            name="field_length"
                            type="number"
                            className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-slate-600 focus:outline-none"
                            id="field_length"
                            placeholder="Eg: 100"
                            defaultValue={field.field_length}
                            onChange={(e) => {
                              handleFieldChange(index, e)
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
                            key={`input_field_value_type_${index}`}
                            id="field_value_type"
                            name="field_value_type"
                            ref={(el) => (formRef.current[`field_value_type_${index}`] = el)}
                            defaultValue={field.field_value_type}
                            className="form-select form-select-lg mb-3 block w-full  px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300  rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-slate-600 focus:outline-none"
                            onChange={(e) => {
                              handleFieldChange(index, e)
                            }}
                            onBlur={(e) => {
                              checkFieldEmpty(formErrors, showError, setFormErrors, setShowError, e, index)
                            }}
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
                            key={`input_field_form_type_${index}`}
                            id="field_form_type"
                            name="field_form_type"
                            ref={(el) => (formRef.current[`field_form_type_${index}`] = el)}
                            defaultValue={field.field_form_type}
                            className="form-select form-select-lg mb-3 block w-full  px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300  rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-slate-600 focus:outline-none"
                            onChange={(e) => {
                              handleFieldChange(index, e)
                            }}
                            onBlur={(e) => {
                              checkFieldEmpty(formErrors, showError, setFormErrors, setShowError, e, index)
                            }}
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
                            removeField(
                              formFields,
                              formErrors,
                              setFormFields,
                              setFormErrors,
                              index,
                              "UPDATE",
                              setAnyValueChanged,
                              fieldsData
                            )
                          }}>
                          <FiX />
                        </a>
                      </div>
                    </div>
                  )
                })}
                <div
                  id="add_new_field"
                  className="flex flex-row flex-nowrap justify-center border-2 border-dashed border-slate-200 mt-5 p-10 ">
                  <div className=" w-11/12">
                    <a
                      href="#"
                      className="flex flex-row justify-center text-slate-300 transition hover:text-slate-900"
                      onClick={() => {
                        addField(
                          formFields,
                          formErrors,
                          setFormFields,
                          setFormErrors,
                          "UPDATE",
                          setAnyValueChanged,
                          fieldsData
                        )
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
                    {anyValueChanged ? (
                      <button
                        type="button"
                        onClick={() => {
                          setIsUpdateBtnClicked(true)
                          void submitData()
                        }}
                        className="mb-2 w-full inline-block px-6 py-2.5 bg-slate-700 text-white font-medium text-xs leading-normal uppercase rounded shadow-md hover:bg-slate-800 hover:shadow-lg focus:bg-slate-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-slate-800 active:shadow-lg transition duration-150 ease-in-out">
                        Update
                      </button>
                    ) : (
                      <Tippy content="Make some changes first!" theme="translucent">
                        <button
                          type="button"
                          className="mb-2 w-full inline-block px-6 py-2.5 bg-gray-500 text-white font-medium text-xs leading-normal uppercase rounded shadow-md">
                          {isUpdateBtnClicked ? (
                            <span className="flex flex-row justify-center">
                              <FiLoader className="animate-spin text-2xl" />
                              <span className="mt-1 ml-3">Processing</span>
                            </span>
                          ) : (
                            "Update"
                          )}
                        </button>
                      </Tippy>
                    )}
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
