'use server';
import { signIn, auth } from '@/auth';
import { FormValues } from '../register/form';

/**
 * 登录
 * @param type 类型(谷歌|github|账号)
 * @param formData
 * @param callbackUrl 回调地址
 * @returns
 */
export async function login(type: 'google' | 'github' | 'credentials', formData?: FormValues, callbackUrl?: string) {
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

export const getSession = async () => {
  return await auth();
};
