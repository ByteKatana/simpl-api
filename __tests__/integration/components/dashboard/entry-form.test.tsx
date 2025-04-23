// __tests__/components/EntryForm.test.tsx
import React from "react"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import EntryForm from "../../../../components/dashboard/entry-form"
import { EntryType } from "../../../../interfaces"
import mockRouter from "next-router-mock"

// Create manual mock for useSaveData hook
const mockSaveDataFn = jest.fn()
jest.mock("../../../../hooks/use-save-data", () => {
  return jest.fn().mockImplementation(() => mockSaveDataFn)
})

//Mock next/router
jest.mock("next/router", () => ({
  ...jest.requireActual("next-router-mock"),
  default: {
    push: jest.fn()
  },
  useRouter: () => ({
    ...mockRouter,
    query: { slug: "test-slug" },
    push: jest.fn()
  })
}))

// Mock SweetAlert2
jest.mock("sweetalert2-react-content", () => {
  return jest.fn().mockImplementation(() => ({
    fire: jest.fn().mockResolvedValue({
      isConfirmed: false,
      isDenied: false
    })
  }))
})

jest.mock("sweetalert2", () => ({
  fire: jest.fn()
}))

describe("EntryForm Component Integration Tests", () => {
  const mockFetchedEntryType: EntryType = {
    name: "AnotherType",
    namespace: "anothertype",
    fields: [
      {
        another_field: {
          value_type: "string",
          form_type: "input",
          length: "75"
        }
      }
    ]
  }

  const mockEntry = {
    name: "Test Entry",
    slug: "test-entry",
    namespace: "anothertype",
    another_field: "Sample text"
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockSaveDataFn.mockResolvedValue({ status: "success", message: "Entry created" })
  })

  test("renders correctly in create mode", () => {
    render(<EntryForm dataType="ENTRY" actionType="CREATE" fetchedEntryType={mockFetchedEntryType} />)

    expect(screen.getByLabelText(/Entry Name/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /CREATE/i })).toBeInTheDocument()
  })

  test("renders correctly in update mode with prefilled values", () => {
    render(
      <EntryForm
        dataType="ENTRY"
        actionType="UPDATE"
        fetchedEntryType={mockFetchedEntryType}
        fetchedEntry={mockEntry}
      />
    )

    const nameInput = screen.getByLabelText(/Entry Name/i)
    expect(nameInput).toBeInTheDocument()
    expect(nameInput).toHaveValue("Test Entry")
    expect(screen.getByRole("button", { name: /UPDATE/i })).toBeInTheDocument()
  })

  test("shows validation errors when submitting an empty form", async () => {
    render(<EntryForm dataType="ENTRY" actionType="CREATE" fetchedEntryType={mockFetchedEntryType} />)

    const submitButton = screen.getByRole("button", { name: /CREATE/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/This field is required/i)).toBeInTheDocument()
    })
  })

  test("handles input change and validation correctly", async () => {
    render(<EntryForm dataType="ENTRY" actionType="CREATE" fetchedEntryType={mockFetchedEntryType} />)

    const nameInput = screen.getByLabelText(/Entry Name/i)

    // Test empty field validation
    fireEvent.blur(nameInput)
    await waitFor(() => {
      expect(screen.getByText(/This field is required/i)).toBeInTheDocument()
    })

    // Test input validation passes when value is entered
    await userEvent.type(nameInput, "New Test Entry")
    fireEvent.blur(nameInput)

    await waitFor(() => {
      expect(screen.queryByText(/This field is required/i)).not.toBeInTheDocument()
    })
  })

  test("calls saveData hook with correct parameters when form is valid", async () => {
    mockSaveDataFn.mockResolvedValue({ status: "success", message: "Entry created" })

    render(<EntryForm dataType="ENTRY" actionType="CREATE" fetchedEntryType={mockFetchedEntryType} />)

    const nameInput = screen.getByLabelText(/Entry Name/i)
    await userEvent.type(nameInput, "New Test Entry")

    // Fill in the required another_field
    const textFieldInput = screen.getByLabelText(/another_field/i)
    await userEvent.type(textFieldInput, "Some text value")

    const submitButton = screen.getByRole("button", { name: /CREATE/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockSaveDataFn).toHaveBeenCalled()
      expect(mockSaveDataFn.mock.calls[0][0].formValues).toHaveProperty("name", "New Test Entry")
      expect(mockSaveDataFn.mock.calls[0][0].formValues).toHaveProperty("another_field", "Some text value")
    })
  })

  test("shows loading state during form submission", async () => {
    // Mock delayed response
    mockSaveDataFn.mockImplementation(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ status: "success", message: "Entry created" })
        }, 100)
      })
    })

    render(<EntryForm dataType="ENTRY" actionType="CREATE" fetchedEntryType={mockFetchedEntryType} />)

    const nameInput = screen.getByLabelText(/Entry Name/i)
    await userEvent.type(nameInput, "New Test Entry")

    const textFieldInput = screen.getByLabelText(/another_field/i)
    await userEvent.type(textFieldInput, "Some text value")

    const submitButton = screen.getByRole("button", { name: /CREATE/i })
    fireEvent.click(submitButton)

    // Check that loading indicator is shown
    expect(screen.getByText(/PROCESSING/i)).toBeInTheDocument()
  })

  test("calls saveData and displays success message", async () => {
    mockSaveDataFn.mockResolvedValue({ status: "success", message: "Entry created" })

    const mockSwalFire = jest.fn().mockResolvedValue({
      isConfirmed: false,
      isDenied: false
    })

    jest.requireMock("sweetalert2-react-content").mockReturnValue({
      fire: mockSwalFire
    })

    render(<EntryForm dataType="ENTRY" actionType="CREATE" fetchedEntryType={mockFetchedEntryType} />)

    // Fill and submit the form
    const nameInput = screen.getByLabelText(/Entry Name/i)
    await userEvent.type(nameInput, "New Test Entry")

    const textFieldInput = screen.getByLabelText(/another_field/i)
    await userEvent.type(textFieldInput, "Some text value")

    const submitButton = screen.getByRole("button", { name: /CREATE/i })
    fireEvent.click(submitButton)

    // Verify that saveData was called and the success message was displayed
    await waitFor(() => {
      expect(mockSaveDataFn).toHaveBeenCalled()
      expect(mockSwalFire).toHaveBeenCalledWith(
        expect.objectContaining({
          title: expect.stringContaining("Entry created"),
          icon: "success"
        })
      )
    })
  })

  test("shows error message when form submission fails", async () => {
    mockSaveDataFn.mockResolvedValue({ status: "failed", message: "Entry creation failed" })

    // Setup SweetAlert mock for this specific test
    const mockSwalFire = jest.fn().mockResolvedValue({
      isConfirmed: true,
      isDenied: false
    })

    jest.requireMock("sweetalert2-react-content").mockReturnValue({
      fire: mockSwalFire
    })

    render(<EntryForm dataType="ENTRY" actionType="CREATE" fetchedEntryType={mockFetchedEntryType} />)

    const nameInput = screen.getByLabelText(/Entry Name/i)
    await userEvent.type(nameInput, "New Test Entry")

    const textFieldInput = screen.getByLabelText(/another_field/i)
    await userEvent.type(textFieldInput, "Some text value")

    const submitButton = screen.getByRole("button", { name: /CREATE/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockSaveDataFn).toHaveBeenCalled()
      expect(mockSwalFire).toHaveBeenCalledWith(
        expect.objectContaining({
          title: expect.stringContaining("Entry creation failed"),
          icon: "error"
        })
      )
    })
  })
})
