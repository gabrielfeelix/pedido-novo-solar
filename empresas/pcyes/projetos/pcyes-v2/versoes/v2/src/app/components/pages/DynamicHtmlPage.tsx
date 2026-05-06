import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { Footer } from "../Footer";

interface DynamicHtmlPageProps {
  htmlPath: string;
}

export function DynamicHtmlPage({ htmlPath }: DynamicHtmlPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [html, setHtml] = useState<string>("");
  const location = useLocation();

  useEffect(() => {
    let cancelled = false;
    fetch(htmlPath)
      .then((res) => res.text())
      .then((text) => {
        if (!cancelled) setHtml(text);
      });

    return () => {
      cancelled = true;
    };
  }, [htmlPath, location.pathname]);

  useEffect(() => {
    if (!html || !containerRef.current) return;

    const container = containerRef.current;
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const overridesLink = document.createElement("link");
    overridesLink.rel = "stylesheet";
    overridesLink.href = "/pages/unified-overrides.css";
    document.head.appendChild(overridesLink);

    const sharedTokensLink = document.createElement("link");
    sharedTokensLink.rel = "stylesheet";
    sharedTokensLink.href = "/pages/shared-tokens.css";
    document.head.appendChild(sharedTokensLink);

    const styleElements: HTMLStyleElement[] = [];
    doc.querySelectorAll("style").forEach((style) => {
      const el = document.createElement("style");
      el.textContent = style.textContent;
      document.head.appendChild(el);
      styleElements.push(el);
    });

    const linkElements: HTMLLinkElement[] = [];
    doc.querySelectorAll('link[rel="preconnect"], link[rel="stylesheet"]').forEach((link) => {
      const href = link.getAttribute("href");
      if (href && document.querySelector(`link[href="${href}"]`)) return;

      const el = document.createElement("link");
      Array.from(link.attributes).forEach((attr) => {
        el.setAttribute(attr.name, attr.value);
      });
      document.head.appendChild(el);
      linkElements.push(el);
    });

    const zOverride = document.createElement("style");
    zOverride.textContent = `
      .noise-overlay, #noise { z-index: 30 !important; }
      #mc-scroll-progress { top: 120px !important; }
    `;
    document.head.appendChild(zOverride);

    container.innerHTML = "";
    const wrapper = document.createElement("div");
    wrapper.innerHTML = doc.body.innerHTML;
    container.appendChild(wrapper);

    const syncWrapperOffset = () => {
      const navbar = document.querySelector("nav");
      const navbarBottom = navbar?.getBoundingClientRect().bottom ?? 0;
      wrapper.style.paddingTop = `${Math.max(0, Math.ceil(navbarBottom))}px`;
    };

    syncWrapperOffset();

    const navbar = document.querySelector("nav");
    const resizeObserver = navbar ? new ResizeObserver(syncWrapperOffset) : null;
    if (navbar && resizeObserver) {
      resizeObserver.observe(navbar);
    }
    window.addEventListener("resize", syncWrapperOffset);

    try {
      const storedTheme = localStorage.getItem("v2-theme");
      const isDark = storedTheme === "dark" || (!storedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches);
      const targets = wrapper.querySelectorAll(
        "#pcyes-influencers, #pcyes-fale-conosco, #pcyes-reseller-locator, .landing-page, #pcyes-maringa-collab"
      );

      targets.forEach((el) => {
        el.classList.remove("light", "dark");
        el.classList.add(isDark ? "dark" : "light");
      });
    } catch {
      // localStorage not available
    }

    const scriptElements: HTMLScriptElement[] = [];
    doc.querySelectorAll("script").forEach((script) => {
      if (script.textContent) {
        const el = document.createElement("script");
        el.textContent = script.textContent;
        document.body.appendChild(el);
        scriptElements.push(el);
      } else if (script.src) {
        const el = document.createElement("script");
        el.src = script.src;
        el.async = true;
        document.body.appendChild(el);
        scriptElements.push(el);
      }
    });

    const themeSync = document.createElement("script");
    themeSync.src = "/pages/theme-sync.js";
    themeSync.async = true;
    document.body.appendChild(themeSync);
    scriptElements.push(themeSync);

    window.scrollTo(0, 0);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", syncWrapperOffset);
      overridesLink.remove();
      sharedTokensLink.remove();
      styleElements.forEach((s) => s.remove());
      linkElements.forEach((l) => l.remove());
      zOverride.remove();
      scriptElements.forEach((s) => {
        if (document.body.contains(s)) s.remove();
      });
      container.innerHTML = "";
    };
  }, [html, location.pathname]);

  return (
    <>
      <div ref={containerRef} />
      <Footer />
    </>
  );
}
