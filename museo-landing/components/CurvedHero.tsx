import { PixelTiltedGridHero } from "@/components/ui/pixel-tilted-grid-hero";

const images = [
  { src: "https://images.unsplash.com/photo-1564399579883-451a5d44ec08?auto=format&fit=crop&w=1200&q=82", alt: "Visitors exploring a contemporary museum" },
  { src: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=1200&q=82", alt: "Classical artworks in a museum gallery" },
  { src: "https://images.unsplash.com/photo-1554907984-15263bfd63bd?auto=format&fit=crop&w=1200&q=82", alt: "Grand museum interior" },
  { src: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1200&q=82", alt: "Colorful abstract museum artwork" },
  { src: "https://images.unsplash.com/photo-1577083288073-40892c0860a4?auto=format&fit=crop&w=1200&q=82", alt: "Museum exhibition space" },
  { src: "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=1200&q=82", alt: "Expressive artwork" },
];

export function CurvedHero() {
  return <PixelTiltedGridHero images={images} className="hero" id="top"><h1 className="hero-title">Bringing museum stories<br/>alive through technology.</h1><p className="hero-copy">Museoedu helps museums connect heritage, education, and technology—creating meaningful experiences for visitors everywhere.</p></PixelTiltedGridHero>;
}
