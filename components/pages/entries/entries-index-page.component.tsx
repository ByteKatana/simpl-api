"use client"

//Utility
import { FiEdit, FiTrash2 } from "react-icons/fi"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import Tippy from "@tippyjs/react"
import { useSession } from "next-auth/react"

//React
import { useEffect, useState } from "react"

//Components
import Menu from "@/components/dashboard/menu"

//Interfaces
import { Entry, PermissionGroup } from "@/interfaces"

//Styles
import "tippy.js/dist/tippy.css"
import deleteEntryTypeAction from "@/lib/actions/dashboard/entry-types/delete-entry-type"
import deleteEntryAction from "@/lib/actions/dashboard/entries/delete-entry"

//===============================================

export default function EntriesIndexPage({
  fetchedEntries,
  fetchedPermGroups
}: {
  fetchedEntries: Entry[]
  fetchedPermGroups: PermissionGroup[]
}) {
  const [searchKeyword, setSearchKeyword] = useState("")
  const [paginationState, setPaginationState] = useState({
    min: 0,
    max: 5,
    limit: 5,
    currentPage: 1,
    pages: []
  })

  const { data: session } = useSession()

  const deleteSwal = withReactContent(Swal)

  useEffect(() => {
    function calcPages() {
      const count = []
      for (let i = 1; i <= fetchedEntries.length / paginationState.limit + 1; i++) {
        count.push(i)
      }
      setPaginationState({ ...paginationState, pages: count })
    }

    calcPages()
  }, [fetchedEntries])

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

  const searchEntries = (event) => {
    setSearchKeyword(event.target.value)
  }

  const deleteEntry = async (id) => {
    const result = await deleteEntryAction(id)
    if (result.success) Swal.fire("Deleted!", "", "success")
    else Swal.fire("Failed to delete!", "", "error")
  }

  return (
    <div className="container ">
      <div className="grid grid-flow-col auto-cols-max h-screen w-screen">
        <Menu />
        <div className="grid grid-col-6 ml-10 mt-10 content-start place-content-around w-screen">
          <div className="col-start-1 col-end-2 ">
            <h1 className="text-6xl font-josefin">Entries</h1>
          </div>
          <div className="col-start-4 col-end-6 ">{/*Button placeholder*/}</div>
          <div className="col-start-4 col-end-6 my-7">
            <div className="flex justify-start">
              <div className="">
                <input
                  type="text"
                  className="form-control block w-full px-3 py-1.5 text-basefont-normaltext-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded-sm transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-slate-600 focus:outline-hidden"
                  id="search"
                  placeholder="Search"
                  onChange={(e) => {
                    searchEntries(e)
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
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {fetchedEntries
                  .filter((entry) => entry.name.includes(searchKeyword) || entry.namespace.includes(searchKeyword))
                  .slice(paginationState.min, paginationState.max)
                  .map((entry, index) => {
                    return (
                      <tr
                        key={index}
                        className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {paginationState.min + index + 1}
                        </td>
                        <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{entry.name}</td>
                        <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                          {entry.namespace}
                        </td>
                        <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-row text-2xl">
                            <div>
                              {checkPermission("update", entry.namespace) ? (
                                <Tippy content="Edit Entry" theme="translucent">
                                  <a
                                    href={`entries/edit/${entry._id}`}
                                    data-testid={`edit-entry-btn-${entry.slug}`}
                                    className="transition hover:text-amber-400">
                                    <FiEdit />
                                  </a>
                                </Tippy>
                              ) : (
                                ""
                              )}
                            </div>
                            <div className="ml-2">
                              {checkPermission("delete", entry.namespace) ? (
                                <Tippy content="Delete Entry" theme="translucent">
                                  <a
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
                                            void deleteEntry(entry._id)
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
                  {paginationState.pages.map((page, idx) => {
                    return (
                      <li key={idx} className={`page-item ${paginationState.currentPage === page ? "active" : null}  `}>
                        <a
                          className={`page-link relative block py-1.5 px-3 rounded border-0 ${
                            paginationState.currentPage === page
                              ? "bg-slate-900 text-white outline-hidden transition-all duration-300 rounded-sm  hover:text-white hover:bg-slate-600"
                              : "bg-transparent text-gray-800  outline-hidden transition-all duration-300 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none"
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
