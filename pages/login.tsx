import { getCsrfToken } from "next-auth/react"

export default function SignIn({ csrfToken }) {
	return (
		<form method="post" action="/api/auth/callback/credentials">
			<input name="csrfToken" type="hidden" defaultValue={csrfToken} />
			<div className="container ">
				<div className="grid grid-flow-col auto-cols-max h-screen w-screen">
					<div className="grid grid-col-6 ml-10 place-content-center  w-screen">
						<div className="col-start-2 col-end-4 ">
							<div className="flex flex-col border-2 bg-slate-200 p-10 rounded-xl">
								<div className="text-slate-800  hover:text-yellow-500 h-24 font-raleway text-6xl pl-7 mt-3">
									<a href="#">simpl:api</a>
								</div>
								<div>
									<label htmlFor="email" class="form-label inline-block mb-2 text-gray-700 text-xl">
										Email
									</label>
									<input
										id="email"
										name="email"
										type="text"
										className="form-control block w-full  px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-slate-600 focus:outline-none"
										placeholder="Email"
									/>
								</div>
								<div className="mt-5">
									<label
										htmlFor="password"
										class="form-label inline-block mb-2 text-gray-700 text-xl">
										Password
									</label>
									<input
										id="password"
										name="password"
										type="password"
										className="form-control block w-full  px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-slate-600 focus:outline-none"
										placeholder="Password"
									/>
								</div>
								<div className="mt-5">
									<button
										type="submit"
										className="mb-2 w-full inline-block px-6 py-2.5 bg-slate-700 text-white font-medium text-xs leading-normal uppercase rounded shadow-md hover:bg-slate-800 hover:shadow-lg focus:bg-slate-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-slate-800 active:shadow-lg transition duration-150 ease-in-out">
										Login
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</form>
	)
}

export async function getServerSideProps(context) {
	return {
		props: {
			csrfToken: await getCsrfToken(context)
		}
	}
}
