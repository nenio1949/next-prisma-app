'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { signIn } from '@/auth';
import { LoginUserInput, loginUserSchema } from '@/lib/user-prisma';
import { loginAction } from './loginAction';
import styles from './login.module.less';
import { Button, Form, Input, Spin, message, Image } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';

export default function LoginForm() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const methods = useForm<LoginUserInput>({
    resolver: zodResolver(loginUserSchema),
  });

  const {
    reset,
    handleSubmit,
    register,
    formState: { errors },
  } = methods;

  const onSubmitHandler: SubmitHandler<LoginUserInput> = async (values) => {
    console.log('222', values);
    try {
      setLoading(true);

      const res = await signIn('credentials', {
        redirect: false,
        email: values.email,
        password: values.password,
        redirectTo: callbackUrl,
      });

      setLoading(false);

      if (!res?.error) {
        message.success('登录成功');
        router.push(callbackUrl);
      } else {
        reset({ password: '' });
        message.error('账号或密码错误');
      }
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>登录</h1>
      <Spin spinning={loading}>
        <Form form={form} onFinish={handleSubmit(onSubmitHandler)}>
          <Form.Item name='email' label='邮箱' rules={[{ required: true, message: '请输入你的邮箱!' }]}>
            <Input
              type='email'
              prefix={<UserOutlined className='site-form-item-icon' />}
              placeholder='请输入邮箱'
              size='large'
              allowClear
              {...register('email')}
            />
          </Form.Item>
          <Form.Item name='password' label='密码' rules={[{ required: true, message: '请输入你的密码!' }]}>
            <Input.Password
              autoComplete='on'
              prefix={<LockOutlined className='site-form-item-icon' />}
              type='password'
              placeholder='请输入密码'
              size='large'
              allowClear
              {...register('password')}
            />
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit' block size='large'>
              立即登录
            </Button>
          </Form.Item>
        </Form>
      </Spin>
      <ul>
        {/* <li>
          <Image src={GoogleLogo} alt='' />
        </li> */}
        <li
          onClick={async () => {
            await loginAction('github', '/');
          }}>
          <Image src='/github.svg' alt='github登录' title='github登录' width={50} height={50} preview={false} />
        </li>
      </ul>
    </div>
    // <form onSubmit={handleSubmit(onSubmitHandler)}>
    //   {error && <p className='text-center bg-red-300 py-4 mb-6 rounded'>{error}</p>}
    //   <div className='mb-6'>
    //     <input type='email' {...register('email')} placeholder='Email address' className={`${input_style}`} />
    //     {errors['email'] && (
    //       <span className='text-red-500 text-xs pt-1 block'>{errors['email']?.message as string}</span>
    //     )}
    //   </div>
    //   <div className='mb-6'>
    //     <input type='password' {...register('password')} placeholder='Password' className={`${input_style}`} />
    //     {errors['password'] && (
    //       <span className='text-red-500 text-xs pt-1 block'>{errors['password']?.message as string}</span>
    //     )}
    //   </div>
    //   <button
    //     type='submit'
    //     style={{ backgroundColor: `${submitting ? '#ccc' : '#3446eb'}` }}
    //     className='inline-block px-7 py-4 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full'
    //     disabled={submitting}>
    //     {submitting ? 'loading...' : 'Sign In'}
    //   </button>

    //   <div className='flex items-center my-4 before:flex-1 before:border-t before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-gray-300 after:mt-0.5'>
    //     <p className='text-center font-semibold mx-4 mb-0'>OR</p>
    //   </div>

    //   <a
    //     className='px-7 py-2 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out w-full flex justify-center items-center mb-3'
    //     style={{ backgroundColor: '#3b5998' }}
    //     onClick={async () => {
    //       await signIn('google', { callbackUrl });
    //     }}
    //     role='button'>
    //     <Image className='pr-2' src={GoogleLogo} alt='' style={{ height: '2rem' }} width={35} height={35} />
    //     Continue with Google
    //   </a>
    //   <a
    //     className='px-7 py-2 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out w-full flex justify-center items-center'
    //     style={{ backgroundColor: '#55acee' }}
    //     onClick={async () => {
    //       // 'use server';
    //       // await signIn('github', { callbackUrl });
    //       await loginAction('github', '/');
    //     }}
    //     role='button'>
    //     <Image className='pr-2' src={GithubLogo} alt='' width={40} height={40} />
    //     Continue with GitHub
    //   </a>
    // </form>
  );
}
