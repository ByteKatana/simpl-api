/**
 * Safely builds a RegExp from a validation pattern defined in an Entry Type.
 * Returns undefined when the pattern is missing or invalid, so the schema
 * can gracefully skip the regex constraint instead of throwing.
 *
 * @param pattern - The user-defined pattern string from field validation config.
 * @returns A RegExp instance, or undefined if the pattern is absent/invalid.
 */
export const buildPatternRegExp = (pattern: unknown): RegExp | undefined => {
  if (typeof pattern !== "string" || pattern.length === 0) return undefined
  try {
    // Pattern is admin-defined Entry Type config, so a dynamic RegExp is required here.
    // eslint-disable-next-line security/detect-non-literal-regexp
    return new RegExp(pattern)
  } catch {
    return undefined
  }
}
