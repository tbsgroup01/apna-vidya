import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../services/api";
import defaultLogo from "../assets/apnavidya.png";

export const sanitizeAssetUrl = (url, fallback = "") => {
  if (!url || typeof url !== "string") return fallback;
  const trimmed = url.trim();
  if (trimmed === "/images/logo.png" || trimmed === "/favicon.ico") {
    return fallback;
  }
  // Automatically upgrade http:// to https:// to prevent mixed-content blocks
  if (
    (typeof window !== "undefined" && window.location.protocol === "https:" && trimmed.startsWith("http://")) ||
    trimmed.includes("towsindia.com")
  ) {
    return trimmed.replace(/^http:\/\//i, "https://");
  }
  return trimmed;
};

const DEFAULT_SETTINGS = {
  general: {
    siteName: "Apna Vidya",
    tagline: "Learn • Grow • Succeed",
    logoUrl: defaultLogo,
    faviconUrl: defaultLogo,
  },
  seo: {
    metaTitle: "Apna Vidya - Learn • Grow • Succeed | Leading Tech Education",
    metaDescription: "Master Full Stack Development, Data Science, Python, and DSA with live 1-on-1 mentoring, verified certifications, and guaranteed career support.",
    keywords: "coding bootcamp, web development, data science, apna vidya, full stack course, learn react, python dsa",
    ogImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
  },
  customTags: [],
  contact: {
    phone: "+91 98765 43210",
    alternatePhone: "+91 98111 22334",
    email: "admissions@apnavidya.com",
    supportEmail: "support@apnavidya.com",
    whatsapp: "+91 98765 43210",
    address: "Apna Vidya Tower, 4th Floor, Sector 62, Noida, UP - 201301",
    workingHours: "Mon - Sat: 9:00 AM - 7:00 PM",
    googleMapsUrl: "https://maps.google.com/?q=Noida+Sector+62",
    social: {
      facebook: "https://facebook.com/apnavidya",
      instagram: "https://instagram.com/apnavidya_official",
      linkedin: "https://linkedin.com/company/apna-vidya",
      youtube: "https://youtube.com/@apnavidya",
      twitter: "https://twitter.com/apnavidya",
    },
  },
};

const SettingsContext = createContext({
  settings: DEFAULT_SETTINGS,
  loading: true,
  error: null,
  refreshSettings: () => {},
});

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/public/settings");
      if (res.data?.success && res.data?.data) {
        const d = res.data.data;
        const gen = d.general || {};
        setSettings({
          general: {
            ...DEFAULT_SETTINGS.general,
            ...gen,
            logoUrl: sanitizeAssetUrl(gen.logoUrl, defaultLogo),
            faviconUrl: sanitizeAssetUrl(gen.faviconUrl, defaultLogo),
          },
          seo: {
            ...DEFAULT_SETTINGS.seo,
            ...(d.seo || {}),
            ogImage: sanitizeAssetUrl(d.seo?.ogImage, DEFAULT_SETTINGS.seo.ogImage),
          },
          customTags: Array.isArray(d.customTags) ? d.customTags : [],
          contact: {
            ...DEFAULT_SETTINGS.contact,
            ...(d.contact || {}),
            social: { ...DEFAULT_SETTINGS.contact.social, ...(d.contact?.social || {}) },
          },
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();

    const handleSettingsUpdated = (e) => {
      if (e.detail) {
        const d = e.detail;
        const gen = d.general || {};
        setSettings((prev) => ({
          general: {
            ...prev.general,
            ...gen,
            logoUrl: sanitizeAssetUrl(gen.logoUrl, prev.general?.logoUrl || defaultLogo),
            faviconUrl: sanitizeAssetUrl(gen.faviconUrl, prev.general?.faviconUrl || defaultLogo),
          },
          seo: {
            ...prev.seo,
            ...(d.seo || {}),
            ogImage: sanitizeAssetUrl(d.seo?.ogImage, prev.seo?.ogImage),
          },
          customTags: Array.isArray(d.customTags) ? d.customTags : prev.customTags,
          contact: {
            ...prev.contact,
            ...(d.contact || {}),
            social: { ...prev.contact.social, ...(d.contact?.social || {}) },
          },
        }));
      }
      fetchSettings();
    };

    const handleStorageChange = (e) => {
      if (e.key === "apna_settings_sync") {
        fetchSettings();
      }
    };

    window.addEventListener("apna_settings_updated", handleSettingsUpdated);
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("apna_settings_updated", handleSettingsUpdated);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [fetchSettings]);

  useEffect(() => {
    if (typeof document === "undefined") return;

    if (settings.seo?.metaTitle) {
      document.title = settings.seo.metaTitle;
    } else if (settings.general?.siteName) {
      document.title = settings.general.siteName;
    }

    const setOrCreateMeta = (nameAttr, nameVal, propAttr, propVal, content) => {
      if (!content) return;
      let selector = nameAttr ? `meta[${nameAttr}="${nameVal}"]` : `meta[${propAttr}="${propVal}"]`;
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement("meta");
        if (nameAttr) el.setAttribute(nameAttr, nameVal);
        if (propAttr) el.setAttribute(propAttr, propVal);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setOrCreateMeta("name", "description", null, null, settings.seo?.metaDescription);
    setOrCreateMeta("name", "keywords", null, null, settings.seo?.keywords);
    setOrCreateMeta(null, null, "property", "og:title", settings.seo?.metaTitle || settings.general?.siteName);
    setOrCreateMeta(null, null, "property", "og:description", settings.seo?.metaDescription);
    setOrCreateMeta(null, null, "property", "og:image", sanitizeAssetUrl(settings.seo?.ogImage, ""));
    setOrCreateMeta(null, null, "property", "og:site_name", settings.general?.siteName);

    const activeFavicon = sanitizeAssetUrl(settings.general?.faviconUrl, defaultLogo);
    if (activeFavicon) {
      let iconLink = document.querySelector("link[rel*='icon']");
      if (!iconLink) {
        iconLink = document.createElement("link");
        iconLink.setAttribute("rel", "icon");
        document.head.appendChild(iconLink);
      }
      iconLink.setAttribute("href", activeFavicon);
    }

    document.querySelectorAll("[data-apna-injected='true']").forEach((el) => el.remove());

    if (Array.isArray(settings.customTags)) {
      settings.customTags.forEach((tag) => {
        if (!tag || tag.active === false || !tag.code) return;
        try {
          const parser = new DOMParser();
          const doc = parser.parseFromString(tag.code, "text/html");
          const elements = [...doc.head.children, ...doc.body.children];
          elements.forEach((el) => {
            const targetContainer =
              String(tag.placement).toLowerCase() === "body" ? document.body : document.head;
            const newEl = document.createElement(el.tagName);
            for (const attr of el.attributes) {
              newEl.setAttribute(attr.name, attr.value);
            }
            newEl.innerHTML = el.innerHTML;
            newEl.setAttribute("data-apna-injected", "true");
            newEl.setAttribute("data-tag-id", tag.id || "");
            targetContainer.appendChild(newEl);
          });
        } catch {}
      });
    }
  }, [settings]);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        error,
        refreshSettings: fetchSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);

export default SettingsContext;
