"use client"

//Auth
import { signIn, useSession } from "next-auth/react"

//Utility
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"

export default function IndexPage() {
  const { data: session } = useSession()

  return (
    <div className="container ">
      <div className="grid grid-flow-col auto-cols-max h-screen w-screen">
        <div className="grid grid-col-6 place-content-center  w-screen">
          <div className="col-start-1 col-end-6">
            <h1 className="text-9xl text-slate-800  hover:text-yellow-500 h-24 font-raleway mb-7">simpl:api</h1>
          </div>
          {session ? (
            <>
              <div className="col-start-1 col-end-3 mr-5 ">
                <div className="mt-5">
                  <a href="/dashboard">
                    <button
                      type="button"
                      className="flex flex-row items-center justify-center mb-2 w-full p-6 bg-slate-700 text-white font-josefin text-xl leading-normal uppercase rounded-sm shadow-md hover:bg-white hover:border-2 hover:border-slate-800 hover:text-slate-800 transition duration-150 ease-in-out">
                      <FiChevronLeft className="text-2xl" />
                      <span className="ml-3">Dashboard</span>
                    </button>
                  </a>
                </div>
              </div>
              <div className="col-start-3 col-end-6 ">
                <div className="mt-5">
                  <a href="https://bytekatana.github.io/simpl-api-doc/">
                    <button
                      type="button"
                      className="flex flex-row items-center justify-center mb-2 w-full p-6 bg-slate-700 text-white font-josefin text-xl leading-normal uppercase rounded-sm shadow-md hover:bg-white hover:border-2 hover:border-slate-800 hover:text-slate-800 transition duration-150 ease-in-out">
                      <span className="mr-3">Doc</span> <FiChevronRight className="text-2xl" />
                    </button>
                  </a>
                </div>
              </div>
            </>
          ) : (
            <div className="col-start-2 col-end-5 ">
              <div className="mt-5">
                <button
                  type="button"
                  onClick={() => signIn()}
                  className="flex flex-row items-center justify-center mb-2 w-full p-6 bg-slate-700 text-white font-josefin text-xl leading-normal uppercase rounded-sm shadow-md hover:bg-white hover:border-2 hover:border-slate-800 hover:text-slate-800 transition duration-150 ease-in-out">
                  <span className="mr-3">Login</span> <FiChevronRight className="text-2xl" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
