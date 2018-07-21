import { IRouterMatcher, Router } from 'express';
import 'reflect-metadata';
import {
  isMethodDefinition,
  isMiddlewareDefinition,
  METADATA_KEY_METHODS,
  MetadataDefinition,
  MethodDefinition
} from './metadata';

const getMetadataByProperty = (definitions: MetadataDefinition[]) => {
  const definitionsByProperty: {
    propertyName: string | symbol;
    definitions: MetadataDefinition[];
  }[] = [];

  outer: for (const definition of definitions) {
    for (const mapEntry of definitionsByProperty) {
      if (mapEntry.propertyName === definition.property) {
        mapEntry.definitions.push(definition);
        continue outer;
      }
    }
    definitionsByProperty.push({
      propertyName: definition.property,
      definitions: [definition]
    });
  }

  return definitionsByProperty;
};

export function useRoutes(app: Router, routerInstance: object): Router {
  if (!Reflect.hasMetadata(METADATA_KEY_METHODS, routerInstance)) {
    return app;
  }

  const definitions: MetadataDefinition[] = Reflect.getMetadata(METADATA_KEY_METHODS, routerInstance);
  const metadataByProperty = getMetadataByProperty(definitions);

  for (const metadata of metadataByProperty) {
    const propertyName = metadata.propertyName;
    const property = (routerInstance as any)[propertyName].bind(routerInstance);

    const middleware = metadata.definitions
      .filter(isMiddlewareDefinition)
      .map((definition) => definition.handler)
      .reverse(); // Method decorators are evaluated in reverse order
    const methods = metadata.definitions.filter<MethodDefinition>(isMethodDefinition);

    for (const methodMetadata of methods) {
      const verb = methodMetadata.method.toLowerCase() as keyof Router;
      (app[verb] as IRouterMatcher<any>).apply(app, [methodMetadata.path, ...middleware, property]);
    }
  }

  return app;
}
