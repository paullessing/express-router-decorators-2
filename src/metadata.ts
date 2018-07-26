import 'reflect-metadata';
import { Handler } from 'express';

const METADATA_KEY = 'express-router-decorators:data';

export type SinglePath = string | RegExp;
export type PathParams = SinglePath | SinglePath[];
export type HttpVerb = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD';

interface ClassMetadata {
  routes: SinglePath[];
  endpoints: EndpointMetadata[];
}

interface BaseEndpointMetadata {
  type: 'method' | 'middleware' | 'use';
  property: string | symbol;
}

export interface EndpointMethodMetadata extends BaseEndpointMetadata {
  type: 'method';
  path: PathParams;
  method: HttpVerb;
}

export function isMethodMetadata(definition: EndpointMetadata): definition is EndpointMethodMetadata {
  return definition.type === 'method';
}

export interface EndpointMiddlewareMetadata extends BaseEndpointMetadata {
  type: 'middleware';
  handler: Handler;
}

export function isMiddlewareMetadata(definition: EndpointMetadata): definition is EndpointMiddlewareMetadata {
  return definition.type === 'middleware';
}

export interface EndpointUseMetadata extends BaseEndpointMetadata {
  type: 'use';
  path: PathParams;
}

export function isUseMetadata(definition: EndpointMetadata): definition is EndpointUseMetadata {
  return definition.type === 'use';
}

export type EndpointMetadata = EndpointMethodMetadata | EndpointMiddlewareMetadata | EndpointUseMetadata;

export function addEndpointMetadata(target: any, entry: EndpointMetadata): void {
  const metadata = getClassMetadata(target);
  setClassMetadata(target, {
    ...metadata,
    endpoints: [...metadata.endpoints, entry]
  });
}

export function addRouteMetadata(target: any, path: PathParams): void {
  const metadata = getClassMetadata(target);
  setClassMetadata(target, {
    ...metadata,
    routes: ([] as SinglePath[]).concat(path).concat(metadata.routes)
  });
}

export function getClassMetadata(target: any): ClassMetadata {
  const constructr = findConstructor(target);
  return Reflect.getMetadata(METADATA_KEY, constructr) || {
    endpoints: [],
    routes: []
  };
}

function setClassMetadata(target: any, metadata: ClassMetadata): void {
  const constructr = findConstructor(target);
  Reflect.defineMetadata(METADATA_KEY, metadata, constructr);
}

function findConstructor(target: any): Function {
  while (target.constructor && target.constructor !== Function) {
    target = target.constructor;
  }
  return target;
}
