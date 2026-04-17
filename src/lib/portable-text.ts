export type PortableTextSpan = {
  _type: "span";
  _key?: string;
  marks?: string[];
  text: string;
};

export type PortableTextBlock = {
  _type: string;
  _key?: string;
  style?: string;
  children?: PortableTextSpan[];
  [key: string]: unknown;
};

export function portableTextToPlainText(
  blocks: PortableTextBlock[] | null | undefined,
): string {
  if (!blocks?.length) {
    return "";
  }

  return blocks
    .map((block) => {
      if (!Array.isArray(block.children)) {
        return "";
      }

      return block.children
        .map((child) => (typeof child.text === "string" ? child.text : ""))
        .join("")
        .trim();
    })
    .filter(Boolean)
    .join("\n\n");
}

export function plainTextToPortableText(text: string): PortableTextBlock[] {
  return text
    .split(/\n+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((paragraph) => ({
      _type: "block",
      style: "normal",
      children: [{ _type: "span", marks: [], text: paragraph }],
      markDefs: [],
    }));
}
