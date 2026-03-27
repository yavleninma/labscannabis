import { defineField, defineType } from "sanity";

export const strain = defineType({
  name: "strain",
  title: "Strain",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Indica", value: "indica" },
          { title: "Sativa", value: "sativa" },
          { title: "Hybrid", value: "hybrid" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "effect",
      title: "Effect (legacy)",
      type: "string",
      options: {
        list: [
          { title: "Relax", value: "relax" },
          { title: "Energy", value: "energy" },
          { title: "Creative", value: "creative" },
          { title: "Sleep", value: "sleep" },
          { title: "Euphoria", value: "euphoria" },
          { title: "Focus", value: "focus" },
          { title: "Happy", value: "happy" },
          { title: "Uplifted", value: "uplifted" },
          { title: "Talkative", value: "talkative" },
          { title: "Hungry", value: "hungry" },
        ],
      },
      description: "Deprecated. Prefer 'Effects profile' below.",
    }),
    defineField({
      name: "effects",
      title: "Effects profile",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "key",
              title: "Effect",
              type: "string",
              options: {
                list: [
                  { title: "Relax", value: "relax" },
                  { title: "Energy", value: "energy" },
                  { title: "Creative", value: "creative" },
                  { title: "Sleep", value: "sleep" },
                  { title: "Euphoria", value: "euphoria" },
                  { title: "Focus", value: "focus" },
                  { title: "Happy", value: "happy" },
                  { title: "Uplifted", value: "uplifted" },
                  { title: "Talkative", value: "talkative" },
                  { title: "Hungry", value: "hungry" },
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "amount",
              title: "Intensity (1-5)",
              type: "number",
              validation: (Rule) => Rule.required().integer().min(1).max(5),
            }),
          ],
          preview: {
            select: {
              key: "key",
              amount: "amount",
            },
            prepare(selection) {
              const { key, amount } = selection as { key?: string; amount?: number };
              return {
                title: key || "Effect",
                subtitle: typeof amount === "number" ? `Intensity: ${amount}/5` : "No intensity",
              };
            },
          },
        },
      ],
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: "thcPercent",
      title: "THC %",
      type: "number",
      validation: (Rule) => Rule.min(0).max(100),
    }),
    defineField({
      name: "cbdPercent",
      title: "CBD %",
      type: "number",
      validation: (Rule) => Rule.min(0).max(100),
    }),
    defineField({
      name: "pricePerGram",
      title: "Price per gram (THB)",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "shortDescription",
      title: "Short Description (for card)",
      type: "string",
      validation: (Rule) => Rule.max(150),
    }),
    defineField({
      name: "shortDescriptionRu",
      title: "Short Description (RU)",
      type: "string",
      validation: (Rule) => Rule.max(150),
    }),
    defineField({
      name: "shortDescriptionTh",
      title: "Short Description (TH)",
      type: "string",
      validation: (Rule) => Rule.max(150),
    }),
    defineField({
      name: "fullDescription",
      title: "Full Description (for detail page)",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "fullDescriptionRu",
      title: "Full Description (RU)",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "fullDescriptionTh",
      title: "Full Description (TH)",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "terpenes",
      title: "Terpenes",
      type: "array",
      of: [{ type: "string" }],
      description: "Legacy text list. Prefer 'Terpene profile' below.",
    }),
    defineField({
      name: "terpeneProfile",
      title: "Terpene profile",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Terpene",
              type: "string",
              options: {
                list: [
                  { title: "Myrcene", value: "Myrcene" },
                  { title: "Caryophyllene", value: "Caryophyllene" },
                  { title: "Limonene", value: "Limonene" },
                  { title: "Pinene", value: "Pinene" },
                  { title: "Terpinolene", value: "Terpinolene" },
                  { title: "Ocimene", value: "Ocimene" },
                  { title: "Linalool", value: "Linalool" },
                  { title: "Humulene", value: "Humulene" },
                  { title: "Nerolidol", value: "Nerolidol" },
                  { title: "Bisabolol", value: "Bisabolol" },
                  { title: "Fenchol", value: "Fenchol" },
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "amount",
              title: "Share (%)",
              type: "number",
              validation: (Rule) => Rule.required().min(0).max(100),
            }),
          ],
          preview: {
            select: {
              name: "name",
              amount: "amount",
            },
            prepare(selection) {
              const { name, amount } = selection as { name?: string; amount?: number };
              return {
                title: name || "Terpene",
                subtitle: typeof amount === "number" ? `${amount}%` : "No amount",
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: "isStaffPick",
      title: "☆ Staff Pick",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "isSoldOut",
      title: "Sold Out",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: "Sort Order",
      name: "sortOrder",
      by: [{ field: "sortOrder", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "type",
      media: "image",
    },
  },
});
