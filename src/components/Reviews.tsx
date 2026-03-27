import { useTranslations } from "next-intl";

const reviews = [
  {
    name: "Mike R.",
    initial: "M",
    stars: 5,
    text: "Best dispensary in Pattaya hands down. The staff really knows their strains and helped me pick the perfect one. Clean shop, great vibes.",
    lang: "en",
  },
  {
    name: "Алексей К.",
    initial: "А",
    stars: 5,
    text: "Отличный магазин! Ребята помогли с оформлением карты прямо на месте за пару минут. Выбор сортов хороший, цены адекватные. Рекомендую.",
    lang: "ru",
  },
  {
    name: "Sarah T.",
    initial: "S",
    stars: 5,
    text: "So easy! I was nervous about the medical card thing but they walked me through everything. Great selection and very knowledgeable staff.",
    lang: "en",
  },
];

function Stars({ count }: { count: number }) {
  return (
    <span className="text-yellow-400 text-sm">
      {"★".repeat(count)}
      {"☆".repeat(5 - count)}
    </span>
  );
}

export function Reviews() {
  const t = useTranslations("reviews");

  return (
    <section className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-3xl sm:text-4xl font-bold mb-1">
            4.8 <span className="text-yellow-400">★★★★★</span>
          </div>
          <p className="text-text-secondary text-sm">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {reviews.map((review) => (
            <div
              key={review.name}
              className="bg-bg-card border border-border rounded-xl p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-bold">
                  {review.initial}
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {review.name}
                  </p>
                  <Stars count={review.stars} />
                </div>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed">
                &ldquo;{review.text}&rdquo;
              </p>
              <p className="text-text-muted text-xs mt-3">via Google</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
