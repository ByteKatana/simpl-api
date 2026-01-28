import { Providers } from "./providers"

// Styles
import "@/styles/globals.css"
import "tailwindcss/tailwind.css"

export const metadata = {
  title: "simpl:api",
  description: "simpl:api dashboard"
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Raleway:wght@900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers session={undefined}>{children}</Providers>
      </body>
    </html>
  )
}
