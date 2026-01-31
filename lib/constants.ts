export const API_BASE_URL = "https://www.marasil.sa/api";
//export const API_BASE_URL = "http://localhost:8000/api";

// Base URL للملفات الثابتة والصور (بدون /api)
export const IMAGE_BASE_URL =
  process.env.NEXT_PUBLIC_IMAGE_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "") ||
  API_BASE_URL.replace(/\/api\/?$/, "") ||
  "https://www.marasil.sa";

/**
 * يحول مسار الصورة النسبي إلى رابط كامل مع base URL
 */
export function getImageUrl(path: string | null | undefined): string {
  if (!path || typeof path !== "string") return "";
  const trimmed = path.trim();
  if (!trimmed) return "";
  // روابط كاملة أو blob (معاينة محلية)
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("blob:")
  )
    return trimmed;
  const base = IMAGE_BASE_URL.replace(/\/$/, "");
  const normalizedPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return `${base}${normalizedPath}`;
}
