declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by data-testid attribute.
       * @param dataTestSelector - The data-testid value to select
       * @example cy.getDataTest("my-button")
       */
      getDataTest(dataTestSelector: string): Chainable<JQuery<HTMLElement>>

      waitForRequest: () => void
    }
  }
}

export {}
