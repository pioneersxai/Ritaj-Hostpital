/**
 * ============================================================
 *  BRAND CONFIG — مستشفى ريتاج التخصصي — Ritaj Specialized Hospital
 *  Edit ONLY this file to rebrand
 * ============================================================
 */

const BRAND = {

  name:        "مستشفى ريتاج التخصصي",
  tagline:     "صحتك أمانتنا، ورعايتك مسؤوليتنا",
  description: "مستشفى ريتاج التخصصي — صرح طبي متكامل في سوهاج الجديدة. عيادات خارجية، طوارئ، عمليات، عناية مركزة، أشعة، مختبرات وأكثر.",

  primaryColor: "#1a7a3c",   // green

  logoLetter:  "ر",
  logoFile:    "assets/Logo.jpg",
  faviconColor: "%231a7a3c",

  phone:      "01503808877",
  whatsapp:   "201503808877",
  email:      "info@ritajhospital.com",   // TODO: confirm real support email with Dr. Yousef
  city:       "مدينة سوهاج الجديدة — محافظة سوهاج — مصر",

  apiBase:    "https://pioneersx-backend.onrender.com/api",
  domain:     "https://Ritaj-Hostpital.pages.dev",   // TODO: update once Cloudflare Pages domain is live

  social: {
    twitter:   "",
    linkedin:  "",
    instagram: "https://www.instagram.com/ritajhospital/",
    youtube:   "",
    tiktok:    "",
  },

  lang: "ar",
  dir:  "rtl",

  // Facebook isn't in the standard BRAND.social schema — kept here for reference:
  // facebook: "https://www.facebook.com/RitajHospital"

};

// ── Auto-apply brand to page ───────────────────────────────
document.addEventListener("DOMContentLoaded", () => {

  document.title = `${BRAND.name} - ${BRAND.tagline}`;
  document.documentElement.lang = BRAND.lang;
  document.documentElement.dir  = BRAND.dir;

  const replacements = {
    "brand-name":        BRAND.name,
    "brand-tagline":     BRAND.tagline,
    "brand-description": BRAND.description,
    "brand-phone":       BRAND.phone,
    "brand-email":       BRAND.email,
    "brand-city":        BRAND.city,
    "brand-whatsapp":    BRAND.whatsapp,
  };

  Object.entries(replacements).forEach(([key, value]) => {
    document.querySelectorAll(`[data-brand="${key}"]`).forEach(el => {
      el.textContent = value;
    });
  });

  document.querySelectorAll("[data-whatsapp-link]").forEach(el => {
    el.href = `https://wa.me/${BRAND.whatsapp}`;
  });

  document.querySelectorAll("[data-phone-link]").forEach(el => {
    el.href = `tel:${BRAND.phone}`;
  });

  document.querySelectorAll("[data-email-link]").forEach(el => {
    el.href = `mailto:${BRAND.email}`;
  });

  const socialMap = {
    "social-twitter":   BRAND.social.twitter,
    "social-linkedin":  BRAND.social.linkedin,
    "social-instagram": BRAND.social.instagram,
    "social-youtube":   BRAND.social.youtube,
    "social-tiktok":    BRAND.social.tiktok,
  };
  Object.entries(socialMap).forEach(([key, url]) => {
    document.querySelectorAll(`[data-brand="${key}"]`).forEach(el => {
      if (!url) { el.style.display = "none"; return; }
      el.href = url;
    });
  });

  // Logo — image if available, else letter
  document.querySelectorAll("[data-brand='logo-letter']").forEach(el => {
    if (BRAND.logoFile) {
      el.innerHTML = `<img src="${BRAND.logoFile}" alt="${BRAND.name}" style="height:40px;object-fit:contain;">`;
    } else {
      el.textContent = BRAND.logoLetter;
    }
  });

});
