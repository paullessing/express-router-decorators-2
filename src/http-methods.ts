import 'reflect-metadata';

import { HttpVerb, METADATA_KEY_METHODS, MethodDefinition, PathParams } from './metadata';

export function Get(path: PathParams): MethodDecorator & PropertyDecorator {
  return <T = any>(
    target: Object,
    propertyKey: string | symbol,
    descriptor?: TypedPropertyDescriptor<T> // Only used for Methods
  ): TypedPropertyDescriptor<T> | void => {
    if (descriptor) {
      console.log(`GET ${path} for method ${String(propertyKey)}`);
    } else {
      console.log(`GET ${path} for property ${String(propertyKey)}`);
    }

    addMethod(target, propertyKey, 'GET', path);
  };
}

function addMethod(target: any, property: string | symbol, method: HttpVerb, path: PathParams): void {
  const metadata: MethodDefinition[] = Reflect.getMetadata(METADATA_KEY_METHODS, target) || [];
  const entry: MethodDefinition = {
    property,
    method,
    path
  };
  Reflect.defineMetadata(METADATA_KEY_METHODS, [...metadata, entry], target);
}
