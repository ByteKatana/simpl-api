export default function UnauthorizedPage() {
  return (
    <main style={{ textAlign: "center", padding: "100px" }}>
      <h1>403 - Unauthorized</h1>
      <p>You do not have the permissions required to view this page.</p>
      <a href="/studio" style={{ color: "blue", textDecoration: "underline" }}>
        Return Home
      </a>
    </main>
  )
}
