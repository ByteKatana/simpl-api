import { SessionProvider } from "next-auth/react"

//Styles
import "../styles/globals.css"
import "tailwindcss/tailwind.css"

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}

export default MyApp
