import React, { ClassAttributes, InputHTMLAttributes, useRef } from 'react';
import { Field, FieldAttributes, FieldHookConfig, useField } from 'formik';
import ThreeDots from '../../../../Loaders/ThreeDots';
import ImagePrev from './ImgPrevs/ImagePrev';
import { RxCross2 } from 'react-icons/rx';
import Button from '@/components/UI/Buttons/Button/Button';
import { FaImage } from 'react-icons/fa';
import API from '@/services/api/api';
import { MongooseFile } from '@/types/types';
import { useFetching } from '@/hooks/useFetching';
import FormButton from '../../../../UI/Formik/FormButton';
import UploadedImagesPrev from './ImgPrevs/UploadedImagesPrev';

interface FileInputFieldProps {
  label: string;
  isProductLoading: boolean;
  formSubmitting: boolean;
  selectedImages: FileList | [];
  setSelectedImages: React.Dispatch<React.SetStateAction<FileList | []>>;
  uploadedImages: MongooseFile[] | [];
  setUploadedImages: React.Dispatch<React.SetStateAction<MongooseFile[] | []>>;
  uploadedImagesIdToDelete: string[];
  setUploadedImagesIdToDelete: React.Dispatch<React.SetStateAction<string[]>>;
  productId: string;
  getProduct: () => Promise<any>;
}

const FileInputField: React.FC<FileInputFieldProps> = ({
  label,
  isProductLoading,
  formSubmitting,
  selectedImages,
  uploadedImages,
  setSelectedImages,
  setUploadedImages,
  setUploadedImagesIdToDelete,
  uploadedImagesIdToDelete,
  productId,
  getProduct,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const clearSelectedImages = () => {
    if (fileInputRef.current) fileInputRef.current.value = '';
    setSelectedImages([]);
  };
  const deleteAllUploadedImages = () => {
    const uploadedImagesIds = uploadedImages.map((img) => img._id);
    setUploadedImages([]);
    setUploadedImagesIdToDelete((prev) => [...prev, ...uploadedImagesIds]);
  };
  const saveImages = async () => {
    let filesId: string[] | undefined = undefined;
    if (selectedImages.length > 0) {
      const formData = new FormData();
      Array.from(selectedImages).forEach((file) => {
        formData.append('images', file);
      });
      const res = await API.upload(formData);
      filesId = res.data.map((obj) => obj.fileId);
    }
    if (uploadedImagesIdToDelete.length > 0) {
      await API.deleteFiles(uploadedImagesIdToDelete);
      //УДАЛЕНИЕ ФАЙЛОВ
    }
    const uploadedImagesIdx = uploadedImages.map((img) => img._id);
    const allImages = filesId ? [...filesId, ...uploadedImagesIdx] : uploadedImagesIdx;
    const productImages = { images: allImages };

    const res = await API.updateProductById(productId, productImages);
    if (fileInputRef.current) fileInputRef.current.value = '';
    clearSelectedImages();
    await getProduct();
  };

  const [newSaveImages, isImagesSaving, saveImagesErrors] = useFetching(saveImages);
  const deleteImgBySource = (source: string) => {
    const upImgs = [...uploadedImages];
    const idx = upImgs.findIndex((img) => img.source === source);
    const deletedImg = upImgs.splice(idx, 1);
    setUploadedImages((prev) => upImgs);
    setUploadedImagesIdToDelete((prev) => [...prev, deletedImg[0]._id]);
  };
  return (
    <div className="flex flex-col gap-1 items-start">
      <div className="flex gap-2 justify-center items-center">
        <label
          className="ml-1 text-lg flex justify-center gap-1 items-center border-2 border-solid border-gray-300 p-2 rounded-xl transition-colors hover:border-blue-900"
          htmlFor="images">
          {!isProductLoading ? (
            <>
              <FaImage size={20} />
              <span>{`${label}${
                selectedImages.length > 0 ? `: ${selectedImages.length}` : ''
              }`}</span>
            </>
          ) : (
            <ThreeDots className="h-6" alt="loading..." />
          )}
          <input
            hidden
            id="images"
            type="file"
            accept="image/png, image/jpg, image/jpeg, image/webp"
            multiple
            ref={fileInputRef}
            disabled={isProductLoading}
            placeholder={isProductLoading ? '' : 'product images'}
            onChange={(event) => {
              setSelectedImages(event.target.files || []);
            }}
          />
        </label>
        {selectedImages.length > 0 && (
          <Button onClick={clearSelectedImages}>
            <RxCross2 size={18} />
          </Button>
        )}
        {selectedImages.length > 0 && (
          <FormButton
            type="button"
            loadingText="Изображения загружаются..."
            onClick={newSaveImages}
            disabled={formSubmitting || isImagesSaving || isProductLoading}
            isLoading={isImagesSaving}>
            Загрузить добавленные изображения
          </FormButton>
        )}
      </div>

      {selectedImages.length > 0 && <ImagePrev images={selectedImages} />}
      {uploadedImages.length > 0 && (
        <UploadedImagesPrev
          deleteAllUploadedImages={deleteAllUploadedImages}
          deleteImgBySource={deleteImgBySource}
          uploadedImages={uploadedImages}
          setUploadedImages={setUploadedImages}
        />
      )}
      {/* КАСТОМНЫЕ ФИЛДЫ */}

      {/* <div className="text-orange-700">
                <ErrorMessage name="images" />
              </div> */}
    </div>
  );
};
export default FileInputField;
