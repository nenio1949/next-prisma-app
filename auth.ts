import NextAuth from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GitHubProvider from 'next-auth/providers/github';
// import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '@/prisma/prisma';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      // httpOptions: {
      //   timeout: 10000, // 等待响应时间，因为本地环境经常登录超时，所以改了这个配置
      // },
    }),
    // CredentialsProvider({
    //   name: 'Credentials',
    //   credentials: {
    //     username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
    //     password: { label: 'Password', type: 'password' },
    //   },
    //   async authorize(credentials, req) {
    //     const user = prisma.user.findUnique({
    //       where: {
    //         email: credentials?.username as string | undefined,
    //       },
    //     });
    //     return user;
    //   },
    // }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.SECRET, // 目前生产环境是必须的
  callbacks: {
    // 调用 getSession 和 useSession 时会触发
    // 文档可查看 https://next-auth.js.org/configuration/callbacks
    async session({ session, token, user }) {
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
