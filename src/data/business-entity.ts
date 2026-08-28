import { ADDRESS, BRAND, CONTACT, GOOGLE } from "@/data/site";

/**
 * Юридическая сущность бизнеса и её документы.
 *
 * Страница «о компании» — сильнейший сигнал доверия и для человека, и для
 * поисковика, но ровно поэтому она же самое соблазнительное место, чтобы
 * написать факт, которого никто не проверял. Здесь лежит механизм, а не факты:
 * поля пустые, гейты закрыты, и до подтверждения владельцем ничего из этого не
 * рендерится и не эмитится в разметку.
 *
 * Правило то же, что у `getPublishableHours()`: единственный законный способ
 * прочитать значение — функция-геттер, которая отдаёт `null`, пока набор
 * неполон. Тогда компонент не может напечатать половину факта по неосторожности.
 */

interface LicenseRecord {
  /** Владелец сверил номер, орган и срок с бумажной лицензией на стене. */
  licenseVerified: boolean;
  /** Номер лицензии так, как он напечатан в документе. */
  number: string | null;
  /** Выдавший орган. */
  authority: string | null;
  /** ISO-дата выдачи. */
  issuedOn: string | null;
  /** ISO-дата окончания срока действия. */
  validUntil: string | null;
}

/**
 * ⚠️ НЕ ПОДТВЕРЖДЕНО ВЛАДЕЛЬЦЕМ (O-02) — значения намеренно пустые.
 *
 * Номер лицензии, орган и срок — проверяемые утверждения о государственном
 * документе. Ошибка в любом из четырёх полей превращает знак доверия в повод
 * для проверки, поэтому до сверки с оригиналом не публикуется ничего: страница
 * «о компании» вместо номера пишет, что документ висит у прилавка и его можно
 * прочитать на месте. Это правда и сегодня.
 */
export const LICENSE: LicenseRecord = {
  licenseVerified: false,
  number: null,
  authority: null,
  issuedOn: null,
  validUntil: null,
};

export interface PublishableLicense {
  number: string;
  authority: string;
  issuedOn: string;
  validUntil: string;
}

/** `null`, пока лицензия не сверена или набор полей неполон. */
export function getPublishableLicense(): PublishableLicense | null {
  if (!LICENSE.licenseVerified) return null;
  if (!LICENSE.number || !LICENSE.authority || !LICENSE.issuedOn || !LICENSE.validUntil) return null;
  return {
    number: LICENSE.number,
    authority: LICENSE.authority,
    issuedOn: LICENSE.issuedOn,
    validUntil: LICENSE.validUntil,
  };
}

/**
 * Формальная запись NAP — один источник для страницы о компании и для карточек
 * адреса. Строка собирается здесь, чтобы «32 Pattaya 13 Alley, Pattaya, Chon
 * Buri 20150» не разъезжалась по шаблонам посимвольно: расхождение сайта с
 * карточкой — ровно тот механизм, которым Google склеил нас с чужим магазином.
 */
export const BUSINESS_ENTITY = {
  /** Имя на вывеске и в карточке Google. */
  listingName: GOOGLE.listingName,
  /** Имя, под которым выходит сайт. */
  siteName: BRAND.name,
  addressLine: `${ADDRESS.street}, ${ADDRESS.locality}, ${ADDRESS.region} ${ADDRESS.postalCode}`,
  phone: CONTACT.phoneDisplay,
  listingUrl: GOOGLE.listingUrl,
  domain: BRAND.domain,
} as const;
