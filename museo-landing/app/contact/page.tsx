import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { PageFrame } from "@/components/PageFrame";

export const metadata: Metadata = { title: "Contact", description: "Start a conversation with Museoedu about your museum, learning platform, collection, or visitor experience." };

export default function ContactPage() {
  return <PageFrame className="contact-page"><section className="contact-hero" id="top"><p className="about-kicker">Start a conversation</p><h1>Tell us what your<br/>museum needs next.</h1><div><p>Whether you are planning a digital strategy, visitor experience, learning platform, or collection project, we would love to understand the opportunity.</p><a href="#enquiry">Share your project ↓</a></div></section><section className="contact-enquiry about-section" id="enquiry"><div className="contact-enquiry-intro"><p className="about-kicker">Project enquiry</p><h2>Let’s make culture easier to discover, understand, and share.</h2><div><p>Prefer to write directly?</p><a href="mailto:hello@museoedu.com">hello@museoedu.com ↗</a><a href="tel:+918127267218">+91 81272 67218</a></div></div><ContactForm/></section></PageFrame>;
}
