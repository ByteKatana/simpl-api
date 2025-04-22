import "@testing-library/jest-dom"
import { render } from "@testing-library/react"
import Menu from "../../../components/dashboard/menu"
import { useSession } from "next-auth/react"
jest.mock("next-auth/react")
describe("Check if Menu component rendered properly", () => {
  it("Menu rendered properly without session", () => {
    const mockUseSession = useSession as jest.Mock
    mockUseSession.mockReturnValue({
      data: null,
      status: "unauthenticated"
    })
    const menu = render(<Menu />)
    const dashboard = menu.getByTestId("dashboard")
    const entryTypes = menu.getByTestId("entryTypes")
    const entries = menu.getByTestId("entries")
    const users = menu.getByTestId("users")
    const login = menu.getByTestId("login")

    expect(dashboard).toBeInTheDocument()
    expect(entryTypes).toBeInTheDocument()
    expect(entries).toBeInTheDocument()
    expect(users).toBeInTheDocument()
    expect(login).toBeInTheDocument()
  })
  it("Menu rendered properly with session", () => {
    const mockUseSession = useSession as jest.Mock
    mockUseSession.mockReturnValue({
      data: {
        user: {
          username: "mock_user",
          permission_group: "mockgroup",
          name: "mock_user",
          email: "mock_user@test.lab",
          image: "mock_image"
        },
        expires: "2025-05-01T22:00:00.000Z" // ISO string
      },
      status: "authenticated"
    })
    const menu = render(<Menu />)
    const dashboard = menu.getByTestId("dashboard")
    const entryTypes = menu.getByTestId("entryTypes")
    const entries = menu.getByTestId("entries")
    const users = menu.getByTestId("users")
    const logout = menu.getByTestId("logout")

    expect(dashboard).toBeInTheDocument()
    expect(entryTypes).toBeInTheDocument()
    expect(entries).toBeInTheDocument()
    expect(users).toBeInTheDocument()
    expect(logout).toBeInTheDocument()
  })
  it("Menu rendered properly with admin session", () => {
    const mockUseSession = useSession as jest.Mock
    mockUseSession.mockReturnValue({
      data: {
        user: {
          username: "mock_user",
          permission_group: "admin",
          name: "mock_user",
          email: "mock_user@test.lab",
          image: "mock_image"
        },
        expires: "2025-05-01T22:00:00.000Z" // ISO string
      },
      status: "authenticated"
    })
    const menu = render(<Menu />)
    const dashboard = menu.getByTestId("dashboard")
    const entryTypes = menu.getByTestId("entryTypes")
    const entries = menu.getByTestId("entries")
    const users = menu.getByTestId("users")
    const settings = menu.getByTestId("settings")
    const logout = menu.getByTestId("logout")

    expect(dashboard).toBeInTheDocument()
    expect(entryTypes).toBeInTheDocument()
    expect(entries).toBeInTheDocument()
    expect(users).toBeInTheDocument()
    expect(settings).toBeInTheDocument()
    expect(logout).toBeInTheDocument()
  })
})
