'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const RedirectC = ({ to }: { to: string }) => {
  const router = useRouter();

  useEffect(() => {
    if (to) {
      router.push(to);
    }
  }, [to, router]);

  return null;
};

export default RedirectC;
