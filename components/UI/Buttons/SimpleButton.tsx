import { FormikProps } from 'formik';
import React, { ComponentPropsWithoutRef } from 'react';

interface ProductButtonProps extends ComponentPropsWithoutRef<'button'> {}

const SimpleButton = ({ children, className, ...props }: ProductButtonProps) => {
  const btnStyles = `transition-colors w-fit duration-500 border-solid border-2 border-blue-900 rounded-md px-3 py-2 bg-white text-blue-900 disabled:bg-gray-200 disabled:border-gray-600 disabled:text-gray-600`;
  return (
    <button {...props} className={btnStyles + ' ' + className}>
      {children}
    </button>
  );
};

export default SimpleButton;
