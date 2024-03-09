'use client';
import SelfClosedInformCard from '@/components/PopUp/SelfClosedInformCard/SelfClosedInformCard';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const message = searchParams.get('message');
  const router = useRouter();

  return (
    <main>
      {session ? (
        <p>Текущая сессия: {session.user?.email}</p>
      ) : (
        <button
          onClick={async () => {
            // router.push('/');
            await signIn('google', {});
          }}
          className="bg-black duration-100 text-white p-3 px-2 rounded-lg hover:bg-opacity-80 active:scale-105">
          Войти с помощью Google
        </button>
      )}
      {message && <SelfClosedInformCard title="Информационное окно" message={message} />}
    </main>
  );
}
