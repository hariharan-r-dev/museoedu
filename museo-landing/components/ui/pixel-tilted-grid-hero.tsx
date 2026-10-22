"use client";

import * as React from "react";

const SLICES = 16;
const CAMERA = 1.6;
const MAX_WIDTH = .55;
export type GridImage = { src: string; alt?: string };

export function PixelTiltedGridHero({ images, children, className = "", ...props }: React.ComponentProps<"section"> & { images: GridImage[] }) {
  const heroRef = React.useRef<HTMLElement>(null);
  const bandRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const hero = heroRef.current;
    const band = bandRef.current;
    if (!hero || !band || !images.length) return;
    images.forEach(({ src }) => { const image = new Image(); image.src = src; });
    let styleElement: HTMLStyleElement | null = null;
    let frame = 0;
    const bend = 80 * Math.PI / 180;
    const radiusShare = (CAMERA - 1 + Math.cos(bend)) / (2 * CAMERA * Math.sin(bend));
    const animationName = `museo-orbit-${Math.random().toString(36).slice(2)}`;

    const render = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const width = hero.clientWidth || 1200;
        const height = hero.clientHeight || 700;
        const aspect = 16 / 9;
        const tileHeight = Math.min(height * .27, width * MAX_WIDTH / aspect);
        const tileWidth = tileHeight * aspect;
        const radius = width * radiusShare;
        const degrees = (radians: number) => radians * 180 / Math.PI;
        const unit = degrees(tileHeight / radius);
        const pitch = (aspect + .06) * unit;
        const limit = degrees(bend) + aspect * unit / 2;
        const columns = Math.min(60, Math.max(4, Math.ceil(2 * limit / pitch)));
        const sweep = columns * pitch / 2;
        const duration = columns * 4;
        const sliceWidth = tileWidth / SLICES;
        const turn = (angle: number) => `translateZ(${radius}px) rotateY(${angle}deg) translateZ(${-radius}px)`;
        const hidden = (sweep - Math.min(sweep, limit)) / (2 * sweep || 1) * 100;

        band.replaceChildren();
        styleElement?.remove();
        styleElement = document.createElement("style");
        styleElement.textContent = `@keyframes ${animationName}{from{transform:${turn(-sweep)}}to{transform:${turn(sweep)}}0%,${hidden}%,${100-hidden}%,100%{visibility:hidden}${hidden+.001}%,${100-hidden-.001}%{visibility:visible}}@media(prefers-reduced-motion:reduce){.pixel-grid-tile{animation-play-state:paused!important}}`;
        hero.append(styleElement);
        band.style.perspective = `${radius * CAMERA}px`;

        for (let tileIndex = 0; tileIndex < columns; tileIndex += 1) {
          const tile = document.createElement("div");
          const firstImage = columns - 1 - tileIndex;
          tile.className = "tilted-grid-react-tile pixel-grid-tile";
          Object.assign(tile.style, { left: `calc(50% - ${tileWidth/2}px)`, top: `${height*.57-tileHeight/2}px`, width: `${tileWidth}px`, height: `${tileHeight}px`, transformStyle: "preserve-3d", animation: `${animationName} ${duration}s linear ${-tileIndex*4}s infinite` });
          const setImage = (index: number) => {
            const source = images[((index % images.length) + images.length) % images.length].src;
            tile.querySelectorAll<HTMLElement>(".tilted-grid-react-slice").forEach(slice => { slice.style.backgroundImage = `url("${source}")`; });
          };
          for (let sliceIndex = 0; sliceIndex < SLICES; sliceIndex += 1) {
            const slice = document.createElement("div");
            const share = aspect / SLICES;
            const angle = (aspect/2-(sliceIndex+.5)*share)*unit;
            slice.className = `tilted-grid-react-slice${sliceIndex===0?" is-first":""}${sliceIndex===SLICES-1?" is-last":""}`;
            Object.assign(slice.style, { left: `${(tileWidth-sliceWidth)/2}px`, width: `${sliceWidth+(sliceIndex===SLICES-1?0:1)}px`, height: `${tileHeight}px`, backgroundSize: `${tileWidth}px 100%`, backgroundPosition: `${-sliceIndex*sliceWidth}px 0`, backgroundRepeat: "no-repeat", transform: turn(angle) });
            tile.append(slice);
          }
          setImage(firstImage);
          tile.addEventListener("animationiteration", event => setImage(Math.max(1, Math.round((event as AnimationEvent).elapsedTime / duration))*columns+firstImage));
          band.append(tile);
        }
      });
    };
    render();
    const observer = new ResizeObserver(render);
    observer.observe(hero);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); styleElement?.remove(); band.replaceChildren(); };
  }, [images]);

  return <section ref={heroRef} className={`tilted-grid-react ${className}`.trim()} {...props}><div ref={bandRef} className="tilted-grid-react-band" aria-hidden="true" style={{ opacity: 1, perspectiveOrigin: "50% 57%", maskImage: "linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)", WebkitMaskImage: "linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)" }}/>{children}</section>;
}
