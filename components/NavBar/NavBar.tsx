'use client';
import React from 'react';
import { AiOutlineHome, AiFillSetting } from 'react-icons/ai';
import { BsBorderStyle } from 'react-icons/bs';
import { MdProductionQuantityLimits } from 'react-icons/md';
import { MdCategory } from 'react-icons/md';
import s from './NavBar.module.scss';
import DefaultNavBar from './DefaultNavBar/DefaultNavBar';
import MobileNavBar from './MobileNavBar/MobileNavBar';

const navItems = [
  {
    title: 'Дашборд',
    href: '/dashboard',
    Image: AiOutlineHome,
  },
  {
    title: 'Товары',
    href: '/products',
    Image: MdProductionQuantityLimits,
  },
  {
    title: 'Категории',
    href: '/categories',
    Image: MdCategory,
  },
  {
    title: 'Orders',
    href: '/orders',
    Image: BsBorderStyle,
  },
  {
    title: 'Настройки',
    href: '/settings',
    Image: AiFillSetting,
  },
];

const NavBar = () => {
  return (
    <div className="shrink-0">
      <DefaultNavBar navItems={navItems} />
      <MobileNavBar navItems={navItems} />
    </div>
  );
};

export default NavBar;
