import { Dispatch, SetStateAction } from "react"

const checkLength = (
  formErrors: object,
  setFormErrors: Dispatch<SetStateAction<object>>,
  setShowError: Dispatch<SetStateAction<object>>,
  length: number,
  event
) => {
  let newRule: object
  if (event.target.value.length > length) {
    newRule = { [`${event.target.name}_length`]: "length-error" }
    setFormErrors({ ...formErrors, ...newRule })
    setShowError({ [`${event.target.name}_length`]: true })
  } else {
    if (`${event.target.name}_length` in formErrors) {
      let copyErrors = { ...formErrors }
      const { [`${event.target.name}_length`]: undefined, ...restOfErrors }: Record<string, string> = copyErrors
      setFormErrors(restOfErrors)
      setShowError({ [`${event.target.name}_length`]: false })
    }
  }
}
export default checkLength
