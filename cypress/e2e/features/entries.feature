Feature: Entries Page

  Scenario: visiting entries page
    When I visit entries page.
    Then I should see navigation menu.
    And I should see entries table.

  Scenario: editing entries
    When I click edit button.
    Then I should see entry edit form.
    When I make a change.
    Then I should see update button enabled.
    When I click the update button.
    Then I should see "Entry has been updated. Do you want to continue editing it?" message on the screen.
    When I click to "No" button.
    Then I should see newly updated entry with its new values in the table.

  Scenario: deleting entries
    When I click the delete button.
    Then I should see "Do you really want to delete this item?" message on the screen.
    When I click to "Yes" button.
    Then I should see "Deleted!" message on the screen.