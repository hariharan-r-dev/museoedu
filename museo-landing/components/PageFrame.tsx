import { Header } from "./Header";
import { Footer } from "./Footer";

export function PageFrame({ children, className = "", footerHeading }: { children: React.ReactNode; className?: string; footerHeading?: string }) {
  return <div className={className}><a className="skip-link" href="#main">Skip to content</a><Header/><main className="next-page" id="main">{children}</main><Footer heading={footerHeading}/></div>;
}
