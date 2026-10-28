import { Extension } from 'shared';
import { initRouteScope } from './routeScope.ts';

class EmberExtension extends Extension {
  public cardConfigurationPage: React.FC | null = null;
  public cardComponent: React.FC | null = null;

  public initialize(): void {
    // Tags <html data-ember-scope="client|admin"> so app.css can target client pages only.
    initRouteScope();
  }
}

export default new EmberExtension();
