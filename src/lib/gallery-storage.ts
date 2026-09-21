import { put, del } from "@vercel/blob";
import { randomUUID } from "crypto";
import path from "path";

export const MAX_GALLERY_UPLOAD_BYTES = 2.5 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export function validateGalleryFile(file: File, bytes: Buffer) {
  if (!file.type || !ALLOWED_TYPES.has(file.type)) {
    return "Επιτρέπονται μόνο εικόνες JPG, PNG, WEBP ή GIF.";
  }
  if (bytes.length > MAX_GALLERY_UPLOAD_BYTES) {
    return "Η φωτογραφία είναι πολύ μεγάλη (μέγιστο 2.5MB).";
  }
  return null;
}

/**
 * Persist gallery images for serverless hosting.
 * Prefer Vercel Blob when configured; otherwise store a data URL in Postgres
 * (Vercel's filesystem is ephemeral and cannot keep /public/uploads files).
 */
export async function persistGalleryImage(
  file: File,
  bytes: Buffer
): Promise<string> {
  const mime = file.type || "image/jpeg";
  const ext = path.extname(file.name) || mimeToExt(mime);
  const filename = `gallery/${randomUUID()}${ext}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(filename, bytes, {
      access: "public",
      contentType: mime,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    return blob.url;
  }

  return `data:${mime};base64,${bytes.toString("base64")}`;
}

export async function deletePersistedGalleryImage(url: string) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return;
  if (!url.includes("blob.vercel-storage.com")) return;
  try {
    await del(url, { token: process.env.BLOB_READ_WRITE_TOKEN });
  } catch {
    // Best-effort cleanup; DB row removal is what matters for the UI.
  }
}

function mimeToExt(mime: string) {
  switch (mime) {
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    case "image/gif":
      return ".gif";
    default:
      return ".jpg";
  }
}
