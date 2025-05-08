Feature: homepage

  Scenario: visiting the homepage
    When I visit homepage
    Then I should see navigation menu
    Then I should see two cards

  Scenario: checking navigation menu
    When I check navigation menu
    Then I should see navigation menu items