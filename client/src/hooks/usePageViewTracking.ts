import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { API_BASE_URL } from '@/lib/config';

export function usePageViewTracking() {
  const [location] = useLocation();

  useEffect(() => {
    // Only track in browser environment
    if (typeof window === 'undefined' || typeof navigator === 'undefined' || typeof document === 'undefined') {
      return;
    }

    // Track page view
    const trackPageView = async () => {
      try {
        await fetch(`${API_BASE_URL}/api/pageview`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            page: location,
            userAgent: navigator.userAgent,
            referrer: document.referrer || null,
          }),
        });
      } catch {
        // Silently fail - don't disrupt user experience
      }
    };

    trackPageView();
  }, [location]);
}
