"use client";

import { useEffect, useRef } from "react";

/** Props for the ScrollReveal component. */
interface ScrollRevealProps {
  /** The content to animate in on scroll. */
  children: React.ReactNode;
  /** Delay in milliseconds before the animation starts. Default 0. */
  delay?: number;
  /** Additional class names to apply to the wrapper element. */
  className?: string;
}

/**
 * ScrollReveal — wraps children in a div with an Intersection Observer that
 * triggers a reveal-up animation when the element enters the viewport.
 *
 * Respects `prefers-reduced-motion` by skipping animation and making
 * the element immediately visible.
 *
 * Applied skill: vercel-react-best-practices — useRef for the DOM node
 * and observer; no state to avoid re-renders.
 */
export function ScrollReveal({
  children,
  delay = 0,
  className,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      el.style.opacity = "1";
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.style.animationDelay = `${delay}ms`;
            el.classList.add("is-visible");
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -48px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`reveal-visible${className ? ` ${className}` : ""}`}
    >
      {children}
    </div>
  );
}
