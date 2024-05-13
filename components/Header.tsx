import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button, Popover } from 'antd';
import { getSession, logout } from '@/lib/serverAction';
import styles from './header.module.less';
import DefaultAvatar from '@/app/assets/img/default-avatar.jpeg';

const Header = () => {
  const [user, setUser] = useState<any>();

  useEffect(() => {
    handleGetSession();
  }, []);

  /**
   * 获取session
   */
  const handleGetSession = async () => {
    const session = await getSession();
    console.log('session', session);
    setUser(session?.user);
  };

  return (
    <header className={styles.container}>
      <ul>
        <li>
          <Image src={user?.image || DefaultAvatar} alt='头像' width={30} height={30} />
        </li>
        <li>
          {user?.name ? (
            <Popover
              content={
                <div className={styles.userBox}>
                  <Button type='link'>个人中心</Button>
                  <Button
                    type='link'
                    onClick={async () => {
                      await logout();
                    }}>
                    退出登录
                  </Button>
                </div>
              }>
              <span>{user?.name}</span>
            </Popover>
          ) : (
            <Link href='/login'>登录</Link>
          )}
        </li>
      </ul>
    </header>
  );
};

export default Header;
