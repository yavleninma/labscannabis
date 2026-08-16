export interface AreaDetails {
  landmarks: string[];
}

// Neutral geographic references only. Travel time, service coverage and stock
// must come from a live source and are intentionally not stored here.
export const AREA_DETAILS: Record<string, AreaDetails> = {
  pattaya: { landmarks: ["Walking Street", "Beach Road", "Central Pattaya"] },
  jomtien: { landmarks: ["Jomtien Beach", "Jomtien Plaza", "View Talay"] },
  "walking-street": { landmarks: ["Walking Street", "Bali Hai Pier", "Pattaya 13 Alley"] },
  "soi-hollywood": { landmarks: ["Soi Hollywood", "Pattaya 13 Alley", "Walking Street"] },
  "soi-buakhao": { landmarks: ["Soi Buakhao", "Soi LK Metro", "Soi Diana", "Second Road"] },
  naklua: { landmarks: ["Naklua", "Wong Amat", "Terminal 21 Pattaya"] },
  pratumnak: { landmarks: ["Pratumnak Hill", "Cosy Beach", "Big Buddha"] },
  "central-pattaya": { landmarks: ["Central Pattaya", "Beach Road", "Central Festival"] },
};

export function renderCopy(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_match, key: string) => String(vars[key] ?? ""));
}
