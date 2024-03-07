import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { IconType } from 'react-icons';
import { BsShop } from 'react-icons/bs';
import { CiLogout } from 'react-icons/ci';
import s from './DefaultNavBar.module.scss';

interface DefaultNavBarProps {
  navItems: {
    title: string;
    href: string;
    Image: IconType;
  }[];
}

const DefaultNavBar: React.FC<DefaultNavBarProps> = ({ navItems }) => {
  const pathname = usePathname();
  const activeLink = 'bg-white text-blue-900 rounded-l-xl';
  return (
    <div className={s.wrapper}>
      <div className={s.navContainer}>
        <a href="/" className="flex items-center gap-2 mr-4 mb-4">
          <BsShop size={25} />
          <span>EcommerceAdmin</span>
        </a>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 p-1 ${
                pathname.includes(item.href) ? activeLink : ''
              }`}>
              <item.Image size={25} />
              <span>{item.title}</span>
            </Link>
          ))}
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className={'flex items-center gap-2 p-1'}>
            <CiLogout size={25} />
            <span>Logout</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default DefaultNavBar;
