import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import ShowFullImage from '../ShowFullImage/ShowFullImage';
import ImagePrevItem from './ImagePrevItem';
import { MongooseFile } from '@/types/types';
import { ReactSortable } from 'react-sortablejs';

interface ImagePrevProps {
  images: FileList | [];
}

const ImagePrev: React.FC<ImagePrevProps> = ({ images }) => {
  const [imagePrevs, setImagePrevs] = useState<(string | null)[] | []>([]);
  const [clickedImg, setClickedImg] = useState<number | null>(null);

  useEffect(() => {
    const getPrevs = async () => {
      setImagePrevs([]);
      if (images.length > 0) {
        const promises = Array.from(images).map((image) => {
          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = (e) => resolve(reader.result as string);
            reader.onerror = (e) => reject(e);
            reader.readAsDataURL(image);
          });
        });
        try {
          const results = await Promise.all(promises);
          setImagePrevs(results);
        } catch (error) {
          console.error('Error reading image file:', error);
        }
      }
    };
    getPrevs();
  }, [images, images?.length]);

  return (
    <div className="w-fit flex flex-wrap gap-2 bg-green-100 border-2 border-solid border-green-300 p-2 rounded-xl">
      {imagePrevs.map(
        (obj, idx) =>
          obj && (
            <ImagePrevItem key={obj} setClickedImg={() => setClickedImg(idx)} url={obj as string} />
          ),
      )}
      {clickedImg !== null && (
        <ShowFullImage
          clickedImg={clickedImg}
          setClickedImgIdx={setClickedImg}
          imagePrevs={imagePrevs}
        />
      )}
    </div>
  );
};

export default ImagePrev;
