import { cookies } from "next/headers";
import { UTM_CAMPAIGN_COOKIE, UTM_SOURCE_COOKIE } from "@/lib/utm-constants";

export type StoredUtm = {
  source: string | null;
  campaign: string | null;
};

export async function getStoredUtm(): Promise<StoredUtm> {
  const cookieStore = await cookies();

  return {
    source: cookieStore.get(UTM_SOURCE_COOKIE)?.value ?? null,
    campaign: cookieStore.get(UTM_CAMPAIGN_COOKIE)?.value ?? null,
  };
}
