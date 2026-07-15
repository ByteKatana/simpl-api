import { AnyFieldApi } from "@tanstack/form-core"
type Props = { field: AnyFieldApi }
const FieldErrorText = ({ field }: Props) => {
  if (!field.state.meta.isTouched) return null
  const errors = field.state.meta.errors
  if (!errors || errors.length === 0) return null
  const msg = Array.from(
    new Set(errors.map((e: any) => (typeof e === "string" ? e : e?.message)).filter(Boolean))
  )

  if (!msg) return null
  return <ul className="text-xs text-red-500 mx-1">{msg.map(item => (<li key={item} className={"my-[0.5]"} >{item}</li>))}</ul>
}

export default FieldErrorText
