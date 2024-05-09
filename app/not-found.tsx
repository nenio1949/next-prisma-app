'use client';
import Link from 'next/link';
import { Button, Result } from 'antd';

export default function NotFound() {
  return <Result status='404' title='404' subTitle='你访问的页面不存在' extra={<Link href='/'>返回首页</Link>} />;
}
