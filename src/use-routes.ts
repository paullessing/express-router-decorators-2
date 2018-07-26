import { IRouterMatcher, Router } from 'express';
import {
  isMethodMetadata,
  isMiddlewareMetadata,
  EndpointMetadata,
  EndpointMethodMetadata, getClassMetadata
} from './metadata';

const getMetadataByProperty = (definitions: EndpointMetadata[]) => {
  const definitionsByProperty: {
    propertyName: string | symbol;
    definitions: EndpointMetadata[];
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

export function useRoutes(app: Router, routerInstance: object): void {
  const metadata = getClassMetadata(routerInstance);

  if (!metadata.endpoints.length && !metadata.routes.length) {
    return;
  }

  const router = Router();

  const metadataByProperty = getMetadataByProperty(metadata.endpoints);

  for (const metadata of metadataByProperty) {

    const propertyName = metadata.propertyName;
    const property = (routerInstance as any)[propertyName].bind(routerInstance);

    const middleware = metadata.definitions
      .filter(isMiddlewareMetadata)
      .map((definition) => definition.handler)
      .reverse(); // Method decorators are evaluated in reverse order on the method
    const methods = metadata.definitions.filter<EndpointMethodMetadata>(isMethodMetadata);

    for (const methodMetadata of methods) {
      const verb = methodMetadata.method.toLowerCase() as keyof Router;
      (router[verb] as IRouterMatcher<any>).apply(router, [methodMetadata.path, ...middleware, property]);
    }
  }

  if (!metadata.routes.length) {
    app.use(router);
  } else {
    const wrapperRouter = Router();
    wrapperRouter.use(metadata.routes, router);
    app.use(wrapperRouter);
  }
}
