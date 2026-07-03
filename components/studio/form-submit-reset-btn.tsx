import { Button } from "@/components/ui/button"

type Props = {
  form: any
}

const FormSubmitResetBtn = ({ form }: Props) => {
  return (
    <div className="flex gap-x-4 items-center justify-start my-4">
      <form.Subscribe
        selector={(state: { canSubmit: boolean; isSubmitting: boolean }) => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]: [boolean, boolean]) => (
          <Button className="cursor-default hover:cursor-pointer" type="submit" disabled={!canSubmit}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        )}
      />
      <Button
        type="button"
        onClick={() => {
          form.reset()
        }}>
        Reset
      </Button>
    </div>
  )
}
export default FormSubmitResetBtn
