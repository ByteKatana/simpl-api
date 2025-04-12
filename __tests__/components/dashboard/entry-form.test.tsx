import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import EntryField from "../../../components/dashboard/entry-field"
import EntryForm from "../../../components/dashboard/entry-form"
import { ActionType, DataType, Entry, EntryType } from "../../../interfaces"
import { userEvent } from "@testing-library/user-event"

jest.mock("next/router", () => require("next-router-mock"))

describe("Check if EntryForm component render properly", () => {
  it("Render Entry Form properly with its field", () => {
    const mockDataType: DataType = "ENTRY"
    const mockActionType: ActionType = "CREATE"
    const mockFetchedEntryType: EntryType = {
      name: "mockType",
      namespace: "mocktype",
      fields: [
        {
          mock_field: {
            value_type: "string",
            form_type: "textarea",
            length: "101"
          }
        }
      ]
    }
    const mockEntry: Entry = {
      name: "mock Entry",
      slug: "mock-entry",
      namespace: "mocktype",
      mock_field: "hello world"
    }
    const entryForm = render(
      <EntryForm
        dataType={mockDataType}
        actionType={mockActionType}
        fetchedEntryType={mockFetchedEntryType}
        fetchedEntry={mockEntry}
      />
    )

    const mockField = entryForm.getByText("Mock_field")
    const submitButton = entryForm.getByRole("button", { name: "CREATE" })
    expect(entryForm.getByText("Entry Name")).toBeInTheDocument()
    expect(mockField).toBeInTheDocument()
    expect(submitButton).toBeInTheDocument()
  })
})
