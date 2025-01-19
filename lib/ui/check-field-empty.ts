import { Dispatch, SetStateAction } from "react"

const checkFieldEmpty = (
  event,
  formErrors: object,
  showError: object,
  setFormErrors: Dispatch<SetStateAction<object>>,
  setShowError: Dispatch<SetStateAction<object>>
) => {
  if (event.target.value === "") {
    let newError = { [event.target.name]: "empty-field" }
    setFormErrors({ ...formErrors, ...newError })
    setShowError({ ...showError, [event.target.name]: true })
  } else {
    if (`${event.target.name}` in formErrors) {
      let copyErrors = { ...formErrors }
      const { [event.target.name]: _, ...restOfErrors }: { [key: string]: string } = copyErrors
      setFormErrors(restOfErrors)
      setShowError({ [event.target.name]: false })
    }
  }
}

export default checkFieldEmpty
