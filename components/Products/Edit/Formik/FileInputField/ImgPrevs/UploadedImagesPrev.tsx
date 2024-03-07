import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import ShowFullImage from '../ShowFullImage/ShowFullImage';
import ImagePrevItem from './ImagePrevItem';
import { MongooseFile } from '@/types/types';
import { ReactSortable } from 'react-sortablejs';
import Button from '@/components/UI/Buttons/Button/Button';
import { RxCross2 } from 'react-icons/rx';

interface ImagePrevProps {
  uploadedImages: MongooseFile[] | [];
  deleteImgBySource: (source: string) => void;
  deleteAllUploadedImages: () => void;
  setUploadedImages: React.Dispatch<React.SetStateAction<[] | MongooseFile[]>>;
}

const UploadedImagesPrev: React.FC<ImagePrevProps> = ({
  uploadedImages,
  deleteImgBySource,
  deleteAllUploadedImages,
  setUploadedImages,
}) => {
  const [clickedImg, setClickedImg] = useState<number | null>(null);
  const sortableList = uploadedImages.map((img, idx) => ({ id: idx, ...img }));
  const updateList = (list: (MongooseFile & { id: number })[]) => {
    setUploadedImages(list.map(({ id, ...rest }) => rest));
  };
  return (
    <div className="flex flex-col gap-3">
      <div>
        <div className="flex gap-2 items-center max-w-fit">
          <span className="pl-2 text-xl">{`Загруженные изображения${
            uploadedImages.length > 0 ? `: ${uploadedImages.length}` : ''
          }`}</span>
          <Button onClick={deleteAllUploadedImages}>
            <RxCross2 size={18} />
          </Button>
        </div>
        <ReactSortable
          list={sortableList}
          setList={updateList}
          className="w-fit flex flex-wrap gap-2 bg-blue-100 border-2 border-solid border-gray-300 p-2 rounded-xl">
          {uploadedImages.map((obj, idx) => (
            <ImagePrevItem
              key={obj._id}
              deleteImgBySource={deleteImgBySource}
              setClickedImg={() => setClickedImg(idx)}
              url={obj.source}
            />
          ))}
        </ReactSortable>
        {clickedImg !== null && (
          <ShowFullImage
            clickedImg={clickedImg}
            setClickedImgIdx={setClickedImg}
            imagePrevs={uploadedImages.map((img) => img.source)}
          />
        )}
      </div>
    </div>
  );
};

export default UploadedImagesPrev;
