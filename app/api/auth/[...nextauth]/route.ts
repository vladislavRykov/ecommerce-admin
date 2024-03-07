import clientPromise from '@/lib/mongodb';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import NextAuth, { AuthOptions, getServerSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { NextResponse } from 'next/server';

const adminEmails = ['vladislav.ok.07@mail.ru'];

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || '',
      clientSecret: process.env.GOOGLE_SECRET || '',
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  secret: process.env.NEXT_AUTH_SECRET,
  callbacks: {
    // session: ({ session, token, user }) => {
    //   if (adminEmails.includes(user.email)) return session;
    //   return false;
    // },
  },
};

export const checkAuth = async () => {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Not authorized');
  return true;
};
export const checkAuthV2 = async () => {
  try {
    await checkAuth();
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    } else {
      return NextResponse.json({ message: error }, { status: 400 });
    }
  }
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
