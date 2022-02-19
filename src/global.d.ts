type PickRequestOptionKey = "method";
type requestOption<T extends Record<string, any> = {}> = {
  _req: http.IncomingMessage;
  headers: http.IncomingHttpHeaders;
  fullPath: string;
  pathName: string;
  query: Record<string, any>;
} & Pick<http.IncomingHttpHeaders, PickRequestOptionKey> &
  T;

type PickResponseOptionKey = "statusCode" | "end" | "setHeader";
type responseOption = {
  _res: http.ServerResponse;
  send: (chunk: string | Buffer) => boolean;
} & Pick<http.ServerResponse, PickResponseOptionKey>;

type nextTickFunc = () => void;

type middleWareFunc<K extends Record<string, any> = {}> = (
  req: requestOption<K>,
  res: responseOption,
  next: nextTickFunc
) => void;
