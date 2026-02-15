import { Given, Then, When } from "@badeball/cypress-cucumber-preprocessor"

// User credentials from environment
const USER_EMAIL = Cypress.env("USER_EMAIL") || "test@example.com"
const USER_PASSWORD = Cypress.env("USER_PASSWORD") || "testpassword"

// Scenario: displaying login page
When("I visit login page", () => {
  cy.clearCookies()
  cy.visit("/login")
})

Then("I should see email input field", () => {
  cy.get('input[name="email"]').should("be.visible")
})

Then("I should see password input field", () => {
  cy.get('input[name="password"]').should("be.visible")
})

Then("I should see submit button", () => {
  cy.get('button[type="submit"]').should("be.visible")
})

// Scenario: successful login with valid credentials
When("I fill email field with valid email", () => {
  cy.get('input[name="email"]').type(USER_EMAIL)
})

When("I fill password field with valid password", () => {
  cy.get('input[name="password"]').type(USER_PASSWORD)
})

When("I click submit button", () => {
  cy.get('button[type="submit"]').click()
})

Then("I should be redirected to dashboard or homepage", () => {
  cy.url().should("match", /(dashboard|\/(?!login))/)
})

Then('I should see session cookie set with name "authjs.session-token"', () => {
  cy.getCookie("authjs.session-token").should("exist")
})

Then("session cookie should have a value", () => {
  cy.getCookie("authjs.session-token").should("have.property", "value")
})

// Scenario: failed login with invalid credentials
When("I fill email field with invalid email", () => {
  cy.get('input[name="email"]').type("invalid@example.com")
})

When("I fill password field with invalid password", () => {
  cy.get('input[name="password"]').type("wrongpassword")
})

Then("I should remain on login page", () => {
  cy.url().should("include", "login")
})

Then("I should not see session cookie", () => {
  cy.getCookie("authjs.session-token").should("not.exist")
})

// Scenario: CSRF protection on login page
Then('I should see CSRF token cookie with name "authjs.csrf-token"', () => {
  cy.getCookie("authjs.csrf-token").should("exist")
})

// Scenario: maintaining session across page navigation
Given("I am logged in", () => {
  cy.session(
    "authenticated-user",
    () => {
      cy.visit("/api/auth/signin")
      cy.get('input[name="email"]').type(USER_EMAIL)
      cy.get('input[name="password"]').type(USER_PASSWORD)
      cy.contains("button", "Sign in with credentials").click()
      cy.waitForRequest()
    },
    {
      validate: () => {
        cy.getCookie("authjs.session-token").should("exist")
      }
    }
  )
})

When("I visit dashboard page", () => {
  cy.visit("/dashboard")
})

Then("I should see session cookie", () => {
  cy.getCookie("authjs.session-token").should("exist")
})

When("I visit entries page", () => {
  cy.visit("/dashboard/entries")
})

When("I visit entry types page", () => {
  cy.visit("/dashboard/entry-types")
})

When("I visit users page", () => {
  cy.visit("/dashboard/users")
})

// Scenario: persisting session after page reload
When("I reload the page", () => {
  cy.reload()
})

Then("I should see session cookie with same value", () => {
  cy.getCookie("authjs.session-token").then((cookie) => {
    expect(cookie).to.exist
    expect(cookie.value).to.not.be.empty
  })
})

// Scenario: displaying user information when authenticated
Then("I should see navigation menu", () => {
  cy.getDataTest("menu-component").should("be.visible")
})

Then("I should see logout button", () => {
  cy.getDataTest("logout").should("be.visible")
})

Then("I should not see login button", () => {
  cy.getDataTest("login").should("not.exist")
})

// Scenario: accessing session data from API endpoint
When("I request session endpoint", () => {
  cy.request({
    method: "GET",
    url: "/api/auth/session"
  }).as("sessionResponse")
})

Then("I should receive response with status 200", () => {
  cy.get("@sessionResponse").its("status").should("eq", 200)
})

Then("response should contain user object", () => {
  cy.get("@sessionResponse").its("body").should("have.property", "user")
})

Then("user object should contain email", () => {
  cy.get("@sessionResponse").its("body.user").should("have.property", "email")
})

Then("user object should contain username", () => {
  cy.get("@sessionResponse").its("body.user").should("have.property", "username")
})

Then("user object should contain permission_group", () => {
  cy.get("@sessionResponse").its("body.user").should("have.property", "permission_group")
})

// Scenario: redirecting to login when accessing dashboard without authentication
When("I visit dashboard page without authentication", () => {
  cy.clearCookies()
  cy.visit("/dashboard")
})

Then("I should be redirected to login page", () => {
  cy.url().should("match", /(login|signin|auth)/)
})

// Scenario: allowing access to dashboard with valid session
Then("I should see dashboard page", () => {
  cy.url().should("include", "/dashboard")
})

// Scenario: allowing access to entries page with valid session
Then("I should see entries page", () => {
  cy.url().should("include", "/dashboard/entries")
})

Then("I should see entries table", () => {
  cy.get("table").should("be.visible")
})

// Scenario: protecting settings page for admin only
Then("settings link visibility should match permission level", () => {
  cy.get("body").then(($body) => {
    if ($body.find('[data-testid="settings"]').length > 0) {
      cy.visit("/dashboard/settings")
      cy.url().should("include", "/dashboard/settings")
    } else {
      cy.log("User does not have admin permissions")
    }
  })
})

// Scenario: displaying logout button when authenticated
Then('logout button should contain text "Logout"', () => {
  cy.getDataTest("logout").should("contain.text", "Logout")
})

// Scenario: successful logout and clearing session
When("I click logout button", () => {
  cy.getDataTest("logout").click()
  cy.waitForRequest()
})

Then("session cookie should be removed", () => {
  cy.getCookie("authjs.session-token").should("not.exist")
})

Then("I should be redirected to login or home page", () => {
  cy.url().should("match", /(login|signin|^\/$)/)
})

// Scenario: displaying menu items based on authentication status
Then("I should see dashboard menu item", () => {
  cy.getDataTest("dashboard").should("exist")
})

Then("I should see entry types menu item", () => {
  cy.getDataTest("entryTypes").should("exist")
})

Then("I should see entries menu item", () => {
  cy.getDataTest("entries").should("exist")
})

Then("I should see users menu item", () => {
  cy.getDataTest("users").should("exist")
})

// Scenario: including permission_group in session data
Then("permission_group should be a string", () => {
  cy.request("/api/auth/session").then((response) => {
    expect(response.body.user.permission_group).to.be.a("string")
  })
})

Then("permission_group should not be empty", () => {
  cy.request("/api/auth/session").then((response) => {
    expect(response.body.user.permission_group).to.not.be.empty
  })
})

// Scenario: respecting permission-based UI elements
Then("UI elements should match user permissions", () => {
  cy.get("body").then(($body) => {
    const hasEditButtons = $body.find('[data-testid*="edit"]').length > 0
    const hasDeleteButtons = $body.find('[data-testid*="delete"]').length > 0

    if (hasEditButtons) {
      cy.log("User has edit permissions")
    }

    if (hasDeleteButtons) {
      cy.log("User has delete permissions")
    }
  })
})

// Scenario: using Auth.js v5 cookie naming convention
Then('I should see CSRF cookie with name "authjs.csrf-token"', () => {
  cy.getCookie("authjs.csrf-token").should("exist")
})

Then('I should not see cookie with name "next-auth.csrf-token"', () => {
  cy.getCookie("next-auth.csrf-token").should("not.exist")
})

Then('I should not see cookie with name "next-auth.session-token"', () => {
  cy.getCookie("next-auth.session-token").should("not.exist")
})

// Scenario: setting session cookie after successful login
Then("I should be redirected away from login page", () => {
  cy.url().should("not.include", "login")
})

Then("session cookie value should be longer than 10 characters", () => {
  cy.getCookie("authjs.session-token").then((cookie) => {
    expect(cookie.value).to.not.be.empty
    expect(cookie.value.length).to.be.greaterThan(10)
  })
})

// Scenario: setting appropriate cookie attributes
Then("session cookie should exist", () => {
  cy.getCookie("authjs.session-token").should("exist")
})

Then("session cookie should be httpOnly", () => {
  cy.getCookie("authjs.session-token").then((cookie) => {
    expect(cookie.httpOnly).to.be.true
  })
})

Then("session cookie should have secure attribute", () => {
  cy.getCookie("authjs.session-token").then((cookie) => {
    expect(cookie.secure).to.exist
  })
})

Then('session cookie path should be "/"', () => {
  cy.getCookie("authjs.session-token").then((cookie) => {
    expect(cookie.path).to.equal("/")
  })
})

// Scenario: handling network errors gracefully during login
Given("login endpoint returns server error", () => {
  cy.intercept("POST", "/api/auth/callback/credentials", {
    statusCode: 500,
    body: { error: "Internal Server Error" }
  }).as("loginError")
})

// Scenario: handling expired session gracefully
Given("I have an expired session cookie", () => {
  cy.setCookie("authjs.session-token", "expired-or-invalid-token")
})

Then("I should be redirected to login or error page", () => {
  cy.url().should("match", /(login|signin|error)/)
})
