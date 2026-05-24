import { defineField, defineType } from "sanity";

export const area = defineType({
  name: "area",
  title: "Зона доставки (Pattaya)",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Название (EN)",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "nameRu",
      title: "Название (RU)",
      type: "string",
    }),
    defineField({
      name: "nameTh",
      title: "Название (TH)",
      type: "string",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "etaMinutes",
      title: "ETA в минутах",
      type: "number",
      initialValue: 30,
      validation: (rule) => rule.min(1).integer(),
    }),
    defineField({
      name: "shortDescription",
      title: "Короткое описание (EN)",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "shortDescriptionRu",
      title: "Короткое описание (RU)",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "shortDescriptionTh",
      title: "Короткое описание (TH)",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "landmarks",
      title: "Ориентиры",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "isHidden",
      title: "Скрыто",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "sortOrder",
      title: "Порядок",
      type: "number",
      initialValue: 100,
    }),
  ],
});
