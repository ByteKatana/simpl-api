//Utility
import axios, { AxiosResponse } from "axios"
import { FiEdit, FiFileText, FiPlusCircle, FiTrash2 } from "react-icons/fi"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import Tippy from "@tippyjs/react"
import { useSession } from "next-auth/react"

//React
import { useEffect, useState } from "react"

//Components
import Menu from "../../../components/dashboard/menu"

//Interfaces
import { EntryType } from "../../../interfaces"

//Styles
import "tippy.js/dist/tippy.css"

//===============================================

export async function getServerSideProps() {
  const res = await axios.get(`${process.env.BASE_URL}/api/v1/entry-types?apikey=${process.env.API_KEY}`)
  const entryTypes: EntryType = await res.data

  const resPermGroups = await axios.get(
    `${process.env.BASE_URL}/api/v1/permission-groups/?apikey=${process.env.API_KEY}`
  )
  const permGroups = await resPermGroups.data

  return {
    props: {
      fetchedEntryTypes: entryTypes,
      fetchedPermGroups: permGroups
    }
  }
}

export default function EntryTypes({ fetchedEntryTypes, fetchedPermGroups }) {
  const [searchKeyword, setSearchKeyword] = useState("")
  const [paginationState, setPaginationState] = useState({
    min: 0,
    max: 10,
    limit: 10,
    currentPage: 1,
    pages: []
  })

  const { data: session } = useSession()

  const deleteSwal = withReactContent(Swal)

  useEffect(() => {
    function calcPages() {
      const count = []
      for (let i = 1; i <= fetchedEntryTypes.length / paginationState.limit + 1; i++) {
        count.push(i)
      }
      setPaginationState({ ...paginationState, pages: count })
    }

    calcPages()
  }, [fetchedEntryTypes])

  const checkPermission = (permission, namespace) => {
    if (session) {
      const permGroup = fetchedPermGroups.find((group) => group.slug === session.user.permission_group)
      if (permGroup.privileges.find((privilege) => Object.keys(privilege).includes(`${namespace}`))) {
        const result = permGroup.privileges
          .find((privilege) => Object.keys(privilege).includes(`${namespace}`))
          [`${namespace}`].permissions.includes(`${permission}`)

        return result
      }
      return false
    }
  }

  const checkPermGroup = (permGroup: string) => {
    if (session) {
      if (session.user.permission_group === permGroup) return true
    }
    return false
  }

  const searchEntryType = (event) => {
    setSearchKeyword(event.target.value)
  }

  const deleteEntryType = async (id) => {
    let result
    await axios
      .delete(
        `${process.env.baseUrl}/api/v1/entry-type/delete/${id}?apikey=${process.env.apiKey}&secretkey=${process.env.secretKey}`
      )
      .then((res: AxiosResponse) => {
        result = res.data
      })
      .catch((e: unknown) => {
        console.log(e)
      })

    if (result.status === "success") Swal.fire("Deleted!", "", "success")
    else if (result.status === "failed") Swal.fire("Failed to delete!", "", "error")
    else console.log("Something went wrong! Unexpected result status!")
  }

  return (
    <div className="container ">
      <div className="grid grid-flow-col auto-cols-max h-screen w-screen">
        <Menu />
        <div className="grid grid-col-6 ml-10 mt-10 content-start place-content-around w-screen">
          <div className="col-start-1 col-end-2 ">
            <h1 className="text-6xl font-josefin">Entry Types</h1>
          </div>
          <div className="col-start-4 col-end-6 ">
            {checkPermGroup("admin") ? (
              <a href="entry-types/create">
                <button className=" flex flex-row bg-emerald-600 font-josefin text-white rounded-2xl px-7 py-2 mt-3 justify-self-end transition hover:bg-emerald-500 ">
                  <span className="pt-1">
                    <FiPlusCircle />
                  </span>
                  <span className="ml-2">Add</span>
                </button>
              </a>
            ) : (
              ""
            )}
          </div>
          <div className="col-start-4 col-end-6 my-7">
            <div className="flex justify-start">
              <div className="">
                <input
                  type="text"
                  className="form-control block w-full px-3 py-1.5 text-basefont-normaltext-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-slate-600 focus:outline-none"
                  id="search"
                  placeholder="Search"
                  onChange={(e) => {
                    searchEntryType(e)
                  }}
                />
              </div>
            </div>
          </div>
          <div className="col-start-1 col-end-6 w-10/12">
            <table className="min-w-full">
              <thead className="bg-white border-b">
                <tr>
                  <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                    #
                  </th>
                  <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                    Name
                  </th>
                  <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                    Namespace
                  </th>
                  <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {fetchedEntryTypes
                  .filter(
                    (entryType) => entryType.name.includes(searchKeyword) || entryType.namespace.includes(searchKeyword)
                  )
                  .slice(paginationState.min, paginationState.max)
                  .map((entryType, index) => {
                    return (
                      <tr
                        key={index}
                        className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {paginationState.min + index + 1}
                        </td>
                        <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                          {entryType.name}
                        </td>
                        <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                          {entryType.namespace}
                        </td>
                        <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-row text-2xl">
                            <div>
                              {checkPermission("create", entryType.namespace) ? (
                                <Tippy content="Create Entry" theme="translucent">
                                  <a
                                    data-test-id="create-entry-btn"
                                    href={`entries/create/${entryType.slug}`}
                                    className="transition hover:text-amber-400">
                                    <FiFileText />
                                  </a>
                                </Tippy>
                              ) : (
                                ""
                              )}
                            </div>
                            <div className="ml-2">
                              {checkPermission("update", entryType.namespace) ? (
                                <Tippy content="Edit Entry Type" theme="translucent">
                                  <a
                                    data-testid={`edit-entry-type-btn-${entryType.slug}`}
                                    href={`entry-types/edit/${entryType._id}`}
                                    className="transition hover:text-amber-400">
                                    <FiEdit />
                                  </a>
                                </Tippy>
                              ) : (
                                ""
                              )}
                            </div>
                            <div className="ml-2">
                              {checkPermission("delete", entryType.namespace) ? (
                                <Tippy content="Delete Entry Type" theme="translucent">
                                  <a
                                    data-testid="delete-entry-type-btn"
                                    href="#"
                                    onClick={() =>
                                      deleteSwal
                                        .fire({
                                          title: "Do you really want to delete this item?",
                                          icon: "warning",
                                          showDenyButton: false,
                                          showCancelButton: true,
                                          confirmButtonText: "Yes",
                                          denyButtonText: "No",
                                          confirmButtonColor: "#EF4444"
                                        })
                                        .then((result) => {
                                          if (result.isConfirmed) {
                                            void deleteEntryType(entryType._id)
                                          }
                                        })
                                    }
                                    className="transition hover:text-red-500">
                                    <FiTrash2 />
                                  </a>
                                </Tippy>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>
          <div className="col-start-1 col-end-6 w-9/12 mt-10 justify-items-center">
            <div className="flex justify-center">
              <nav aria-label="Page navigation example">
                <ul className="flex list-style-none">
                  {paginationState.pages.map((page) => {
                    return (
                      <li className={`page-item ${paginationState.currentPage === page ? "active" : null}  `}>
                        <a
                          className={`page-link relative block py-1.5 px-3 rounded border-0 ${
                            paginationState.currentPage === page
                              ? "bg-slate-900 text-white outline-none transition-all duration-300 rounded  hover:text-white hover:bg-slate-600"
                              : "bg-transparent text-gray-800  outline-none transition-all duration-300 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none"
                          }  `}
                          href="#"
                          onClick={() => {
                            setPaginationState({
                              ...paginationState,
                              min: (page - 1) * paginationState.limit,
                              max: paginationState.limit * page,
                              currentPage: page
                            })
                          }}>
                          {page}
                        </a>
                      </li>
                    )
                  })}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
