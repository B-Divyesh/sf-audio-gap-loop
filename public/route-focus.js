function focusRouteHeading() {
  const heading = document.querySelector('main h1');
  if (!(heading instanceof HTMLElement)) return;
  heading.tabIndex = -1;
  heading.focus({ preventScroll: true });
  let status = document.querySelector('.sr-route-status');
  if (!(status instanceof HTMLElement)) {
    status = document.createElement('div');
    status.className = 'sr-route-status';
    status.setAttribute('aria-live', 'polite');
    document.body.append(status);
  }
  status.textContent = document.title;
}

window.addEventListener('DOMContentLoaded', focusRouteHeading);
window.addEventListener('pageshow', (event) => {
  if (event.persisted) focusRouteHeading();
});
