//Utility
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import Router from "next/router"
import { FiLoader } from "react-icons/fi"
import { useSession } from "next-auth/react"

//React
import { useEffect, useRef, useState } from "react"

//Components
import Menu from "../../../components/dashboard/menu"
import checkFieldEmpty from "../../../lib/ui/check-field-empty"
import checkPermGroup from "../../../lib/ui/check-perm-group"
import handleValueChange from "../../../lib/ui/handle-value-change"
import useSaveData from "../../../hooks/use-save-data"

//===============================================

export default function CreatePermissionGroup() {
  const [formValues, setFormValues] = useState({})

  const [formErrors, setFormErrors] = useState({})

  const [showErrors, setShowErrors] = useState(false)
  const [showError, setShowError] = useState({})
  const [isCreateBtnClicked, setIsCreateBtnClicked] = useState(false)
  const saveData = useSaveData("PERM_GROUP", "CREATE")
  //sweetalert
  const resultSwal = withReactContent(Swal)

  //formRef
  const formRef = useRef([])

  //Auth Session
  const { data: session } = useSession()

  useEffect(() => {
    //Add form error for name field at first page render
    if (Object.keys(formErrors).length === 0) {
      setFormErrors({ name: "empty-field" })
    }

    //Add initial form values at first page render
    if (Object.keys(formValues).length === 0) {
      setFormValues({
        name: "",
        slug: "",
        privileges: []
      })
    }
  }, [])

  const submitData = async () => {
    if (Object.keys(formErrors).length > 0) {
      const formValuesWithErrors = Object.keys(formErrors)
      setShowErrors(true)
      setIsCreateBtnClicked(false)
      formRef.current[formValuesWithErrors[0]].focus()
    } else {
      const result = await saveData({ formValues })
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
              ;(document.getElementById("perm_group_create_form") as HTMLFormElement).reset()
              setFormValues({ name: "" })
              setIsCreateBtnClicked(false)
            } else if (result.isDenied) {
              void Router.push("/dashboard/permission-groups")
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
              void Router.push("/dashboard/permission-groups")
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
            <h1 className="text-6xl font-josefin">New Group</h1>
          </div>
          <div className="col-start-4 col-end-6 "></div>
          <div className="col-start-1 col-end-6 w-10/12 mt-10 ">
            {checkPermGroup(session, "admin") ? (
              <form action="#" id="perm_group_create_form">
                <div className="flex flex-col justify-center border-2 border-slate-200 p-10 ">
                  <div className="w-11/12">
                    <label htmlFor="name" className="form-label inline-block mb-2 text-gray-700 text-xl">
                      Group Name
                    </label>
                    <input
                      type="text"
                      className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                      id="name"
                      name="name"
                      ref={(el) => (formRef.current[`name`] = el)}
                      defaultValue={formValues["name"]}
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
                          "PERM_GROUP"
                        )
                      }}
                      onBlur={(e) => {
                        checkFieldEmpty(formErrors, showError, setFormErrors, setShowError, e)
                      }}
                      required
                    />
                    {(showErrors || showError[`name`]) &&
                      formErrors[`name`] &&
                      formErrors[`name`] === "empty-field" && (
                        <span className="text-red-500 font-bold">This field is required</span>
                      )}
                  </div>
                </div>

                <div id="user_submit" className="flex flex-row flex-nowrap justify-center  mt-5 p-10 ">
                  <div className=" w-11/12">
                    <button
                      type="button"
                      data-testid="create_perm_group_btn"
                      onClick={() => {
                        setIsCreateBtnClicked(true)
                        void submitData()
                      }}
                      className="mb-2 w-full inline-block px-6 py-2.5 bg-slate-700 text-white font-medium text-xs leading-normal uppercase rounded shadow-md hover:bg-slate-800 hover:shadow-lg focus:bg-slate-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-slate-800 active:shadow-lg transition duration-150 ease-in-out">
                      {isCreateBtnClicked ? (
                        <span className="flex flex-row justify-center">
                          <FiLoader className="animate-spin text-2xl" />
                          <span data-testid="create_perm_group_btn_processing" className="mt-1 ml-3">
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
              "You don't have a permission to do this"
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
