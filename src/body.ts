/**
 * 用于获取post参数的中间件
 */

function BodyParse(): middleWareFunc<{
  body: Record<string, any>;
  bodyBuf: Buffer;
}> {
  return async (req, res, next) => {
    let buf = Buffer.from([]);

    req._req.on('data', (chunk) => {
      buf = Buffer.concat([buf, chunk]);
    });
    req._req.on('end', async () => {
      try {
        let json = JSON.parse(buf.toString() || '{}');
        req.body = json;
      } catch {
      } finally {
        req.bodyBuf = buf;
        await next();
      }
    });
  };
}

export default BodyParse;
