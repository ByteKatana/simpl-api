Feature: Settings Page

  Scenario: visiting the settings page
    When I visit the settings page
    Then I should see nav menu on the left side of the page
    And I should see Permission Group Settings
    And I should see API Keys Settings

  Scenario: changing permission of a permission group for a namespace
    When I choose a permission group
    Then I choose a namespace
    And I choose a permission
    Then I update the permission
    Then I should see "Permission group has been updated." message on the screen.

  Scenario: generating API keys
    When I click "Generate" button.
    Then I should see "API Key has been generated." message on the screen.

  Scenario: deleting API keys
    When I click the delete button of a API key
    Then I should see "API Key has been removed." message on the screen.

