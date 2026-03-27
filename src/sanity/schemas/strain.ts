import { defineField, defineType } from "sanity";

export const strain = defineType({
  name: "strain",
  title: "Товар",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Название",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Фото",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "type",
      title: "Тип",
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
      title: "Эффект (устар.)",
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
      description: "Устаревшее. Используйте «Профиль эффектов» ниже.",
    }),
    defineField({
      name: "effects",
      title: "Профиль эффектов",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "key",
              title: "Эффект",
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
              title: "Интенсивность (1-5)",
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
      title: "Цена за грамм (THB)",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "shortDescription",
      title: "Короткое описание (EN, для карточки)",
      type: "string",
      validation: (Rule) => Rule.max(150),
    }),
    defineField({
      name: "shortDescriptionRu",
      title: "Короткое описание (RU, для карточки)",
      type: "string",
      validation: (Rule) => Rule.max(150),
    }),
    defineField({
      name: "shortDescriptionTh",
      title: "Короткое описание (TH, для карточки)",
      type: "string",
      validation: (Rule) => Rule.max(150),
    }),
    defineField({
      name: "fullDescription",
      title: "Полное описание (EN, страница товара)",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "fullDescriptionRu",
      title: "Полное описание (RU, страница товара)",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "fullDescriptionTh",
      title: "Полное описание (TH, страница товара)",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "terpenes",
      title: "Терпены (устар.)",
      type: "array",
      of: [{ type: "string" }],
      description: "Устаревший список. Используйте «Профиль терпенов» ниже.",
    }),
    defineField({
      name: "terpeneProfile",
      title: "Профиль терпенов",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Терпен",
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
              title: "Доля (%)",
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
      title: "☆ Выбор персонала",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "isSoldOut",
      title: "Нет в наличии",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "isHidden",
      title: "Скрыть из каталога",
      type: "boolean",
      initialValue: false,
      description: "Если включено, товар не показывается на сайте.",
    }),
    defineField({
      name: "sortOrder",
      title: "Порядок сортировки",
      type: "number",
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: "Порядок сортировки",
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
