import { Http2ServerRequest, Http2ServerResponse } from 'http2';
import type http from 'http';

// 创建上下文
function CreateContext(req: http.IncomingMessage, res: http.ServerResponse) {
  const { method, url, headers } = req;
  const { statusCode, write, end, setHeader } = res;
  const [pathName, query] = (url || '').split('?');
  let queryObj: URLSearchParams = new URLSearchParams(query);

  const reqOption: requestOption = {
    _req: req,
    method: method || '',
    pathName,
    query: queryObj,
    fullPath: url || '',
    headers,
  };

  const resOption: responseOption = {
    _res: res,
    statusCode,
    setHeader: setHeader.bind(res),
    send: write.bind(res),
    end: end.bind(res),
  };
  return {
    reqOption,
    resOption,
  };
}

function CreateHttp2Context(req: Http2ServerRequest, res: Http2ServerResponse) {
  const { method, url, headers } = req;
  const { statusCode, write, end, setHeader } = res;
  const [pathName, query] = (url || '').split('?');
  let queryObj: URLSearchParams = new URLSearchParams(query);

  const reqOption: requestOption = {
    _req: req,
    method: method || '',
    pathName,
    query: queryObj,
    fullPath: url || '',
    headers,
  };

  const resOption: responseOption = {
    _res: res,
    statusCode,
    setHeader: setHeader.bind(res),
    send: write.bind(res),
    end: end.bind(res),
  };
  return {
    reqOption,
    resOption,
  };
}

export { CreateHttp2Context, CreateContext };
