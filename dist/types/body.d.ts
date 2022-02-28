/// <reference types="node" />
declare function BodyParse(): middleWareFunc<{
    body: Record<string, any>;
    bodyBuf: Buffer;
}>;
export default BodyParse;
