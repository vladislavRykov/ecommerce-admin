import React, { ComponentPropsWithoutRef } from 'react';

interface ErrorMessageProps extends ComponentPropsWithoutRef<'p'> {
  message: string;
  fontS?: string;
  fontW?:
    | 'font-thin'
    | 'font-extralight'
    | 'font-light'
    | 'font-normal'
    | 'font-medium'
    | 'font-semibold'
    | 'font-bold'
    | 'font-extrabold'
    | 'font-black';
}

const ErrorMessageC: React.FC<ErrorMessageProps> = ({
  message,
  fontS = 'text-base',
  fontW = 'font-normal',
  ...rest
}) => {
  return (
    <p className={`text-red-700 ${fontS} ${fontW}`} {...rest}>
      {message}
    </p>
  );
};

export default ErrorMessageC;
