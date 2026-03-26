import { useTranslations } from "next-intl";

export function Location() {
  const t = useTranslations("location");

  return (
    <section
      id="location"
      className="py-20 sm:py-28 bg-bg-secondary"
      aria-label="Labs Cannabis location — cannabis shop Soi Hollywood South Pattaya"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">
          <span className="text-emerald-500">{t("sectionTitle")}</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Map */}
          <div className="rounded-xl overflow-hidden border border-border aspect-[4/3]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3892.!2d100.8825!3d12.9236!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU1JzI1LjAiTiAxMDDCsDUyJzU3LjAiRQ!5e0!3m2!1sen!2sth!4v1"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Labs Cannabis — cannabis dispensary location on Google Maps, South Pattaya"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center space-y-6">
            <div>
              <h3 className="text-sm font-medium text-emerald-500 uppercase tracking-wider mb-2">
                Address
              </h3>
              <p className="text-text-secondary">{t("address")}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-emerald-500 uppercase tracking-wider mb-2">
                Hours
              </h3>
              {/* TODO: Confirm exact hours */}
              <p className="text-text-primary font-medium">{t("hours")}</p>
              <p className="text-text-muted text-sm mt-1">{t("hoursNote")}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-emerald-500 uppercase tracking-wider mb-2">
                Landmark
              </h3>
              <p className="text-text-secondary">{t("landmark")}</p>
            </div>

            <a
              href="https://maps.app.goo.gl/T67UqNDGdALMC1VZ8"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors w-fit"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {t("getDirections")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
