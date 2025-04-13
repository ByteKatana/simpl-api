import "@testing-library/jest-dom"
import { PermissionGroup } from "../../interfaces"
import { PermissionGroupController } from "../../controllers/permission-group.controller"

describe("Check if permission group controller handles actions properly", () => {
  let permissionGroupController: PermissionGroupController
  let permGroupData: PermissionGroup
  let permGroupId: string

  afterAll(() => {
    jest.clearAllMocks()
  })

  it("Check if permission group created properly", async () => {
    permGroupData = {
      name: "editors",
      slug: "editors",
      privileges: []
    }
    permissionGroupController = new PermissionGroupController(permGroupData, true)
    const createPermGroup = await permissionGroupController.create()

    expect(createPermGroup.result).toEqual({ status: "success", message: "Permission group has been created." })
    permGroupId = createPermGroup.permGroupId
  })
  it("Check if permission group updated properly", async () => {
    permGroupData = {
      name: "editors1",
      slug: "editors1",
      privileges: []
    }
    permissionGroupController = new PermissionGroupController(permGroupData, true)
    const updatePermGroup = await permissionGroupController.update(permGroupId)

    expect(updatePermGroup).toEqual({ status: "success", message: "Permission group has been updated." })
  })
  it("Check if permission group deleted properly", async () => {
    permGroupData = {
      name: "editors1",
      slug: "editors1",
      privileges: []
    }
    permissionGroupController = new PermissionGroupController(permGroupData, true)
    const deletePermGroup = await permissionGroupController.delete(permGroupId)

    expect(deletePermGroup).toEqual({ status: "success", message: "Permission group has been deleted." })
  })
})
