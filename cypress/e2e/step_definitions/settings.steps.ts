import { Then, When } from "@badeball/cypress-cucumber-preprocessor"

// Test data for permission group settings
const permissionSettings = {
  permissionGroup: "Member",
  namespace: "Test Entry Type",
  permission: "permissionCreate"
}

// Scenario: visiting the settings page
When("I visit the settings page", () => {
  cy.visit("/dashboard/settings")
  // Wait for the page to load completely
  cy.get("body").should("be.visible")
  cy.waitForRequest()
})

Then("I should see nav menu on the left side of the page", () => {
  cy.getDataTest("menu-component").should("be.visible")
})

Then("I should see Permission Group Settings", () => {
  cy.contains("h2", "Permission Groups", { matchCase: false }).should("be.visible")
})

Then("I should see API Keys Settings", () => {
  cy.contains("h2", "API Keys", { matchCase: false }).should("be.visible")
})

// Scenario: changing permission of a permission group for a entry type
When("I choose a permission group", () => {
  cy.visit("/dashboard/settings")
  cy.contains("li", permissionSettings.permissionGroup).click()
})

Then("I choose a namespace", () => {
  cy.contains("li", permissionSettings.namespace).click()
})

Then("I choose a permission", () => {
  cy.get(`input[name="${permissionSettings.permission}"]`).check()
})

Then("I update the permission", () => {
  cy.getDataTest("update_permission_btn").as("updateButton")
  cy.get("@updateButton").should("exist").should("be.visible").should("not.be.disabled")

  cy.intercept("PUT", `/api/v1/permission-group/update/*`).as("updatePermissionRequest")

  cy.get("@updateButton").click({ force: true })

  cy.wait("@updatePermissionRequest").its("response.statusCode").should("eq", 200)
})

Then('I should see "Permission group has been updated." message on the screen.', () => {
  cy.contains("Permission group has been updated.").should("be.visible")
  cy.contains("button", "Ok", { matchCase: false }).click()
})

// Scenario: generating API keys
When('I click "Generate" button.', () => {
  cy.visit("/dashboard/settings")
  cy.getDataTest("generate_api_key_btn").as("generateButton")
  cy.get("@generateButton").should("exist").should("be.visible").should("not.be.disabled")

  cy.intercept("GET", `/api/v1/key/generate?secretkey=*`).as("generateApiKeyRequest")

  cy.get("@generateButton").click()

  cy.wait("@generateApiKeyRequest").its("response.statusCode").should("eq", 200)
})

Then('I should see "API Key has been generated." message on the screen.', () => {
  cy.contains("API Key has been generated.").should("be.visible")
  cy.contains("button", "Ok", { matchCase: false }).click()
})

// Scenario: deleting API keys
When("I click the delete button of a API key", () => {
  cy.visit("/dashboard/settings")
  cy.intercept("DELETE", "/api/v1/key/remove/**").as("deleteApiKeyRequest")
  cy.getDataTest("delete-api-key-btn").last().click()
  cy.wait("@deleteApiKeyRequest").its("response.statusCode").should("eq", 200)
})

Then('I should see "API Key has been removed." message on the screen.', () => {
  cy.contains("API Key has been removed.").should("be.visible")
  cy.contains("button", "Ok", { matchCase: false }).click()
})
