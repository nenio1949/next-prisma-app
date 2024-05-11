'use client';

import { useEffect, useState } from 'react';
import { redirect, useRouter, useSearchParams } from 'next/navigation';
import { Button, Form, Input, Spin, Image } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { login, getSession } from './loginAction';

import styles from './login.module.less';

type FormValues = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  useEffect(() => {
    handleGetSession();
  }, []);

  /**
   * 获取session
   */
  const handleGetSession = async () => {
    const session = await getSession();
    if (session) {
      redirect('/');
    }
  };

  const handleSubmit = async (values: FormValues) => {
    setLoading(true);
    const res = await login('credentials', values, callbackUrl);
    console.log('555', res);
    setLoading(false);
    if (!res?.error) {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  return (
    <div className={styles.container}>
      <h1>登录</h1>
      <Spin spinning={loading}>
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item name='email' label='邮箱' rules={[{ required: true, message: '请输入你的邮箱!' }]}>
            <Input
              type='email'
              prefix={<UserOutlined className='site-form-item-icon' />}
              placeholder='请输入邮箱'
              size='large'
              allowClear
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
            />
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit' block size='large'>
              立即登录
            </Button>
          </Form.Item>
        </Form>
        <span className={styles.register}>
          还没有账号？点击<Link href='/register'>注册</Link>
        </span>
        <h3>其他方式登录</h3>
        <ul>
          {/* <li>
          <Image src={GoogleLogo} alt='' />
        </li> */}
          <li
            onClick={async () => {
              await login('github', undefined, '/');
            }}>
            <Image src='/github.svg' alt='github登录' title='github登录' width={50} height={50} preview={false} />
          </li>
        </ul>
      </Spin>
    </div>
  );
}
