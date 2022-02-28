/// <reference types="node" />
import { Http2ServerRequest, Http2ServerResponse } from 'http2';
import type http from 'http';
declare function CreateContext(req: http.IncomingMessage, res: http.ServerResponse): {
    reqOption: requestOption<{}>;
    resOption: {
        _res: http.ServerResponse | Http2ServerResponse;
        send: (chunk: string | Buffer) => boolean;
    } & Pick<http.ServerResponse, PickResponseOptionKey>;
};
declare function CreateHttp2Context(req: Http2ServerRequest, res: Http2ServerResponse): {
    reqOption: requestOption<{}>;
    resOption: {
        _res: http.ServerResponse | Http2ServerResponse;
        send: (chunk: string | Buffer) => boolean;
    } & Pick<Http2ServerResponse, PickResponseOptionKey>;
};
export { CreateHttp2Context, CreateContext };
