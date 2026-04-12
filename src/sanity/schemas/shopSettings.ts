import { defineField, defineType } from "sanity";

export const shopSettings = defineType({
  name: "shopSettings",
  title: "Настройки магазина",
  type: "document",
  fields: [
    defineField({
      name: "openTime",
      title: "Время открытия",
      type: "string",
      initialValue: "12:00",
      description: "Формат ЧЧ:мм, например 09:30",
      hidden: ({ document }) => Boolean(document?.isOpen24h),
    }),
    defineField({
      name: "closeTime",
      title: "Время закрытия",
      type: "string",
      initialValue: "01:00",
      description: "Формат ЧЧ:мм, например 21:00",
      hidden: ({ document }) => Boolean(document?.isOpen24h),
    }),
    defineField({
      name: "isOpen24h",
      title: "Открыто 24/7",
      type: "boolean",
      initialValue: false,
      description: "Если включено, магазин работает круглосуточно. Поля времени игнорируются.",
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
      description: "Необязательно. Используется для ссылок LINE, когда URL не указан.",
    }),
    defineField({
      name: "whatsappUrl",
      title: "WhatsApp URL",
      type: "url",
    }),
    defineField({
      name: "whatsappNumber",
      title: "WhatsApp номер",
      type: "string",
      description: "Необязательно. Укажите код страны. Используется, когда URL не указан.",
    }),
    defineField({
      name: "telegramUrl",
      title: "Telegram URL",
      type: "url",
    }),
    defineField({
      name: "telegramId",
      title: "Telegram имя/ID",
      type: "string",
      description: "Необязательно. Используется для ссылок Telegram, когда URL не указан.",
    }),
    defineField({
      name: "phone",
      title: "Номер телефона",
      type: "string",
      description: "Необязательно. Используется для звонков и как запасной вариант для WhatsApp/LINE.",
    }),
    defineField({
      name: "announcement",
      title: "Баннер объявлений",
      type: "string",
      description: "Необязательный текст объявления вверху сайта",
    }),
    defineField({
      name: "deliveryEnabled",
      title: "Каналы выдачи — Доставка включена",
      type: "boolean",
      initialValue: true,
      description:
        "Показывать карточку доставки на главной. Мягкая подача — без зон и цен, клиент пишет в мессенджер.",
    }),
    defineField({
      name: "pickupEnabled",
      title: "Каналы выдачи — Самовывоз включён",
      type: "boolean",
      initialValue: true,
      description:
        "Показывать карточку самовывоза на главной. Клиент пишет заранее и забирает готовый заказ.",
    }),
    defineField({
      name: "fulfillmentNote",
      title: "Каналы выдачи — Заметка",
      type: "string",
      description:
        "Необязательный короткий текст под заголовком блока (например: «Доставка только до 22:00»).",
    }),
    defineField({
      name: "googleRating",
      title: "Рейтинг Google",
      type: "number",
      initialValue: 4.8,
      description: "Текущий рейтинг на Google Maps (напр. 4.8). Обновляйте вручную.",
      validation: (rule) => rule.min(1).max(5).precision(1),
    }),
    defineField({
      name: "googleReviewCount",
      title: "Кол-во отзывов Google",
      type: "number",
      initialValue: 91,
      description: "Общее число отзывов на Google. Обновляйте вручную.",
      validation: (rule) => rule.min(0).integer(),
    }),
    defineField({
      name: "guidePhoto",
      title: "Фото гида (Дмитрий)",
      type: "image",
      description: "Фото консультанта, отображается на главной.",
      options: { hotspot: true },
    }),
    defineField({
      name: "teamPhoto",
      title: "Фото команды",
      type: "image",
      description: "Фото команды магазина, отображается на главной.",
      options: { hotspot: true },
    }),
  ],
  preview: {
    prepare() {
      return { title: "Настройки магазина" };
    },
  },
});
