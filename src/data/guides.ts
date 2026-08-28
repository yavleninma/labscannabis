import type { Locale } from "@/lib/i18n";
import type { CopySection, FaqItem } from "@/data/visit-copy";

/**
 * Знаниевый кластер (T-04, T-11).
 *
 * Правовой гид — единственная страница сайта, которая берёт первое место
 * честной работой и не упирается ни в одно железное правило. Соседние вопросы
 * («нужен ли рецепт», «как проходит первый визит», «как выбрать цветок»)
 * в паттайской выдаче практически пусты, и закрываются они тем же способом:
 * длинным собственным текстом с видимой датой и проверяемыми утверждениями.
 *
 * Общая форма гайда лежит здесь, тексты — в отдельных файлах по гайду, чтобы
 * один слаг нельзя было случайно переиспользовать под другой интент.
 *
 * ЖЁСТКИЕ ОГРАНИЧЕНИЯ, которые действуют на все гайды, кроме правового:
 * • денежные суммы (включая размеры штрафов) разрешены линтером ТОЛЬКО на
 *   `guides/legal-cannabis-tourists` — в остальных гайдах штраф называется
 *   словами, без цифры;
 * • содержание каннабиноидов и нормативные пороги — там же и только там;
 * • ни одного обещания «без рецепта», ни одного медицинского утверждения;
 * • ни цен, ни меню, ни наличия, ни онлайн-заказа.
 */

/**
 * Единственный источник даты обновления для всего знаниевого кластера, включая
 * правовой гид и страницы доставки.
 *
 * Отсюда берётся и машинная дата (`Article.dateModified`, `<time datetime>`), и
 * видимая подпись — её собирает `formatUpdatedLabel()` из `@/lib/updated-date`.
 * Раньше видимых строк было двадцать с лишним (по одной на локаль в четырёх
 * файлах копирайта) плюс третий литерал в `delivery/[area].astro`, и они уже
 * разъехались: страница показывала одновременно «Updated 28 August 2026» и
 * «Official sources rechecked 16 August 2026», а часть страниц отдавала
 * `dateModified` за 16 августа.
 */
export const GUIDES_UPDATED_ON = "2026-08-28";
/** Дата первой публикации кластера — уходит в `Article.datePublished`. */
export const GUIDES_PUBLISHED_ON = "2026-08-28";

/**
 * Основание раздела, которое печатается ВИДИМО над текстом. Пересказ
 * официального уведомления и практическая осторожность — разные вещи, и
 * читатель обязан видеть, что именно он читает. Тот же приём, что в
 * `LEGAL_GUIDE_COPY`.
 */
export type GuideBasis = "official" | "practice";

export interface GuideSection extends CopySection {
  basis: GuideBasis;
}

export interface GuideCopy {
  title: string;
  description: string;
  h1: string;
  kicker: string;
  basisLabels: Record<GuideBasis, string>;
  intro: string;
  /** Короткий проверяемый чеклист над длинным текстом — его цитируют ИИ-поиски. */
  checklistTitle: string;
  checklist: string[];
  sections: GuideSection[];
  faqTitle: string;
  faq: FaqItem[];
  /** Подпись под текстом: что этот гайд не является юридической консультацией. */
  cautionTitle: string;
  caution: string;
}

export type GuideCopyByLocale = Record<Locale, GuideCopy>;
/** Гайды, написанные не на всех локалях: en+ru пишутся первыми, остальные — нет. */
export type PartialGuideCopyByLocale = Partial<Record<Locale, GuideCopy>>;
