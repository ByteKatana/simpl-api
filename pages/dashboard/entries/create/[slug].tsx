//Utility
import axios from "axios"
import { useSession } from "next-auth/react"
import checkPermission from "../../../../lib/ui/check-permission"

//Components
import Menu from "../../../../components/dashboard/menu"
import EntryForm from "../../../../components/dashboard/entry-form"

//Interfaces
import { EntryType } from "../../../../interfaces"

//===============================================

export async function getServerSideProps(req) {
  const { slug } = req.query

  const res = await axios.get(`${process.env.BASE_URL}/api/v1/entry-type/slug/${slug}?apikey=${process.env.API_KEY}`)
  const entryType: EntryType = await res.data

  const resPermGroups = await axios.get(
    `${process.env.BASE_URL}/api/v1/permission-groups/?apikey=${process.env.API_KEY}`
  )
  const permGroups = await resPermGroups.data

  return {
    props: {
      fetchedEntryType: entryType,
      fetchedPermGroups: permGroups
    }
  }
}

export default function CreateEntry({ fetchedEntryType, fetchedPermGroups }) {
  //Auth Session
  const { data: session } = useSession()

  return (
    <div className="container ">
      <div className="grid grid-flow-col auto-cols-max h-screen w-screen">
        <Menu />
        <div className="grid grid-col-6 ml-10 mt-10 content-start place-content-around w-screen">
          <div className="col-start-1 col-end-2 ">
            <h1 className="text-6xl font-josefin">New Entry: {fetchedEntryType[0].name} </h1>
          </div>
          <div className="col-start-4 col-end-6 "></div>
          <div className="col-start-1 col-end-6 w-10/12 mt-10 ">
            {checkPermission(fetchedPermGroups, session, "create", fetchedEntryType[0].namespace) ? (
              <EntryForm dataType="ENTRY" actionType="CREATE" fetchedEntryType={fetchedEntryType[0]} />
            ) : (
              "You don't have permission to do this"
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
