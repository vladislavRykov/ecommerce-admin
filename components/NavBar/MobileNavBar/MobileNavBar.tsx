import React, { useEffect, useState } from 'react';
import s from './MobileNavBar.module.scss';
import { RxHamburgerMenu } from 'react-icons/rx';
import Button from '@/components/UI/Buttons/Button/Button';
import { usePathname } from 'next/navigation';
import { IconType } from 'react-icons';
import { BsShop } from 'react-icons/bs';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { CiLogout } from 'react-icons/ci';
import NavBarOverlay from './NavBarOverlay';

interface MobileNavBarProps {
  navItems: {
    title: string;
    href: string;
    Image: IconType;
  }[];
}

const MobileNavBar: React.FC<MobileNavBarProps> = ({ navItems }) => {
  const [isNavBarOpen, setIsNavBarOpen] = useState<boolean>(false);
  useEffect(() => {
    if (isNavBarOpen) {
    }
  }, [isNavBarOpen]);
  return (
    <div className={s.wrapper}>
      <div className={s.navBtn}>
        <Button onClick={() => setIsNavBarOpen(true)}>
          <RxHamburgerMenu size={26} />
        </Button>
      </div>
      {isNavBarOpen && (
        <NavBarOverlay navItems={navItems} closeNav={() => setIsNavBarOpen(false)} />
      )}
    </div>
  );
};

export default MobileNavBar;
