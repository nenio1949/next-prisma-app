'use server';

import { signIn, signOut, auth } from '@/auth';
import { LoginForm } from '@/types';

/**
 * 登录
 * @param type 类型(谷歌|github|账号)
 * @param formData
 * @param callbackUrl 回调地址
 * @returns
 */
export async function login(type: 'google' | 'github' | 'credentials', formData?: LoginForm, callbackUrl?: string) {
  if (type === 'credentials') {
    return await signIn(type, {
      email: formData?.email,
      password: formData?.password,
      redirectTo: callbackUrl,
      redirect: false,
    });
  } else {
    return await signIn(type, {
      redirectTo: callbackUrl,
      redirect: false,
    });
  }
}

/**
 * 登出
 */
export const logout = async () => {
  await signOut({ redirectTo: '/login' });
};

/**
 * 获取session
 * @returns
 */
export const getSession = async () => {
  return await auth();
};
