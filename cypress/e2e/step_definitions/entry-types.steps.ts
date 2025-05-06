import { Then, When } from "@badeball/cypress-cucumber-preprocessor"

//User credentials
const USER_EMAIL = Cypress.env("USER_EMAIL")
const USER_PASSWORD = Cypress.env("USER_PASSWORD")

// Test data for entry type creation
const newEntryType = {
  name: "Test Entry Type",
  namespace: "itself",
  slug: "test-entry-type",
  fields: [
    {
      field_name: "content",
      field_value_type: "string",
      field_form_type: "textarea",
      field_length: "500"
    },
    {
      field_name: "author",
      field_value_type: "string",
      field_form_type: "input",
      field_length: "25"
    }
  ]
}

// Test data for entry creation
const newEntry = {
  name: "Test Entry Title",
  content: "This is a test entry created by Cypress",
  author: "cypress"
}

// Modified entry type data for edit test
const modifiedEntryType = {
  name: "Modified Entry Type"
}

/*Before(() => {
  // Login before each test (assuming you have authentication)
  cy.session(
    "authenticated",
    () => {
      cy.visit("/api/auth/signin")
      cy.get('input[name="email"]').type(USER_EMAIL)
      cy.get('input[name="password"]').type(USER_PASSWORD)
      cy.contains("button", "Sign in with credentials").click()
      /!*    cy.waitForRequest()
        cy.contains("button", "Dashboard").click()
        cy.waitForRequest()
        cy.url().should("include", "/dashboard")*!/
    },
    {
      validate: () => {
        // Check if user is authenticated
        cy.getCookie("next-auth.session-token").should("exist")
      }
    }
  )
  cy.visit("/dashboard/entry-types")
})*/

// Scenario: visiting entry types page
When("I visit entry types page", () => {
  cy.visit("/dashboard/entry-types")
  // Wait for the page to load completely
  cy.get("body").should("be.visible")
  cy.waitForRequest()
})

Then("I should see navigation menu on the left side of the screen", () => {
  cy.get(`[data-testid='menu-component']`).should("be.visible")
})

Then("I should see the add button", () => {
  cy.contains("button", "Add", { matchCase: false }).should("be.visible")
})

Then("I should see entry types table", () => {
  cy.get("table").should("be.visible")
})

// Scenario: adding entry types
When("I click the add button", () => {
  cy.visit("/dashboard/entry-types")
  cy.contains("button", "Add", { matchCase: false }).click()
  cy.waitForRequest()
})

Then("I should see entry type create form", () => {
  cy.contains("h1", "New entry type", { matchCase: true }).should("be.visible")
  cy.get("form").should("be.visible")
})

When("I fill the create new entry type form", () => {
  cy.get('input[name="name"]').type(newEntryType.name)
  cy.get('select[name="namespace"]').type(newEntryType.namespace)

  // Add a field to the entry type
  cy.getDataTest("input_field_name_0").type(newEntryType.fields[0].field_name)
  cy.getDataTest("input_field_length_0").clear()
  cy.getDataTest("input_field_length_0").type(newEntryType.fields[0].field_length)
  cy.getDataTest("select_field_value_type_0").select(newEntryType.fields[0].field_value_type)
  cy.getDataTest("select_field_form_type_0").select(newEntryType.fields[0].field_form_type)
  cy.contains("a", "Click here to add new field", { matchCase: true }).click()
  cy.getDataTest("input_field_name_1").type(newEntryType.fields[1].field_name)
  cy.getDataTest("input_field_length_1").type(newEntryType.fields[1].field_length)
  cy.getDataTest("select_field_value_type_1").select(newEntryType.fields[1].field_value_type)
  cy.getDataTest("select_field_form_type_1").select(newEntryType.fields[1].field_form_type)
})

When("I click the create button", () => {
  cy.getDataTest("create_entry_type_btn").as("createButton")

  cy.get("@createButton").should("exist").should("be.visible").should("not.be.disabled")

  cy.intercept("POST", `/api/v1/entry-type/create*`).as("createEntryTypeRequest")

  cy.get("@createButton").click({ force: true })

  cy.getDataTest("create_entry_type_btn_processing").should("exist").should("be.visible")

  cy.wait("@createEntryTypeRequest").its("response.statusCode").should("eq", 200)
})

Then("I should see newly created entry type in the table", () => {
  cy.visit("/dashboard/entry-types")
  cy.waitForRequest()
  cy.contains("td", newEntryType.name).should("be.visible")
})

// Scenario: editing entry types
When("I click edit button", () => {
  cy.visit("/dashboard/entry-types")
  cy.waitForRequest()

  cy.contains("tr", newEntryType.name).getDataTest(`edit-entry-type-btn-${newEntryType.slug}`).click()
  cy.waitForRequest()
})

Then("I should see entry type edit form", () => {
  cy.get("form").should("be.visible")
  cy.contains("h1", "Edit entry type", { matchCase: true }).should("be.visible")

  cy.get('input[name="name"]').should("have.value", newEntryType.name)
  cy.get('select[name="namespace"]').should("have.value", "test entry type")
})

When("I make a change", () => {
  cy.get('input[name="name"]').clear()
  cy.get('input[name="name"]').type(modifiedEntryType.name)
})

Then("I should see update button enabled", () => {
  cy.contains("button", "Update", { matchCase: false }).should("be.visible").and("not.be.disabled")
})

When("I click the update button", () => {
  cy.getDataTest("update_entry_type_btn").as("updateButton")

  cy.get("@updateButton").should("exist").should("be.visible").should("not.be.disabled")

  cy.intercept("PUT", `/api/v1/entry-type/update*`).as("updateEntryTypeRequest")

  cy.get("@updateButton").click({ force: true })

  cy.getDataTest("update_entry_type_btn_processing").should("exist").should("be.visible")

  cy.wait("@updateEntryTypeRequest").its("response.statusCode").should("eq", 200)
})

Then("I should see newly updated entry with its new name in the table", () => {
  cy.visit("/dashboard/entry-types")
  cy.contains("td", modifiedEntryType.name).should("be.visible")
})

// Scenario: adding a entry from this entry type
When("I click create entry button", () => {
  cy.contains("td", modifiedEntryType.name).getDataTest("create-entry-btn").click()
  cy.waitForRequest()
})

Then("I should see entry create form", () => {
  cy.get("form").should("be.visible")
  cy.contains("h1", "Create Entry", { matchCase: false }).should("be.visible")
})

When("I fill the create entry form", () => {
  cy.get('input[name="name"]').type(newEntry.name)
  cy.get('textarea[name="content"]').type(newEntry.content)
  cy.get('input[name="author"]').type(newEntry.author)
})

Then("I should see create button enabled", () => {
  cy.contains("button", "Create", { matchCase: false }).should("be.visible").and("not.be.disabled")
})

When("I click the create button", () => {
  cy.getDataTest("create_entry_btn").as("createButton")

  cy.get("@createButton").should("exist").should("be.visible").should("not.be.disabled")

  cy.intercept("PUT", `/api/v1/entry/create*`).as("createEntryRequest")

  cy.get("@createButton").click({ force: true })

  cy.getDataTest("update_entry_type_btn_processing").should("exist").should("be.visible")

  cy.wait("@createEntryRequest").its("response.statusCode").should("eq", 200)
})

Then("I should see newly created entry in the table", () => {
  cy.visit("/dashboard/entries")
  cy.contains("td", newEntry.name).should("be.visible")
})

// Scenario: deleting entry types
When("I click the delete button", () => {
  cy.visit("/dashboard/entry-types")
  cy.waitForRequest()
  cy.contains("tr", modifiedEntryType.name).find('[data-testid="delete-entry-type-btn"]').click()
})

Then('I should see "Do you really want to delete this item?" message on the screen', () => {
  cy.contains("Do you really want to delete this item?").should("be.visible")
})

When('I click to "Yes" button', () => {
  cy.contains("button", "Yes").click()
  cy.intercept("DELETE", `/api/v1/entry-type/delete*`).as("deleteEntryTypeRequest")
  cy.wait("@deleteEntryTypeRequest").its("response.statusCode").should("eq", 200)
})

Then('I should see "Deleted!" message on the screen', () => {
  cy.contains("Deleted!").should("be.visible")
  cy.contains("button", "Ok", { matchCase: false }).click()

  cy.reload()
  cy.contains("td", modifiedEntryType.name).should("not.exist")
})
