//Components
import Menu from "../../components/dashboard/menu"
import ContentCard from "../../components/dashboard/content-card"

export default function Index() {
  return (
    <div className="container ">
      <div className="grid grid-flow-col auto-cols-max h-screen w-screen">
        <Menu />
        <div className="grid grid-col-6 ml-10 place-content-center  w-screen">
          <div data-testid="entry-types-card" className="col-start-1 col-end-2 ">
            <ContentCard
              img="entry_types.png"
              img_width="325"
              content={
                <div className="grid w-52">
                  <h1 className="py-5 font-josefin text-2xl text-slate-900 w-64 ">Entry Types</h1>
                  <p>This is a test content</p>
                  <button className="bg-slate-900 font-josefin text-white rounded-2xl px-5 py-2 mt-7 justify-self-end transition hover:bg-slate-800">
                    <span>View</span>
                  </button>
                </div>
              }
            />
          </div>
          <div data-testid="entries-card" className="col-start-4 col-end-6 ">
            <ContentCard
              img="entries.png"
              img_width="400"
              content={
                <div className="grid w-52">
                  <h1 className="py-5 font-josefin text-2xl text-slate-900 ">Entries</h1>
                  <p>This is a test content</p>
                  <button className="bg-slate-900 font-josefin text-white rounded-2xl px-5 py-2 mt-7 justify-self-end transition hover:bg-slate-800">
                    <span>View</span>
                  </button>
                </div>
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}
