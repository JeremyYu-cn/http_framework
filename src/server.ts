import http from "http";

interface HttpFrameworkMethods {
  use: (func: middleWareFunc) => void;
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
  use(callback: middleWareFunc) {
    this.middleWareArr.push(callback);
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
  res: responseOption,
  current: number = 0
) {
  let index = current;
  let isNext = false;
  function next(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        isNext = true;
        resolve();
      }, 0);
    });
  }

  if (middleWareArr[index]) {
    req.method;
    await middleWareArr[index](req, res, next);
    if (isNext) {
      await runMiddleWare(middleWareArr, req, res, index + 1);
    }
  }
}

// 创建上下文
function createContext(req: http.IncomingMessage, res: http.ServerResponse) {
  const { method, url, headers } = req;
  const { statusCode, write, end, setHeader } = res;
  const [pathName, query] = url || "".split("?");
  const queryObj: Record<string, any> = {};
  if (query) {
    const queryArr = query.split("&");
    queryArr.forEach((val) => {
      const [key, value] = decodeURIComponent(val).split("=");
      if (key) queryObj[key] = value;
    });
  }
  const reqOption: requestOption = {
    _req: req,
    method: method,
    pathName,
    query: queryObj,
    fullPath: url || "",
    headers,
  };

  const resOption: responseOption = {
    _res: res,
    statusCode,
    setHeader,
    send: (chunk) =>
      write(chunk, (err) => {
        if (err) {
          console.log(err);
        }
      }),
    end,
  };

  return {
    reqOption,
    resOption,
  };
}

export default HttpFramework;
