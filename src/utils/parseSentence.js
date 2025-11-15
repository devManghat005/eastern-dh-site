export function parseSentenceToMonths(raw) {
  if (!raw) return null;
  const text = raw.toString().trim().toLowerCase();

  let years = 0;
  let months = 0;

  // Match years: "2 years", "2yrs", "1 yr", "4 y"
  const yearMatch = text.match(/(\d+)\s*(year|years|yr|yrs|y)\b/);
  if (yearMatch) {
    years = parseInt(yearMatch[1], 10);
  }

  // Match months: "6 months", "6mos", "6 m"
  const monthMatch = text.match(/(\d+)\s*(month|months|mos|m)\b/);
  if (monthMatch) {
    months = parseInt(monthMatch[1], 10);
  }

  // If the entire string is only a number → assume months
  if (!yearMatch && !monthMatch) {
    const numOnly = text.match(/^(\d+)$/);
    if (numOnly) {
      months = parseInt(numOnly[1], 10);
    } else {
      return null; // Could not parse
    }
  }

  return years * 12 + months;
}
