export type ResponseBody = string | object;

export class Response {
  public readonly status: number;
  public readonly body: ResponseBody | null;
  public readonly type: 'text' | 'json' | 'none';

  constructor(
    status: number,
    body?: ResponseBody
  ) {
    this.status = status;
    this.body = this.convertBody(body);
    this.type = this.determineType(body);
  }

  public static success(body: ResponseBody): Response;
  public static success(status: number, body?: ResponseBody): Response;
  public static success(statusorBody: number | ResponseBody, maybeBody?: ResponseBody): Response {
    const status = typeof statusorBody === 'number' ? statusorBody : 200;
    const body = maybeBody || typeof statusorBody !== 'number' && statusorBody || null;
    return new Response(status, body as ResponseBody);
  }

  public static error(body: ResponseBody): Response;
  public static error(status: number, body?: ResponseBody): Response;
  public static error(statusorBody: number | ResponseBody, maybeBody?: ResponseBody): Response {
    const status = typeof statusorBody === 'number' ? statusorBody : 500;
    const body = maybeBody || typeof statusorBody !== 'number' && statusorBody || null;
    return new Response(status, body as ResponseBody);
  }

  public static resolve(body: ResponseBody): Promise<Response>;
  public static resolve(status: number, body?: ResponseBody): Promise<Response>;
  public static resolve(statusorBody: number | ResponseBody, maybeBody?: ResponseBody): Promise<Response> {
    return Promise.resolve(Response.success(statusorBody as number, maybeBody));
  }

  public static reject(body: ResponseBody): Promise<Response>;
  public static reject(status: number, body?: ResponseBody): Promise<Response>;
  public static reject(statusorBody: number | ResponseBody, maybeBody?: ResponseBody): Promise<Response> {
    return Promise.resolve(Response.error(statusorBody as number, maybeBody));
  }

  private convertBody(body?: ResponseBody): ResponseBody | null {
    switch (typeof body) {
      case 'string':
        return body as string;
      case 'object':
        return body || null;
      case 'undefined':
        return null;
      default:
        throw new Error('Unexpected body type (must be object or string)');
    }
  }

  private determineType(body?: ResponseBody): 'text' | 'json' | 'none' {
    if (body && typeof body === 'string') {
      return 'text';
    } else if (body && typeof body === 'object') {
      return 'json';
    } else {
      return 'none';
    }
  }
}
