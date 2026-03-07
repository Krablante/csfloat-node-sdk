export function cleanParams(
  params: Record<string, string | number | boolean | undefined | null>,
): URLSearchParams {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) {
      continue;
    }

    searchParams.set(key, String(value));
  }

  return searchParams;
}
