import type http from "http";
interface AbstructRouter {
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
  routes: middleWareFunc<{ route: RouteParam }>;
}

type MethodList = "GET" | "POST" | "PUT" | "OPTION" | "DELETE";
type PathMethod = string | RegExp;
type BusinessFunc = (req: requestOption, res: responseOption) => void;

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
};

type RouterResult = {
  data: RouterParam;
  routeList: RouteParam[];
};

class Router implements AbstructRouter {
  public routeList: RouteParam[];
  public data: RouterParam;
  constructor(data: RouterParam) {
    this.routeList = [];
    this.data = data;
  }

  use(data: Router) {
    this.routeList = this.routeList.concat(data.routeList);
  }

  set(method: MethodList, path: PathMethod, businessFunc: BusinessFunc) {
    this.routeList.push({
      method,
      prefix: this.data.prefix,
      path: `${path}`,
      pathArr: typeof path === "string" ? path.split("/") : [],
      businessFunc,
    });
  }

  get(path: PathMethod, businessFunc: BusinessFunc) {
    this.set("GET", path, businessFunc);
  }
  put(path: PathMethod, businessFunc: BusinessFunc) {
    this.set("PUT", path, businessFunc);
  }
  delete(path: PathMethod, businessFunc: BusinessFunc) {
    this.set("DELETE", path, businessFunc);
  }
  post(path: PathMethod, businessFunc: BusinessFunc) {
    this.set("POST", path, businessFunc);
  }
  option(path: PathMethod, businessFunc: BusinessFunc) {
    this.set("OPTION", path, businessFunc);
  }

  async routes(
    req: requestOption<{ route: RouteParam }>,
    res: responseOption,
    next: nextTickFunc
  ) {
    const url = req.pathName;
    for (let item of this.routeList) {
      if (typeof item.path === "string") {
        const pathArr = item.prefix
          ? [item.prefix].concat(item.pathArr)
          : item.pathArr;
      } else if (item.path.test(url)) {
        req.route = item;
        await item.businessFunc(req, res);
        break;
      }
    }
    await next();
  }
}

export default Router;
