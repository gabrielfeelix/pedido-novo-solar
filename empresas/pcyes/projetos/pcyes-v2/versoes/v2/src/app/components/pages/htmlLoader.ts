/**
 * Utility to load HTML pages from files.
 * Reads HTML files from the public directory or inline content.
 */

export async function loadHtmlPage(path: string): Promise<string> {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to load HTML page: ${path}`);
  }
  return response.text();
}

export function definePageHtmlPages() {
  // Maps route paths to their HTML file locations
  return {
    "/influenciadores": "/pages/influenciadores.html",
    "/revendedor": "/pages/revendedor.html",
    "/fale-conosco": "/pages/fale-conosco.html",
    "/onde-encontrar": "/pages/onde-encontrar.html",
    "/maringa-fc": "/pages/maringa-fc.html",
  } as const;
}
