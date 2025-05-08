import { Then, When } from "@badeball/cypress-cucumber-preprocessor"

// Test data for permission group creation
const newPermissionGroup = {
  name: "Test Permission Group",
  slug: "test-permission-group"
}

// Modified permission group data for edit test
const modifiedPermissionGroup = {
  name: "Modified Permission Group",
  slug: "modified-permission-group"
}

// Scenario: visiting permission groups page
When("I visit permission groups page", () => {
  cy.visit("/dashboard/permission-groups")
  // Wait for the page to load completely
  cy.get("body").should("be.visible")
  cy.waitForRequest()
})

Then("I should see nav menu", () => {
  cy.get(`[data-testid='menu-component']`).should("be.visible")
})

Then("I should see create permission group button", () => {
  cy.getDataTest("perm_group_add_btn").should("be.visible")
})

Then("I should see permission groups table", () => {
  cy.get("table").should("be.visible")
})

// Scenario: adding permission groups
When("I click create permission group button", () => {
  cy.getDataTest("perm_group_add_btn").click()
  cy.waitForRequest()
})

Then("I should see permission group create form", () => {
  cy.contains("h1", "Create Permission Group", { matchCase: false }).should("be.visible")
  cy.get("form").should("be.visible")
})

When("I fill the permission group create form", () => {
  cy.get('input[name="name"]').type(newPermissionGroup.name)
})

Then("I should see create the button enabled", () => {
  cy.getDataTest("create_perm_group_btn").should("be.visible").and("not.be.disabled")
})

When("I click the create the button", () => {
  cy.getDataTest("create_perm_group_btn").as("createButton")

  cy.get("@createButton").should("exist").should("be.visible").should("not.be.disabled")

  cy.intercept("POST", `/api/v1/permission-group/create*`).as("createPermissionGroupRequest")

  cy.get("@createButton").click({ force: true })

  cy.getDataTest("create_perm_group_btn_processing").should("exist").should("be.visible")

  cy.wait("@createPermissionGroupRequest").its("response.statusCode").should("eq", 200)
})

Then(
  'I should see "Permission Group has been created. Do you want to create another one?" message on the screen',
  () => {
    cy.contains("Permission Group has been created. Do you want to create another one?").should("be.visible")
  }
)

When('I click to "No" button in the popup modal', () => {
  cy.contains("button", "No").click()
})

Then("I should see newly created permission group in the table", () => {
  cy.visit("/dashboard/permission-groups")
  cy.waitForRequest()
  cy.contains("td", newPermissionGroup.name).should("be.visible")
})

// Scenario: editing permission groups
When("I click the edit permission group button", () => {
  cy.visit("/dashboard/permission-groups")
  cy.waitForRequest()

  cy.getDataTest(`edit-permission-group-btn-${newPermissionGroup.slug}`).click()
  cy.waitForRequest()
})

Then("I should see the permission group edit form", () => {
  cy.get("form").should("be.visible")
  cy.contains("h1", "Edit Permission Group", { matchCase: false }).should("be.visible")

  cy.get('input[name="name"]').should("have.value", newPermissionGroup.name)
})

When("I make a change in the form", () => {
  cy.get('input[name="name"]').clear()
  cy.get('input[name="name"]').type(modifiedPermissionGroup.name)
})

Then("I should see the update button enabled", () => {
  cy.getDataTest("update_perm_group_btn").should("be.visible").and("not.be.disabled")
})

When("I click the permission group update button", () => {
  cy.getDataTest("update_perm_group_btn").as("updateButton")

  cy.get("@updateButton").should("exist").should("be.visible").should("not.be.disabled")

  cy.intercept("PUT", `/api/v1/permission-group/update*`).as("updatePermissionGroupRequest")

  cy.get("@updateButton").click({ force: true })

  cy.getDataTest("update_perm_group_btn_processing").should("exist").should("be.visible")

  cy.wait("@updatePermissionGroupRequest").its("response.statusCode").should("eq", 200)
})

Then(
  'I should see "Permission Group has been updated. Do you want to continue editing it?" message on the screen',
  () => {
    cy.contains("Permission Group has been updated. Do you want to continue editing it?").should("be.visible")
  }
)

When('I click to "No" button', () => {
  cy.contains("button", "No").click()
})

Then("I should see newly updated permission group with its new name in the table", () => {
  cy.visit("/dashboard/permission-groups")
  cy.waitForRequest()
  cy.contains("td", modifiedPermissionGroup.name).should("be.visible")
})

// Scenario: deleting permission groups
When("I click the delete permission group button", () => {
  cy.visit("/dashboard/permission-groups")
  cy.waitForRequest()
  cy.getDataTest("delete-permission-group-btn").click()
})

Then('I should see "Do you really want to delete this permission group?" message on the screen', () => {
  cy.contains("Do you really want to delete this permission group?").should("be.visible")
})

When('I click to "Yes" button in the popup modal', () => {
  cy.contains("button", "Yes").click()
  cy.intercept("DELETE", `/api/v1/permission-group/delete*`).as("deletePermissionGroupRequest")
  cy.wait("@deletePermissionGroupRequest").its("response.statusCode").should("eq", 200)
})

Then('I should see "Deleted!" message in the modal', () => {
  cy.contains("Deleted!").should("be.visible")
  cy.contains("button", "Ok", { matchCase: false }).click()

  cy.reload()
  cy.contains("td", modifiedPermissionGroup.name).should("not.exist")
})
