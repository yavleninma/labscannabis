import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { ruKZLocale } from "@sanity/locale-ru-kz";
import { schemaTypes } from "./src/sanity/schemas";
import { aiStrainTool } from "./src/sanity/plugins/ai-strain-tool";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "77odgngy";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export default defineConfig({
  name: "labs-cannabis",
  title: "Labs Cannabis",
  // Must match app route at src/app/studio/[[...tool]]/page.tsx
  basePath: "/studio",
  projectId,
  dataset,
  plugins: [structureTool(), ruKZLocale(), aiStrainTool()],
  schema: {
    types: schemaTypes,
  },
});
