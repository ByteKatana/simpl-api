Feature: Entry Types Page

  Scenario: visiting entry types page
    When I visit entry types page
    Then I should see navigation menu on the left side of the screen
    And I should see the add button
    And I should see entry types table

  Scenario: adding entry types
    When I click the add button
    Then I should see entry type create form
    When I fill the create new entry type form
    And  I click the create button
    Then I should see newly created entry type in the table

  Scenario: editing entry types
    When I click edit button
    Then I should see entry type edit form
    When I make a change
    Then I should see update button enabled
    When I click the update button
    Then I should see newly updated entry with its new name in the table

  Scenario: adding a entry from this entry type
    When I click create entry button
    Then I should see entry create form
    When I fill the create entry form
    Then I should see create button enabled
    When I click the create button
    Then I should see newly created entry in the table

  Scenario: deleting entry types
    When I click the delete button
    Then I should see "Do you really want to delete this item?" message on the screen
    When I click to "Yes" button
    Then I should see "Deleted!" message on the screen