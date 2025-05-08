import { Then, When } from "@badeball/cypress-cucumber-preprocessor"

//User credentials
const USER_EMAIL = Cypress.env("USER_EMAIL")
const USER_PASSWORD = Cypress.env("USER_PASSWORD")

// Test data for entry editing
const modifiedEntry = {
  name: "Modified Entry Title",
  content: "This is a modified test entry content",
  author: "cypress-modified",
  slug: "modified-entry-title"
}

// Scenario: visiting entries page
When("I visit entries page.", () => {
  /*cy.session(
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
  )*/
  cy.visit("/dashboard/entries")
  // Wait for the page to load completely
  cy.get("body").should("be.visible")
  cy.waitForRequest()
})

Then("I should see navigation menu.", () => {
  cy.get(`[data-testid='menu-component']`).should("be.visible")
})

Then("I should see entries table.", () => {
  cy.get("table").should("be.visible")
})

// Scenario: editing entries
When("I click edit button.", () => {
  // Find the first entry in the table and click its edit button
  cy.getDataTest(`edit-entry-btn-${modifiedEntry.slug}`).click()
  cy.waitForRequest()
})

Then("I should see entry edit form.", () => {
  cy.get("form").should("be.visible")
  cy.contains("h1", "Edit Entry", { matchCase: true }).should("be.visible")
})

When("I make a change.", () => {
  // Clear fields and enter new values
  cy.get('input[name="name"]').clear()
  cy.get('input[name="name"]').type(modifiedEntry.name)

  // Check if content and author fields exist and modify them
  cy.get('textarea[name="content"]').then(($el) => {
    if ($el.length) {
      cy.get('textarea[name="content"]').clear()
      cy.get('textarea[name="content"]').type(modifiedEntry.content)
    }
  })

  cy.get('input[name="author"]').then(($el) => {
    if ($el.length) {
      cy.get('input[name="author"]').clear()
      cy.get('input[name="author"]').type(modifiedEntry.author)
    }
  })
})

Then("I should see update button enabled.", () => {
  cy.contains("button", "Update", { matchCase: false }).should("be.visible").and("not.be.disabled")
})

When("I click the update button.", () => {
  cy.getDataTest("submit_entry_button").as("updateButton")

  cy.get("@updateButton").should("exist").should("be.visible").should("not.be.disabled")

  cy.intercept("PUT", `/api/v1/entry/update*`).as("updateEntryRequest")

  cy.get("@updateButton").click({ force: true })

  cy.getDataTest("submit_entry_button_processing").should("exist").should("be.visible")

  cy.wait("@updateEntryRequest").its("response.statusCode").should("eq", 200)
})

Then('I should see "Entry has been updated. Do you want to continue editing it?" message on the screen.', () => {
  cy.contains("Entry has been updated. Do you want to continue editing it?").should("be.visible")
})

When('I click to "No" button.', () => {
  cy.contains("button", "No").click()
})

Then("I should see newly updated entry with its new values in the table.", () => {
  cy.visit("/dashboard/entries")
  cy.waitForRequest()
  cy.contains("td", modifiedEntry.name).should("be.visible")
})

// Scenario: deleting entries
When("I click the delete button.", () => {
  cy.visit("/dashboard/entries")
  cy.waitForRequest()

  // Find the entry to delete (using the modified entry name from previous test)
  // or fallback to the first entry in the table
  cy.contains("tr", modifiedEntry.name).then(($row) => {
    if ($row.length) {
      cy.wrap($row).getDataTest("delete-entry-btn").click()
    } else {
      cy.get("table tbody tr").first().find('[data-testid="delete-entry-btn"]').click()
    }
  })
})

Then('I should see "Do you really want to delete this item?" message on the screen.', () => {
  cy.contains("Do you really want to delete this item?").should("be.visible")
})

When('I click to "Yes" button.', () => {
  cy.contains("button", "Yes").click()
  cy.intercept("DELETE", `/api/v1/entry/delete*`).as("deleteEntryRequest")
  cy.wait("@deleteEntryRequest").its("response.statusCode").should("eq", 200)
})

Then('I should see "Deleted!" message on the screen.', () => {
  cy.contains("Deleted!").should("be.visible")
  cy.contains("button", "Ok", { matchCase: false }).click()

  // Verify the entry is no longer in the table (if we used the modified entry)
  cy.reload()
  cy.contains("td", modifiedEntry.name).should("not.exist")
})
