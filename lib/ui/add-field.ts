import { ActionType } from "../../interfaces"
import { Dispatch, SetStateAction } from "react"

const addField = (
  formFields: object[],
  formErrors: object,
  setFormFields: Dispatch<SetStateAction<object[]>>,
  setFormErrors: Dispatch<SetStateAction<object>>,
  actionType: ActionType,
  setAnyValueChanged?: Dispatch<SetStateAction<boolean>>,
  fieldsData?: object[]
) => {
  //Prepare data for new field
  let newField = {
    field_name: "",
    field_value_type: "",
    field_form_type: ""
  }

  let newFieldsData = [...formFields, newField]

  //Prepare empty field validation data
  let newErrors = {
    [`field_name_${formFields.length}`]: "empty-field",
    [`field_length_${formFields.length}`]: "empty-field",
    [`field_value_type_${formFields.length}`]: "empty-field",
    [`field_form_type_${formFields.length}`]: "empty-field"
  }
  //Update validation state
  setFormErrors({ ...formErrors, ...newErrors })

  if (actionType === "UPDATE") {
    //Enable "update" button, so you can update entry type
    if (newFieldsData.length > fieldsData.length) setAnyValueChanged(true)
  }

  //Update formFields state
  setFormFields(newFieldsData)
}

export default addField
