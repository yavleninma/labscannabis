import { defineField, defineType } from "sanity";

export const shopSettings = defineType({
  name: "shopSettings",
  title: "Shop Settings",
  type: "document",
  fields: [
    defineField({
      name: "openTime",
      title: "Opening Time",
      type: "string",
      initialValue: "12:00",
    }),
    defineField({
      name: "closeTime",
      title: "Closing Time",
      type: "string",
      initialValue: "01:00",
    }),
    defineField({
      name: "lineUrl",
      title: "LINE URL",
      type: "url",
    }),
    defineField({
      name: "whatsappUrl",
      title: "WhatsApp URL",
      type: "url",
    }),
    defineField({
      name: "telegramUrl",
      title: "Telegram URL",
      type: "url",
    }),
    defineField({
      name: "announcement",
      title: "Announcement Banner",
      type: "string",
      description: "Optional announcement text shown at the top of the site",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Shop Settings" };
    },
  },
});
