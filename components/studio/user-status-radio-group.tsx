import { PublishStatus, UserStatus } from "@/interfaces"
import { RadioGroup as RadioGroupPrimitive } from "radix-ui"
import { AnyFieldApi } from "@tanstack/form-core"

type Props = { field: AnyFieldApi }

const UserStatusRadioGroup = ({ field }: Props) => {
  const ringColors: Record<UserStatus, string> = {
    [UserStatus.Disabled]: "data-[state=checked]:ring-red-400",
    [UserStatus.Active]: "data-[state=checked]:ring-green-400",
    [UserStatus.Inactive]: "data-[state=checked]:ring-gray-400"
  }

  return (
    <RadioGroupPrimitive.Root
      className="grid w-full max-w-md grid-cols-3 gap-3"
      value={field.state.value}
      onValueChange={(val) => field.handleChange(val as UserStatus)}
      defaultValue={UserStatus.Draft}>
      {(Object.values(UserStatus) as UserStatus[]).map((status) => (
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
export default UserStatusRadioGroup
