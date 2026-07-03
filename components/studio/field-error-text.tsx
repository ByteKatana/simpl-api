import { AnyFieldApi } from "@tanstack/form-core"
type Props = { field: AnyFieldApi }
const FieldErrorText = ({ field }: Props) => {
  if (!field.state.meta.isTouched) return null
  const errors = field.state.meta.errors
  if (!errors || errors.length === 0) return null
  const msg = Array.from(
    new Set(errors.map((e: any) => (typeof e === "string" ? e : e?.message)).filter(Boolean))
  ).join(", ")
  if (!msg) return null
  return <span className="text-xs text-red-500 mt-1">{msg}</span>
}

export default FieldErrorText
