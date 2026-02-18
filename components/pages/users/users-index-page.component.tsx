"use client"

//Utility
import { FiCheckCircle, FiEdit, FiPlusCircle, FiTrash2 } from "react-icons/fi"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import Tippy from "@tippyjs/react"
import { useSession } from "next-auth/react"

//React
import { useEffect, useState } from "react"

//Components
import Menu from "@/components/dashboard/menu"

//Interfaces
import { User } from "@/interfaces"

//Styles
import "tippy.js/dist/tippy.css"
import deleteUserAction from "@/lib/actions/dashboard/users/delete-user"

//===============================================

export default function UsersIndexPage({ fetchedUsers }: { fetchedUsers: User[] }) {
  const [searchKeyword, setSearchKeyword] = useState("")
  const [paginationState, setPaginationState] = useState({
    min: 0,
    max: 10,
    limit: 10,
    currentPage: 1,
    pages: []
  })

  const deleteSwal = withReactContent(Swal)

  //Auth Session
  const { data: session } = useSession()

  useEffect(() => {
    function calcPages() {
      const count = []
      for (let i = 1; i <= fetchedUsers.length / paginationState.limit + 1; i++) {
        count.push(i)
      }
      setPaginationState({ ...paginationState, pages: count })
    }
    calcPages()
  }, [fetchedUsers])

  const checkPermGroup = (permGroup: string) => {
    if (session) {
      if (session.user.permission_group === permGroup) return true
    }
    return false
  }

  const searchUser = (event) => {
    setSearchKeyword(event.target.value)
  }

  const deleteUser = async (id) => {
    const result = await deleteUserAction(id)
    if (result.success) Swal.fire("Deleted!", "", "success")
    else Swal.fire("Failed to delete!", "", "error")
  }

  return (
    <div className="container ">
      <div className="grid grid-flow-col auto-cols-max h-screen w-screen">
        <Menu />
        <div className="grid grid-col-6 ml-10 mt-10 content-start place-content-around w-screen">
          <div className="col-start-1 col-end-2 ">
            <h1 className="text-6xl font-josefin">Users</h1>
          </div>
          <div className="col-start-4 col-end-6 flex flex-row ">
            {checkPermGroup("admin") ? (
              <>
                <a href="users/create">
                  <button
                    data-testid="create-user-btn"
                    className=" flex flex-row bg-emerald-600 font-josefin text-white rounded-2xl px-7 py-2 mt-3 justify-self-end transition hover:bg-emerald-500 ">
                    <span className="pt-1">
                      <FiPlusCircle />
                    </span>
                    <span className="ml-2">Add</span>
                  </button>
                </a>
                <a href="permission-groups" className="ml-3">
                  <button className=" flex flex-row bg-sky-600 font-josefin text-white rounded-2xl px-7 py-2 mt-3 justify-self-end transition hover:bg-sky-500 ">
                    <span className="pt-1">
                      <FiCheckCircle />
                    </span>
                    <span className="ml-2">Permission Groups</span>
                  </button>
                </a>
              </>
            ) : (
              ""
            )}
          </div>
          <div className="col-start-4 col-end-6 my-7">
            <div className="flex justify-start">
              <div className="">
                <input
                  type="text"
                  className="form-control block w-full px-3 py-1.5 text-basefont-normaltext-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded-sm transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-slate-600 focus:outline-hidden"
                  id="search"
                  placeholder="Search"
                  onChange={(e) => {
                    searchUser(e)
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
                    Username
                  </th>
                  <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                    Email
                  </th>
                  <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                    Group
                  </th>
                  <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {fetchedUsers
                  .filter(
                    (user) =>
                      user.username.includes(searchKeyword) ||
                      user.email.includes(searchKeyword) ||
                      user.permission_group.includes(searchKeyword)
                  )
                  .slice(paginationState.min, paginationState.max)
                  .map((user, index) => {
                    return (
                      <tr
                        key={index}
                        className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {paginationState.min + index + 1}
                        </td>
                        <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                          {user.username}
                        </td>
                        <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{user.email}</td>
                        <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                          {user.permission_group}
                        </td>
                        <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-row text-2xl">
                            <div>
                              {checkPermGroup("admin") ? (
                                <Tippy content="Edit User" theme="translucent">
                                  <a
                                    data-testid={`edit-user-btn-${user.username}`}
                                    href={`users/edit/${user._id}`}
                                    className="transition hover:text-amber-400">
                                    <FiEdit />
                                  </a>
                                </Tippy>
                              ) : (
                                ""
                              )}
                            </div>
                            <div className="ml-2">
                              {checkPermGroup("admin") ? (
                                <Tippy content="Delete User" theme="translucent">
                                  <a
                                    href="#"
                                    data-testid={`delete-user-btn-${user.username}`}
                                    onClick={() =>
                                      deleteSwal
                                        .fire({
                                          title: "Do you really want to delete this user?",
                                          icon: "warning",
                                          showDenyButton: false,
                                          showCancelButton: true,
                                          confirmButtonText: "Yes",
                                          denyButtonText: "No",
                                          confirmButtonColor: "#EF4444"
                                        })
                                        .then((result) => {
                                          if (result.isConfirmed) {
                                            void deleteUser(user._id)
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
