/**
 * 路由中间件
 */

interface AbstractRouter {
  use: (data: Router) => void;
  get: PublicRouteMethod;
  put: PublicRouteMethod;
  delete: PublicRouteMethod;
  post: PublicRouteMethod;
  option: PublicRouteMethod;
  set: (
    method: MethodList,
    path: PathMethod,
    businessFunc: BusinessFunc
  ) => void;
  routes: () => middleWareFunc<{ route: RouteParam }>;
}

type MethodList = 'GET' | 'POST' | 'PUT' | 'OPTION' | 'DELETE';
type PathMethod = string | RegExp;
type BusinessFunc = (
  req: requestOption<{ route: RouteParam } & Record<string, any>>,
  res: responseOption,
  next: nextTickFunc
) => void;

type PublicRouteMethod = (path: PathMethod, businessFunc: BusinessFunc) => void;

type RouterParam = {
  /** 前置路由 */
  prefix?: string;
};

type RouteParam = {
  method: MethodList;
  path: PathMethod;
  pathArr: string[];
  prefix?: string;
  businessFunc: BusinessFunc;
  param: Record<string, any>;
};

class Router implements AbstractRouter {
  public routeList: RouteParam[];
  public data: RouterParam;
  constructor(data: RouterParam = {}) {
    this.routeList = [];
    this.data = data;
  }

  // 路由串联
  use(data: Router) {
    this.routeList = this.routeList.concat(data.routeList);
  }
  /**
   * 设置路由方法
   */
  set(method: MethodList, path: PathMethod, businessFunc: BusinessFunc) {
    let prefixArr: string[] = [];
    const pathArr =
      typeof path === 'string'
        ? path.split('/').filter((val) => val !== '')
        : [];
    if (this.data.prefix) {
      prefixArr = this.data.prefix.split('/').filter((val) => val !== '');
    }
    this.routeList.push({
      method,
      prefix: this.data.prefix,
      path: `${path}`,
      pathArr: prefixArr.concat(pathArr),
      businessFunc,
      param: {},
    });
  }

  get(path: PathMethod, businessFunc: BusinessFunc) {
    this.set('GET', path, businessFunc);
  }
  put(path: PathMethod, businessFunc: BusinessFunc) {
    this.set('PUT', path, businessFunc);
  }
  delete(path: PathMethod, businessFunc: BusinessFunc) {
    this.set('DELETE', path, businessFunc);
  }
  post(path: PathMethod, businessFunc: BusinessFunc) {
    this.set('POST', path, businessFunc);
  }
  option(path: PathMethod, businessFunc: BusinessFunc) {
    this.set('OPTION', path, businessFunc);
  }

  /** 路由匹配 */
  routes() {
    return async (
      req: requestOption<{ route: RouteParam }>,
      res: responseOption,
      next: nextTickFunc
    ) => {
      const url = req.pathName;
      const urlArr = url.split('/').filter((val) => val !== '');

      for (let item of this.routeList) {
        // 方法匹配
        if (item.method !== req.method) continue;
        // 字符串/动态路由匹配
        if (typeof item.path === 'string') {
          const param: Record<string, any> = {};
          const pathArr = item.pathArr;
          let isMatch = true;
          if (pathArr.length !== urlArr.length) continue;
          // 匹配路由
          for (let [key, val] of Object.entries(urlArr)) {
            let index = Number(key);
            if (/^\:.*$/.test(pathArr[index]) || val === pathArr[index]) {
              if (pathArr[index][0] === ':') {
                param[pathArr[index].substring(1, pathArr[index].length)] = val;
              }
            } else {
              isMatch = false;
              break;
            }
          }
          if (isMatch) {
            item.param = param;
            req.route = item;
            item.businessFunc(req, res, next);
            return;
          }
          // 正则匹配
        } else if (item.path.test(url)) {
          req.route = item;
          item.businessFunc(req, res, next);
          return;
        }
      }
      res.send('404 not found');
      res.end();
    };
  }
}

export default Router;
