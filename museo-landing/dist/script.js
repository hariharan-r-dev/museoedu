const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('#mobile-menu');
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!open));
  toggle.querySelector('.menu-symbol').textContent = open ? '+' : '—';
  menu.hidden = open;
  document.body.style.overflow = open ? '' : 'hidden';
});
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  toggle.setAttribute('aria-expanded', 'false');
  toggle.querySelector('.menu-symbol').textContent = '+';
  menu.hidden = true;
  document.body.style.overflow = '';
}));

document.querySelectorAll('.service-item button').forEach(button => {
  button.addEventListener('click', () => {
    const item = button.closest('.service-item');
    const panel = item.querySelector('.service-panel');
    const icon = item.querySelector('.service-icon');
    const open = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!open));
    panel.hidden = open;
    icon.textContent = open ? '+' : '—';
    item.classList.toggle('is-open', !open);
  });
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const header = document.querySelector('[data-header]');
let lastY = 0;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  header.classList.toggle('is-sticky', y > 420 && y < lastY);
  lastY = y;
}, { passive: true });

document.querySelector('.back-to-top').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* Curved, continuously moving image band used by the hero. This is the
   buildless equivalent of the supplied TiltedGridHero React component. */
const tiltedHero = document.querySelector('[data-tilted-grid-hero]');
const tiltedBand = tiltedHero?.querySelector('[data-tilted-grid-band]');

if (tiltedHero && tiltedBand) {
  const images = [
    'https://images.unsplash.com/photo-1564399579883-451a5d44ec08?auto=format&fit=crop&w=1200&q=82',
    'https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=1200&q=82',
    'https://images.unsplash.com/photo-1554907984-15263bfd63bd?auto=format&fit=crop&w=1200&q=82',
    'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1200&q=82',
    'https://images.unsplash.com/photo-1561214115-98c05b3f3f66?auto=format&fit=crop&w=1200&q=82',
    'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=1200&q=82',
  ];

  const slicesPerTile = 16;
  const camera = 1.6;
  const curve = 80 * Math.PI / 180;
  const aspect = 16 / 9;
  const gap = .06;
  const speed = 4;
  const axis = .57;
  let styleElement;

  images.forEach(src => { const image = new Image(); image.src = src; });

  const radiusShare = (camera - 1 + Math.cos(curve)) /
    (2 * camera * Math.sin(curve));

  const renderBand = () => {
    const width = tiltedHero.clientWidth;
    const height = tiltedHero.clientHeight;
    const tileHeight = Math.min(height * .27, width * .55 / aspect);
    const tileWidth = tileHeight * aspect;
    const radius = width * radiusShare;
    const radiansToDegrees = radians => radians * 180 / Math.PI;
    const unit = radiansToDegrees(tileHeight / radius);
    const pitch = (aspect + gap) * unit;
    const limit = radiansToDegrees(curve) + aspect * unit / 2;
    const columns = Math.min(60, Math.max(4, Math.ceil(2 * limit / pitch)));
    const sweep = columns * pitch / 2;
    const duration = columns * speed;
    const sliceWidth = tileWidth / slicesPerTile;
    const turn = degrees =>
      `translateZ(${radius}px) rotateY(${degrees}deg) translateZ(${-radius}px)`;
    const hiddenShare = (sweep - Math.min(sweep, limit)) / (2 * sweep || 1) * 100;
    const animationName = 'museo-tilted-orbit';

    tiltedBand.replaceChildren();
    styleElement?.remove();
    styleElement = document.createElement('style');
    styleElement.textContent = `
      @keyframes ${animationName} {
        from { transform: ${turn(-sweep)}; }
        to { transform: ${turn(sweep)}; }
        0%, ${hiddenShare}%, ${100 - hiddenShare}%, 100% { visibility: hidden; }
        ${hiddenShare + .001}%, ${100 - hiddenShare - .001}% { visibility: visible; }
      }
      @media (prefers-reduced-motion: reduce) {
        .tilted-grid-tile { animation-play-state: paused !important; }
      }
    `;
    tiltedHero.append(styleElement);

    tiltedBand.style.perspective = `${radius * camera}px`;

    for (let tileIndex = 0; tileIndex < columns; tileIndex += 1) {
      const tile = document.createElement('div');
      const firstImage = columns - 1 - tileIndex;
      tile.className = 'tilted-grid-tile';
      tile.style.left = `calc(50% - ${tileWidth / 2}px)`;
      tile.style.top = `${height * axis - tileHeight / 2}px`;
      tile.style.width = `${tileWidth}px`;
      tile.style.height = `${tileHeight}px`;
      tile.style.setProperty('--tile-width', `${tileWidth}px`);
      tile.style.animation = `${animationName} ${duration}s linear ${-tileIndex * speed}s infinite`;
      tile.dataset.imageIndex = String(firstImage);

      const setTileImage = imageIndex => {
        const src = images[((imageIndex % images.length) + images.length) % images.length];
        tile.querySelectorAll('.tilted-grid-slice').forEach(slice => {
          slice.style.backgroundImage = `url("${src}")`;
        });
      };

      for (let sliceIndex = 0; sliceIndex < slicesPerTile; sliceIndex += 1) {
        const slice = document.createElement('div');
        const sliceShare = aspect / slicesPerTile;
        const sliceAngle = (aspect / 2 - (sliceIndex + .5) * sliceShare) * unit;
        slice.className = 'tilted-grid-slice';
        slice.style.left = `${(tileWidth - sliceWidth) / 2}px`;
        slice.style.width = `${sliceWidth + (sliceIndex === slicesPerTile - 1 ? 0 : 1)}px`;
        slice.style.height = `${tileHeight}px`;
        slice.style.backgroundPosition = `${-sliceIndex * sliceWidth}px 0`;
        slice.style.transform = turn(sliceAngle);
        tile.append(slice);
      }

      setTileImage(firstImage);
      tile.addEventListener('animationiteration', event => {
        const laps = Math.max(1, Math.round(event.elapsedTime / duration));
        const nextImage = laps * columns + firstImage;
        tile.dataset.imageIndex = String(nextImage);
        setTileImage(nextImage);
      });
      tiltedBand.append(tile);
    }

    requestAnimationFrame(() => tiltedBand.classList.add('is-ready'));
  };

  const resizeObserver = new ResizeObserver(renderBand);
  resizeObserver.observe(tiltedHero);
}
