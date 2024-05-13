'use server';
import { signIn } from '@/auth';
import { LoginForm } from '@/types';

/**
 * github登录
 */
export const loginWithGithub = async () => {
  await signIn('github', {
    redirect: true,
    redirectTo: '/',
  });
};

/**
 * 账号密码方式登录
 * @param formData 账号密码
 * @param callbackUrl 回调地址
 */
export const loginWithCredentials = async (formData: LoginForm, callbackUrl?: string) => {
  await signIn('credentials', {
    email: formData?.email,
    password: formData?.password,
    redirectTo: callbackUrl,
    redirect: true,
  });
};
