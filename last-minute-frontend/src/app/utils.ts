import { environment } from "./environments/environment";
const url = environment.apiUrl;

export function resolveImagePath(path?: string, fallback: string = ''): string {
  if (!path) {
    return fallback;
  }

  const isExternalLink = /^https?:\/\//i.test(path);

  return isExternalLink
    ? path
    : `${url}/uploads/${path}`;
}