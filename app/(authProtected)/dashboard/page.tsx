'use client';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React from 'react';

const Dashboard = () => {
  const { data: session } = useSession();
  return (
    <div>
      <div className="flex justify-between">
        <span className="text-blue-400">
          {session?.user?.name ? `Привет, ${session?.user?.name}` : 'Загрузка...'}
        </span>
        <div className="flex items-center bg-slate-500 rounded-lg">
          <Image
            className="rounded-l-lg"
            src={session?.user?.image || ''}
            alt="Profile image"
            height={40}
            width={40}
          />
          <span className="py-1 px-2">
            {session?.user?.name ? `${session?.user?.name}` : 'Loading...'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
