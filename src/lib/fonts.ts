import { Noto_Sans, Noto_Sans_Thai, Noto_Serif, Noto_Serif_Thai } from "next/font/google";

export const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-noto-sans",
  display: "swap",
  preload: true,
});

export const notoSerif = Noto_Serif({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-noto-serif",
  display: "swap",
  preload: true,
});

export const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-noto-sans-thai",
  display: "swap",
  preload: false,
});

export const notoSerifThai = Noto_Serif_Thai({
  subsets: ["thai"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-serif-thai",
  display: "swap",
  preload: false,
});
