Feature: Permission Groups Page

  Scenario: visiting permission groups page
    When I visit permission groups page
    Then I should see nav menu
    And I should see create permission group button
    And I should see permission groups table

  Scenario: adding permission groups
    When I click create permission group button
    Then I should see permission group create form
    When I fill the permission group create form
    Then I should see create the button enabled
    When I click the create the button
    Then I should see "Permission Group has been created. Do you want to create another one?" message on the screen
    When I click to "No" button in the popup modal
    Then I should see newly created permission group in the table

  Scenario: editing permission groups
    When I click the edit permission group button
    Then I should see the permission group edit form
    When I make a change in the form
    Then I should see the update button enabled
    When I click the permission group update button
    Then I should see "Permission Group has been updated. Do you want to continue editing it?" message on the screen
    When I click to "No" button
    Then I should see newly updated permission group with its new name in the table

  Scenario: deleting permission groups
    When I click the delete permission group button
    Then I should see "Do you really want to delete this permission group?" message on the screen
    When I click to "Yes" button in the popup modal
    Then I should see "Deleted!" message in the modal