import "@testing-library/jest-dom"
import checkPermGroup from "../../../lib/ui/check-perm-group"
import { Session } from "next-auth"

describe("Check Permission Group", () => {
  it("Without Session", () => {
    const result = checkPermGroup(null, "admin")
    expect(result).toBe(false)
  })
  it("With Session and correct permission group", () => {
    const mockSession: Session = {
      id: 123,
      user: {
        username: "mock_user",
        permission_group: "member",
        name: "mock_user",
        email: "mock_user@test.lab",
        image: "mock_image"
      },
      expires: ""
    }
    const result = checkPermGroup(mockSession, "member")
    expect(result).toBe(true)
  })
  it("With Session and wrong permission group", () => {
    const mockSession: Session = {
      id: 123,
      user: {
        username: "mock_user",
        permission_group: "member",
        name: "mock_user",
        email: "mock_user@test.lab",
        image: "mock_image"
      },
      expires: ""
    }
    const result = checkPermGroup(mockSession, "admin")
    expect(result).toBe(false)
  })
})
