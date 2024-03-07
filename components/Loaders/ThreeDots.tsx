import Image from 'next/image';
import React, { ComponentProps } from 'react';

interface ThreeDotsProps extends Omit<ComponentProps<typeof Image>, 'src'> {}

const ThreeDots: React.FC<ThreeDotsProps> = (props) => {
  return <Image src={'/circles.svg'} height={50} width={50} {...props} />;
};

export default ThreeDots;
