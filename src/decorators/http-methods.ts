import 'reflect-metadata';

import { addMetadata, HttpVerb, MethodDefinition, PathParams } from '../metadata';

export function HttpMethod(verb: HttpVerb): (path: PathParams) => MethodDecorator & PropertyDecorator {
  return (path: PathParams): MethodDecorator & PropertyDecorator => {
    return <T = any>(
      target: Object,
      propertyKey: string | symbol,
      // descriptor?: TypedPropertyDescriptor<T> // Only used for Methods
    ): TypedPropertyDescriptor<T> | void => {
      addMethod(target, propertyKey, verb, path);
    };
  }
}

function addMethod(target: any, property: string | symbol, method: HttpVerb, path: PathParams): void {
  const entry: MethodDefinition = {
    type: 'method',
    property,
    method,
    path
  };
  addMetadata(target, entry);
}

export const Get     = HttpMethod('GET');
export const Post    = HttpMethod('POST');
export const Put     = HttpMethod('PUT');
export const Patch   = HttpMethod('PATCH');
export const Delete  = HttpMethod('DELETE');
export const Options = HttpMethod('OPTIONS');
export const Head    = HttpMethod('HEAD');
