import { addRouteMetadata, METADATA_KEY_METHODS, METADATA_KEY_ROUTES, MethodDefinition, PathParams } from './metadata';
import 'reflect-metadata';
import express from 'express';

export function Router(path?: PathParams): ClassDecorator {
  return <Constructr extends Function>(target: Constructr): void => {
    if (path) {
      addRouteMetadata(target, path);
    }
  };
}

export namespace Router {
  export function create(target: any): express.Router {
    const router = express.Router();

    const constructor = target.constructor;

    if (!Reflect.hasMetadata(METADATA_KEY_METHODS, constructor)) {
      return router;
    }

    const definitions: MethodDefinition[] = Reflect.getMetadata(METADATA_KEY_METHODS, constructor);
    for (const definition of definitions) {
      const handler = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        (target as any)[definition.property](req, res, next); // TODO this is where better stuff hooks in
      };

      const verb = definition.method.toLowerCase();
      ((router as any)[verb] as express.IRouterMatcher<any>)(definition.path, handler);
    }

    const routes = Reflect.getMetadata(METADATA_KEY_ROUTES, constructor) || [];
    if (!routes.length) {
      return router;
    } else {
      const wrapperRouter = express.Router();
      wrapperRouter.use(routes, router);
      return wrapperRouter;
    }
  }
}
