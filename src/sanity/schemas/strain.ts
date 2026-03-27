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
      title: "Effect",
      type: "string",
      options: {
        list: [
          { title: "Relax", value: "relax" },
          { title: "Energy", value: "energy" },
          { title: "Creative", value: "creative" },
          { title: "Sleep", value: "sleep" },
          { title: "Euphoria", value: "euphoria" },
        ],
      },
      validation: (Rule) => Rule.required(),
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
      name: "fullDescription",
      title: "Full Description (for detail page)",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "terpenes",
      title: "Terpenes",
      type: "array",
      of: [{ type: "string" }],
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
