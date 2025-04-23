// __tests__/components/Menu.test.tsx
import React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import Menu from "../../../../components/dashboard/menu"

// Mock next-auth
jest.mock("next-auth/react", () => {
  const originalModule = jest.requireActual("next-auth/react")
  return {
    ...originalModule,
    signIn: jest.fn(),
    signOut: jest.fn(),
    useSession: jest.fn()
  }
})

describe("Menu Component Integration Tests", () => {
  const mockUseSession = jest.requireMock("next-auth/react").useSession
  const mockSignIn = jest.requireMock("next-auth/react").signIn
  const mockSignOut = jest.requireMock("next-auth/react").signOut

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders login option when user is not authenticated", () => {
    // Mock unauthenticated session
    mockUseSession.mockReturnValue({
      data: null,
      status: "unauthenticated"
    })

    render(<Menu />)

    // Check that login link is displayed
    expect(screen.getByTestId("login")).toBeInTheDocument()
    expect(screen.queryByTestId("logout")).not.toBeInTheDocument()
  })

  it("renders user info and logout option when user is authenticated", () => {
    // Mock authenticated session
    mockUseSession.mockReturnValue({
      data: {
        user: {
          username: "testuser",
          permission_group: "member",
          name: "Test User",
          email: "test@example.com",
          image: "test.jpg"
        },
        expires: "1"
      },
      status: "authenticated"
    })

    render(<Menu />)

    // Check that username and logout are displayed
    expect(screen.getByText("testuser")).toBeInTheDocument()
    expect(screen.getByTestId("logout")).toBeInTheDocument()
    expect(screen.queryByTestId("login")).not.toBeInTheDocument()
  })

  it("calls signIn function when login is clicked", async () => {
    // Mock unauthenticated session
    mockUseSession.mockReturnValue({
      data: null,
      status: "unauthenticated"
    })

    render(<Menu />)

    const user = userEvent.setup()
    const loginButton = screen.getByTestId("login")
    await user.click(loginButton)

    expect(mockSignIn).toHaveBeenCalled()
  })

  it("calls signOut function when logout is clicked", async () => {
    // Mock authenticated session
    mockUseSession.mockReturnValue({
      data: {
        user: {
          username: "testuser",
          permission_group: "member",
          name: "Test User",
          email: "test@example.com",
          image: "test.jpg"
        },
        expires: "1"
      },
      status: "authenticated"
    })

    render(<Menu />)

    const user = userEvent.setup()
    const logoutButton = screen.getByTestId("logout")
    await user.click(logoutButton)

    expect(mockSignOut).toHaveBeenCalled()
  })

  it("renders admin settings link when user has admin permission", () => {
    // Mock authenticated admin session
    mockUseSession.mockReturnValue({
      data: {
        user: {
          username: "adminuser",
          permission_group: "admin",
          name: "Admin User",
          email: "admin@example.com",
          image: "admin.jpg"
        },
        expires: "1"
      },
      status: "authenticated"
    })

    render(<Menu />)

    // Check that the settings link is displayed for admin
    expect(screen.getByTestId("settings")).toBeInTheDocument()
  })

  it("does not render admin settings link for non-admin users", () => {
    // Mock authenticated non-admin session
    mockUseSession.mockReturnValue({
      data: {
        user: {
          username: "regularuser",
          permission_group: "member",
          name: "Regular User",
          email: "regular@example.com",
          image: "regular.jpg"
        },
        expires: "1"
      },
      status: "authenticated"
    })

    render(<Menu />)

    // Check that the settings link is not displayed for non-admin
    expect(screen.queryByTestId("settings")).not.toBeInTheDocument()
  })

  it("navigates to dashboard pages when links are clicked", () => {
    // Mock authenticated session
    mockUseSession.mockReturnValue({
      data: {
        user: {
          username: "testuser",
          permission_group: "member",
          name: "Test User",
          email: "test@example.com",
          image: "test.jpg"
        },
        expires: "1"
      },
      status: "authenticated"
    })

    render(<Menu />)

    // Check that all navigation links have correct hrefs
    expect(screen.getByTestId("dashboard")).toHaveAttribute("href", "/dashboard")
    expect(screen.getByTestId("entryTypes")).toHaveAttribute("href", "/dashboard/entry-types")
    expect(screen.getByTestId("entries")).toHaveAttribute("href", "/dashboard/entries")
    expect(screen.getByTestId("users")).toHaveAttribute("href", "/dashboard/users")
  })
})
