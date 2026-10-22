import Link from "next/link";
import { Brand } from "./Brand";

export function Footer({ heading = "Let’s build the museum experience people remember." }: { heading?: string }) {
  return <footer className="site-footer" id="contact"><div className="footer-top"><h2>{heading}</h2><a className="footer-cta" href="mailto:hello@museoedu.com">Get in touch <span>↗</span></a></div><div className="footer-bottom"><Brand/><div><p>Chennai</p><p>Perungudi, Tamil Nadu<br/>India — 600096</p></div><div><p>Enquiries</p><a href="mailto:hello@museoedu.com">hello@museoedu.com</a><a href="tel:+918127267218">+91 81272 67218</a></div><div><p>Explore</p><Link href="/visitors">For visitors</Link><Link href="/professionals">For professionals</Link><Link href="/lms">Learning systems</Link><Link href="/events">Events</Link><Link href="/blogs">Insights</Link><Link href="/faq">FAQs</Link></div><a className="back-to-top" href="#top">Back to top ↑</a></div></footer>;
}
