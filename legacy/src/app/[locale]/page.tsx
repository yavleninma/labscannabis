import { Hero } from "@/components/Hero";
import { SocialProofStrip } from "@/components/SocialProofStrip";
import { NoPrescription } from "@/components/NoPrescription";
import { FulfillmentOptions } from "@/components/FulfillmentOptions";
import { AboutTeam } from "@/components/AboutTeam";
import { FAQ } from "@/components/FAQ";
import { Reviews } from "@/components/Reviews";
import { StaffPick } from "@/components/StaffPick";
import { StrainCatalog } from "@/components/StrainCatalog";
import { LocationSection } from "@/components/LocationSection";
import { ContactSection } from "@/components/ContactSection";
import { DeliveryAreasGrid } from "@/components/DeliveryAreasGrid";
import { Footer } from "@/components/Footer";
import { getAllAreas, getAllStrains, getStaffPick, getShopSettings } from "@/lib/queries";
import { getStoredUtm } from "@/lib/utm-tracking";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [strains, staffPick, shopSettings, areas, utm] = await Promise.all([
    getAllStrains(),
    getStaffPick(),
    getShopSettings(),
    getAllAreas(),
    getStoredUtm(),
  ]);

  return (
    <>
      <Hero
        shopSettings={shopSettings}
        locale={locale}
        utmSource={utm.source}
        utmCampaign={utm.campaign}
      />
      <SocialProofStrip
        rating={shopSettings.googleRating}
        reviewCount={shopSettings.googleReviewCount}
      />
      {staffPick && (
        <StaffPick
          strain={staffPick}
          locale={locale}
          shopSettings={shopSettings}
          utmSource={utm.source}
          utmCampaign={utm.campaign}
        />
      )}
      <StrainCatalog
        strains={strains}
        shopSettings={shopSettings}
        utmSource={utm.source}
        utmCampaign={utm.campaign}
      />
      <NoPrescription />
      <FulfillmentOptions
        shopSettings={shopSettings}
        locale={locale}
        utmSource={utm.source}
        utmCampaign={utm.campaign}
      />
      <DeliveryAreasGrid areas={areas} locale={locale} />
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
        utmSource={utm.source}
        utmCampaign={utm.campaign}
      />
      <Footer shopSettings={shopSettings} utmSource={utm.source} utmCampaign={utm.campaign} />
    </>
  );
}
