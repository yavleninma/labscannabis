import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StudioClient } from "./StudioClient";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function StudioPage() {
  if (process.env.STUDIO_ENABLED !== "true") {
    notFound();
  }

  return <StudioClient />;
}
