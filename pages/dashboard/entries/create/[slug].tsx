//Utility
import axios, { AxiosResponse } from "axios"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import Router from "next/router"
import { FiLoader } from "react-icons/fi"
import { useSession } from "next-auth/react"

//React
import { useState, useEffect, useRef } from "react"

//Components
import Menu from "../../../../components/dashboard/menu"

//Interfaces
import { EntryType } from "../../../../interfaces"

//===============================================

export async function getServerSideProps(req) {
  const { slug } = req.query

  const res = await axios.get(`${process.env.BASE_URL}/api/v1/entry-type/slug/${slug}?apikey=${process.env.API_KEY}`)
  let entryType: EntryType = await res.data

  const resPermGroups = await axios.get(
    `${process.env.BASE_URL}/api/v1/permission-groups/?apikey=${process.env.API_KEY}`
  )
  let permGroups = await resPermGroups.data

  return {
    props: {
      fetchedEntryType: entryType,
      fetchedPermGroups: permGroups
    }
  }
}

export default function CreateEntry({ fetchedEntryType, fetchedPermGroups }) {
  const [formValues, setFormValues] = useState({ name: "", slug: "", namespace: "" })
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
    let newFields = {}
    let newErrorFields = {}
    fetchedEntryType[0].fields.forEach((field: string) => {
      let fieldName = Object.keys(field).toString()
      newFields[fieldName] = ""
      newErrorFields[fieldName] = "empty-field"
    })
    setFormValues({ ...formValues, ...newFields })
    setFormErrors({ ...formErrors, ...newErrorFields })

    //Add form error for name field at first page render
    if (Object.keys(formErrors).length === 0) {
      setFormErrors({ name: "empty-field" })
    }
  }, [fetchedEntryType])

  const checkPermission = (permission: string, namespace: string): Boolean => {
    if (session) {
      let permGroup = fetchedPermGroups.find((group) => group.slug === session.user.permission_group)
      if (permGroup.privileges.find((privilege: object[]) => Object.keys(privilege).includes(`${namespace}`))) {
        return permGroup.privileges
          .find((privilege: object[]) => Object.keys(privilege).includes(`${namespace}`))
          [`${namespace}`].permissions.includes(`${permission}`)
      }
      return false
    }
  }

  const checkFieldEmpty = (event) => {
    if (event.target.value === "") {
      let newError = { [event.target.name]: "empty-field" }
      setFormErrors({ ...formErrors, ...newError })
      setShowError({ ...showError, [event.target.name]: true })
    } else {
      if (`${event.target.name}` in formErrors) {
        let copyErrors = { ...formErrors }
        const { [event.target.name]: _, ...restOfErrors }: Record<string, string> = copyErrors
        setFormErrors(restOfErrors)
        setShowError({ [event.target.name]: false })
      }
    }
  }

  const isDouble = (n: number) => Number(n) === n && n % 1 !== 0

  const isBoolean = (value: string): boolean => {
    return value === "true" || value === "false"
  }

  const checkFormRules = (valueType: string, event) => {
    let newRule: object
    if (valueType === "string" && typeof event.target.value !== "string") {
      newRule = { [`${event.target.name}_rule`]: "string-field" }
      setFormErrors({ ...formErrors, ...newRule })
      setShowError({ [`${event.target.name}_rule`]: true })
    } else if (valueType === "integer" && !Number.isSafeInteger(Number(event.target.value))) {
      newRule = { [`${event.target.name}_rule`]: "integer-field" }
      setFormErrors({ ...formErrors, ...newRule })
      setShowError({ [`${event.target.name}_rule`]: true })
    } else if (valueType === "double" && !isDouble(event.target.value)) {
      newRule = { [`${event.target.name}_rule`]: "double-field" }
      setFormErrors({ ...formErrors, ...newRule })
      setShowError({ [`${event.target.name}_rule`]: true })
    } else if (valueType === "boolean" && !isBoolean(event.target.value)) {
      newRule = { [`${event.target.name}_rule`]: "boolean-field" }
      setFormErrors({ ...formErrors, ...newRule })
      setShowError({ [`${event.target.name}_rule`]: true })
    } else {
      if (`${event.target.name}_rule` in formErrors) {
        let copyErrors = { ...formErrors }
        const { [`${event.target.name}_rule`]: undefined, ...restOfErrors }: Record<string, string> = copyErrors
        setFormErrors(restOfErrors)
        setShowError({ [`${event.target.name}_rule`]: false })
      }
    }
  }

  const checkLength = (length: number, event) => {
    let newRule: object
    if (event.target.value.length > length) {
      newRule = { [`${event.target.name}_length`]: "length-error" }
      setFormErrors({ ...formErrors, ...newRule })
      setShowError({ [`${event.target.name}_length`]: true })
    } else {
      if (`${event.target.name}_length` in formErrors) {
        let copyErrors = { ...formErrors }
        const { [`${event.target.name}_length`]: undefined, ...restOfErrors }: Record<string, string> = copyErrors
        setFormErrors(restOfErrors)
        setShowError({ [`${event.target.name}_length`]: false })
      }
    }
  }

  const handleFormValuesChange = (event, valueType?: string, length?: number) => {
    let copyData = { ...formValues }
    copyData[event.target.name] = event.target.value

    //Empty field validation
    checkFieldEmpty(event)

    if (event.target.name !== "name") {
      checkFormRules(valueType, event)

      checkLength(length, event)
    }

    setFormValues(copyData)
  }

  const submitData = async () => {
    if (Object.keys(formErrors).length > 0) {
      let formValuesWithErrors = Object.keys(formErrors)
      setShowErrors(true)
      setIsCreateBtnClicked(false)
      formRef.current[formValuesWithErrors[0]].focus()
    } else {
      let result
      await axios
        .post(
          `${process.env.baseUrl}/api/v1/entry/create?apikey=${process.env.apiKey}&secretkey=${process.env.secretKey}`,
          {
            ...formValues,
            slug: formValues.name.split(" ").join("-").toLowerCase(),
            namespace: fetchedEntryType[0].namespace
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
              ;(document.getElementById("new_entry_form") as any).reset()
              let newFields = {}
              let newErrorFields = {}
              fetchedEntryType[0].fields.forEach((field) => {
                let fieldName = Object.keys(field).toString()
                newFields[fieldName] = ""
                newErrorFields[fieldName] = "empty-field"
              })
              setFormValues({ name: "", slug: "", namespace: "", ...newFields })
              setFormErrors({ name: "empty-field", ...newErrorFields })
              setIsCreateBtnClicked(false)
            } else if (result.isDenied) {
              Router.push("/dashboard/entries")
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
              Router.push("/dashboard/entries")
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
            <h1 className="text-6xl font-josefin">New Entry: {fetchedEntryType[0].name} </h1>
          </div>
          <div className="col-start-4 col-end-6 "></div>
          <div className="col-start-1 col-end-6 w-10/12 mt-10 ">
            {checkPermission("create", fetchedEntryType[0].namespace) ? (
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
                      onChange={(e) => handleFormValuesChange(e)}
                      onBlur={(e) => checkFieldEmpty(e)}
                      required
                    />
                    {(showErrors || showError[`name`]) &&
                      formErrors[`name`] &&
                      formErrors[`name`] === "empty-field" && (
                        <span className="text-red-500 font-bold">This field is required</span>
                      )}
                  </div>
                </div>
                <div className="flex flex-col justify-center border-2 border-slate-200 p-10 ">
                  <h3 className="text-3xl mb-3">Fields</h3>
                  {fetchedEntryType[0].fields.map((field: string | string[], index: number) => {
                    let fieldName = Object.keys(field).toString()
                    if (field[fieldName].form_type === "textarea") {
                      return (
                        <div key={index} className="w-11/12 mt-3">
                          <label
                            htmlFor={`${fieldName}`}
                            className="form-label inline-block mb-2 text-gray-700 text-xl">
                            {fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
                          </label>

                          <textarea
                            rows={3}
                            className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                            id={`${fieldName}`}
                            name={`${fieldName}`}
                            ref={(el) => (formRef.current[`${fieldName}`] = el)}
                            defaultValue={formValues[`${fieldName}`]}
                            onChange={(e) =>
                              handleFormValuesChange(e, field[fieldName].value_type, field[fieldName].length)
                            }
                            onBlur={(e) => checkFieldEmpty(e)}
                            required></textarea>
                          {(showErrors || showError[`${fieldName}`]) &&
                            formErrors[`${fieldName}`] &&
                            formErrors[`${fieldName}`] === "empty-field" && (
                              <span className="text-red-500 font-bold">This field is required.</span>
                            )}
                          {(showErrors || showError[`${fieldName}_rule`]) &&
                            formErrors[`${fieldName}_rule`] &&
                            formErrors[`${fieldName}_rule`] === `${field[fieldName].value_type}-field` && (
                              <span className="text-red-500 font-bold">
                                {` This field must be ${field[fieldName].value_type}. `}
                              </span>
                            )}
                          {(showErrors || showError[`${fieldName}_length`]) &&
                            formErrors[`${fieldName}_length`] &&
                            formErrors[`${fieldName}_length`] === "length-error" && (
                              <span className="text-red-500 font-bold">
                                {`Maximum length is ${field[fieldName].length}. `}
                              </span>
                            )}
                        </div>
                      )
                    } else {
                      return (
                        <div key={index} className="w-11/12 mt-3">
                          <label
                            htmlFor={`${fieldName}`}
                            className="form-label inline-block mb-2 text-gray-700 text-xl">
                            {fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
                          </label>

                          <input
                            type="text"
                            className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                            id={`${fieldName}`}
                            name={`${fieldName}`}
                            ref={(el) => (formRef.current[`${fieldName}`] = el)}
                            defaultValue={formValues[`${fieldName}`]}
                            onChange={(e) =>
                              handleFormValuesChange(e, field[fieldName].value_type, field[fieldName].length)
                            }
                            onBlur={(e) => checkFieldEmpty(e)}
                            required
                          />
                          {(showErrors || showError[`${fieldName}`]) &&
                            formErrors[`${fieldName}`] &&
                            formErrors[`${fieldName}`] === "empty-field" && (
                              <span className="text-red-500 font-bold">This field is required.</span>
                            )}
                          {(showErrors || showError[`${fieldName}_rule`]) &&
                            formErrors[`${fieldName}_rule`] &&
                            formErrors[`${fieldName}_rule`] === `${field[fieldName].value_type}-field` && (
                              <span className="text-red-500 font-bold">
                                {` This field must be ${field[fieldName].value_type}. `}
                              </span>
                            )}
                          {(showErrors || showError[`${fieldName}_length`]) &&
                            formErrors[`${fieldName}_length`] &&
                            formErrors[`${fieldName}_length`] === "length-error" && (
                              <span className="text-red-500 font-bold">
                                {`Maximum length is ${field[fieldName].length}. `}
                              </span>
                            )}
                        </div>
                      )
                    }
                  })}
                </div>
                <div id="user_submit" className="flex flex-row flex-nowrap justify-center  mt-5 p-10 ">
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
