// src/ai/rules.js
// Simple, explainable, rule-based engine: face shape + booking history boosts.

export const STYLES = [
  {
    id: "modern-fade",
    name: "Modern Fade",
    faceShapes: ["Oval", "Square"],
    maintenance: "Medium",
    difficulty: "Medium",
    image:
      "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1600&auto=format",
    service: "Skin Fade",
  },
  {
    id: "classic-side-part",
    name: "Classic Side Part",
    faceShapes: ["Oval", "Square", "Heart"],
    maintenance: "Low",
    difficulty: "Easy",
    image:
      "https://images.unsplash.com/photo-1520975661595-6453be3f7070?q=80&w=1600&auto=format",
    service: "Haircut & Styling",
  },
  {
    id: "textured-crop",
    name: "Textured Crop",
    faceShapes: ["Round", "Oval"],
    maintenance: "Medium",
    difficulty: "Medium",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format",
    service: "Haircut & Styling",
  },
  {
    id: "tight-taper",
    name: "Tight Taper",
    faceShapes: ["Round", "Diamond", "Square"],
    maintenance: "Low",
    difficulty: "Medium",
    image:
      "https://images.unsplash.com/photo-1520340356584-8cd4a5c1bb72?q=80&w=1600&auto=format",
    service: "Haircut & Styling",
  },
  {
    id: "low-fade-beard",
    name: "Low Fade + Beard",
    faceShapes: ["Oval", "Square", "Round"],
    maintenance: "Medium",
    difficulty: "Medium",
    image:
      "https://images.unsplash.com/photo-1487412912498-0447578fcca8?q=80&w=1600&auto=format",
    service: "Cut + Beard",
  },
  {
    id: "buzz-clean",
    name: "Buzz & Clean",
    faceShapes: ["Square", "Diamond"],
    maintenance: "Very Low",
    difficulty: "Easy",
    image:
      "https://images.unsplash.com/photo-1506792006437-256b665541e9?q=80&w=1600&auto=format",
    service: "Haircut & Styling",
  },
];

/**
 * Compute a confidence score (0–1) for a style.
 * Base = face shape match; + history boost if user often books its service;
 * + recency nudge for most recent service.
 */
export function getStyleRecommendations(profile = {}, history = []) {
  const face = (profile.faceShape || "Oval").toLowerCase();

  // Count bookings by service for a simple popularity signal
  const serviceCounts = history.reduce((acc, a) => {
    acc[a.service] = (acc[a.service] || 0) + 1;
    return acc;
  }, {});
  const mostRecentService = history[0]?.service;

  const scored = STYLES.map((style) => {
    let score = 0;

    // Face shape match (biggest factor)
    const matchesFace = style.faceShapes.some(
      (fs) => fs.toLowerCase() === face
    );
    score += matchesFace ? 0.6 : 0.2; // if no match, still allow but lower

    // Popularity with this user (how often they've booked that service)
    const svcBoost = Math.min((serviceCounts[style.service] || 0) * 0.08, 0.24);
    score += svcBoost;

    // Recency nudge if the last appointment matches this service
    if (mostRecentService && mostRecentService === style.service) {
      score += 0.08;
    }

    // Clamp
    if (score > 1) score = 1;

    return { ...style, score };
  });

  // Sort by confidence (desc)
  scored.sort((a, b) => b.score - a.score);
  return scored;
}

// Utility: pick the next good time window (for your sidebar hints, if needed)
export function bestTimeWindow(history = []) {
  // naive example: if most history is on weekends, suggest Thu–Sat evenings
  const win = { label: "Thu 5–7pm or Sat 10–12", reason: "based on your history" };
  return win;
}
