//Utility
import checkFieldEmpty from "./check-field-empty"
import checkFormRules from "./check-form-rules"
import checkLength from "./check-length"

//React
import { Dispatch, SetStateAction } from "react"

//Interfaces
import { ContentType } from "../../interfaces"
//===============================================

const handleValueChange = (
  formData: any,
  formErrors: object,
  showError: object,
  showErrors: boolean,
  setFormErrors: Dispatch<SetStateAction<object>>,
  setShowError: Dispatch<SetStateAction<object>>,
  setAction: Dispatch<SetStateAction<any>>,
  event,
  contentType: ContentType,
  arrayIndex?: number,
  valueType?: string,
  length?: number
) => {
  //Initialize copyData
  let copyData: object[]
  if (contentType === "FIELD") {
    copyData = [...formData]
    copyData[arrayIndex][event.target.name] = event.target.value
  } else {
    copyData = { ...formData }
    if (contentType === "PERM_GROUP" || contentType === "USER_EDIT") {
      copyData[0][event.target.name] = event.target.value
    } else {
      copyData[event.target.name] = event.target.value
    }
  }

  //Empty field validation
  checkFieldEmpty(formErrors, showError, setFormErrors, setShowError, event)

  //Check for Form rules and value length if the content type is entry
  if (contentType === "ENTRY") {
    if (event.target.name !== "name") {
      checkFormRules(formErrors, showError, showErrors, setShowError, setFormErrors, valueType, event)

      checkLength(formErrors, setFormErrors, setShowError, length, event)
    }
  }

  //useState setter function
  setAction(copyData)
}

export default handleValueChange
