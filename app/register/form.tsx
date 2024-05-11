'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './register.module.less';
import { Button, Form, Input, Spin, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import Link from 'next/link';

export type FormValues = {
  email: string;
  password: string;
};

export default function RegisterForm() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (values: FormValues) => {
    setLoading(true);
    // 发送注册请求
    const res = await fetch(`/api/auth/register`, {
      method: 'POST',
      body: JSON.stringify({
        email: values.email,
        password: values.password,
      }),
    });
    setLoading(false);

    if (res.status === 200) {
      message.success('注册成功, 请登录!');
      router.push('/login');
    }
  };

  return (
    <div className={styles.container}>
      <h1>注册</h1>
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
              注册
            </Button>
          </Form.Item>
        </Form>

        <Link href='/login'>返回登录</Link>
      </Spin>
    </div>
  );
}
