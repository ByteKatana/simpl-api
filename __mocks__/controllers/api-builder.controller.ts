export const apiBuilderController = jest
  .fn()
  .mockImplementation((routeType: string, collectionName: string, findWhere: any, routeData: any) => {
    return {
      routeType,
      collectionName,
      findWhere,
      routeData,
      fetchData: jest.fn().mockImplementation(async (_findType?: string) => {
        if (collectionName === "users") {
          const mockUsers = [
            { id: "1", username: "mock_user", permission_group: "admin", email: "mock1@test.com" },
            { id: "2", username: "mock_user", permission_group: "admin", email: "mock2@test.com" },
            { id: "3", username: "mock_user", permission_group: "admin", email: "mock3@test.com" },
            { id: "4", username: "other_user", permission_group: "editor", email: "other1@test.com" },
            { id: "5", username: "root_user", permission_group: "root", email: "root@test.com" }
          ]

          if (routeType === "index") {
            return mockUsers
          } else if (routeType === "single-param") {
            if (findWhere === "permission_group") {
              return mockUsers.filter((u) => u.permission_group === routeData)
            } else if (findWhere === "username") {
              return mockUsers.filter((u) => u.username === routeData)
            }
            return mockUsers
          }
          return []
        }

        const mockEntryTypes = [
          { id: "1", name: "Type 1", namespace: "test-entry-type", slug: "type-1" },
          { id: "2", name: "Type 2", namespace: "test-entry-type", slug: "type-2" },
          { id: "3", name: "Type 3", namespace: "newtest.newtest1", slug: "type-3" },
          { id: "4", name: "Type 4", namespace: "newtest.newtest1", slug: "type-4" },
          { id: "5", name: "Type 5", namespace: "other-namespace", slug: "type-5" }
        ]

        if (routeType === "index") {
          return mockEntryTypes
        } else if (routeType === "single-param") {
          if (routeData === "test-entry-type") {
            return mockEntryTypes.filter((et) => et.namespace === "test-entry-type")
          }
          return mockEntryTypes
        } else if (routeType === "multi-param") {
          const ns = Array.isArray(routeData) ? routeData.join(".") : routeData
          return mockEntryTypes.filter((et) => et.namespace === ns)
        }
        return []
      })
    }
  })
