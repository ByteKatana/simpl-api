import "@testing-library/jest-dom"
import { render } from "@testing-library/react"
import ContentCard from "../../../components/dashboard/content-card"

describe("Check if ContentCard component rendered properly", () => {
  it("Render content card with all required props", () => {
    const contentCard = render(<ContentCard img={"entry_types.png"} img_width={"325"} content={"Test Content"} />)
    const img = contentCard.getByTestId("img")
    const content = contentCard.getByTestId("content")
    expect(img).toBeInTheDocument()
    expect(content).toBeInTheDocument()
  })
})
