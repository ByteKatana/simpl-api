import { PublishStatus } from "@/interfaces"
import { RadioGroup as RadioGroupPrimitive } from "radix-ui"
import { AnyFieldApi } from "@tanstack/form-core"

type Props = { field: AnyFieldApi }

const StatusRadioGroup = ({ field }: Props) => {
  const ringColors: Record<PublishStatus, string> = {
    [PublishStatus.Draft]: "data-[state=checked]:ring-amber-400",
    [PublishStatus.Published]: "data-[state=checked]:ring-green-400",
    [PublishStatus.Archived]: "data-[state=checked]:ring-gray-400"
  }

  return (
    <RadioGroupPrimitive.Root
      className="grid w-full max-w-md grid-cols-3 gap-3"
      value={field.state.value}
      onValueChange={(val) => field.handleChange(val as PublishStatus)}
      defaultValue={PublishStatus.Draft}>
      {(Object.values(PublishStatus) as PublishStatus[]).map((status) => (
        <RadioGroupPrimitive.Item
          key={status}
          value={status}
          className={`rounded-lg px-3 py-1 ring-[1px] ring-border data-[state=checked]:ring-2 ${ringColors[status]}`}>
          <span className="font-semibold text-sm tracking-tight">{status}</span>
        </RadioGroupPrimitive.Item>
      ))}
    </RadioGroupPrimitive.Root>
  )
}
export default StatusRadioGroup
