export const slugifyName = (name: string | undefined | null): string =>
  (name ?? "").trim().split(/\s+/).join("-").toLowerCase()
