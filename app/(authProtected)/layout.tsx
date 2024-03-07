'use client';
import CheckAuth from '@/components/Auth/CheckAuth';

export default function CategoriesLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return <CheckAuth>{children}</CheckAuth>;
}
