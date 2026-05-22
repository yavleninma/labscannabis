export interface MediaSlide {
  id: string;
  type: "video" | "image";
  src: string;
  poster?: string;
  webm?: string;
  alt?: string;
}

/** Offer → hero photo → vid-1 → astronaut → vid-2 → rest of gallery */
export const REELS_SLIDES: MediaSlide[] = [
  {
    id: "offer-joints",
    type: "image",
    src: "/images/special-offer-joints.jpg",
    alt: "Three pre-rolls special offer — Labs Cannabis Pattaya",
  },
  {
    id: "img-1",
    type: "image",
    src: "/media/IMG_20260517_175646.jpg",
    alt: "Premium cannabis buds close-up",
  },
  {
    id: "vid-1",
    type: "video",
    src: "/media/VID_20260517_180757.mp4",
    webm: "/media/VID_20260517_180757.webm",
    poster: "/media/VID_20260517_180757-poster.jpg",
  },
  {
    id: "img-7",
    type: "image",
    src: "/media/IMG_20260517_173421.jpg",
    alt: "Premium flower detail",
  },
  {
    id: "vid-2",
    type: "video",
    src: "/media/VID_20260517_180841.mp4",
    webm: "/media/VID_20260517_180841.webm",
    poster: "/media/VID_20260517_180841-poster.jpg",
  },
  {
    id: "img-2",
    type: "image",
    src: "/media/IMG_20260517_173839.jpg",
    alt: "Fresh indoor flower",
  },
  {
    id: "img-3",
    type: "image",
    src: "/media/IMG_20260517_170337.jpg",
    alt: "Cannabis macro shot",
  },
  {
    id: "img-5",
    type: "image",
    src: "/media/IMG_0465.jpg",
    alt: "White Widow buds",
  },
  {
    id: "img-4",
    type: "image",
    src: "/media/IMG_20260517_152910.jpg",
    alt: "Labs Cannabis Pattaya",
  },
  {
    id: "img-6",
    type: "image",
    src: "/media/IMG_20260517_175314.jpg",
    alt: "Shop display",
  },
  {
    id: "img-8",
    type: "image",
    src: "/media/IMG_20260517_170143.jpg",
    alt: "Indoor cannabis",
  },
  {
    id: "img-9",
    type: "image",
    src: "/media/IMG_20260517_153655.jpg",
    alt: "Fresh harvest",
  },
];
