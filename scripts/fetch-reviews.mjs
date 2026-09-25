import { mkdir, writeFile } from 'node:fs/promises';

const key = process.env.GOOGLE_PLACES_API_KEY;
const placeId = process.env.GOOGLE_PLACE_ID;

if (!key || !placeId) {
  console.log('GOOGLE_PLACES_API_KEY / GOOGLE_PLACE_ID not set - skipping review refresh.');
  process.exit(0);
}

const res = await fetch(
  `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=en`,
  {
    headers: {
      'X-Goog-Api-Key': key,
      'X-Goog-FieldMask': 'rating,userRatingCount,reviews',
    },
  }
);

if (!res.ok) {
  console.warn(`Places API returned ${res.status}: ${await res.text()} - keeping existing reviews.`);
  process.exit(0);
}

const place = await res.json();

const out = {
  updated: new Date().toISOString(),
  rating: place.rating ?? null,
  count: place.userRatingCount ?? null,
  reviews: (place.reviews || []).map((r) => ({
    author: r.authorAttribution?.displayName || 'Google user',
    rating: r.rating || 5,
    text: r.text?.text || r.originalText?.text || '',
    when: r.relativePublishTimeDescription || '',
    published: r.publishTime || '',
  })),
};

await mkdir('data', { recursive: true });
await writeFile('data/reviews.json', JSON.stringify(out, null, 2));
console.log(`Saved ${out.reviews.length} reviews, rating ${out.rating} (${out.count}).`);
