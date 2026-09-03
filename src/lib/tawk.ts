"use client";

declare global {
  interface Window {
    Tawk_API?: {
      toggle?: () => void;
      hideWidget?: () => void;
      showWidget?: () => void;
      maximize?: () => void;
      onLoad?: () => void;
    };
    Tawk_LoadStart?: Date;
  }
}

let isLoading = false;

export function loadAndToggleTawk() {
  if (typeof window === "undefined") return;

  // If Tawk is already loaded and toggle method exists, toggle chat
  if (window.Tawk_API?.toggle) {
    window.Tawk_API.toggle();
    return;
  }

  // Prevent duplicate script injection while loading
  if (isLoading) return;
  isLoading = true;

  window.Tawk_API = window.Tawk_API || {};
  window.Tawk_LoadStart = new Date();

  window.Tawk_API.onLoad = function () {
    isLoading = false;
    if (window.Tawk_API?.maximize) {
      window.Tawk_API.maximize();
    } else if (window.Tawk_API?.showWidget) {
      window.Tawk_API.showWidget();
    } else if (window.Tawk_API?.toggle) {
      window.Tawk_API.toggle();
    }
  };

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://embed.tawk.to/6a731f8063910b1d443c296b/1jv8r63rg";
  script.charset = "UTF-8";
  script.onerror = function () {
    isLoading = false;
    console.warn("Live chat is currently unavailable.");
  };

  const firstScript = document.getElementsByTagName("script")[0];
  if (firstScript && firstScript.parentNode) {
    firstScript.parentNode.insertBefore(script, firstScript);
  } else {
    document.head.appendChild(script);
  }
}
