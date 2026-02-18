//Auth
import { SessionContextValue, signIn, signOut, useSession } from "next-auth/react"

//Utility
import { FiBox, FiFileText, FiHome, FiLogIn, FiLogOut, FiSettings, FiUser, FiUsers } from "react-icons/fi"

export default function Menu() {
  const { data: session }: SessionContextValue = useSession()

  const checkPermGroup = (permGroup: string) => {
    if (session) {
      if (session.user.permission_group === permGroup) return true
    }
    return false
  }

  return (
    <div
      data-testid="menu-component"
      className="flex flex-nowrap flex-col w-64 font-josefin bg-linear-to-t from-slate-900 to-slate-700 ">
      <div data-testid="menu-logo" className="text-white hover:text-yellow-500 h-24 font-raleway text-5xl pl-5 pt-5">
        <a href="#">simpl:api</a>
      </div>
      <div className="text-white h-80 grow text-2xl list-none">
        <li className="pt-5 px-5">
          <a
            href="/dashboard"
            data-testid={"dashboard"}
            className="flex flex-row py-5 px-5 w-48 hover:transition  hover:bg-gray-900 hover:rounded-2xl hover:bg-linear-to-tl from-neutral-200 to-neutral-50 hover:text-slate-900 ">
            <FiHome /> <span className="ml-2">Dasboard</span>
          </a>
        </li>
        <li className="pt-5 pl-5">
          <a
            href="/dashboard/entry-types"
            data-testid={"entryTypes"}
            className="flex flex-row py-5 px-5 w-52 hover:transition hover:bg-gray-900 hover:rounded-2xl hover:bg-linear-to-tl from-neutral-200 to-neutral-50 hover:text-slate-900 ">
            <FiBox /> <span className="ml-2">Entry Types</span>
          </a>
        </li>
        <li className="pt-5 pl-5">
          <a
            href="/dashboard/entries"
            data-testid={"entries"}
            className="flex flex-row py-5 px-5 w-48 hover:transition hover:bg-gray-900 hover:rounded-2xl hover:bg-linear-to-tl from-neutral-200 to-neutral-50 hover:text-slate-900 ">
            <FiFileText /> <span className="ml-2">Entries</span>
          </a>
        </li>
        <li className="pt-5 pl-5">
          <a
            href="/dashboard/users"
            data-testid={"users"}
            className="flex flex-row py-5 px-5 w-48 hover:transition hover:bg-gray-900 hover:rounded-2xl hover:bg-linear-to-tl from-neutral-200 to-neutral-50 hover:text-slate-900 ">
            <FiUsers /> <span className="ml-2">Users</span>
          </a>
        </li>
        {checkPermGroup("admin") ? (
          <li className="pt-5 pl-5">
            <a
              href="/dashboard/settings"
              data-testid={"settings"}
              className="flex flex-row py-5 px-5 w-48 hover:transition hover:bg-gray-900 hover:rounded-2xl hover:bg-linear-to-tl from-neutral-200 to-neutral-50 hover:text-slate-900 ">
              <FiSettings /> <span className="ml-2">Settings</span>
            </a>
          </li>
        ) : (
          ""
        )}
      </div>
      <div className="flex flex-row items-start h-24 text-white text-xl pl-7 pt-5 pb-2 ">
        <div className="text-5xl mt-1 mr-1">
          <FiUser />
        </div>

        {session ? (
          <div>
            <a href="#">{session.user.username} </a>
            <a href="#" data-testid={"logout"} onClick={() => signOut()} className="flex flex-row hover:text-red-500">
              <FiLogOut /> <span className="ml-2">Log out</span>
            </a>
          </div>
        ) : (
          <div>
            <a href="#" data-testid={"login"} onClick={() => signIn()} className="flex flex-row hover:text-red-500">
              <FiLogIn /> <span className="ml-2">Log In</span>
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
