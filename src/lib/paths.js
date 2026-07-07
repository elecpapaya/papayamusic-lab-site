export const defaultLanguage = 'en';

export function basePath() {
  return import.meta.env.BASE_URL.replace(/\/$/, '');
}

export function sitePath(path) {
  return `${basePath()}${path}`;
}

export function languagePath(language, path = '/') {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return sitePath(`/${language}${normalizedPath}`);
}
