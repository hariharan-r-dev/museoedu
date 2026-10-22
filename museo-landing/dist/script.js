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
