interface AbstractRouter {
    use: (data: Router) => void;
    get: PublicRouteMethod;
    put: PublicRouteMethod;
    delete: PublicRouteMethod;
    post: PublicRouteMethod;
    option: PublicRouteMethod;
    set: (method: MethodList, path: PathMethod, businessFunc: BusinessFunc) => void;
    routes: () => middleWareFunc<{
        route: RouteParam;
    }>;
}
declare type MethodList = 'GET' | 'POST' | 'PUT' | 'OPTION' | 'DELETE';
declare type PathMethod = string | RegExp;
declare type BusinessFunc = (req: requestOption<{
    route: RouteParam;
} & Record<string, any>>, res: responseOption, next: nextTickFunc) => void;
declare type PublicRouteMethod = (path: PathMethod, businessFunc: BusinessFunc) => void;
declare type RouterParam = {
    prefix?: string;
};
declare type RouteParam = {
    method: MethodList;
    path: PathMethod;
    pathArr: string[];
    prefix?: string;
    businessFunc: BusinessFunc;
    param: Record<string, any>;
};
declare class Router implements AbstractRouter {
    routeList: RouteParam[];
    data: RouterParam;
    constructor(data?: RouterParam);
    use(data: Router): void;
    set(method: MethodList, path: PathMethod, businessFunc: BusinessFunc): void;
    get(path: PathMethod, businessFunc: BusinessFunc): void;
    put(path: PathMethod, businessFunc: BusinessFunc): void;
    delete(path: PathMethod, businessFunc: BusinessFunc): void;
    post(path: PathMethod, businessFunc: BusinessFunc): void;
    option(path: PathMethod, businessFunc: BusinessFunc): void;
    routes(): (req: requestOption<{
        route: RouteParam;
    }>, res: responseOption, next: nextTickFunc) => Promise<void>;
}
export default Router;
