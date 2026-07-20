export const apiBuilderController = jest
  .fn()
  .mockImplementation((routeType: string, collectionName: string, findWhere: any, routeData: any) => {
    return {
      routeType,
      collectionName,
      findWhere,
      routeData,
      fetchData: jest.fn().mockImplementation(async (_findType?: string) => {
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
