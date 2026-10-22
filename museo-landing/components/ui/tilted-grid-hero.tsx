"use client";

import * as React from "react";

const SLICES = 16;
const CAMERA = 1.6;
const MAX_WIDTH = 55;

function arc(bend: number) {
  return (CAMERA - 1 + Math.cos(bend)) / (2 * CAMERA * Math.sin(bend));
}

function measure(width: number, height: number, tile: number, aspect: number, gap: number, bend: number) {
  const h = Math.min((tile / 100) * height, ((MAX_WIDTH / 100) * width) / aspect);
  const radius = width * arc(bend);
  if (!(h > 0) || !(radius > 0)) return { columns: 2, sweep: 0, unit: 0, limit: 0 };
  const deg = (rad: number) => (rad * 180) / Math.PI;
  const unit = deg(h / radius);
  const pitch = (aspect + gap / 100) * unit;
  const limit = deg(bend) + (aspect * unit) / 2;
  const columns = Math.min(60, Math.max(2, Math.ceil((2 * limit) / pitch)));
  const round = (n: number) => +n.toFixed(4);
  const sweep = round((columns * pitch) / 2);
  return { columns, sweep, unit: round(unit), limit: round(Math.min(sweep, limit)) };
}

export type TiltedGridImage = { src: string; alt?: string };
export type TiltedGridHeroProps = React.ComponentProps<"section"> & {
  images: TiltedGridImage[];
  speed?: number;
  tileHeight?: number;
  aspectRatio?: number;
  gap?: number;
  axis?: number;
  curve?: number;
  fade?: number;
};

export function TiltedGridHero({
  images,
  speed = 4,
  tileHeight = 26,
  aspectRatio = 16 / 9,
  gap = 6,
  axis = 56,
  curve = 80,
  fade = 12,
  children,
  className = "",
  style,
  ...props
}: TiltedGridHeroProps) {
  const ref = React.useRef<HTMLElement>(null);
  const id = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const orbit = `tgh-o-${id}`;
  const tileClass = `tgh-t-${id}`;
  const bend = (Math.min(85, Math.max(5, curve)) * Math.PI) / 180;
  const [layout, setLayout] = React.useState<ReturnType<typeof measure> | null>(null);
  const [shown, setShown] = React.useState<Record<number, number>>({});

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const updateLayout = (width: number, height: number) => {
      const next = measure(width, height, tileHeight, aspectRatio, gap, bend);
      setLayout(previous => previous?.columns === next.columns && previous.sweep === next.sweep && previous.unit === next.unit ? previous : next);
    };

    const initial = element.getBoundingClientRect();
    updateLayout(initial.width || 1200, initial.height || 560);

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      updateLayout(width || 1200, height || 560);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [tileHeight, aspectRatio, gap, bend]);

  React.useEffect(() => {
    for (const { src } of images) new Image().src = src;
  }, [images]);

  const { columns, sweep, unit, limit } = layout ?? measure(1200, 560, tileHeight, aspectRatio, gap, bend);
  const u = (n: number) => `calc(${+n.toFixed(4)} * min(${tileHeight}cqh, ${+(MAX_WIDTH / aspectRatio).toFixed(4)}cqw))`;
  const radiusShare = 100 * arc(bend);
  const radius = `${+radiusShare.toFixed(3)}cqw`;
  const turn = (degrees: number) => `translateZ(${radius}) rotateY(${+degrees.toFixed(4)}deg) translateZ(-${radius})`;
  const hide = +(((sweep - limit) / (2 * sweep || 1)) * 100).toFixed(4);
  const css = `@keyframes ${orbit}{from{transform:${turn(-sweep)}}to{transform:${turn(sweep)}}0%,${hide}%,${100-hide}%,100%{visibility:hidden}${hide+.001}%,${100-hide-.001}%{visibility:visible}}@media(prefers-reduced-motion:reduce){.${tileClass}{animation-play-state:paused}}`;
  const share = aspectRatio / SLICES;
  const duration = columns * speed;
  const mask = `linear-gradient(90deg,transparent,#000 ${fade}%,#000 ${100-fade}%,transparent)`;

  return <section ref={ref} className={`tilted-grid-react ${className}`.trim()} style={{ ...style, containerType: "size" }} {...props}>
    <style>{css}</style>
    <div className="tilted-grid-react-band" aria-hidden="true" style={{ opacity: 1, perspective: `${+(radiusShare * CAMERA).toFixed(3)}cqw`, perspectiveOrigin: `50% ${axis}%`, maskImage: mask, WebkitMaskImage: mask }}>
      {Array.from({ length: columns }, (_, tileIndex) => {
        const first = columns - 1 - tileIndex;
        const image = images[(shown[tileIndex] ?? first) % Math.max(images.length, 1)];
        return <div key={tileIndex} className={`tilted-grid-react-tile ${tileClass}`} style={{ left: `calc(50% - ${u(aspectRatio/2)})`, top: `calc(${axis}% - ${u(.5)})`, width: u(aspectRatio), height: u(1), transformStyle: "preserve-3d", animation: `${orbit} ${duration}s linear ${-tileIndex*speed}s infinite` }} onAnimationIteration={event => {
          const lap = Math.round(event.elapsedTime / duration);
          const next = lap * columns + first;
          setShown(previous => previous[tileIndex] === next ? previous : { ...previous, [tileIndex]: next });
        }}>
          {Array.from({ length: SLICES }, (_, sliceIndex) => <div key={sliceIndex} className={`tilted-grid-react-slice${sliceIndex===0?" is-first":""}${sliceIndex===SLICES-1?" is-last":""}`} style={{ left: u((aspectRatio-share)/2), width: sliceIndex===SLICES-1 ? u(share) : `calc(${u(share)} + 1px)`, height: u(1), transform: turn((aspectRatio/2-(sliceIndex+.5)*share)*unit) }}>
            {image ? <img src={image.src} alt="" draggable={false} style={{ left: u(-sliceIndex*share), width: u(aspectRatio), height: u(1) }}/> : null}
          </div>)}
        </div>;
      })}
    </div>
    {children}
  </section>;
}

