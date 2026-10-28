/**
 * Tags the document root with the current route area so CSS can be scoped to
 * client pages only (i.e. everything that is not under /admin).
 *
 * The Panel is a SPA, so we cannot rely on `popstate` alone - we wrap
 * `history.pushState` / `history.replaceState` as well.
 */
export const isAdminRoute = (): boolean => window.location.pathname.startsWith('/admin');

const SCOPE_ATTRIBUTE = 'data-ember-scope';

let installed = false;

export function initRouteScope(): void {
  if (installed) {
    return;
  }
  installed = true;

  const apply = () => {
    document.documentElement.setAttribute(SCOPE_ATTRIBUTE, isAdminRoute() ? 'admin' : 'client');
  };

  apply();

  const { pushState, replaceState } = history;

  history.pushState = function (...args: Parameters<History['pushState']>) {
    pushState.apply(this, args);
    apply();
  };

  history.replaceState = function (...args: Parameters<History['replaceState']>) {
    replaceState.apply(this, args);
    apply();
  };

  window.addEventListener('popstate', apply);
}
