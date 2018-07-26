import { addRouteMetadata, SinglePath } from '../metadata';
import 'reflect-metadata';

export function Router(...path: SinglePath[]): ClassDecorator {
  return <Constructr extends Function>(target: Constructr): void => {
    if (path) {
      addRouteMetadata(target, path);
    }
  };
}
