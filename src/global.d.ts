import type http from 'http';
import { Http2ServerRequest, Http2ServerResponse } from 'http2';

export global {
  type PickRequestOptionKey = 'method';
  type ServerRequestType =
    | Pick<http.IncomingHttpHeaders, PickRequestOptionKey>
    | Pick<Http2ServerRequest, PickRequestOptionKey>;
  type requestOption<T extends Record<string, any> = {}> = {
    _req: http.IncomingMessage | Http2ServerRequest;
    headers: http.IncomingHttpHeaders;
    fullPath: string;
    pathName: string;
    query: URLSearchParams;
  } & ServerRequestType &
    T;

  type PickResponseOptionKey = 'statusCode' | 'end' | 'setHeader';
  type ServerResponseType =
    | Pick<http.ServerResponse, PickResponseOptionKey>
    | Pick<Http2ServerResponse, PickResponseOptionKey>;
  type responseOption = {
    _res: http.ServerResponse | Http2ServerResponse;
    send: (chunk: string | Buffer) => boolean;
  } & ServerResponseType;

  type nextTickFunc = () => Promise<any>;

  type middleWareFunc<K extends Record<string, any> = {}> = (
    req: requestOption<K>,
    res: responseOption,
    next: nextTickFunc
  ) => void;
}
