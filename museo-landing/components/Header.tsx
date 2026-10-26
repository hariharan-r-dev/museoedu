"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Brand } from "./Brand";

const links = [
  { href: "/about", label: "About" },
  { href: "/events", label: "Events" },
  { href: "/blogs", label: "Insights" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hubOpen, setHubOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const y = Math.max(0, window.scrollY);
        const delta = y - lastY;
        if (!menuOpen) {
          if (y <= 120 || delta < -1) setHidden(false);
          else if (delta > 1) setHidden(true);
        }
        lastY = y;
        frame = 0;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(frame); };
  }, [menuOpen]);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    if (menuOpen) { setHidden(false); requestAnimationFrame(() => closeRef.current?.focus()); }
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (menuOpen) { setMenuOpen(false); triggerRef.current?.focus(); }
      if (hubOpen) setHubOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen, hubOpen]);

  return <>
    <header className={`site-header${hidden ? " is-hidden" : ""}`}>
      <Brand />
      <nav className="desktop-nav" aria-label="Primary navigation">
        <div className={`service-hub${hubOpen ? " is-open" : ""}`} onMouseLeave={() => setHubOpen(false)}>
          <button className="service-hub-toggle" type="button" aria-expanded={hubOpen} aria-controls="service-hub-menu" onClick={() => setHubOpen(!hubOpen)}>Service Hub <span>+</span></button>
          <div className="service-hub-menu" id="service-hub-menu">
            <Link href="/visitors" aria-current={pathname === "/visitors" ? "page" : undefined}><span>For visitors</span></Link>
            <Link href="/professionals" aria-current={pathname === "/professionals" ? "page" : undefined}><span>For professionals</span></Link>
            <Link href="/lms" aria-current={pathname === "/lms" ? "page" : undefined}><span>Learning systems</span></Link>
          </div>
        </div>
        {links.map(link => <Link key={link.href} href={link.href} aria-current={pathname === link.href ? "page" : undefined}>{link.label}</Link>)}
      </nav>
      <button ref={triggerRef} className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="mobile-menu" aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"} onClick={() => setMenuOpen(!menuOpen)}><span>Menu</span><span className="menu-symbol">{menuOpen ? "—" : "+"}</span></button>
    </header>
    <div className={`mobile-menu${menuOpen ? " is-open" : ""}`} id="mobile-menu" role="dialog" aria-modal="true" aria-label="Navigation menu" aria-hidden={!menuOpen}>
      <div className="mobile-menu-header"><Brand /><button ref={closeRef} className="menu-close" type="button" onClick={() => { setMenuOpen(false); triggerRef.current?.focus(); }}><span>Close</span><span>—</span></button></div>
      <div className="mobile-menu-layout"><nav aria-label="Overlay navigation"><Link href="/visitors" onClick={() => setMenuOpen(false)}><span>For visitors</span></Link><Link href="/professionals" onClick={() => setMenuOpen(false)}><span>For professionals</span></Link><Link href="/lms" onClick={() => setMenuOpen(false)}><span>Learning systems</span></Link><Link href="/events" onClick={() => setMenuOpen(false)}><span>Events</span></Link><Link href="/blogs" onClick={() => setMenuOpen(false)}><span>Insights</span></Link><Link href="/faq" onClick={() => setMenuOpen(false)}><span>FAQs</span></Link><Link href="/about" onClick={() => setMenuOpen(false)}><span>About</span></Link><Link href="/contact" onClick={() => setMenuOpen(false)}><span>Contact</span></Link></nav><div className="mobile-menu-aside"><p>Preserve the past.<br/>Inspire what comes next.</p><a href="mailto:hello@museoedu.com">hello@museoedu.com ↗</a></div></div>
    </div>
  </>;
}
