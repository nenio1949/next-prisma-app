'use client'; // this makes this component a client component

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getSession } from '@/lib/serverAction';
import siteConfig from '@/app/config';

interface Props extends React.PropsWithChildren {}

export default function AuthGuard({ children }: Props): JSX.Element {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    handleGetSession();
  }, [router]);

  const handleGetSession = async () => {
    if (!siteConfig.whiteRoutes.includes(pathname)) {
      const session = await getSession();
      if (!session) {
        router.replace('/login');
      }
    }
  };

  return <>{children}</>;
}

export type { Props as AuthGuardProps };
