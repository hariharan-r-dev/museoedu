"use client";

import { FormEvent, useState } from "react";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = `${data.get("firstName") ?? ""} ${data.get("lastName") ?? ""}`.trim();
    const subject = encodeURIComponent(`Museoedu enquiry from ${name || "website visitor"}`);
    const body = encodeURIComponent([
      `Name: ${name}`,
      `Email: ${data.get("email") ?? ""}`,
      `Phone: ${data.get("phone") ?? ""}`,
      `Organization type: ${data.get("organizationType") ?? ""}`,
      `Organization: ${data.get("organizationName") ?? ""}`,
      "",
      `${data.get("message") ?? ""}`,
    ].join("\n"));
    setSubmitted(true);
    window.location.href = `mailto:hello@museoedu.com?subject=${subject}&body=${body}`;
  };

  return <form className="contact-form" onSubmit={submit}>
    <div className="contact-field"><label htmlFor="first-name">First name</label><input id="first-name" name="firstName" autoComplete="given-name" required/></div>
    <div className="contact-field"><label htmlFor="last-name">Last name</label><input id="last-name" name="lastName" autoComplete="family-name" required/></div>
    <div className="contact-field"><label htmlFor="email">Email <span aria-hidden="true">*</span></label><input id="email" name="email" type="email" autoComplete="email" required/></div>
    <div className="contact-field"><label htmlFor="phone">Phone</label><input id="phone" name="phone" type="tel" autoComplete="tel" inputMode="tel"/></div>
    <div className="contact-field"><label htmlFor="organization-type">Type of organization <span aria-hidden="true">*</span></label><select id="organization-type" name="organizationType" defaultValue="" required><option value="" disabled>Select organization type</option><option>Museum</option><option>Gallery</option><option>Cultural institution</option><option>Educational institution</option><option>Government or public body</option><option>Technology partner</option><option>Other</option></select></div>
    <div className="contact-field"><label htmlFor="organization-name">Name of organization <span aria-hidden="true">*</span></label><input id="organization-name" name="organizationName" autoComplete="organization" required/></div>
    <div className="contact-field contact-field-message"><label htmlFor="message">Message</label><textarea id="message" name="message" rows={5} placeholder="Tell us about your museum, audience, or project." required/></div>
    <button className="contact-submit" type="submit">Send enquiry <span>↗</span></button>
    <p className="contact-status" role="status" aria-live="polite">{submitted ? "Your email application is opening with the enquiry details." : ""}</p>
  </form>;
}
