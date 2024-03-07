import Image from 'next/image';
import React, { ComponentProps } from 'react';

interface CircleSpinnerProps extends Omit<ComponentProps<typeof Image>, 'src'> {}

const CircleSpinner: React.FC<CircleSpinnerProps> = ({ className, ...rest }) => {
  const classes = `w-full h-auto ${className}`;
  return (
    <Image
      src={'/circleTube.svg'}
      width={0}
      height={0}
      sizes="100vw"
      className={classes}
      {...rest}
    />
  );
};

export default CircleSpinner;
