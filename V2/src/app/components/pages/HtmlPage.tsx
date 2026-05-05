import { useEffect, useRef } from "react";

interface HtmlPageProps {
  htmlContent: string;
  wrapperId: string;
}

/**
 * Renders a full HTML page by injecting its content into the DOM.
 * Handles injecting styles, markup, and scripts from the standalone HTML file.
 */
export function HtmlPage({ htmlContent, wrapperId }: HtmlPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptsExecutedRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Parse the HTML content
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");

    // Extract and inject styles from <style> tags
    const styles = doc.querySelectorAll("style");
    styles.forEach((style) => {
      const styleEl = document.createElement("style");
      styleEl.textContent = style.textContent;
      document.head.appendChild(styleEl);
      return () => {
        document.head.removeChild(styleEl);
      };
    });

    // Extract and inject <link> tags (fonts, etc.)
    const links = doc.querySelectorAll('link[rel="preconnect"], link[rel="stylesheet"]');
    links.forEach((link) => {
      const linkEl = document.createElement("link");
      Array.from(link.attributes).forEach((attr) => {
        linkEl.setAttribute(attr.name, attr.value);
      });
      document.head.appendChild(linkEl);
      return () => {
        if (document.head.contains(linkEl)) {
          document.head.removeChild(linkEl);
        }
      };
    });

    // Clear container and inject HTML body content
    container.innerHTML = "";

    // Get the body content from parsed doc
    const bodyContent = doc.body.innerHTML;
    container.innerHTML = bodyContent;

    // Execute scripts
    if (!scriptsExecutedRef.current) {
      scriptsExecutedRef.current = true;
      const scripts = doc.querySelectorAll("script");
      scripts.forEach((script) => {
        if (script.src) {
          // External script
          const externalScript = document.createElement("script");
          externalScript.src = script.src;
          externalScript.async = true;
          document.head.appendChild(externalScript);
        } else if (script.textContent) {
          // Inline script - execute via eval in global scope
          try {
            const fn = new Function(script.textContent);
            fn.call(window);
          } catch (e) {
            // Fallback: create script element
            const inlineScript = document.createElement("script");
            inlineScript.textContent = script.textContent;
            document.body.appendChild(inlineScript);
          }
        }
      });
    }

    // Cleanup function
    return () => {
      // Remove injected styles
      styles.forEach(() => {
        // Styles remain in head for performance during navigation
      });
      scriptsExecutedRef.current = false;
    };
  }, [htmlContent]);

  return <div ref={containerRef} id={wrapperId} />;
}
