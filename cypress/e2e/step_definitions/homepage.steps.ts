import { Before, Then, When } from "@badeball/cypress-cucumber-preprocessor"
//User credentials
const USER_EMAIL = Cypress.env("USER_EMAIL")
const USER_PASSWORD = Cypress.env("USER_PASSWORD")

Before(() => {
  // Login before each test (assuming you have authentication)
  cy.session("authenticated", () => {
    cy.visit("/api/auth/signin")
    cy.get('input[name="email"]').type(USER_EMAIL)
    cy.get('input[name="password"]').type(USER_PASSWORD)
    cy.contains("button", "Sign in with credentials").click()
    cy.waitForRequest()
    // cy.contains("button", "Dashboard").click()
    // cy.waitForRequest()
    // cy.url().should("include", "/dashboard")
  })
})

When("I visit homepage", () => {
  cy.visit("http://localhost:3000/dashboard")
})

Then("I should see navigation menu", () => {
  cy.getDataTest("menu-component").should("be.visible")
})

Then("I should see two cards", () => {
  cy.getDataTest("entry-types-card").should("have.text", "Entry TypesThis is a test contentView")
  cy.getDataTest("entries-card").should("have.text", "EntriesThis is a test contentView")
})

When("I check navigation menu", () => {
  cy.visit("http://localhost:3000/dashboard")
  cy.getDataTest("menu-component").should("be.visible")
})

Then("I should see navigation menu items", () => {
  cy.getDataTest("menu-logo").should("exist")
  cy.getDataTest("dashboard").should("exist")
  cy.getDataTest("entryTypes").should("exist")
  cy.getDataTest("entries").should("exist")
  cy.getDataTest("entries").should("exist")
  cy.getDataTest("users").should("exist")
  cy.getDataTest("settings").should("exist")
  cy.getDataTest("logout").should("exist")
})
