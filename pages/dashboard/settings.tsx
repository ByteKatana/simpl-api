//Utility
import axios, { AxiosResponse } from "axios"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { FiPlusCircle, FiTrash2 } from "react-icons/fi"
import { useSession } from "next-auth/react"

//React
import { useState, useEffect } from "react"

//Components
import Menu from "../../components/dashboard/menu"

//Interfaces
import { PermissionGroup, EntryType, ApiKey } from "../../interfaces"
import checkPermGroup from "../../lib/ui/check-perm-group"

export async function getServerSideProps() {
  let resPermissionGroup = await axios.get(
    `${process.env.BASE_URL}/api/v1/permission-groups?apikey=${process.env.API_KEY}`
  )
  let permissionGroups: PermissionGroup = await resPermissionGroup.data

  let resNamespace = await axios.get(`${process.env.BASE_URL}/api/v1/entry-types?apikey=${process.env.API_KEY}`)
  let namespaces: EntryType = await resNamespace.data

  let resApiKey = await axios.get(
    `${process.env.BASE_URL}/api/v1/key/list-all?apikey=${process.env.API_KEY}&secretkey=${process.env.SECRET_KEY}`
  )
  let apiKeys: ApiKey = await resApiKey.data

  return {
    props: {
      fetchedPermissionGroups: permissionGroups,
      fetchedNamespaces: namespaces,
      fetchedApiKeys: apiKeys
    }
  }
}

export default function Settings({ fetchedPermissionGroups, fetchedNamespaces, fetchedApiKeys }) {
  const [paginationNamespaceState, setPaginationNamespaceState] = useState({
    min: 0,
    max: 5,
    limit: 5,
    currentPage: 1,
    pages: []
  })

  const [paginationPermissionGroupState, setPaginationPermissionGroupState] = useState({
    min: 0,
    max: 5,
    limit: 5,
    currentPage: 1,
    pages: []
  })

  const [activePermissionGroup, setActivePermissionGroup] = useState(0)
  const [activeNamespace, setActiveNamespace] = useState(0)
  const [activePermissions, setActivePermissions] = useState([])

  //sweetalert
  const resultSwal = withReactContent(Swal)

  //Auth Session
  const { data: session } = useSession()

  useEffect(() => {
    function calcNamespacePages() {
      let count = []
      for (let i = 1; i <= fetchedNamespaces.length / paginationNamespaceState.limit + 1; i++) {
        count.push(i)
      }
      setPaginationNamespaceState({ ...paginationNamespaceState, pages: count })
    }
    function calcPermissionGroupPages() {
      let count = []
      for (let i = 1; i <= fetchedPermissionGroups.length / paginationPermissionGroupState.limit + 1; i++) {
        count.push(i)
      }
      setPaginationPermissionGroupState({ ...paginationPermissionGroupState, pages: count })
    }

    const getActivePermissions = () => {
      setActivePermissions([])

      let permGroupIndex = paginationPermissionGroupState.min + activePermissionGroup
      fetchedPermissionGroups[permGroupIndex].privileges.map((privilege) => {
        let namespaceIndex = paginationNamespaceState.min + activeNamespace
        let namespaceKey = fetchedNamespaces[namespaceIndex].namespace
        if (privilege[namespaceKey] !== undefined) {
          let activePerms = privilege[namespaceKey].permissions
          setActivePermissions(activePerms)
        }
      })
    }

    calcPermissionGroupPages()
    calcNamespacePages()
    getActivePermissions()
  }, [fetchedPermissionGroups, fetchedNamespaces, activePermissionGroup, activeNamespace])

  const updatePermissions = (permission: string) => {
    if (!activePermissions.includes(permission)) {
      setActivePermissions([...activePermissions, permission])
    } else {
      const filteredPermissions = activePermissions.filter((value) => value !== permission)
      setActivePermissions([...filteredPermissions])
    }
  }

  const sendPermissions = async () => {
    let result
    let permIndex = paginationPermissionGroupState.min + activePermissionGroup
    let namespaceIndex = paginationNamespaceState.min + activeNamespace
    let permissionGroupId = fetchedPermissionGroups[permIndex]._id
    let privilegeIndex = fetchedPermissionGroups[permIndex].privileges.findIndex((privilege) =>
      Object.keys(privilege).includes(fetchedNamespaces[namespaceIndex].namespace)
    )
    let payload
    if (privilegeIndex === -1) {
      payload = {
        privileges: [
          ...fetchedPermissionGroups[permIndex].privileges,
          {
            [fetchedNamespaces[namespaceIndex].namespace]: {
              permissions: [...activePermissions]
            }
          }
        ]
      }
    } else {
      payload = {
        privileges: [...fetchedPermissionGroups[permIndex].privileges]
      }
      payload.privileges[privilegeIndex] = {
        [fetchedNamespaces[namespaceIndex].namespace]: {
          permissions: [...activePermissions]
        }
      }
    }
    await axios
      .put(
        `${process.env.baseUrl}/api/v1/permission-group/update/${permissionGroupId}?apikey=${process.env.apiKey}&secretkey=${process.env.secretKey}`,
        payload
      )
      .then((res: AxiosResponse) => {
        result = res.data
      })
      .catch((e: unknown) => console.log(e))
    if (result.status === "success") {
      resultSwal.fire({
        title: `${result.message}`,
        icon: "success",
        showDenyButton: false,
        showCancelButton: false,
        confirmButtonText: "OK",
        denyButtonText: "No",
        confirmButtonColor: "#10B981"
      })
    } else {
      resultSwal.fire({
        title: `${result.message}`,
        icon: "error",
        showDenyButton: false,
        showCancelButton: false,
        confirmButtonText: "OK",
        denyButtonText: "No",
        confirmButtonColor: "#10B981"
      })
    }
  }

  const generateApiKey = async () => {
    let result
    await axios
      .get(`${process.env.baseUrl}/api/v1/key/generate?secretkey=${process.env.secretKey}`)
      .then((res) => {
        result = res.data
      })
      .catch((e) => console.log(e))
    if (result.result.status === "success") {
      resultSwal.fire({
        title: `${result.result.message}\nKey:${result.key}`,
        icon: "success",
        showDenyButton: false,
        showCancelButton: false,
        confirmButtonText: "OK",
        denyButtonText: "No",
        confirmButtonColor: "#10B981"
      })
    } else {
      resultSwal.fire({
        title: `${result.result.message}`,
        icon: "error",
        showDenyButton: false,
        showCancelButton: false,
        confirmButtonText: "OK",
        denyButtonText: "No",
        confirmButtonColor: "#10B981"
      })
    }
  }

  const removeApiKey = async (id: string) => {
    let result
    await axios
      .delete(
        `${process.env.baseUrl}/api/v1/key/remove/${id}?apikey=${process.env.apiKey}&secretkey=${process.env.secretKey}`
      )
      .then((res) => {
        result = res.data
      })
      .catch((e) => console.log(e))
    if (result.status === "success") {
      resultSwal.fire({
        title: `${result.message}`,
        icon: "success",
        showDenyButton: false,
        showCancelButton: false,
        confirmButtonText: "OK",
        denyButtonText: "No",
        confirmButtonColor: "#10B981"
      })
    } else {
      resultSwal.fire({
        title: `${result.message}`,
        icon: "error",
        showDenyButton: false,
        showCancelButton: false,
        confirmButtonText: "OK",
        denyButtonText: "No",
        confirmButtonColor: "#10B981"
      })
    }
  }

  return (
    <div className="container ">
      <div className="grid grid-flow-col auto-cols-max h-screen w-screen">
        <Menu />
        <div className="grid grid-col-6 ml-10 mt-10 content-start place-content-around w-screen">
          <div className="col-start-1 col-end-2 ">
            <h1 className="text-6xl font-josefin">Settings</h1>
          </div>
          <div className="col-start-4 col-end-6 "></div>
          <div className="col-start-1 col-end-6 w-10/12 mt-10 ">
            {checkPermGroup(session, "admin") ? (
              <div
                id="permssion_group_settings"
                className="flex flex-col justify-center border-2 border-slate-200 p-10 ">
                <div className="w-11/12">
                  <h2 className="text-slate-800 text-2xl">Permission Groups</h2>
                  <p className="text-slate-400">Manage permission groups, edit their privileges</p>
                </div>
                <div className="flex flex-row mt-5">
                  <div className="w-4/12">
                    <h3 className="text-xl">Group Name</h3>
                    <ul className="mt-3 cursor-pointer justify-start">
                      {fetchedPermissionGroups
                        .slice(paginationPermissionGroupState.min, paginationPermissionGroupState.max)
                        .map((permissionGroup: PermissionGroup, index: number) => {
                          return (
                            <li
                              key={index}
                              onClick={() => setActivePermissionGroup(index)}
                              className={`my-2 py-2 px-5 rounded-xl border-y border-gray-200 shadow-md ${
                                activePermissionGroup === index
                                  ? "text-white bg-slate-900 hover:bg-slate-800 active:bg-slate-700"
                                  : " text-black bg-slate-200 hover:bg-slate-300 active:bg-slate-400"
                              }`}>
                              {permissionGroup.name}
                            </li>
                          )
                        })}
                    </ul>
                    <ul className="flex list-style-none justify-center mt-5">
                      {paginationPermissionGroupState.pages.map((page) => {
                        return (
                          <li
                            className={`page-item ${
                              paginationPermissionGroupState.currentPage === page ? "active" : null
                            }  `}>
                            <a
                              className={`page-link relative block py-1.5 px-3 rounded border-0 ${
                                paginationPermissionGroupState.currentPage === page
                                  ? "bg-slate-900 text-white outline-none transition-all duration-300 rounded  hover:text-white hover:bg-slate-600"
                                  : "bg-transparent text-gray-800  outline-none transition-all duration-300 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none"
                              }  `}
                              href="#"
                              onClick={() =>
                                setPaginationPermissionGroupState({
                                  ...paginationPermissionGroupState,
                                  min: (page - 1) * paginationPermissionGroupState.limit,
                                  max: paginationPermissionGroupState.limit * page,
                                  currentPage: page
                                })
                              }>
                              {page}
                            </a>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                  <div className="w-4/12 px-5">
                    <h3 className="text-xl">Namespace</h3>
                    <ul className="mt-3 cursor-pointer justify-start">
                      {fetchedNamespaces
                        .slice(paginationNamespaceState.min, paginationNamespaceState.max)
                        .map((namespace: EntryType, index: number) => {
                          return (
                            <li
                              key={index}
                              onClick={() => setActiveNamespace(index)}
                              className={`my-2 py-2 px-5 rounded-xl border-y border-gray-200 shadow-md ${
                                activeNamespace === index
                                  ? "text-white bg-slate-900 hover:bg-slate-800 active:bg-slate-700"
                                  : "text-black bg-slate-200 hover:bg-slate-300 active:bg-slate-400"
                              } `}>
                              {namespace.name}
                            </li>
                          )
                        })}
                    </ul>
                    <ul className="flex list-style-none justify-center mt-5">
                      {paginationNamespaceState.pages.map((page) => {
                        return (
                          <li
                            className={`page-item ${
                              paginationNamespaceState.currentPage === page ? "active" : null
                            }  `}>
                            <a
                              className={`page-link relative block py-1.5 px-3 rounded border-0 ${
                                paginationNamespaceState.currentPage === page
                                  ? "bg-slate-900 text-white outline-none transition-all duration-300 rounded  hover:text-white hover:bg-slate-600"
                                  : "bg-transparent text-gray-800  outline-none transition-all duration-300 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none"
                              }  `}
                              href="#"
                              onClick={() =>
                                setPaginationNamespaceState({
                                  ...paginationNamespaceState,
                                  min: (page - 1) * paginationNamespaceState.limit,
                                  max: paginationNamespaceState.limit * page,
                                  currentPage: page
                                })
                              }>
                              {page}
                            </a>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                  <div className="w-4/12 px-5">
                    <h3 className="text-xl">Permissions</h3>
                    <div className="flex justify-start mt-3">
                      <div>
                        <div className="form-check py-2">
                          <input
                            checked={activePermissions.includes("read") ? true : false}
                            className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                            type="checkbox"
                            value="read"
                            id="permissionRead"
                            name="permissionRead"
                            onClick={() => updatePermissions("read")}
                          />
                          <label className="form-check-label inline-block text-gray-800" htmlFor="permissionRead">
                            Read
                          </label>
                        </div>
                        <div className="form-check py-2">
                          <input
                            checked={activePermissions.includes("create") ? true : false}
                            className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                            type="checkbox"
                            value="create"
                            id="permissionCreate"
                            name="permissionCreate"
                            onClick={() => updatePermissions("create")}
                          />
                          <label className="form-check-label inline-block text-gray-800" htmlFor="permissionCreate">
                            Create
                          </label>
                        </div>
                        <div className="form-check py-2">
                          <input
                            checked={activePermissions.includes("update") ? true : false}
                            className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                            type="checkbox"
                            value="update"
                            id="permissionUpdate"
                            name="permissionUpdate"
                            onClick={() => updatePermissions("update")}
                          />
                          <label className="form-check-label inline-block text-gray-800" htmlFor="permissionUpdate">
                            Update
                          </label>
                        </div>
                        <div className="form-check py-2">
                          <input
                            checked={activePermissions.includes("delete") ? true : false}
                            className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                            type="checkbox"
                            value="delete"
                            id="permissionDelete"
                            name="permissionDelete"
                            onClick={() => updatePermissions("delete")}
                          />
                          <label className="form-check-label inline-block text-gray-800" htmlFor="permissionDelete">
                            Delete
                          </label>
                        </div>
                        <div id="send_permission_btn" className="flex flex-row flex-nowrap justify-center  mt-5">
                          <div className=" w-11/12">
                            <button
                              onClick={() => sendPermissions()}
                              type="button"
                              className="mb-2 w-full inline-block px-6 py-2.5 bg-slate-700 text-white font-medium text-xs leading-normal uppercase rounded shadow-md hover:bg-slate-800 hover:shadow-lg focus:bg-slate-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-slate-800 active:shadow-lg transition duration-150 ease-in-out">
                              Update
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row justify-between mt-20">
                  <div className="w-4/12">
                    <h2 className="text-slate-800 text-2xl">API Keys</h2>
                    <p className="text-slate-400">Manage api keys, generate or remove an api key</p>
                  </div>
                  <div className="w-3/12">
                    <button
                      onClick={() => generateApiKey()}
                      className=" flex flex-row bg-emerald-600 font-josefin text-white rounded-2xl px-7 py-2 mt-3 justify-self-end transition hover:bg-emerald-500 ">
                      <span className="pt-1">
                        <FiPlusCircle />
                      </span>
                      <span className="ml-2">Generate</span>
                    </button>
                  </div>
                </div>
                <div className="w-11/12">
                  <ul>
                    {fetchedApiKeys.map((apiKey, index) => {
                      return (
                        <li
                          key={`apikey_${index}`}
                          className="grid grid-col-6 place-content-between my-2 py-2 px-5 rounded-xl border-y border-gray-200 shadow-md text-black bg-slate-200 hover:bg-slate-300">
                          <p className="col-start-1 col-end-4"> {apiKey.key} </p>
                          <a
                            onClick={() => removeApiKey(apiKey._id)}
                            href="#"
                            className="col-start-5 col-end-6 text-2xl">
                            <FiTrash2 />
                          </a>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </div>
            ) : (
              "You don't have permission to change settings."
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
