import http from 'http';
import http2 from 'http2';
import { CreateContext, CreateHttp2Context } from './context';

interface HttpFrameworkMethods {
  /** 向实例添加中间件 */
  use: (func: middleWareFunc) => void;
  /** 启动web服务 */
  listen: (...data: ListenOption) => void;
}

/** 监听服务方法传入参数 */
type ListenOption = [port: number, callback: () => void];

/** 构造器传入参数 */
type HttpFrameworkData = {
  http2?: boolean;
  key?: string | Buffer;
  cert?: string | Buffer;
};

/** Http框架类 */
class HttpFramework implements HttpFrameworkMethods {
  /** http服务实例 */
  private serverApp: http.Server | http2.Http2SecureServer | null;
  /** 中间件列表 */
  private middleWareArr: middleWareFunc[];
  public data: HttpFrameworkData;
  constructor(data: HttpFrameworkData = {}) {
    this.serverApp = null;
    this.middleWareArr = [];
    this.data = data;
    this.init();
  }

  /** 初始化 */
  private init() {
    let app = null;
    if (this.data.http2) {
      const { key, cert } = this.data;
      app = http2.createSecureServer(
        {
          key,
          cert,
        },
        (req, res) => {
          const { reqOption, resOption } = CreateHttp2Context(req, res);
          // 调用中间件
          runMiddleWare(this.middleWareArr, reqOption, resOption);
        }
      );
    } else {
      app = http.createServer((req, res) => {
        const { reqOption, resOption } = CreateContext(req, res);
        // 调用中间件
        runMiddleWare(this.middleWareArr, reqOption, resOption);
      });
    }
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
    return;
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

export default HttpFramework;
