import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import prisma from '@/prisma/prisma';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const hashedPassword = await hash(password, 10);

    const hasEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (hasEmail) {
      return NextResponse.json({ message: '该邮箱已被注册', status: 400 });
    } else {
      const user = await prisma.user.create({
        data: {
          name: email,
          email,
        },
      });

      if (user) {
        await prisma.account.create({
          data: {
            userId: user.id,
            provider: 'credentials',
            type: 'credentials',
            login: email,
            password: hashedPassword,
          },
        });
      }
    }
  } catch (e) {
    console.log({ e });
    return NextResponse.json({ message: e, status: 500 });
  }
  return NextResponse.json({ message: 'success', status: 200 });
}
