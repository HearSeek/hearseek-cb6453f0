import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackEvent } from "@/lib/analytics";

/** Pushes a `page_view` event to the dataLayer on every SPA route change. */
export const useRouteTracking = () => {
  const location = useLocation();
  useEffect(() => {
    trackEvent("page_view", {
      page_path: location.pathname + location.search,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [location.pathname, location.search]);
};
