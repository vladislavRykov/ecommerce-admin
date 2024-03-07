import Image from 'next/image';
import React, { ComponentProps } from 'react';

interface GearsSpinnerProps extends Omit<ComponentProps<typeof Image>, 'src'> {}

const GearsSpinner: React.FC<GearsSpinnerProps> = (props) => {
  return <Image width={232} height={232} {...props} src={'/loader1.gif'} alt="loading..." />;
};

export default GearsSpinner;
