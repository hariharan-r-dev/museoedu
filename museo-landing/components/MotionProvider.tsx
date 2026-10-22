"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function MotionProvider() {
  const pathname = usePathname();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
    }), { threshold: .01, rootMargin: "0px 0px 8% 0px" });

    const frame = requestAnimationFrame(() => {
      document.querySelectorAll(".reveal").forEach(element => observer.observe(element));
    });

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [pathname]);
  return null;
}
