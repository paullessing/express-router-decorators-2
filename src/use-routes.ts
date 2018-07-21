import { IRouterMatcher, Router } from 'express';
import 'reflect-metadata';
import { METADATA_KEY_METHODS, MethodDefinition } from './metadata';

export function useRoutes(app: Router, routerInstance: object): Router {
  if (!Reflect.hasMetadata(METADATA_KEY_METHODS, routerInstance)) {
    return app;
  }

  const definitions: MethodDefinition[] = Reflect.getMetadata(METADATA_KEY_METHODS, routerInstance);
  for (const definition of definitions.slice().reverse()) {
    const property = (routerInstance as any)[definition.property].bind(routerInstance);
    if (definition.method === 'ANY') {
      app.use(definition.path, property);
    } else {
      const verb = definition.method.toLowerCase();
      ((app as any)[verb] as IRouterMatcher<any>)(definition.path, property);
    }
  }

  return app;
}
