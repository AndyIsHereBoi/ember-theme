import { Extension } from 'shared';
import { initRouteScope } from './routeScope.ts';
import { initSidebarScrollbar } from './sidebarScrollbar.ts';

class EmberExtension extends Extension {
  public cardConfigurationPage: React.FC | null = null;
  public cardComponent: React.FC | null = null;

  public initialize(): void {
    // Tags <html data-ember-scope="client|admin"> so app.css can target client pages only.
    initRouteScope();

    // Paints a persistent, themed scrollbar on the sidebar nav (the native one
    // fades out in Firefox and in Chromium when overlay scrollbars are enabled).
    initSidebarScrollbar();
  }
}

export default new EmberExtension();
