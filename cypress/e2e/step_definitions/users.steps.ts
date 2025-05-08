import { Then, When } from "@badeball/cypress-cucumber-preprocessor"

// User credentials for login
const USER_EMAIL = Cypress.env("USER_EMAIL")
const USER_PASSWORD = Cypress.env("USER_PASSWORD")

// Test data for user creation
const newUser = {
  username: "Test User",
  email: `test-user-${Date.now()}@example.com`,
  password: "P@ssw0rd123",
  role: "member"
}

// Modified user data for edit test
const modifiedUser = {
  username: "Modified Test User"
}

// Scenario: visiting users page
When("I visit users page", () => {
  cy.visit("/dashboard/users")
  // Wait for the page to load completely
  cy.get("body").should("be.visible")
  cy.waitForRequest()
})

Then("I should see navigation menu in the screen", () => {
  cy.getDataTest("menu-component").should("be.visible")
})

Then("I should see create user button", () => {
  cy.contains("button", "Create User", { matchCase: false }).should("be.visible")
})

Then("I should see users table", () => {
  cy.get("table").should("be.visible")
})

// Scenario: adding users
When("I click create user button", () => {
  cy.visit("/dashboard/users")
  cy.getDataTest("create-user-btn").click()
  cy.waitForRequest()
})

Then("I should see user create form", () => {
  cy.contains("h1", "Create User", { matchCase: false }).should("be.visible")
  cy.get("form").should("be.visible")
})

When("I fill the create user form", () => {
  cy.get('input[name="username"]').type(newUser.username)
  cy.get('input[name="email"]').type(newUser.email)
  cy.get('input[name="password"]').type(newUser.password)
  cy.get('select[name="role"]').select(newUser.role)
})

Then("I should see create user button enabled", () => {
  cy.getDataTest("create_user_btn").should("be.visible").and("not.be.disabled")
})

When("I click the create user button", () => {
  cy.getDataTest("create_user_btn").as("createButton")

  cy.get("@createButton").should("exist").should("be.visible").should("not.be.disabled")

  cy.intercept("POST", `/api/v1/user/create*`).as("createUserRequest")

  cy.get("@createButton").click({ force: true })

  cy.getDataTest("create_user_btn_processing").should("exist").should("be.visible")

  cy.wait("@createUserRequest").its("response.statusCode").should("eq", 200)
})

Then("I should see {string} message on the screen", (message) => {
  cy.contains(message).should("be.visible")
})

When("I click to {string} button in the modal", (buttonText) => {
  cy.contains("button", buttonText).click()
})

Then("I should see newly created user in the table", () => {
  cy.visit("/dashboard/users")
  cy.waitForRequest()
  cy.contains("td", newUser.username).should("be.visible")
})

// Scenario: editing users
When("I click edit user button", () => {
  cy.visit("/dashboard/users")
  cy.waitForRequest()

  // Find the row with our test user and click its edit button
  cy.contains("td", newUser.email)
    .parent("tr")
    .within(() => {
      cy.getDataTest(`edit-user-btn-${newUser.username}`).click()
    })

  cy.waitForRequest()
})

Then("I should see user edit form", () => {
  cy.get("form").should("be.visible")
  cy.contains("h1", "Edit User", { matchCase: false }).should("be.visible")

  // Verify the form is pre-filled with our user's data
  cy.get('input[name="username"]').should("have.value", newUser.username)
  cy.get('input[name="email"]').should("have.value", newUser.email)
})

When("I make a change in the user edit form", () => {
  cy.get('input[name="username"]').clear()
  cy.get('input[name="username"]').type(modifiedUser.username)
})

Then("I should see the update user button enabled", () => {
  cy.getDataTest("update_user_btn").should("be.visible").and("not.be.disabled")
})

When("I click the update user button", () => {
  cy.getDataTest("update_user_btn").as("updateButton")

  cy.get("@updateButton").should("exist").should("be.visible").should("not.be.disabled")

  cy.intercept("PUT", `/api/v1/user/update*`).as("updateUserRequest")

  cy.get("@updateButton").click({ force: true })

  cy.getDataTest("update_user_btn_processing").should("exist").should("be.visible")

  cy.wait("@updateUserRequest").its("response.statusCode").should("eq", 200)
})

Then("I should see newly updated user with its new information in the table", () => {
  cy.visit("/dashboard/users")
  cy.waitForRequest()
  cy.contains("td", modifiedUser.username).should("be.visible")
})

// Scenario: deleting users
When("I click the delete user button", () => {
  cy.visit("/dashboard/users")
  cy.waitForRequest()

  // Find the row with our test user and click its delete button
  cy.contains("td", newUser.email)
    .parent("tr")
    .within(() => {
      cy.getDataTest(`delete-user-btn-${modifiedUser.username}`).click()
    })
})

When("I click to {string} button in the modal", (buttonText) => {
  cy.contains("button", buttonText).click()

  if (buttonText === "Yes") {
    cy.intercept("DELETE", `/api/v1/user/delete*`).as("deleteUserRequest")
    cy.wait("@deleteUserRequest").its("response.statusCode").should("eq", 200)
  }
})

Then("I should see {string} message in the popup modal", (message) => {
  cy.contains(message).should("be.visible")

  if (message === "Deleted!") {
    cy.contains("button", "Ok", { matchCase: false }).click()

    cy.reload()
    cy.contains("td", nmodifiedUser.username).should("not.exist")
    cy.contains("td", newUser.email).should("not.exist")
  }
})
