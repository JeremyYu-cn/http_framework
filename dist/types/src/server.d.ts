interface HttpFrameworkMethods {
    use: (func: middleWareFunc) => void;
    listen: (...data: ListenOption) => void;
}
declare type ListenOption = [port: number, callback: () => void];
declare class HttpFramework implements HttpFrameworkMethods {
    private serverApp;
    private middleWareArr;
    constructor();
    private init;
    use<T extends Record<string, any> = {}>(callback: middleWareFunc<T>): void;
    listen(port: number, callback?: () => void): void;
}
export default HttpFramework;
