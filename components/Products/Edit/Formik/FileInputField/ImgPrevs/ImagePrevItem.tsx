import Image from 'next/image';
import React, { useState } from 'react';
import ShowFullImage from '../ShowFullImage/ShowFullImage';
import { unwatchFile } from 'fs';
import { RxCross2 } from 'react-icons/rx';

const ImagePrevItem = ({
  url,
  setClickedImg,
  deleteImgBySource,
}: {
  url: string;
  setClickedImg: () => void;
  deleteImgBySource?: (source: string) => void;
}) => {
  return (
    <div className="group relative">
      <Image
        // blurDataURL="/gg.jpg"
        blurDataURL="/loader1.gif"
        placeholder="blur"
        src={url}
        height={100}
        width={1000}
        alt="image preview"
        onClick={setClickedImg}
        className="cursor-pointer duration-0 w-36 h-36 object-cover object-center rounded group-hover:shadow"
      />
      {deleteImgBySource && (
        <div
          onClick={() => deleteImgBySource(url)}
          className="cursor-pointer transition-all opacity-0 top-2/3 left-2/3 group-hover:top-1/2 group-hover:left-1/2 group-hover:opacity-100 absolute bottom-0 right-0 bg-black/50 rounded-ss-full rounded-ee">
          <div className="w-full h-full relative">
            <RxCross2
              color="white"
              size={22}
              className="transition-all absolute bottom-0 right-0 group-hover:right-1/4 group-hover:bottom-1/4"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImagePrevItem;
