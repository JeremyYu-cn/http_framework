type PickRequestOptionKey = "method";
type requestOption = {
  _req: http.IncomingMessage;
  headers: http.IncomingHttpHeaders;
  fullPath: string;
  pathName: string;
  query: Record<string, any>;
} & Pick<http.IncomingHttpHeaders, PickRequestOptionKey>;

type PickResponseOptionKey = "statusCode" | "end" | "setHeader";
type responseOption = {
  _res: http.ServerResponse;
  send: (chunk: string | Buffer) => boolean;
} & Pick<http.ServerResponse, PickResponseOptionKey>;

type nextTickFunc = () => void;

type middleWareFunc = (
  req: requestOption,
  res: responseOption,
  next: nextTickFunc
) => void;
