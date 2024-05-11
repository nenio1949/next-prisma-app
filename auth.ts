import NextAuth from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '@/prisma/prisma';
import { compare } from '@/lib/encrypt';

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      // httpOptions: {
      //   timeout: 10000, // 等待响应时间，因为本地环境经常登录超时，所以改了这个配置
      // },
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req) {
        console.log('111', credentials);
        const account = await prisma.account.findFirst({
          where: {
            login: credentials?.email as string | undefined,
          },
        });
        console.log('222', account);
        if (account) {
          // 验证密码
          console.log('密码对比', credentials?.password, account.password);
          const passwordCorrect = await compare(credentials?.password as string, account.password as string);
          console.log('333', passwordCorrect);
          if (passwordCorrect) {
            const user = await prisma.user.findUnique({
              where: {
                email: credentials?.email as string,
              },
            });
            console.log('444', user);
            if (user) {
              return user;
            } else {
              return null;
            }
          } else {
            return null;
          }
        } else {
          return null;
        }
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.SECRET, // 目前生产环境是必须的
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log(
        `${JSON.stringify(user)} \n ${JSON.stringify(account)}\n ${profile}\n  ${email}\n ${JSON.stringify(
          credentials
        )}`
      );
      return !!user;
    },
    async jwt({ token, user, account, profile, session }) {
      console.log(`0000 ${JSON.stringify(token)} \n ${JSON.stringify(account)} ${JSON.stringify(session)}`);
      return {
        ...token,
        ...user,
      };
    },
    // 调用 getSession 和 useSession 时会触发
    // 文档可查看 https://next-auth.js.org/configuration/callbacks
    async session({ session, token, user }) {
      console.log('999', session, token, user);
      return {
        ...session,
        acessToken: token,
        user: {
          ...session.user,
          id: user.id,
        },
      };
    },
  },
});
