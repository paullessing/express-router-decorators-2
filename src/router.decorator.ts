import { addRouteMetadata, PathParams } from './metadata';
import 'reflect-metadata';

export function Router(path?: PathParams): ClassDecorator {
  return <Constructr extends Function>(target: Constructr): void => {
    if (path) {
      addRouteMetadata(target, path);
    }
  };
}
