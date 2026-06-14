"use client"

import { signIn } from "next-auth/react"
/*import { signIn as signInWithPasskey } from "next-auth/webauthn"*/
import { useRouter } from "next/navigation"
import { useState, FormEvent, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Loader2 } from "lucide-react"
import {
  SiGithub,
  SiGitlab,
  SiBitbucket,
  SiAtlassian,
  SiVercel,
  SiNetlify,
  SiGoogle,
  SiApple,
  SiSlack,
  SiZoom,
  SiNotion,
  SiTodoist,
  SiLinkedin,
  SiClickup,
  SiHuggingface,
  SiYandex,
  SiMaildotru
} from "react-icons/si"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

/**
 * Login Form Component (Client Component)
 *
 * Updated with OAuth provider grid and shadcn/ui components.
 */

type Props = {
  authMethods: {
    built_in: object
    third_party: object
  }
}
export default function LoginForm({ authMethods }: Props) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null)

  const oauthProviders = [
    { id: "github", name: "GitHub", icon: SiGithub },
    { id: "gitlab", name: "GitLab", icon: SiGitlab },
    { id: "bitbucket", name: "Bitbucket", icon: SiBitbucket },
    { id: "atlassian", name: "Atlassian", icon: SiAtlassian },
    { id: "vercel", name: "Vercel", icon: SiVercel },
    { id: "netlify", name: "Netlify", icon: SiNetlify },
    { id: "google", name: "Google", icon: SiGoogle },
    { id: "apple", name: "Apple", icon: SiApple },
    { id: "slack", name: "Slack", icon: SiSlack },
    { id: "zoom", name: "Zoom", icon: SiZoom },
    { id: "notion", name: "Notion", icon: SiNotion },
    { id: "todoist", name: "Todoist", icon: SiTodoist },
    { id: "linkedin", name: "LinkedIn", icon: SiLinkedin },
    { id: "clickup", name: "ClickUp", icon: SiClickup },
    { id: "huggingface", name: "Hugging Face", icon: SiHuggingface },
    { id: "yandex", name: "Yandex", icon: SiGoogle },
    { id: "mailru", name: "Mail.Ru", icon: SiMaildotru }
  ]
  // Filter providers based on authMethods.third_party configuration
  const enabledThirdPartyProviders = useMemo(
    () => oauthProviders.filter((provider) => authMethods.third_party[provider.id] === true),
    [authMethods, oauthProviders]
  )

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false
      })

      if (result?.error) {
        setError(result?.error || "Invalid credentials or cannot connect to the server.")
        setIsLoading(false)
      } else if (result?.ok) {
        router.push("/studio")
        router.refresh()
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("An error occurred during login")
      setIsLoading(false)
    }
  }

  const handleOAuthSignIn = async (providerId: string) => {
    setLoadingProvider(providerId)
    try {
      await signIn(providerId, { callbackUrl: "/studio" })
    } catch (error) {
      console.error(`${providerId} login error:`, error)
      setError(`Could not sign in with ${providerId}`)
      setLoadingProvider(null)
    }
  }

  return (
    <Card className="border-2 shadow-sm w-full max-w-md mx-auto">
      <CardHeader className="space-y-1 text-center">
        <div className="mb-2">
          <a href="#" className="text-4xl font-raleway font-bold text-slate-800 hover:text-primary transition-colors">
            simpl:api
          </a>
        </div>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>Enter your credentials or choose a provider</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-sm">
              {error}
            </div>
          )}

          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              required
              disabled={isLoading || !!loadingProvider}
              className="h-10 text-base"
              aria-label={"Email"}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              disabled={isLoading || !!loadingProvider}
              className="h-10 text-base"
              aria-label={"Password"}
            />
          </Field>

          <Button
            type="submit"
            className="w-full h-10 text-sm uppercase font-semibold"
            disabled={isLoading || !!loadingProvider}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </form>
        {/*{authMethods.built_in["passkeys"] && (
          <>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => signInWithPasskey("passkey")}
                className="px-4 py-2 bg-slate-600 text-white rounded shadow">
                Sign in with Passkey / Yubikey
              </button>
            </div>
          </>
        )}*/}
        {enabledThirdPartyProviders.length > 0 && (
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
        )}
        <TooltipProvider>
          <div className="grid grid-cols-6 gap-2">
            {enabledThirdPartyProviders.map((provider) => (
              <Tooltip key={provider.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-full h-10"
                    onClick={() => handleOAuthSignIn(provider.id)}
                    aria-label={`Sign in with ${provider.name}`}
                    disabled={isLoading || !!loadingProvider}>
                    {loadingProvider === provider.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <provider.icon className="h-5 w-5" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{provider.name}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  )
}
