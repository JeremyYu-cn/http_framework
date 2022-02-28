/// <reference types="node" />
interface HttpFrameworkMethods {
    use: (func: middleWareFunc) => void;
    listen: (...data: ListenOption) => void;
}
declare type ListenOption = [port: number, callback: () => void];
declare type HttpFrameworkData = {
    http2?: boolean;
    key?: string | Buffer;
    cert?: string | Buffer;
};
declare class HttpFramework implements HttpFrameworkMethods {
    private serverApp;
    private middleWareArr;
    data: HttpFrameworkData;
    constructor(data?: HttpFrameworkData);
    private init;
    use<T extends Record<string, any> = {}>(callback: middleWareFunc<T>): void;
    listen(port: number, callback?: () => void): void;
}
export default HttpFramework;
