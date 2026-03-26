import { useTranslations } from "next-intl";

export function About() {
  const t = useTranslations("about");

  return (
    <section
      id="about"
      className="py-20 sm:py-28 bg-bg-secondary"
      aria-label="About Labs Cannabis — Best cannabis dispensary in South Pattaya"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">
          <span className="text-emerald-500">{t("sectionTitle")}</span>
        </h2>

        <div className="space-y-6 text-text-secondary leading-relaxed">
          <p>{t("p1")}</p>
          <p>{t("p2")}</p>
          <p>{t("p3")}</p>
          <p>{t("p4")}</p>
        </div>

        {/* Photo placeholders — TODO: Replace with actual photos */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-14">
          {[
            {
              gradient: "from-emerald-900/40 to-emerald-950/60",
              label: "Premium cannabis flower — Labs Cannabis dispensary Pattaya",
              text: "Premium Flower",
            },
            {
              gradient: "from-emerald-800/30 to-bg-card",
              label: "Boutique dispensary interior — Labs Cannabis Soi Hollywood",
              text: "Our Space",
            },
            {
              gradient: "from-emerald-950/50 to-emerald-900/30",
              label: "Medical consultation — licensed practitioner Pattaya cannabis",
              text: "Consultation",
            },
          ].map((photo) => (
            <div
              key={photo.text}
              className={`aspect-[4/3] rounded-xl bg-gradient-to-br ${photo.gradient} border border-border flex items-end p-4`}
              role="img"
              aria-label={photo.label}
            >
              <span className="text-sm text-text-muted font-medium">{photo.text}</span>
            </div>
          ))}
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-14">
          {[
            {
              icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              ),
              title: "Licensed",
              desc: "Thai medical framework",
            },
            {
              icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              ),
              title: "On-Site Practitioner",
              desc: "Free consultation",
            },
            {
              icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              ),
              title: "Premium Quality",
              desc: "Curated selection",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-bg-card border border-border rounded-xl p-6 text-center"
            >
              <div className="text-emerald-500 flex justify-center mb-3">
                {item.icon}
              </div>
              <h3 className="font-semibold mb-1">{item.title}</h3>
              <p className="text-sm text-text-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
