//Utility
import axios from "axios"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { useRouter } from "next/router"
import Router from "next/router"
import { FiLoader } from "react-icons/fi"
import { useSession } from "next-auth/react"

//React
import { useState, useRef } from "react"

//Components
import Menu from "../../../../components/dashboard/menu"

//Interfaces
import { User, PermissionGroup } from "../../../../interfaces"

//Styles
import "tippy.js/dist/tippy.css"
import checkPermGroup from "../../../../lib/ui/check-perm-group"
import checkFieldEmpty from "../../../../lib/ui/check-field-empty"
import handleValueChange from "../../../../lib/ui/handle-value-change"
import useSaveData from "../../../../hooks/use-save-data"

//===============================================

export async function getServerSideProps(req) {
  const { slug } = req.query
  const resPermGroupActionURI: string = `${process.env.BASE_URL!}/api/v1/permission-groups?apikey=${process.env
    .API_KEY!}`
  let resPermissionGroups = await axios.get(resPermGroupActionURI)
  let permissionGroups: PermissionGroup = await resPermissionGroups.data

  const resUserActionURI: string = `${process.env.BASE_URL!}/api/v1/users/_id/${slug}?apikey=${process.env
    .API_KEY!}&secretkey=${process.env.SECRET_KEY!}`
  const resUser = await axios.get(resUserActionURI)
  let user: User = await resUser.data

  return {
    props: {
      fetchedPermissionGroups: permissionGroups,
      fetchedUser: user
    }
  }
}

export default function EditUser({ fetchedPermissionGroups, fetchedUser }) {
  const [formValues, setFormValues] = useState(fetchedUser)
  const [currentPw] = useState(fetchedUser[0].password)
  const [formErrors, setFormErrors] = useState({})
  const [showErrors, setShowErrors] = useState(false)
  const [showError, setShowError] = useState({})
  const [isUpdateBtnClicked, setIsUpdateBtnClicked] = useState(false)
  const saveData = useSaveData("USER", "UPDATE")

  //routing
  const router = useRouter()
  const { slug } = router.query

  //sweetalert
  const resultSwal = withReactContent(Swal)

  //formRef
  const formRef = useRef([])

  //Auth Session
  const { data: session } = useSession()

  const submitData = async () => {
    if (Object.keys(formErrors).length > 0) {
      let formValuesWithErrors = Object.keys(formErrors)
      setShowErrors(true)
      setIsUpdateBtnClicked(false)
      formRef.current[formValuesWithErrors[0]].focus()
    } else {
      const result = await saveData({ formValues, slug, currentPw })
      if (result.status === "success") {
        resultSwal
          .fire({
            title: `${result.message}. Do you want to continue editing it?`,
            icon: "success",
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "Yes",
            denyButtonText: "No",
            confirmButtonColor: "#10B981"
          })
          .then((result) => {
            if (result.isDenied) {
              void Router.push("/dashboard/users")
            } else {
              setIsUpdateBtnClicked(false)
            }
          })
      } else if (result.status === "failed") {
        resultSwal
          .fire({
            title: `${result.message}. Do you want to continue editing it?`,
            icon: "error",
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "Yes",
            denyButtonText: "No",
            confirmButtonColor: "#10B981"
          })
          .then((result) => {
            if (result.isDenied) {
              void Router.push("/dashboard/users")
            } else {
              setIsUpdateBtnClicked(false)
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
            <h1 className="text-6xl font-josefin">Edit User </h1>
          </div>
          <div className="col-start-4 col-end-6 "></div>
          <div className="col-start-1 col-end-6 w-10/12 mt-10 ">
            {checkPermGroup(session, "admin") ? (
              <form action="#" id="user_create_form">
                <div className="flex flex-col justify-center border-2 border-slate-200 p-10 ">
                  <div className="w-11/12">
                    <label htmlFor="username" className="form-label inline-block mb-2 text-gray-700 text-xl">
                      Username
                    </label>
                    <input
                      type="text"
                      className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                      id="username"
                      name="username"
                      ref={(el) => (formRef.current[`username`] = el)}
                      defaultValue={formValues[0].username}
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
                          "USER_EDIT"
                        )
                      }}
                      onBlur={(e) => {
                        checkFieldEmpty(formErrors, showError, setFormErrors, setShowError, e)
                      }}
                      required
                    />
                    {(showErrors || showError[`username`]) &&
                      formErrors[`username`] &&
                      formErrors[`username`] === "empty-field" && (
                        <span className="text-red-500 font-bold">This field is required</span>
                      )}
                  </div>
                  <div className="w-11/12 mt-5">
                    <label htmlFor="email" className="form-label inline-block mb-2 text-gray-700 text-xl">
                      Email
                    </label>
                    <input
                      type="text"
                      className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                      id="email"
                      name="email"
                      ref={(el) => (formRef.current[`email`] = el)}
                      defaultValue={formValues[0].email}
                      onChange={(e) =>
                        handleValueChange(
                          formValues,
                          formErrors,
                          showError,
                          showErrors,
                          setFormErrors,
                          setShowError,
                          setFormValues,
                          e,
                          "USER_EDIT"
                        )
                      }
                      onBlur={(e) => checkFieldEmpty(formErrors, showError, setFormErrors, setShowError, e)}
                      required
                    />
                    {(showErrors || showError[`email`]) &&
                      formErrors[`email`] &&
                      formErrors[`email`] === "empty-field" && (
                        <span className="text-red-500 font-bold">This field is required</span>
                      )}
                  </div>
                  <div className="w-11/12 mt-5">
                    <label htmlFor="password" className="form-label inline-block mb-2 text-gray-700 text-xl">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                      id="password"
                      name="password"
                      ref={(el) => (formRef.current[`password`] = el)}
                      onChange={(e) =>
                        handleValueChange(
                          formValues,
                          formErrors,
                          showError,
                          showErrors,
                          setFormErrors,
                          setShowError,
                          setFormValues,
                          e,
                          "USER_EDIT"
                        )
                      }
                    />
                  </div>
                  <div className="w-11/12 mt-5">
                    <label htmlFor="permission_group" className="form-label inline-block mb-2 text-gray-700 text-xl">
                      Permission Group
                    </label>
                    <select
                      id="permission_group"
                      name="permission_group"
                      ref={(el) => (formRef.current[`permission_group`] = el)}
                      defaultValue={formValues[0].permission_group}
                      onChange={(e) =>
                        handleValueChange(
                          formValues,
                          formErrors,
                          showError,
                          showErrors,
                          setFormErrors,
                          setShowError,
                          setFormValues,
                          e,
                          "USER_EDIT"
                        )
                      }
                      onBlur={(e) => checkFieldEmpty(formErrors, showError, setFormErrors, setShowError, e)}
                      className="form-select form-select-lg mb-3 block w-full  px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300  rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-slate-600 focus:outline-none">
                      {fetchedPermissionGroups.map((permissionGroup) => {
                        return <option value={`${permissionGroup.slug}`}>{`${permissionGroup.name}`}</option>
                      })}
                    </select>
                    {(showErrors || showError[`permission_group`]) &&
                      formErrors[`permission_group`] &&
                      formErrors[`permission_group`] === "empty-field" && (
                        <span className="text-red-500 font-bold">This field is required</span>
                      )}
                  </div>
                </div>

                <div id="user_submit" className="flex flex-row flex-nowrap justify-center  mt-5 p-10 ">
                  <div className=" w-11/12">
                    <button
                      type="button"
                      onClick={() => {
                        setIsUpdateBtnClicked(true)
                        submitData()
                      }}
                      className="mb-2 w-full inline-block px-6 py-2.5 bg-slate-700 text-white font-medium text-xs leading-normal uppercase rounded shadow-md hover:bg-slate-800 hover:shadow-lg focus:bg-slate-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-slate-800 active:shadow-lg transition duration-150 ease-in-out">
                      {isUpdateBtnClicked ? (
                        <span className="flex flex-row justify-center">
                          <FiLoader className="animate-spin text-2xl" />
                          <span className="mt-1 ml-3">Processing</span>
                        </span>
                      ) : (
                        "Update"
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
