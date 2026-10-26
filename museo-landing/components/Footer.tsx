"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function Footer({ heading: _heading }: { heading?: string }) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => setTime(new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(new Date()));
    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, []);

  return <footer className="museo-footer" id="contact">
    <div className="museo-footer-main">
      <section className="museo-footer-invite">
        <h2>We would love to hear from you.<br/>Let&apos;s work — together.</h2>
        <Link className="museo-footer-button" href="/contact">Contact us</Link>
      </section>
      <div className="museo-footer-details">
        <section><p className="museo-footer-label">Business enquiries</p><a href="mailto:hello@museoedu.com">hello@museoedu.com</a><a href="tel:+918127267218">+91 81272 67218</a></section>
        <section><p className="museo-footer-label">Open positions</p><a href="mailto:careers@museoedu.com">careers@museoedu.com</a></section>
        <section><p className="museo-footer-label">Business hours</p><p>Monday to Friday<br/>08:00 AM – 06:00 PM<br/>IST (+5:30) <span suppressHydrationWarning>{time ? `— ${time}` : ""}</span></p></section>
        <section><p className="museo-footer-label">Chennai</p><p>Perungudi, Tamil Nadu<br/>Chennai — 600096<br/>India</p></section>
      </div>
    </div>
    <div className="museo-footer-bottom">
      <Link href="/">Museoedu® ©2026</Link>
      <nav aria-label="Social links"><a href="https://www.instagram.com/" target="_blank" rel="noreferrer">Instagram</a><a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">LinkedIn</a></nav>
      <a href="#top">Back to top ↑</a>
    </div>
  </footer>;
}
