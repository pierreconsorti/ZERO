import { RotatingText } from "./rotating-text";

const facts = [
  "Observed warming, atmospheric greenhouse gas growth, radiative physics, and attribution studies point in the same direction.",
  "Methane has a shorter atmospheric lifetime than CO2 and a strong warming effect over the next few decades.",
  "Clean electricity is expanding, but infrastructure constraints and fossil lock-in shape the speed of transition.",
  "Heat, flood, drought, wildfire, sea level, and food-system risks are already changing in measurable ways.",
  "Climate progress depends on systems learning faster than warming accumulates."
];

export function FooterFact() {
  return (
    <p>
      <RotatingText items={facts} intervalMs={7200} />
    </p>
  );
}
