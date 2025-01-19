//Utility
import axios, { AxiosResponse } from "axios"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import Router from "next/router"
import { FiLoader } from "react-icons/fi"
import { useSession } from "next-auth/react"

//React
import { useState, useEffect, useRef } from "react"

//Icons
import { FiPlusSquare, FiX } from "react-icons/fi"

//Components
import Menu from "../../../components/dashboard/menu"

//Interfaces
import { EntryType } from "../../../interfaces"

//===============================================

export async function getServerSideProps() {
  const res = await axios.get(`${process.env.BASE_URL}/api/v1/entry-types?apikey=${process.env.API_KEY}`)
  let entryTypes: EntryType = await res.data

  return {
    props: {
      fetchedEntryTypes: entryTypes
    }
  }
}

export default function CreateEntryType({ fetchedEntryTypes }) {
  const [entryType, setEntryType] = useState({})
  const [formFields, setFormFields] = useState([])
  const [formErrors, setFormErrors] = useState({})
  const [showErrors, setShowErrors] = useState(false)
  const [showError, setShowError] = useState({})
  const [isCreateBtnClicked, setIsCreateBtnClicked] = useState(false)

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
  }, [])

  const checkPermGroup = (permGroup: string) => {
    if (session) {
      if (session.user.permission_group === permGroup) return true
    }
    return false
  }

  const checkFieldEmpty = (index: number, event) => {
    if (event.target.name === "name" || event.target.name === "namespace") {
      if (event.target.value === "") {
        let newError = { [event.target.name]: "empty-field" }
        setFormErrors({ ...formErrors, ...newError })
        setShowError({ [event.target.name]: true })
      } else {
        if (`${event.target.name}` in formErrors) {
          let copyErrors = { ...formErrors }
          const { [event.target.name]: undefined, ...restOfErrors }: Record<string, string> = copyErrors
          setFormErrors(restOfErrors)
          setShowError({ [event.target.name]: false })
        }
      }
    } else {
      if (event.target.value === "") {
        console.log("EMPTY FIELD")
        let newError = { [`${event.target.name}_${index}`]: "empty-field" }
        setFormErrors({ ...formErrors, ...newError })
        setShowError({ [`${event.target.name}_${index}`]: true })
      } else {
        if (`${event.target.name}_${index}` in formErrors) {
          let copyErrors = { ...formErrors }
          const { [`${event.target.name}_${index}`]: undefined, ...restOfErrors }: Record<string, string> = copyErrors
          setFormErrors(restOfErrors)
          setShowError({ [`${event.target.name}_${index}`]: false })
        }
      }
    }
  }

  const handleEntryTypeChange = (event) => {
    let entryTypeData = { ...entryType }
    entryTypeData[event.target.name] = event.target.value

    //Empty field validation
    checkFieldEmpty(0, event)

    setEntryType(entryTypeData)
  }
  const handleFieldChange = (index, event) => {
    let fieldData = [...formFields]
    fieldData[index][event.target.name] = event.target.value

    //Empty Field Validation
    checkFieldEmpty(index, event)

    setFormFields(fieldData)
  }

  const addField = () => {
    let newField = { field_name: "", field_value_type: "", field_form_type: "" }

    //Prepare empty field validation data
    let newErrors = {
      [`field_name_${formFields.length}`]: "empty-field",
      [`field_length_${formFields.length}`]: "empty-field",
      [`field_value_type_${formFields.length}`]: "empty-field",
      [`field_form_type_${formFields.length}`]: "empty-field"
    }

    //Update validation state
    setFormErrors({ ...formErrors, ...newErrors })

    setFormFields([...formFields, newField])
  }

  const removeField = (index) => {
    let fieldData = [...formFields]

    //Copy of formErrors state
    let copyErrors = { ...formErrors }

    //remove validation data if field has been removed
    for (let key of Object.keys(formErrors)) {
      if (key.endsWith(index)) {
        delete copyErrors[key]
      }
    }

    //Update formError after removing validation data
    setFormErrors(copyErrors)

    fieldData.splice(index, 1)
    setFormFields(fieldData)
  }

  const submitData = async () => {
    if (Object.keys(formErrors).length > 0) {
      //If there is/are form error(s)
      let formFieldsWithErrors = Object.keys(formErrors)
      setShowErrors(true)
      setIsCreateBtnClicked(false)
      formRef.current[formFieldsWithErrors[0]].focus()
    } else {
      //If there is no form error
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

      let result
      await axios
        .post(
          `${process.env.baseUrl}/api/v1/entry-type/create?apikey=${process.env.apiKey}&secretkey=${process.env.secretKey}`,
          {
            ...formatedEntryType,
            slug: formatedEntryType["name"].split(" ").join("-").toLowerCase(),
            fields: formatedFields
          }
        )
        .then((res: AxiosResponse) => {
          result = res.data
        })
        .catch((e: unknown) => console.log(e))

      if (result.status === "success") {
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
              ;(document.getElementById("entry_type_create_form") as HTMLFormElement).reset()
              setEntryType({ name: "", namespace: "itself" })
              setFormFields([{ field_name: "", field_value_type: "", field_form_type: "", field_length: 100 }])
              setIsCreateBtnClicked(false)
            } else if (result.isDenied) {
              Router.push("/dashboard/entry-types")
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
              Router.push("/dashboard/entry-types")
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
            {checkPermGroup("admin") ? (
              <form id="entry_type_create_form" action="#">
                <div
                  id="entry_type_name"
                  className="flex flex-col block justify-center border-2 border-slate-200 p-10 ">
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
                      onChange={(e) => handleEntryTypeChange(e)}
                      onBlur={(e) => checkFieldEmpty(0, e)}
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
                      onChange={(e) => handleEntryTypeChange(e)}
                      onBlur={(e) => checkFieldEmpty(0, e)}
                      className="form-select form-select-lg mb-3 block w-full  px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300  rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-slate-600 focus:outline-none">
                      <option value="itself"> Itself </option>
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
                      <div key={`field_block_${index}`} className="flex flex-col justify-center block w-11/12">
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
                            ref={(el) => (formRef.current[`field_name_${index}`] = el)}
                            type="text"
                            className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-slate-600 focus:outline-none"
                            id="field_name"
                            placeholder="Eg: Title"
                            defaultValue={field.field_name}
                            onChange={(e) => handleFieldChange(index, e)}
                            onBlur={(e) => checkFieldEmpty(index, e)}
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
                            id="field_length"
                            type="number"
                            className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-slate-600 focus:outline-none"
                            placeholder="Eg: 100"
                            defaultValue={field.field_length}
                            onChange={(e) => handleFieldChange(index, e)}
                            onBlur={(e) => checkFieldEmpty(index, e)}
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
                            onChange={(e) => handleFieldChange(index, e)}
                            onBlur={(e) => checkFieldEmpty(index, e)}
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
                            key={`input_field_form_type_${index}`}
                            id="field_form_type"
                            name="field_form_type"
                            ref={(el) => (formRef.current[`field_form_type_${index}`] = el)}
                            defaultValue={field.field_form_type}
                            onChange={(e) => handleFieldChange(index, e)}
                            onBlur={(e) => checkFieldEmpty(index, e)}
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
                          onClick={() => removeField(index)}>
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
                      onClick={addField}>
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
                      onClick={() => {
                        setIsCreateBtnClicked(true)
                        submitData()
                      }}
                      className="mb-2 w-full inline-block px-6 py-2.5 bg-slate-700 text-white font-medium text-xs leading-normal uppercase rounded shadow-md hover:bg-slate-800 hover:shadow-lg focus:bg-slate-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-slate-800 active:shadow-lg transition duration-150 ease-in-out">
                      {isCreateBtnClicked ? (
                        <span className="flex flex-row justify-center">
                          <FiLoader className="animate-spin text-2xl" />
                          <span className="mt-1 ml-3">Processing</span>
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
