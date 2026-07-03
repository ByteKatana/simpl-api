import { CheckCircle2, CircleDashed, Loader2 } from "lucide-react"

export function SetupStatus({ step }: { step: number }) {
  const steps = ["Creating admin account, seeding database and generating API Key..."]

  return (
    <div className="space-y-4 p-6 border rounded-lg bg-card">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Loader2 className="animate-spin" /> Setup in Progress...
      </h3>
      <div className="space-y-3">
        {steps.map((label, index) => (
          <div key={index} className="flex items-center gap-3">
            {step > index ? (
              <CheckCircle2 className="text-emerald-500 w-5 h-5" />
            ) : step === index ? (
              <CircleDashed className="text-blue-500 animate-spin w-5 h-5" />
            ) : (
              <CircleDashed className="text-muted-foreground w-5 h-5" />
            )}
            <span className={step === index ? "font-medium" : "text-muted-foreground"}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
