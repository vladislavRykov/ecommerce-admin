import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import RedirectC from '../Redirect/RedirectC';

const CheckAuth = ({ children }: { children: React.ReactNode }) => {
  // const { data: session } = useSession();
  console.log(123);
  // if (!session)
  //   return (
  //     <RedirectC to="/?message=Чтобы попасть на эту страницу, необходимо сначала авторизоваться" />
  //   );
  return <>{children}</>;
};
export default CheckAuth;
