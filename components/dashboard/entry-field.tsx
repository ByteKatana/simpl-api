import React, { Dispatch, SetStateAction } from "react"
import { MutableRef } from "preact/hooks"
import CheckFieldEmpty from "../../lib/ui/check-field-empty"
function EntryField({
  key,
  field,
  formRef,
  formValues,
  handleFormValuesChange,
  formErrors,
  showErrors,
  showError,
  setFormErrors,
  setShowError
}: {
  field: object
  key: number
  formRef: MutableRef<any[]>
  formValues: object[] | { name: string; slug: string; namespace: string }
  handleFormValuesChange: (event, valueType?: string, length?: number) => void
  formErrors: object
  showError: object
  showErrors: boolean
  setShowError: Dispatch<SetStateAction<object>>
  setFormErrors: Dispatch<SetStateAction<object>>
}) {
  let fieldName = Object.keys(field).toString()
  if (field[fieldName].form_type === "textarea") {
    return (
      <div key={key} className="w-11/12 mt-3">
        <label htmlFor={`${fieldName}`} className="form-label inline-block mb-2 text-gray-700 text-xl">
          {fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
        </label>

        <textarea
          rows={3}
          className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
          id={`${fieldName}`}
          name={`${fieldName}`}
          ref={(el) => (formRef.current[`${fieldName}`] = el)}
          defaultValue={formValues[`${fieldName}`]}
          onChange={(e) => handleFormValuesChange(e, field[fieldName].value_type, field[fieldName].length)}
          onBlur={(e) => CheckFieldEmpty(e, formErrors, showError, setFormErrors, setShowError)}
          required></textarea>
        {(showErrors || showError[`${fieldName}`]) &&
          formErrors[`${fieldName}`] &&
          formErrors[`${fieldName}`] === "empty-field" && (
            <span className="text-red-500 font-bold">This field is required.</span>
          )}
        {(showErrors || showError[`${fieldName}_rule`]) &&
          formErrors[`${fieldName}_rule`] &&
          formErrors[`${fieldName}_rule`] === `${field[fieldName].value_type}-field` && (
            <span className="text-red-500 font-bold">{` This field must be ${field[fieldName].value_type}. `}</span>
          )}
        {(showErrors || showError[`${fieldName}_length`]) &&
          formErrors[`${fieldName}_length`] &&
          formErrors[`${fieldName}_length`] === "length-error" && (
            <span className="text-red-500 font-bold">{`Maximum length is ${field[fieldName].length}. `}</span>
          )}
      </div>
    )
  } else {
    return (
      <div key={key} className="w-11/12 mt-3">
        <label htmlFor={`${fieldName}`} className="form-label inline-block mb-2 text-gray-700 text-xl">
          {fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
        </label>

        <input
          type="text"
          className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
          id={`${fieldName}`}
          name={`${fieldName}`}
          ref={(el) => (formRef.current[`${fieldName}`] = el)}
          defaultValue={formValues[`${fieldName}`]}
          onChange={(e) => handleFormValuesChange(e, field[fieldName].value_type, field[fieldName].length)}
          onBlur={(e) => CheckFieldEmpty(e, formErrors, showError, setFormErrors, setShowError)}
          required
        />
        {(showErrors || showError[`${fieldName}`]) &&
          formErrors[`${fieldName}`] &&
          formErrors[`${fieldName}`] === "empty-field" && (
            <span className="text-red-500 font-bold">This field is required.</span>
          )}
        {(showErrors || showError[`${fieldName}_rule`]) &&
          formErrors[`${fieldName}_rule`] &&
          formErrors[`${fieldName}_rule`] === `${field[fieldName].value_type}-field` && (
            <span className="text-red-500 font-bold">{` This field must be ${field[fieldName].value_type}. `}</span>
          )}
        {(showErrors || showError[`${fieldName}_length`]) &&
          formErrors[`${fieldName}_length`] &&
          formErrors[`${fieldName}_length`] === "length-error" && (
            <span className="text-red-500 font-bold">{`Maximum length is ${field[fieldName].length}. `}</span>
          )}
      </div>
    )
  }
}

export default EntryField
