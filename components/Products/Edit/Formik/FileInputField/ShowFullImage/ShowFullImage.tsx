import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import s from './ShowFullImage.module.scss';
import cn from 'classnames';
import { delay } from '@/utils/delay';
import { IoIosArrowForward } from 'react-icons/io';
import { IoIosArrowBack } from 'react-icons/io';
import { MongooseFile } from '@/types/types';
import Button from '@/components/UI/Buttons/Button/Button';

interface ShowFullImageProps {
  imagePrevs: (string | null)[];
  setClickedImgIdx: React.Dispatch<React.SetStateAction<number | null>>;
  clickedImg: number;
}

const ShowFullImage: React.FC<ShowFullImageProps> = ({
  imagePrevs,
  setClickedImgIdx,
  clickedImg,
}) => {
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    setAnimate(true);
  }, []);
  const nextImg: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    let nextImgId = clickedImg + 1;
    if (nextImgId > imagePrevs.length - 1) {
      setClickedImgIdx(0);
    } else {
      setClickedImgIdx(nextImgId);
    }
  };
  const prevImg: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    let prevImgId = clickedImg - 1;
    if (prevImgId < 0) {
      setClickedImgIdx(imagePrevs.length - 1);
    } else {
      setClickedImgIdx(prevImgId);
    }
  };
  const onClose = async () => {
    setAnimate(false);
    await delay(400);
    setClickedImgIdx(null);
  };
  return (
    <div onClick={onClose} className={cn(s.blackout, { [s.blackout_shown]: animate })}>
      <Image
        onClick={(e) => e.stopPropagation()}
        src={imagePrevs[clickedImg] || ''}
        height={500}
        width={500}
        alt="image preview"
        className={cn(s.imageBlock, { [s.imageBlock_shown]: animate })}
      />
      {imagePrevs.length > 1 && (
        <>
          <div className={cn(s.forward, s.btns)}>
            <Button type="button" onClick={nextImg}>
              <IoIosArrowForward />
            </Button>
          </div>
          <div className={cn(s.back, s.btns)}>
            <Button type="button" onClick={prevImg}>
              <IoIosArrowBack />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ShowFullImage;
