import { Dispatch, SetStateAction } from "react"

const checkFieldEmpty = (
  formErrors: object,
  showError: object,
  setFormErrors: Dispatch<SetStateAction<object>>,
  setShowError: Dispatch<SetStateAction<object>>,
  event: any,
  index?: number
) => {
  let targetField
  if (index !== undefined) {
    targetField = `${event.target.name}_${index}`
  } else {
    targetField = `${event.target.name}`
  }

  if (event.target.name !== "password" && event.target.value === "") {
    let newError = { [targetField]: "empty-field" }
    setFormErrors({ ...formErrors, ...newError })
    setShowError({ ...showError, [targetField]: true })
  } else {
    if (targetField in formErrors) {
      let copyErrors = { ...formErrors }
      const { [targetField]: _, ...restOfErrors }: Record<string, string> = copyErrors
      setFormErrors(restOfErrors)
      setShowError({ [targetField]: false })
    }
  }
}

export default checkFieldEmpty
