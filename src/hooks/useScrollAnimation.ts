import { useEffect, useRef, useState } from 'react';

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export const useScrollAnimation = (options: UseScrollAnimationOptions = {}) => {
  const { threshold = 0.1, rootMargin = '100px', triggerOnce = true } = options;
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // This effect will re-run if any of these change, 
    // but we also need it to run when the ref is attached.
    // However, in a simple setup, we can't easily track ref changes without a callback ref.
    // Instead, we'll use a MutationObserver or simply ensure the ref is checked more often.
    // But actually, for most cases, simply making sure the component re-renders 
    // and the effect is re-triggered by the dependency changing is enough.

    // Let's use a simpler approach: check visibility on every layout effect? 
    // No, standard IntersectionObserver is better.

    let observer: IntersectionObserver | null = null;
    const element = ref.current;

    if (element) {
      // Check if element is already in viewport on mount
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const isInViewport = rect.top <= windowHeight && rect.bottom >= 0;

      if (isInViewport) {
        setIsVisible(true);
        if (triggerOnce) return;
      }

      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (triggerOnce) {
              observer?.unobserve(element);
            }
          } else if (!triggerOnce) {
            setIsVisible(false);
          }
        },
        { threshold, rootMargin }
      );

      observer.observe(element);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
    // Adding no deps so it re-runs on every render where ref might have changed
    // OR we use a callback ref. Let's use a callback ref approach for maximum reliability.
  });

  return { ref, isVisible };
};

// Alternative more robust version using callback ref:
export const useScrollAnimationBetter = (options: UseScrollAnimationOptions = {}) => {
  const { threshold = 0.1, rootMargin = '100px', triggerOnce = true } = options;
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const ref = (element: HTMLDivElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    if (element) {
      // Initial check
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      if (rect.top <= windowHeight && rect.bottom >= 0) {
        setIsVisible(true);
        if (triggerOnce) return;
      }

      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (triggerOnce && observerRef.current) {
              observerRef.current.unobserve(element);
            }
          } else if (!triggerOnce) {
            setIsVisible(false);
          }
        },
        { threshold, rootMargin }
      );
      observerRef.current.observe(element);
    }
  };

  return { ref, isVisible };
};
