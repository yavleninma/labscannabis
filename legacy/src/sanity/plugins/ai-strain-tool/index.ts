import { definePlugin } from "sanity";
import { AiStrainTool } from "./AiStrainTool";

export const aiStrainTool = definePlugin({
  name: "ai-strain-tool",
  tools: [
    {
      name: "ai-strain-tool",
      title: "AI Strain Generator",
      component: AiStrainTool,
    },
  ],
});
