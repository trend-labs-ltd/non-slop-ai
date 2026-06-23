/** Formats an ISO date string (YYYY-MM-DD) as e.g. "20 June 2026". */
export function formatDate(iso: string): string {
  // Parse as UTC so the displayed day doesn't shift across timezones.
  const date = new Date(`${iso}T00:00:00Z`);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
