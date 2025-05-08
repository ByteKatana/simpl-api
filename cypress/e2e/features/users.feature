Feature: Users Page

  Scenario: visiting users page
    When I visit users page
    Then I should see navigation menu in the screen
    And I should see create user button
    And I should see users table

  Scenario: adding users
    When I click create user button
    Then I should see user create form
    When I fill the create user form
    Then I should see create user button enabled
    When I click the create user button
    Then I should see "User has been created. Do you want to create another one?" message on the screen
    When I click to "No" button in the modal
    Then I should see newly created user in the table

  Scenario: editing users
    When I click edit user button
    Then I should see user edit form
    When I make a change in the user edit form
    Then I should see the update user button enabled
    When I click the update user button
    Then I should see "User has been updated. Do you want to continue editing it?" message on the screen
    When I click to "No" button in the modal
    Then I should see newly updated user with its new information in the table

  Scenario: deleting users
    When I click the delete user button
    Then I should see "Do you really want to delete this user?" message on the screen
    When I click to "Yes" button in the modal
    Then I should see "Deleted!" message in the popup modal