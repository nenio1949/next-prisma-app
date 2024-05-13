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
      name: 'github',
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      // httpOptions: {
      //   timeout: 10000, // 等待响应时间，因为本地环境经常登录超时，所以改了这个配置
      // },
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req) {
        const account = await prisma.account.findFirst({
          where: {
            login: credentials?.email as string | undefined,
          },
        });
        if (account) {
          // 验证密码
          const passwordCorrect = await compare(credentials?.password as string, account.password as string);
          if (passwordCorrect) {
            const user = await prisma.user.findUnique({
              where: {
                email: credentials?.email as string,
              },
            });
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
  useSecureCookies: process.env.NODE_ENV === 'production',
  secret: process.env.SECRET, // 目前生产环境是必须的
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return !!user;
    },
    async jwt({ token, user, account, profile, session }) {
      return {
        ...token,
        ...user,
      };
    },
    // 调用 getSession 和 useSession 时会触发
    // 文档可查看 https://next-auth.js.org/configuration/callbacks
    async session({ session, token }) {
      return {
        ...session,
        acessToken: token,
        user: {
          ...session.user,
          id: token.id,
        },
      };
    },
  },
});
