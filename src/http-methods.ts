export function Get(url: string): MethodDecorator & PropertyDecorator {
  return <T = any>(
    target: Object,
    propertyKey: string | symbol,
    descriptor?: TypedPropertyDescriptor<T> // Only used for Methods
  ): TypedPropertyDescriptor<T> | void => {
    if (descriptor) {
      console.log(`GET ${url} for method ${String(propertyKey)}`);
    } else {
      console.log(`GET ${url} for property ${String(propertyKey)}`);
    }
  };
}
