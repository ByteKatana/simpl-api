import { defineConfig } from "cypress"
import createBundler from "@bahmutov/cypress-esbuild-preprocessor"
import { createEsbuildPlugin } from "@badeball/cypress-cucumber-preprocessor/esbuild"
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor"

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    specPattern: "**/*.feature",
    env: {
      USER_EMAIL: "admin@localhost.test",
      USER_PASSWORD: "ms5prux6dm"
    },
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config)
      on(
        "file:preprocessor",
        createBundler({
          plugins: [createEsbuildPlugin(config)]
        })
      )
      return config
    }
  },

  component: {
    devServer: {
      framework: "next",
      bundler: "webpack"
    }
  }
})
