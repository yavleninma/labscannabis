import { GOOGLE_PLACE_QUERY } from "./constants";

export interface GoogleReview {
  name: string;
  initial: string;
  stars: number;
  originalText: string;
  originalLang: string;
  relativeTime: string;
}

export interface GoogleReviewsData {
  rating: number;
  reviewCount: number;
  reviews: GoogleReview[];
}

export async function fetchGoogleReviews(): Promise<GoogleReviewsData | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) return null;

  try {
    const findRes = await fetch(
      `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(GOOGLE_PLACE_QUERY)}&inputtype=textquery&fields=place_id&key=${apiKey}`,
      { next: { revalidate: 3600 } }
    );
    const findData = (await findRes.json()) as {
      candidates?: { place_id: string }[];
    };
    const placeId = findData.candidates?.[0]?.place_id;
    if (!placeId) return null;

    const detailsRes = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=rating,user_ratings_total,reviews&key=${apiKey}`,
      { next: { revalidate: 3600 } }
    );
    const detailsData = (await detailsRes.json()) as {
      result?: {
        rating?: number;
        user_ratings_total?: number;
        reviews?: {
          author_name: string;
          rating: number;
          text: string;
          language?: string;
          relative_time_description: string;
        }[];
      };
    };

    const result = detailsData.result;
    if (!result) return null;

    const reviews: GoogleReview[] = (result.reviews ?? []).map((r) => ({
      name: r.author_name,
      initial: r.author_name.charAt(0).toUpperCase(),
      stars: r.rating,
      originalText: r.text,
      originalLang: r.language ?? "en",
      relativeTime: r.relative_time_description,
    }));

    return {
      rating: result.rating ?? 0,
      reviewCount: result.user_ratings_total ?? 0,
      reviews,
    };
  } catch {
    return null;
  }
}
