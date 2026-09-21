/** Public URL for a stored gallery image (hides data URLs behind a file route). */
export function toGalleryPublicUrl(image: { id: string; url: string }) {
  if (image.url.startsWith("data:")) {
    return `/api/gallery/file/${image.id}`;
  }
  return image.url;
}
