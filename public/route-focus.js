window.addEventListener('DOMContentLoaded', () => {
  const heading = document.querySelector('main h1');
  if (!(heading instanceof HTMLElement)) return;
  heading.tabIndex = -1;
  heading.focus({ preventScroll: true });
  const status = document.createElement('div');
  status.className = 'sr-route-status';
  status.setAttribute('aria-live', 'polite');
  status.textContent = document.title;
  document.body.append(status);
});
