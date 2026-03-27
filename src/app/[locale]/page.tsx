import { Hero } from "@/components/Hero";
import { SocialProofStrip } from "@/components/SocialProofStrip";
import { NoPrescription } from "@/components/NoPrescription";
import { AboutTeam } from "@/components/AboutTeam";
import { FAQ } from "@/components/FAQ";
import { Reviews } from "@/components/Reviews";
import { StaffPick } from "@/components/StaffPick";
import { StrainCatalog } from "@/components/StrainCatalog";
import { LocationSection } from "@/components/LocationSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { getAllStrains, getStaffPick, getShopSettings } from "@/lib/queries";

export const revalidate = 60;

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
      <SocialProofStrip
        rating={shopSettings.googleRating}
        reviewCount={shopSettings.googleReviewCount}
      />
      {staffPick && <StaffPick strain={staffPick} locale={locale} />}
      <StrainCatalog strains={strains} />
      <NoPrescription />
      <AboutTeam shopSettings={shopSettings} />
      <FAQ />
      <Reviews
        rating={shopSettings.googleRating}
        reviewCount={shopSettings.googleReviewCount}
      />
      <LocationSection
        openTime={shopSettings.openTime}
        closeTime={shopSettings.closeTime}
        isOpen24h={shopSettings.isOpen24h}
      />
      <ContactSection
        shopSettings={shopSettings}
      />
      <Footer shopSettings={shopSettings} />
    </>
  );
}
