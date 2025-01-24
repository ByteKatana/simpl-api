import { Dispatch, SetStateAction } from "react"
import isDouble from "./is-double"

const checkFormRules = (
  formErrors: object,
  showError: object,
  showErrors: boolean,
  setShowError: Dispatch<SetStateAction<object>>,
  setFormErrors: Dispatch<SetStateAction<object>>,
  valueType: string,
  event
) => {
  let newRule: object
  if (valueType === "string" && typeof event.target.value !== "string") {
    newRule = { [`${event.target.name}_rule`]: "string-field" }
    setFormErrors({ ...formErrors, ...newRule })
    setShowError({ [`${event.target.name}_rule`]: true })
  } else if (valueType === "integer" && !Number.isSafeInteger(Number(event.target.value))) {
    newRule = { [`${event.target.name}_rule`]: "integer-field" }
    setFormErrors({ ...formErrors, ...newRule })
    setShowError({ [`${event.target.name}_rule`]: true })
  } else if (valueType === "double" && !isDouble(event.target.value)) {
    newRule = { [`${event.target.name}_rule`]: "double-field" }
    setFormErrors({ ...formErrors, ...newRule })
    setShowError({ [`${event.target.name}_rule`]: true })
  } else if (valueType === "boolean" && typeof JSON.parse(event.target.value) !== "boolean") {
    newRule = { [`${event.target.name}_rule`]: "boolean-field" }
    setFormErrors({ ...formErrors, ...newRule })
    setShowError({ [`${event.target.name}_rule`]: true })
  } else {
    if (`${event.target.name}_rule` in formErrors) {
      let copyErrors = { ...formErrors }
      const { [`${event.target.name}_rule`]: undefined, ...restOfErrors }: Record<string, string> = copyErrors
      setFormErrors(restOfErrors)
      setShowError({ [`${event.target.name}_rule`]: false })
    }
  }
}

export default checkFormRules
