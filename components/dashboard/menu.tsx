//Auth
import { signIn, signOut, useSession } from "next-auth/react"

//Utility
import {
	FiHome,
	FiBox,
	FiFileText,
	FiUsers,
	FiUser,
	FiSettings,
	FiLogIn,
	FiLogOut
} from "react-icons/fi"

export default function Menu() {
	const { data: session } = useSession()

	const checkPermGroup = (permGroup: string) => {
		if (session) {
			if (session.user.permission_group === permGroup) return true
		}
		return false
	}

	return (
		<div className="flex flex-nowrap flex-col w-64 font-josefin bg-gradient-to-t from-slate-900 to-slate-700 ">
			<div className="text-white hover:text-yellow-500 h-24 font-raleway text-5xl pl-5 pt-5">
				<a href="#">simpl:api</a>
			</div>
			<div className="text-white h-80 grow text-2xl list-none">
				<li className="pt-5 px-5">
					<a
						href="/dashboard"
						className="flex flex-row py-5 px-5 w-48 hover:bg-gray-900 hover:rounded-2xl hover:bg-gradient-to-tl from-neutral-200 to-neutral-50 hover:text-slate-900 ">
						<FiHome /> <span className="ml-2">Dasboard</span>
					</a>
				</li>
				<li className="pt-5 pl-5">
					<a
						href="/dashboard/entry-types"
						className="flex flex-row py-5 px-5 w-52 hover:bg-gray-900 hover:rounded-2xl hover:bg-gradient-to-tl from-neutral-200 to-neutral-50 hover:text-slate-900 ">
						<FiBox /> <span className="ml-2">Entry Types</span>
					</a>
				</li>
				<li className="pt-5 pl-5">
					<a
						href="/dashboard/entries"
						className="flex flex-row py-5 px-5 w-48 hover:bg-gray-900 hover:rounded-2xl hover:bg-gradient-to-tl from-neutral-200 to-neutral-50 hover:text-slate-900 ">
						<FiFileText /> <span className="ml-2">Entries</span>
					</a>
				</li>
				<li className="pt-5 pl-5">
					<a
						href="/dashboard/users"
						className="flex flex-row py-5 px-5 w-48 hover:bg-gray-900 hover:rounded-2xl hover:bg-gradient-to-tl from-neutral-200 to-neutral-50 hover:text-slate-900 ">
						<FiUsers /> <span className="ml-2">Users</span>
					</a>
				</li>
				{checkPermGroup("admin") ? (
					<li className="pt-5 pl-5">
						<a
							href="/dashboard/settings"
							className="flex flex-row py-5 px-5 w-48 hover:bg-gray-900 hover:rounded-2xl hover:bg-gradient-to-tl from-neutral-200 to-neutral-50 hover:text-slate-900 ">
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
						<a href="#" onClick={() => signOut()} className="flex flex-row hover:text-red-500">
							<FiLogOut /> <span className="ml-2">Log out</span>
						</a>
					</div>
				) : (
					<div>
						<a href="#" onClick={() => signIn()} className="flex flex-row hover:text-red-500">
							<FiLogIn /> <span className="ml-2">Log In</span>
						</a>
					</div>
				)}
			</div>
		</div>
	)
}
