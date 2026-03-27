import { Hero } from "@/components/Hero";
import { NoPrescription } from "@/components/NoPrescription";
import { StaffPick } from "@/components/StaffPick";
import { StrainCatalog } from "@/components/StrainCatalog";
import { Reviews } from "@/components/Reviews";
import { LocationSection } from "@/components/LocationSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { getAllStrains, getStaffPick, getShopSettings } from "@/lib/queries";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [strains, staffPick, shopSettings] = await Promise.all([
    getAllStrains(),
    getStaffPick(),
    getShopSettings(),
  ]);

  return (
    <>
      <Hero />
      <NoPrescription />
      {staffPick && <StaffPick strain={staffPick} locale={locale} />}
      <StrainCatalog strains={strains} />
      <Reviews />
      <LocationSection />
      <ContactSection
        lineUrl={shopSettings.lineUrl}
        whatsappUrl={shopSettings.whatsappUrl}
        telegramUrl={shopSettings.telegramUrl}
      />
      <Footer />
    </>
  );
}
