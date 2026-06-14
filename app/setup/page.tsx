"use client"

import { useState } from "react"
import SetupForm from "./form"
import { SetupStatus } from "@/components/setup/setup-status"
import { runSetupAction } from "@/app/setup/setup-action"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
import { CircleCheckBig, MessageSquareWarning } from "lucide-react"

export default function SetupPage() {
  const [setupState, setSetupState] = useState<"idle" | "running" | "completed" | "failed">("idle")
  const [currentStep, setCurrentStep] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [setupResult, setSetupResult] = useState({})

  const handleSetup = async (values: any) => {
    setSetupState("running")
    setCurrentStep(0)
    setError(null)

    /*const interval = setInterval(() => {
      setCurrentStep((s) => Math.min(s + 1, 3))
    }, 3000)
*/
    try {
      const result = await runSetupAction(values)
      /*clearInterval(interval)*/
      if (result.success) {
        setSetupResult(result)
        setCurrentStep(4)
        setSetupState("completed")
        toast.success("Setup completed successfully!")
      } else {
        setSetupState("failed")
        setError(result.error || "Something went wrong")
        toast.error("Setup failed: " + (result.error || "Something went wrong"))
      }
    } catch (error) {
      setSetupState("failed")
      setError("Something went wrong")
      toast.error("Setup failed: Something went wrong")
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <Toaster />
      <h1 className="text-3xl font-bold mb-8">Application Setup</h1>
      {setupState === "idle" && <SetupForm onInitiate={handleSetup} isSubmitting={false} />}
      {setupState === "running" && <SetupStatus step={currentStep} />}
      {setupState === "completed" && (
        <div className="flex flex-col gap-5 mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-md">
          <p className="flex flex-col gap-3 justify-center items-center place-self-center text-emerald-800 font-semibold ">
            <CircleCheckBig size={64} />
            <span className="text-4xl">Congratulations!</span>
          </p>
          <p className="text-emerald-800">
            Setup finished! You can now log in with the admin credentials provided during installation.
          </p>

          <p className="text-emerald-800 font-semibold">API Details</p>
          <p className="text-emerald-800 font-semibold">Add generated API Key below to .env file</p>
          <p className="text-emerald-800 bg-emerald-100 p-5 rounded-lg">API_KEY={setupResult.apiKey}</p>
          <p className="text-emerald-800 font-semibold">Admin Credentials:</p>
          <div className="bg-emerald-100 p-5 rounded-lg">
            <p className="text-emerald-800">Username: {setupResult.adminAccount.username}</p>
            <p className="text-emerald-800">Email: {setupResult.adminAccount.email}</p>
            <p className="text-emerald-800">Password: {setupResult.adminAccount.password}</p>
          </div>
          <p className="flex items-center gap-3 bg-primary/50 p-5 text-primary-foreground font-semibold animate-pulse">
            <MessageSquareWarning size={18} />
            <span> Note: Delete ./app/setup folder for security reasons</span>
          </p>
        </div>
      )}
      {setupState === "failed" && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">Setup failed: {error}</p>
          <button
            onClick={() => setSetupState("idle")}
            className="mt-2 text-sm underline text-red-700 hover:text-red-900">
            Try again
          </button>
        </div>
      )}
    </div>
  )
}
