'use server';
import { signIn } from '@/auth';

export async function loginAction(type: 'google' | 'github', callbackUrl: string) {
  console.log('111', type, callbackUrl);
  const res = await signIn(type, { redirectTo: callbackUrl, redirect: true });
  console.log('555', res);
}
