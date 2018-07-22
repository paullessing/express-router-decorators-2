import 'reflect-metadata';
import { Handler } from 'express';

export const METADATA_KEY_METHODS = 'express-router-decorators:methods';
export const METADATA_KEY_ROUTES = 'express-router-decorators:routes';

export type PathParams = string | RegExp | (string | RegExp)[];
export type HttpVerb = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD';

interface BaseMetadataDefinition {
  type: 'method' | 'middleware';
  property: string | symbol;
}

export interface MethodDefinition extends BaseMetadataDefinition {
  type: 'method';
  path: PathParams;
  method: HttpVerb;
}

export function isMethodDefinition(definition: MetadataDefinition): definition is MethodDefinition {
  return definition.type === 'method';
}

export interface MiddlewareDefinition extends BaseMetadataDefinition {
  type: 'middleware';
  handler: Handler;
}

export function isMiddlewareDefinition(definition: MetadataDefinition): definition is MiddlewareDefinition {
  return definition.type === 'middleware';
}

export function addMetadata(target: any, entry: MetadataDefinition): void {
  const metadata: MethodDefinition[] = Reflect.getMetadata(METADATA_KEY_METHODS, target) || [];
  Reflect.defineMetadata(METADATA_KEY_METHODS, [...metadata, entry], target);
}

export interface MethodDefinition extends BaseMetadataDefinition {
  type: 'method';
  method: HttpVerb;
}

export interface MiddlewareDefinition extends BaseMetadataDefinition {
  type: 'middleware';
}

export type MetadataDefinition = MethodDefinition | MiddlewareDefinition;

export function addMethodMetadata(target: any, entry: MetadataDefinition): void {
  const metadata: MethodDefinition[] = Reflect.getMetadata(METADATA_KEY_METHODS, target) || [];
  const constructr = findConstructor(target);
  Reflect.defineMetadata(METADATA_KEY_METHODS, [...metadata, entry], constructr);
}

export function addRouteMetadata(target: any, path: PathParams): void {
  const metadata: (string | RegExp)[] = Reflect.getMetadata(METADATA_KEY_ROUTES, target) || [];
  const constructr = findConstructor(target);
  Reflect.defineMetadata(METADATA_KEY_ROUTES, metadata.concat(path), constructr);
}

function findConstructor(target: any): Function {
  while (target.constructor && target.constructor !== Function) {
    target = target.constructor;
  }
  return target;
}
