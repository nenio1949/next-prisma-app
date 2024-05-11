const bcrypt = require('bcrypt');

/**
 * hash加密
 * @param data 待加密字符
 * @param saltOrRounds 加密长度
 * @returns string
 */
export const hash = async (data: string | Buffer, saltOrRounds: string | number) => {
  // 实现密码哈希的逻辑

  return await bcrypt.hash(data, saltOrRounds);
};

/**
 * 密码比对
 * @param hash hash加密过的字符
 * @param data 字符
 * @returns bool
 */
export const compare = async (hash: string | Buffer, data: string) => {
  return await bcrypt.compare(hash, data);
};
