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
      description: "Format HH:mm, for example 09:30",
      hidden: ({ document }) => Boolean(document?.isOpen24h),
    }),
    defineField({
      name: "closeTime",
      title: "Closing Time",
      type: "string",
      initialValue: "01:00",
      description: "Format HH:mm, for example 21:00",
      hidden: ({ document }) => Boolean(document?.isOpen24h),
    }),
    defineField({
      name: "isOpen24h",
      title: "Open 24/7",
      type: "boolean",
      initialValue: false,
      description: "Turn on for round-the-clock opening. Time fields are ignored when enabled.",
    }),
    defineField({
      name: "lineUrl",
      title: "LINE URL",
      type: "url",
    }),
    defineField({
      name: "lineId",
      title: "LINE ID",
      type: "string",
      description: "Optional. Used to build LINE links when LINE URL is not set.",
    }),
    defineField({
      name: "whatsappUrl",
      title: "WhatsApp URL",
      type: "url",
    }),
    defineField({
      name: "whatsappNumber",
      title: "WhatsApp Number",
      type: "string",
      description: "Optional. Include country code. Used when WhatsApp URL is not set.",
    }),
    defineField({
      name: "telegramUrl",
      title: "Telegram URL",
      type: "url",
    }),
    defineField({
      name: "telegramId",
      title: "Telegram Username/ID",
      type: "string",
      description: "Optional. Used to build Telegram links when Telegram URL is not set.",
    }),
    defineField({
      name: "phone",
      title: "Phone Number",
      type: "string",
      description: "Optional. Used for call link and as fallback for WhatsApp/LINE.",
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
