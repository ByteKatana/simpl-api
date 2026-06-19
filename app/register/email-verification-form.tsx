// "use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel } from "@/components/ui/field"
import { toast } from "sonner"
import { verifyCode } from "@/lib/actions/auth/email-verification"

export function VerificationForm({ email, onSuccess }: { email: string; onSuccess: () => void }) {
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)

  const handleVerify = async () => {
    setLoading(true)
    const result = await verifyCode(email, code)
    setLoading(false)

    if (result.success) {
      toast.success("Email verified!")
      onSuccess()
    } else {
      toast.error("Invalid verification code")
    }
  }

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-card">
      <h3 className="text-lg font-medium">Verify your email</h3>
      <p className="text-sm text-muted-foreground">We sent a code to {email}</p>
      <Field>
        <FieldLabel>6-Digit Code</FieldLabel>
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="123456"
          maxLength={6}
          className="text-center text-2xl tracking-widest"
          aria-label="Verification Code"
        />
      </Field>
      <Button onClick={handleVerify} disabled={loading || code.length !== 6} className="w-full">
        {loading ? "Verifying..." : "Verify Code"}
      </Button>
    </div>
  )
}
