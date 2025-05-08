import globals from "globals"
import pluginJs from "@eslint/js"
import tseslint from "typescript-eslint"
import pluginReact from "eslint-plugin-react"
import prettier from "eslint-plugin-prettier"
import testingLibrary from "eslint-plugin-testing-library"
import jestDom from "eslint-plugin-jest-dom"
import pluginCypress from "eslint-plugin-cypress/flat"

/** @type {import("eslint").Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    plugins: {
      prettier: prettier,
      "testing-library": testingLibrary,
      "jest-dom": jestDom,
      pluginCypress: pluginCypress
    },
    settings: {
      react: {
        version: "detect"
      },
      "import/resolver": {
        node: {
          extensions: [".js", ".mjs", ".cjs", ".ts", ".jsx", ".tsx"]
        }
      }
    },
    languageOptions: { globals: globals.browser },
    rules: {
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/no-unused-vars": "off"
    }
  }
]
