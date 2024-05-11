import Image from 'next/image';
import { logoutAction } from './logoutAction';
// import { getSession } from './session';
import { getSession } from 'next-auth/react';

// import { getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import styles from './header.module.less';
import DefaultAvatar from '@/app/assets/img/default-avatar.jpeg';
import { Button, Popover } from 'antd';

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
                      await logoutAction();
                    }}>
                    退出登录
                  </Button>
                </div>
              }>
              <span>{user?.name}</span>
            </Popover>
          ) : (
            '登录'
          )}
        </li>
      </ul>
    </header>
  );
};

export default Header;
