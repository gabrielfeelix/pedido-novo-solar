import { useEffect, useRef } from "react";
import { useLocation } from "react-router";

interface PageProps {
  html: string;
}

export function PageFromHtml({ html }: PageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Inject styles
    const stylesToInject: HTMLStyleElement[] = [];
    doc.querySelectorAll("style").forEach((style) => {
      const el = document.createElement("style");
      el.textContent = style.textContent;
      document.head.appendChild(el);
      stylesToInject.push(el);
    });

    // Inject links
    const linksToInject: HTMLLinkElement[] = [];
    doc.querySelectorAll("link").forEach((link) => {
      const el = document.createElement("link");
      Array.from(link.attributes).forEach((attr) => {
        el.setAttribute(attr.name, attr.value);
      });
      document.head.appendChild(el);
      linksToInject.push(el);
    });

    // Inject body content
    container.innerHTML = doc.body.innerHTML;

    // Execute scripts safely
    doc.querySelectorAll("script").forEach((script) => {
      if (script.textContent && !script.src) {
        const newScript = document.createElement("script");
        newScript.textContent = script.textContent;
        document.body.appendChild(newScript);
      } else if (script.src) {
        const newScript = document.createElement("script");
        newScript.src = script.src;
        newScript.async = true;
        document.body.appendChild(newScript);
      }
    });

    return () => {
      stylesToInject.forEach((s) => s.remove());
      linksToInject.forEach((l) => l.remove());
    };
  }, [html, location.pathname]);

  return <div ref={containerRef} />;
}
