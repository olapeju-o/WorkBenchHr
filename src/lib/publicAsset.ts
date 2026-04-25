/** Public folder URL, correct for GitHub project Pages (`base` = `/<repo>/`). */
export function publicAsset(absolutePublicPath: string): string {
  const path = absolutePublicPath.replace(/^\/+/, "");
  const base = import.meta.env.BASE_URL;
  return base.endsWith("/") ? `${base}${path}` : `${base}/${path}`;
}
