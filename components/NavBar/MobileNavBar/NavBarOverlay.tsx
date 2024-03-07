import Button from '@/components/UI/Buttons/Button/Button';
import { delay } from '@/utils/delay';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { IconType } from 'react-icons';
import { BsShop } from 'react-icons/bs';
import { CiLogout } from 'react-icons/ci';
import { RxHamburgerMenu } from 'react-icons/rx';

interface NavBarOverlayProps {
  navItems: {
    title: string;
    href: string;
    Image: IconType;
  }[];
  closeNav: () => void;
}

const NavBarOverlay: React.FC<NavBarOverlayProps> = ({ navItems, closeNav }) => {
  const pathname = usePathname();
  const activeLink = 'bg-white text-blue-900';
  const [animate, setAnimate] = useState(false);
  const mountedStyles = 'opacity-100';
  useEffect(() => {
    setAnimate(true);
  }, []);
  const closeNavF = async () => {
    setAnimate(false);
    await delay(300);
    closeNav();
  };
  return (
    <div
      className={`transition duration-300 fixed top-0 left-0 right-0 bottom-0 bg-blue-400 z-50 opacity-0 ${
        animate && mountedStyles
      }`}>
      <div className="h-12 p-3">
        <div className="fixed">
          <Button onClick={closeNavF}>
            <RxHamburgerMenu size={26} />
          </Button>
        </div>
      </div>

      <div className="flex flex-col">
        <a href="/" className="flex items-center self-center gap-2 mb-4">
          <BsShop size={25} />
          <span>EcommerceAdmin</span>
        </a>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              onClick={closeNavF}
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 p-1 justify-center ${
                pathname.includes(item.href) ? activeLink : ''
              }`}>
              <item.Image size={25} />
              <span>{item.title}</span>
            </Link>
          ))}
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className={`flex items-center gap-2 p-1 justify-center text-white active:${activeLink}`}>
            <CiLogout size={25} />
            <span>Logout</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default NavBarOverlay;
