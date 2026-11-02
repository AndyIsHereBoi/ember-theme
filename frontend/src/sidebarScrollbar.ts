/**
 * Persistent scrollbar for the sidebar nav.
 *
 * Firefox (and Chromium with overlay scrollbars) fades the native scrollbar out
 * after a moment of inactivity, and there is no CSS/HTTP way to stop that: it is
 * an OS-level rendering behaviour. So the native bar is hidden and a themed one
 * is painted by us, which looks and behaves the same in every browser.
 *
 * Scrolling itself is untouched - wheel, keyboard, touch and the existing
 * `overflow-y: auto` all still work; only the bar is ours.
 */

const SCROLL_SELECTOR = '#sidebar-content > div.overflow-y-auto';
const MIN_THUMB_HEIGHT = 24;

interface Bar {
  layout: () => void;
  destroy: () => void;
}

const mounted = new WeakMap<HTMLElement, Bar>();

function mount(container: HTMLElement): void {
  if (mounted.has(container)) {
    return;
  }

  const host = container.parentElement;
  if (!host) {
    return;
  }

  host.classList.add('ember-scroll-host');

  const track = document.createElement('div');
  track.className = 'ember-scroll-track';

  const thumb = document.createElement('div');
  thumb.className = 'ember-scroll-thumb';

  track.append(thumb);
  host.append(track);

  const layout = () => {
    // Layout-space measurements: `getBoundingClientRect()` is affected by zoom /
    // display scaling, and mixing those values with CSS pixel lengths makes the
    // bar both offset and over-tall. offsetTop/offsetHeight are untransformed.
    track.style.top = `${container.offsetTop}px`;
    track.style.height = `${container.offsetHeight}px`;

    const ratio = container.clientHeight / Math.max(container.scrollHeight, 1);
    const thumbHeight = Math.max(
      MIN_THUMB_HEIGHT,
      Math.min(container.clientHeight, Math.round(container.clientHeight * ratio)),
    );
    thumb.style.height = `${thumbHeight}px`;

    const maxScroll = container.scrollHeight - container.clientHeight;
    const maxThumbOffset = Math.max(container.clientHeight - thumbHeight, 0);
    const offset = maxScroll > 0 ? (container.scrollTop / maxScroll) * maxThumbOffset : 0;
    thumb.style.transform = `translateY(${Math.round(offset)}px)`;

    const scrollable = maxScroll > 1;
    track.classList.toggle('ember-scroll-track-visible', scrollable);
  };

  const onScroll = () => layout();

  const resizeObserver = new ResizeObserver(() => layout());
  resizeObserver.observe(container);
  resizeObserver.observe(host);

  const mutationObserver = new MutationObserver(() => layout());
  mutationObserver.observe(container, { childList: true, subtree: true, characterData: true });

  const onPointerDown = (event: PointerEvent) => {
    event.preventDefault();
    thumb.setPointerCapture(event.pointerId);

    const startY = event.clientY;
    const startScroll = container.scrollTop;
    const maxScroll = container.scrollHeight - container.clientHeight;
    const travel = Math.max(track.clientHeight - thumb.offsetHeight, 1);
    const scale = maxScroll / travel;

    const onMove = (moveEvent: PointerEvent) => {
      container.scrollTop = startScroll + (moveEvent.clientY - startY) * scale;
    };

    const onEnd = () => {
      thumb.removeEventListener('pointermove', onMove);
      thumb.removeEventListener('pointerup', onEnd);
      thumb.removeEventListener('pointercancel', onEnd);
    };

    thumb.addEventListener('pointermove', onMove);
    thumb.addEventListener('pointerup', onEnd);
    thumb.addEventListener('pointercancel', onEnd);
  };

  const onTrackPointerDown = (event: PointerEvent) => {
    if (event.target === thumb) {
      return;
    }

    // Click on the empty part of the track: page up/down towards the click.
    const box = track.getBoundingClientRect();
    const clickedBelow = event.clientY > box.top + thumb.offsetTop + thumb.offsetHeight;
    container.scrollBy({ top: clickedBelow ? container.clientHeight : -container.clientHeight });
  };

  container.addEventListener('scroll', onScroll, { passive: true });
  thumb.addEventListener('pointerdown', onPointerDown);
  track.addEventListener('pointerdown', onTrackPointerDown);

  mounted.set(container, {
    layout,
    destroy: () => {
      container.removeEventListener('scroll', onScroll);
      thumb.removeEventListener('pointerdown', onPointerDown);
      track.removeEventListener('pointerdown', onTrackPointerDown);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      track.remove();
      mounted.delete(container);
    },
  });

  layout();
}

function scan(root: ParentNode): void {
  // Client pages only: the rail is themed there. Admin keeps its stock sidebar.
  if (document.documentElement.dataset.emberScope === 'admin') {
    return;
  }

  if (root instanceof HTMLElement && root.matches(SCROLL_SELECTOR)) {
    mount(root);
  }

  for (const element of root.querySelectorAll<HTMLElement>(SCROLL_SELECTOR)) {
    mount(element);
  }
}

export function initSidebarScrollbar(): void {
  if (document.documentElement.dataset.emberSidebarScrollbar === 'installed') {
    return;
  }

  document.documentElement.dataset.emberSidebarScrollbar = 'installed';

  scan(document);

  // The sidebar is remounted on navigation and the mobile drawer is created on
  // demand, so pick up any new scroll containers as they appear.
  new MutationObserver((records) => {
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (node instanceof HTMLElement) {
          scan(node);
        }
      }
    }
  }).observe(document.body, { childList: true, subtree: true });
}
