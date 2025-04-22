import { useState, useEffect, RefObject } from "react";

export function useInScrollViewport(
  ref: RefObject<HTMLDivElement | null>,
  options: IntersectionObserverInit = {}
): boolean {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    const scrollParent = ref.current?.parentElement;
    if (!element || !scrollParent) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        root: scrollParent, // 👈 the scroll area container
        threshold: options.threshold ?? 0.5,
        rootMargin: options.rootMargin ?? "0px",
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
      observer.disconnect();
    };
  }, [ref]);

  return isVisible;
}
export default useInScrollViewport;
