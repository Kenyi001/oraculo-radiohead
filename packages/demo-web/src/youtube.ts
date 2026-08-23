/** Parse YouTube watch / youtu.be / embed URL → embeddable ID. */
export function youtubeVideoId(raw: string | undefined): string | null {
  if (!raw?.trim()) return null;
  const url = raw.trim();
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace(/^\//, "").split("/")[0];
      return id || null;
    }
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return v;
      const parts = u.pathname.split("/").filter(Boolean);
      const embedIdx = parts.indexOf("embed");
      if (embedIdx >= 0 && parts[embedIdx + 1]) return parts[embedIdx + 1];
      const shortsIdx = parts.indexOf("shorts");
      if (shortsIdx >= 0 && parts[shortsIdx + 1]) return parts[shortsIdx + 1];
    }
  } catch {
    /* not a URL */
  }
  if (/^[\w-]{11}$/.test(url)) return url;
  return null;
}

export function youtubeEmbedUrl(raw: string | undefined): string | null {
  const id = youtubeVideoId(raw);
  return id ? `https://www.youtube.com/embed/${id}` : null;
}

export function youtubeWatchUrl(raw: string | undefined): string | null {
  const id = youtubeVideoId(raw);
  return id ? `https://www.youtube.com/watch?v=${id}` : null;
}
