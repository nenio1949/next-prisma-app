import { Prisma } from '@prisma/client';

declare global {
  var prisma: Prisma;
}

export type LoginForm = {
  email: string;
  password: string;
};

export {};
