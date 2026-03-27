import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "77odgngy";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const sanityClient = createClient({
  projectId,
  dataset,
  useCdn: false,
  apiVersion: "2024-01-01",
});
