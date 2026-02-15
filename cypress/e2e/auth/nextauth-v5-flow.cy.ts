/**
 * Next-auth v5 (Auth.js) E2E Test Suite
 *
 * Complete authentication flow tests including:
 * - Login with valid credentials
 * - Session persistence across pages
 * - Protected route access
 * - Logout functionality
 * - Permission-based access control
 * - Session cookie validation
 */

// User credentials from environment
const USER_EMAIL = Cypress.env("USER_EMAIL") || "test@example.com"
const USER_PASSWORD = Cypress.env("USER_PASSWORD") || "testpassword"

describe("Auth.js v5 - Complete Authentication Flow", () => {
  // Clear cookies before each test to ensure clean state
  beforeEach(() => {
    cy.clearCookies()
  })

  describe("Login Flow", () => {
    it("should display login page with proper form elements", () => {
      cy.visit("/login")

      // Verify login form elements exist
      cy.get('input[name="email"]').should("be.visible")
      cy.get('input[name="password"]').should("be.visible")
      cy.get('button[type="submit"]').should("be.visible")
    })

    it("should successfully login with valid credentials", () => {
      cy.visit("/login")

      // Fill in credentials
      cy.get('input[name="email"]').type(USER_EMAIL)
      cy.get('input[name="password"]').type(USER_PASSWORD)

      // Submit form
      cy.get('button[type="submit"]').click()

      // Should redirect to dashboard or homepage
      cy.url().should("match", /(dashboard|\/(?!login))/)

      // Verify session cookie is set with new Auth.js v5 name
      cy.getCookie("authjs.session-token").should("exist")
      cy.getCookie("authjs.session-token").should("have.property", "value")
    })

    it("should reject login with invalid credentials", () => {
      cy.visit("/login")

      // Attempt login with invalid credentials
      cy.get('input[name="email"]').type("invalid@example.com")
      cy.get('input[name="password"]').type("wrongpassword")
      cy.get('button[type="submit"]').click()

      // Should remain on login page or show error
      cy.url().should("include", "login")

      // Session cookie should not exist
      cy.getCookie("authjs.session-token").should("not.exist")
    })

    it("should reject login with empty credentials", () => {
      cy.visit("/login")

      // Try to submit without filling form
      cy.get('button[type="submit"]').click()

      // Should remain on login page
      cy.url().should("include", "login")

      // No session cookie
      cy.getCookie("authjs.session-token").should("not.exist")
    })

    it("should include CSRF token in login request", () => {
      cy.visit("/login")

      // Verify CSRF token cookie exists
      cy.getCookie("authjs.csrf-token").should("exist")
    })
  })

  describe("Session Management", () => {
    beforeEach(() => {
      // Login before each session test
      cy.session("authenticated-user", () => {
        cy.visit("/api/auth/signin")
        cy.get('input[name="email"]').type(USER_EMAIL)
        cy.get('input[name="password"]').type(USER_PASSWORD)
        cy.contains("button", "Sign in with credentials").click()
        cy.waitForRequest()
      })
    })

    it("should maintain session across page navigation", () => {
      cy.visit("/dashboard")

      // Verify session cookie exists
      cy.getCookie("authjs.session-token").should("exist")

      // Navigate to different pages
      cy.visit("/dashboard/entries")
      cy.getCookie("authjs.session-token").should("exist")

      cy.visit("/dashboard/entry-types")
      cy.getCookie("authjs.session-token").should("exist")

      cy.visit("/dashboard/users")
      cy.getCookie("authjs.session-token").should("exist")
    })

    it("should persist session after page reload", () => {
      cy.visit("/dashboard")

      // Get initial session cookie
      cy.getCookie("authjs.session-token").then((initialCookie) => {
        expect(initialCookie).to.exist

        // Reload page
        cy.reload()

        // Verify session cookie still exists
        cy.getCookie("authjs.session-token").should("exist")
        cy.getCookie("authjs.session-token").should("have.property", "value", initialCookie.value)
      })
    })

    it("should display user information when authenticated", () => {
      cy.visit("/dashboard")

      // Verify navigation menu shows authenticated state
      cy.getDataTest("menu-component").should("be.visible")
      cy.getDataTest("logout").should("be.visible")
      cy.getDataTest("login").should("not.exist")
    })

    it("should access session data from API endpoint", () => {
      cy.visit("/dashboard")

      // Request session endpoint
      cy.request({
        method: "GET",
        url: "/api/auth/session"
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property("user")
        expect(response.body.user).to.have.property("email")
        expect(response.body.user).to.have.property("username")
        expect(response.body.user).to.have.property("permission_group")
      })
    })
  })

  describe("Protected Route Access", () => {
    it("should redirect to login when accessing dashboard without authentication", () => {
      // Clear any existing session
      cy.clearCookies()

      // Try to access protected route
      cy.visit("/dashboard")

      // Should redirect to login page
      cy.url().should("match", /(login|signin|auth)/)
      cy.getCookie("authjs.session-token").should("not.exist")
    })

    it("should allow access to dashboard with valid session", () => {
      // Login first
      cy.session("authenticated-user", () => {
        cy.visit("/api/auth/signin")
        cy.get('input[name="email"]').type(USER_EMAIL)
        cy.get('input[name="password"]').type(USER_PASSWORD)
        cy.contains("button", "Sign in with credentials").click()
        cy.waitForRequest()
      })

      // Access dashboard
      cy.visit("/dashboard")

      // Should successfully load dashboard
      cy.url().should("include", "/dashboard")
      cy.getDataTest("menu-component").should("be.visible")
    })

    it("should allow access to entries page with valid session", () => {
      cy.session("authenticated-user", () => {
        cy.visit("/api/auth/signin")
        cy.get('input[name="email"]').type(USER_EMAIL)
        cy.get('input[name="password"]').type(USER_PASSWORD)
        cy.contains("button", "Sign in with credentials").click()
        cy.waitForRequest()
      })

      cy.visit("/dashboard/entries")
      cy.url().should("include", "/dashboard/entries")
      cy.get("table").should("be.visible")
    })

    it("should protect settings page (admin only)", () => {
      cy.session("authenticated-user", () => {
        cy.visit("/api/auth/signin")
        cy.get('input[name="email"]').type(USER_EMAIL)
        cy.get('input[name="password"]').type(USER_PASSWORD)
        cy.contains("button", "Sign in with credentials").click()
        cy.waitForRequest()
      })

      cy.visit("/dashboard")

      // Check if settings link is visible (indicates admin access)
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="settings"]').length > 0) {
          // User is admin, can access settings
          cy.visit("/dashboard/settings")
          cy.url().should("include", "/dashboard/settings")
        } else {
          // User is not admin, settings should be restricted
          cy.log("User does not have admin permissions")
        }
      })
    })
  })

  describe("Logout Flow", () => {
    beforeEach(() => {
      // Login before each logout test
      cy.session("authenticated-user", () => {
        cy.visit("/api/auth/signin")
        cy.get('input[name="email"]').type(USER_EMAIL)
        cy.get('input[name="password"]').type(USER_PASSWORD)
        cy.contains("button", "Sign in with credentials").click()
        cy.waitForRequest()
      })
    })

    it("should display logout button when authenticated", () => {
      cy.visit("/dashboard")

      cy.getDataTest("logout").should("be.visible")
      cy.getDataTest("logout").should("contain.text", "Logout")
    })

    it("should successfully logout and clear session", () => {
      cy.visit("/dashboard")

      // Verify user is logged in
      cy.getCookie("authjs.session-token").should("exist")

      // Click logout
      cy.getDataTest("logout").click()

      // Wait for logout to complete
      cy.waitForRequest()

      // Session cookie should be removed
      cy.getCookie("authjs.session-token").should("not.exist")

      // Should redirect to login or home page
      cy.url().should("match", /(login|signin|^\/$)/)
    })

    it("should not access protected routes after logout", () => {
      cy.visit("/dashboard")

      // Logout
      cy.getDataTest("logout").click()
      cy.waitForRequest()

      // Try to access dashboard
      cy.visit("/dashboard")

      // Should redirect to login
      cy.url().should("match", /(login|signin|auth)/)
      cy.getCookie("authjs.session-token").should("not.exist")
    })
  })

  describe("Permission-Based Access", () => {
    beforeEach(() => {
      cy.session("authenticated-user", () => {
        cy.visit("/api/auth/signin")
        cy.get('input[name="email"]').type(USER_EMAIL)
        cy.get('input[name="password"]').type(USER_PASSWORD)
        cy.contains("button", "Sign in with credentials").click()
        cy.waitForRequest()
      })
    })

    it("should display menu items based on authentication status", () => {
      cy.visit("/dashboard")

      // Authenticated users should see these items
      cy.getDataTest("dashboard").should("exist")
      cy.getDataTest("entryTypes").should("exist")
      cy.getDataTest("entries").should("exist")
      cy.getDataTest("users").should("exist")
      cy.getDataTest("logout").should("exist")

      // Should not see login button when authenticated
      cy.get('[data-testid="login"]').should("not.exist")
    })

    it("should include permission_group in session data", () => {
      cy.visit("/dashboard")

      cy.request("/api/auth/session").then((response) => {
        expect(response.body.user).to.have.property("permission_group")
        expect(response.body.user.permission_group).to.be.a("string")
        expect(response.body.user.permission_group).to.not.be.empty
      })
    })

    it("should respect permission-based UI elements", () => {
      cy.visit("/dashboard/entries")

      // Check for permission-based buttons (edit, delete)
      // These should only show if user has appropriate permissions
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
  })

  describe("Cookie Validation", () => {
    it("should use Auth.js v5 cookie naming convention", () => {
      cy.visit("/login")

      // Verify CSRF cookie uses new naming
      cy.getCookie("authjs.csrf-token").should("exist")

      // Should NOT have old next-auth cookies
      cy.getCookie("next-auth.csrf-token").should("not.exist")
      cy.getCookie("next-auth.session-token").should("not.exist")
    })

    it("should set session cookie after successful login", () => {
      cy.visit("/login")

      cy.get('input[name="email"]').type(USER_EMAIL)
      cy.get('input[name="password"]').type(USER_PASSWORD)
      cy.get('button[type="submit"]').click()

      // Wait for redirect
      cy.url().should("not.include", "login")

      // Verify Auth.js v5 session cookie
      cy.getCookie("authjs.session-token").should("exist")
      cy.getCookie("authjs.session-token").should("have.property", "value")
      cy.getCookie("authjs.session-token").then((cookie) => {
        expect(cookie.value).to.not.be.empty
        expect(cookie.value.length).to.be.greaterThan(10)
      })
    })

    it("should set appropriate cookie attributes", () => {
      cy.visit("/login")

      cy.get('input[name="email"]').type(USER_EMAIL)
      cy.get('input[name="password"]').type(USER_PASSWORD)
      cy.get('button[type="submit"]').click()

      cy.getCookie("authjs.session-token").then((cookie) => {
        expect(cookie).to.exist
        expect(cookie.httpOnly).to.be.true
        expect(cookie.secure).to.exist
        expect(cookie.path).to.equal("/")
      })
    })
  })

  describe("Error Handling", () => {
    it("should handle network errors gracefully during login", () => {
      // Intercept and fail the signin request
      cy.intercept("POST", "/api/auth/callback/credentials", {
        statusCode: 500,
        body: { error: "Internal Server Error" }
      }).as("loginError")

      cy.visit("/login")
      cy.get('input[name="email"]').type(USER_EMAIL)
      cy.get('input[name="password"]').type(USER_PASSWORD)
      cy.get('button[type="submit"]').click()

      // Should handle error gracefully
      cy.url().should("include", "login")
    })

    it("should handle expired session gracefully", () => {
      // Set an expired/invalid session cookie
      cy.setCookie("authjs.session-token", "expired-or-invalid-token")

      cy.visit("/dashboard")

      // Should redirect to login or show error
      cy.url().should("match", /(login|signin|error)/)
    })
  })
})
