Feature: Authentication with Auth.js v5

  Scenario: displaying login page
    When I visit login page
    Then I should see email input field
    And I should see password input field
    And I should see submit button

  Scenario: successful login with valid credentials
    When I visit login page
    When I fill email field with valid email
    And I fill password field with valid password
    And I click submit button
    Then I should be redirected to dashboard or homepage
    And I should see session cookie set with name "authjs.session-token"
    And session cookie should have a value

  Scenario: failed login with invalid credentials
    When I visit login page
    When I fill email field with invalid email
    And I fill password field with invalid password
    And I click submit button
    Then I should remain on login page
    And I should not see session cookie

  Scenario: failed login with empty credentials
    When I visit login page
    When I click submit button
    Then I should remain on login page
    And I should not see session cookie

  Scenario: CSRF protection on login page
    When I visit login page
    Then I should see CSRF token cookie with name "authjs.csrf-token"

  Scenario: maintaining session across page navigation
    Given I am logged in
    When I visit dashboard page
    Then I should see session cookie
    When I visit entries page
    Then I should see session cookie
    When I visit entry types page
    Then I should see session cookie
    When I visit users page
    Then I should see session cookie

  Scenario: persisting session after page reload
    Given I am logged in
    When I visit dashboard page
    And I reload the page
    Then I should see session cookie with same value

  Scenario: displaying user information when authenticated
    Given I am logged in
    When I visit dashboard page
    Then I should see navigation menu
    And I should see logout button
    And I should not see login button

  Scenario: accessing session data from API endpoint
    Given I am logged in
    When I visit dashboard page
    And I request session endpoint
    Then I should receive response with status 200
    And response should contain user object
    And user object should contain email
    And user object should contain username
    And user object should contain permission_group

  Scenario: redirecting to login when accessing dashboard without authentication
    When I visit dashboard page without authentication
    Then I should be redirected to login page
    And I should not see session cookie

  Scenario: allowing access to dashboard with valid session
    Given I am logged in
    When I visit dashboard page
    Then I should see dashboard page
    And I should see navigation menu

  Scenario: allowing access to entries page with valid session
    Given I am logged in
    When I visit entries page
    Then I should see entries page
    And I should see entries table

  Scenario: protecting settings page for admin only
    Given I am logged in
    When I visit dashboard page
    Then settings link visibility should match permission level

  Scenario: displaying logout button when authenticated
    Given I am logged in
    When I visit dashboard page
    Then I should see logout button
    And logout button should contain text "Logout"

  Scenario: successful logout and clearing session
    Given I am logged in
    When I visit dashboard page
    And I click logout button
    Then session cookie should be removed
    And I should be redirected to login or home page

  Scenario: preventing access to protected routes after logout
    Given I am logged in
    When I visit dashboard page
    And I click logout button
    When I visit dashboard page
    Then I should be redirected to login page
    And I should not see session cookie

  Scenario: displaying menu items based on authentication status
    Given I am logged in
    When I visit dashboard page
    Then I should see dashboard menu item
    And I should see entry types menu item
    And I should see entries menu item
    And I should see users menu item
    And I should see logout button
    And I should not see login button

  Scenario: including permission_group in session data
    Given I am logged in
    When I visit dashboard page
    And I request session endpoint
    Then user object should contain permission_group
    And permission_group should be a string
    And permission_group should not be empty

  Scenario: respecting permission-based UI elements
    Given I am logged in
    When I visit entries page
    Then UI elements should match user permissions

  Scenario: using Auth.js v5 cookie naming convention
    When I visit login page
    Then I should see CSRF cookie with name "authjs.csrf-token"
    And I should not see cookie with name "next-auth.csrf-token"
    And I should not see cookie with name "next-auth.session-token"

  Scenario: setting session cookie after successful login
    When I visit login page
    When I fill email field with valid email
    And I fill password field with valid password
    And I click submit button
    Then I should be redirected away from login page
    And I should see session cookie with name "authjs.session-token"
    And session cookie should have a value
    And session cookie value should be longer than 10 characters

  Scenario: setting appropriate cookie attributes
    When I visit login page
    When I fill email field with valid email
    And I fill password field with valid password
    And I click submit button
    Then session cookie should exist
    And session cookie should be httpOnly
    And session cookie should have secure attribute
    And session cookie path should be "/"

  Scenario: handling network errors gracefully during login
    Given login endpoint returns server error
    When I visit login page
    When I fill email field with valid email
    And I fill password field with valid password
    And I click submit button
    Then I should remain on login page

  Scenario: handling expired session gracefully
    Given I have an expired session cookie
    When I visit dashboard page
    Then I should be redirected to login or error page
