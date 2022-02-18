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
}

type MethodList = "GET" | "POST" | "PUT" | "OPTION" | "DELETE";
type PathMethod = string | RegExp | string[];
type BusinessFunc = (req: requestOption, res: responseOption) => void;

type PublicRouteMethod = (path: PathMethod, businessFunc: BusinessFunc) => void;

type RouterParam = {
  /** 前置路由 */
  prefix: string;
};

type RouteParam = {
  method: MethodList;
  path: PathMethod;
  businessFunc: BusinessFunc;
};

type RouterResult = {
  routeList: RouteParam[];
};

class Router implements AbstructRouter {
  public routerList: RouterResult[];
  public routeList: RouteParam[];
  public routes: middleWareFunc;
  constructor(data: RouterParam) {
    this.routerList = [];
    this.routeList = [];
    this.routes = function (req, res, next) {};
  }

  private init() {
    this.routerList.push({ routeList: this.routeList });
  }

  use(data: Router) {
    this.routerList.push({ routeList: data.routeList });
  }

  set(method: MethodList, path: PathMethod, businessFunc: BusinessFunc) {
    this.routeList.push({
      method,
      path,
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
}

export default Router;
