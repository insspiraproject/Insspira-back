export function parseFeatures(featuresCsv?: string | null): string[] {
  return (featuresCsv ?? '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
}
export function joinFeatures(features: string[]): string {
  return features.join(', ');
}