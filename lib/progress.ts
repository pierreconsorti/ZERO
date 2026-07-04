export function asciiBar(current: number, total: number, width = 10) {
  const safeTotal = Math.max(total, 1);
  const filled = Math.round((current / safeTotal) * width);
  const boundedFilled = Math.min(Math.max(filled, 0), width);

  return `[${"■".repeat(boundedFilled)}${"□".repeat(
    width - boundedFilled
  )}] ${current} of ${total}`;
}

export function estimateReadingMinutes(text: string) {
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  return Math.max(1, Math.round(wordCount / 200));
}
