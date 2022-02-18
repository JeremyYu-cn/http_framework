import http from 'http';

interface HttpFrameworkMethods {
  use: (func: middleWareFunc) => void;
  listen: (...data: ListenOption) => void;
}

/** 监听服务方法传入参数 */
type ListenOption = [port: number, callback: () => void];

type PickRequestOptionKey = 'method' | 'url';
type requestOption = {
  _req: http.IncomingMessage;
} & Pick<http.IncomingHttpHeaders, PickRequestOptionKey>;

type PickResponseOptionKey = 'statusCode';
type responseOption = {
  _res: http.ServerResponse;
} & Pick<http.ServerResponse, PickResponseOptionKey>;

type nextTickFunc = () => void;

type middleWareFunc = (
  req: requestOption,
  res: responseOption,
  next: nextTickFunc
) => void;

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
      const reqObj: requestOption = {
        _req: req,
        method: req.method,
        url: req.url,
      };
      const resObj: responseOption = {
        _res: res,
        statusCode: res.statusCode,
      };
      // 调用中间件
      runMiddleWare(this.middleWareArr, reqObj, resObj);
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
    await middleWareArr[index](req, res, next);
    if (isNext) {
      await runMiddleWare(middleWareArr, req, res, ++index);
    }
  }
}

const app = new HttpFramework();

app.use(async (req, res, next) => {
  console.log(req);
  console.log(res);

  await next();
});

app.use(async (req, res, next) => {
  res._res.write('Hello world');
  res._res.end();
});

app.listen(9999, () => {
  console.log('server running at 9999');
});

export default HttpFramework;
