import { FormikProps } from 'formik';
import React, { ComponentPropsWithoutRef } from 'react';

interface ProductButtonProps extends ComponentPropsWithoutRef<'button'> {
  isLoading: boolean;
  isValid?: boolean;
  loadingText?: string;
}

const FormButton = ({
  children,
  loadingText = 'Загрузка...',
  isLoading,
  isValid = true,
  className,
  ...props
}: ProductButtonProps) => {
  // const btnStyles = `transition-colors w-fit duration-500 border-solid border-2 ${
  //   isLoading ? 'border-blue-900' : 'border-transparent'
  // } rounded-md px-3 py-2 ${
  //   !isValid
  //     ? 'bg-orange-700 text-red-300'
  //     : isLoading
  //     ? 'bg-white text-blue-900'
  //     : 'bg-blue-900 text-white'
  // }`;
  const btnStyles = `transition-colors w-fit duration-500 border-solid border-2 ${
    isLoading
      ? 'border-blue-900 bg-white text-blue-900'
      : !isValid
      ? 'border-transparent bg-orange-700 text-red-300'
      : 'bg-blue-900 text-white border-transparent disabled:bg-gray-200 disabled:border-gray-600 disabled:text-gray-600'
  } rounded-md px-3 py-2`;
  return (
    <button {...props} className={btnStyles + ' ' + className}>
      <span>{isLoading ? loadingText : children}</span>
    </button>
  );
};

export default FormButton;
