import { createHash } from 'crypto';
import fs, { constants, existsSync } from 'fs';

type StaticDataParam = {
  /** 路由前缀 */
  prefix?: string;
  /** 文件/文件夹路径 */
  pathName: string;
  /** 是否使用强缓存，默认0(不使用) */
  expire?: number;
  /** 是否使用协商缓存 */
  cache?: boolean;
};

/**
 * 静态资源中间件
 */
export default function staticData({
  pathName = '',
  prefix = '',
  expire = 0,
  cache = false,
}: StaticDataParam): middleWareFunc {
  const isExists = existsSync(pathName);
  if (!isExists) {
    console.warn(`file static: ${pathName} is not exists`);
  }
  return async (req, res, next) => {
    const fileName = pathName + prefix + req.pathName;

    if (isExists) {
      const fileIsExists = await checkIsExists(fileName);
      if (!fileIsExists) {
        res.send('404 not found');
        res.end();
      } else {
        // 协商缓存判断
        if (
          req.headers['if-modified-since'] &&
          req.headers['if-modified-since'] === getHash(pathName)
        ) {
          res._res.statusCode = 304;
          res.end();
          return;
        }
        // 强缓存设置
        if (expire > 0) {
          res.setHeader('Cache-Control', `max-age=${expire}`);
        }
        // 协商缓存设置
        if (cache) {
          res.setHeader('last-modified', getHash(pathName));
        }
        fs.createReadStream(fileName).pipe(res._res);
      }
    }
    await next();
  };
}

/** 获取文件名编码 */
function getHash(pathName: string) {
  return createHash('md5').update(pathName).end().digest('hex');
}

/** 查询文件是否存在 */
function checkIsExists(filePath: string) {
  return new Promise((resolve) => {
    fs.access(filePath, constants.F_OK, (err) => {
      resolve(err ? false : true);
    });
  });
}
