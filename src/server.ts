import http from 'http';

interface HttpFrameworkMethods {
  /** 向实例添加中间件 */
  use: (func: middleWareFunc) => void;
  /** 启动web服务 */
  listen: (...data: ListenOption) => void;
}

/** 监听服务方法传入参数 */
type ListenOption = [port: number, callback: () => void];

/** Http框架类 */
class HttpFramework implements HttpFrameworkMethods {
  /** http服务实例 */
  private serverApp: http.Server | null;
  /** 中间件列表 */
  private middleWareArr: middleWareFunc[];
  constructor() {
    this.serverApp = null;
    this.middleWareArr = [];
    this.init();
  }

  /** 初始化 */
  private init() {
    const app = http.createServer((req, res) => {
      const { reqOption, resOption } = createContext(req, res);
      // 调用中间件
      runMiddleWare(this.middleWareArr, reqOption, resOption);
    });
    this.serverApp = app;
  }

  /** 添加中间件 */
  use<T extends Record<string, any> = {}>(callback: middleWareFunc<T>) {
    if (typeof callback !== 'function') {
      throw new Error('middle ware must be a function');
    }
    this.middleWareArr.push(<middleWareFunc<{}>>callback);
  }

  listen(port: number, callback: () => void = () => {}) {
    this.serverApp?.listen(port, callback);
  }
}

/**
 * 执行中间件
 * @param middleWareArr
 * @param req
 * @param res
 * @param current
 */
async function runMiddleWare(
  middleWareArr: middleWareFunc[],
  req: requestOption,
  res: responseOption
) {
  if (middleWareArr.length === 0) {
    res.send('404 not found');
    res.end();
  }
  let current = 0;
  async function next() {
    if (middleWareArr[current + 1]) {
      current++;
      await middleWareArr[current](req, res, next);
    }
  }
  await middleWareArr[0](req, res, next);
}

// 创建上下文
function createContext(req: http.IncomingMessage, res: http.ServerResponse) {
  const { method, url, headers } = req;
  const { statusCode, write, end, setHeader } = res;
  const [pathName, query] = (url || '').split('?');
  const queryObj: Record<string, any> = {};
  if (query) {
    const queryArr = query.split('&');
    queryArr.forEach((val) => {
      const [key, value] = decodeURIComponent(val).split('=');
      if (key) queryObj[key] = value;
    });
  }
  const reqOption: requestOption = {
    _req: req,
    method: method,
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

export default HttpFramework;
