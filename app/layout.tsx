import { Providers } from "./providers"

// Styles
import "@/styles/globals.css"
import { JetBrains_Mono, IBM_Plex_Sans } from "next/font/google"
import { cn } from "@/lib/utils"
import { getSettingsValue } from "@/lib/actions/studio/settings/get-settings-value"
import { ThemeProvider } from "next-themes"
import { Metadata } from "next"

const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" })
const IBMPlexSans = IBM_Plex_Sans({ subsets: ["latin"], variable: "--font-sans" })

export async function generateMetadata(): Promise<Metadata> {
  //Get Metadata settings
  const siteName = await getSettingsValue("general_settings", "site_name")

  return {
    title: {
      template: `%s | ${siteName}`,
      default: siteName
    },
    description: {
      template: `%s | ${siteName} Studio`,
      default: `${siteName} Studio`
    }
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const defaultTheme = await getSettingsValue("appearance_settings", "mode")
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("font-mono", jetbrainsMono.variable, "font-sans", IBMPlexSans.variable)}>
      <body className="font-mono antialiased">
        <ThemeProvider attribute="class" defaultTheme={defaultTheme} enableSystem disableTransitionOnChange>
          <Providers session={undefined}>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
