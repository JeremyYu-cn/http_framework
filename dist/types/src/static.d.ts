declare type StaticDataParam = {
    prefix?: string;
    pathName: string;
    expire?: number;
    cache?: boolean;
};
export default function staticData({ pathName, prefix, expire, cache, }: StaticDataParam): middleWareFunc;
export {};
