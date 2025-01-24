import { ActionType } from "../../interfaces"
import { Dispatch, SetStateAction } from "react"

const removeField = (
  formFields,
  formErrors,
  setFormFields: Dispatch<SetStateAction<object>>,
  setFormErrors: Dispatch<SetStateAction<object>>,
  index,
  actionType: ActionType,
  setAnyValueChanged?: Dispatch<SetStateAction<boolean>>,
  fieldsData?
) => {
  //Copy of formField state
  let fieldData = [...formFields]

  //Copy of formErrors state
  let copyErrors = { ...formErrors }

  //remove validation data if field has been removed
  for (let key of Object.keys(formErrors)) {
    if (key.endsWith(index)) {
      delete copyErrors[key]
    }
  }
  //Update formError after removing validation data
  setFormErrors(copyErrors)

  //separate field that going to be removed
  fieldData.splice(index, 1)

  if (actionType === "UPDATE") {
    //If removed field is not newly added empty field, that means one of the entry type's field is removed, so value changed.
    if (fieldData.length < fieldsData.length) {
      setAnyValueChanged(true)
    } else {
      setAnyValueChanged(false)
    }
  }

  //update formFields state after removing field
  setFormFields(fieldData)
}

export default removeField
