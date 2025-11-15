// ----------------------
// Helper: convert sentencing text into months
// ----------------------
export function parseSentenceToMonths(text) {
  if (!text) return null;

  const lower = text.toLowerCase();

  // Extract years and months
  const yearMatch = lower.match(/(\d+)\s*year/);
  const monthMatch = lower.match(/(\d+)\s*month/);

  const years = yearMatch ? parseInt(yearMatch[1]) : 0;
  const months = monthMatch ? parseInt(monthMatch[1]) : 0;

  const total = years * 12 + months;
  return total > 0 ? total : null;
}



// ----------------------
// Helper: classify race (NEW LOGIC)
// ----------------------
export function classifyRace(raw) {
  if (!raw) return "Unknown";

  const val = raw.toLowerCase();

  if (val.includes("black")) return "Black";
  if (val.includes("mul")) return "Mulatto";

  return "Other";
}



// ----------------------
// Step 1: preprocess rows
// ----------------------
export function preprocessRows(rows, raceCol, sentenceCol) {
  return rows
    .map(r => {
      const rawRace = r[raceCol]?.trim() || "";
      const race = classifyRace(rawRace);

      const sentenceRaw = r[sentenceCol]?.trim() || "";
      const months = parseSentenceToMonths(sentenceRaw);

      return { race, months };
    })
    .filter(r => r.months !== null); // remove invalid sentences
}



// ----------------------
// Step 2: compute average sentence length by race
// ----------------------
export function computeAvgSentenceByRace(processedRows) {
  const groups = {};
  const counts = {};

  processedRows.forEach(r => {
    if (!groups[r.race]) {
      groups[r.race] = 0;
      counts[r.race] = 0;
    }
    groups[r.race] += r.months;
    counts[r.race] += 1;
  });

  const result = [];
  Object.keys(groups).forEach(race => {
    const avg = groups[race] / counts[race];
    result.push({ race, averageMonths: Math.round(avg) });
  });

  return result;
}



// ----------------------
// Step 3: compute distributions (list of sentence lengths)
// ----------------------
export function computeSentenceDistribution(processedRows) {
  const dist = {};

  processedRows.forEach(r => {
    if (!dist[r.race]) dist[r.race] = [];
    dist[r.race].push(r.months);
  });

  return dist;
}
