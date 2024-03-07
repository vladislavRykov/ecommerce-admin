'use client';
import { PageProps } from '@/.next/types/app/products/edit/[id]/page';
import { useFetching } from '@/hooks/useFetching';
import API from '@/services/api/api';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import { useParams, useRouter } from 'next/navigation';
import React, { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import * as Yup from 'yup';
import ErrorMessageC from '@/components/Errors/ErrorMessageC';
import { delay } from '@/utils/delay';
import FormField from '@/components/UI/Formik/FormField';
import { MongooseCategoryPopulated, MongooseFile, UploadFileResponseData } from '@/types/types';
import FileInputField from '@/components/Products/Edit/Formik/FileInputField/FileInputField';
import FormButton from '@/components/UI/Formik/FormButton';
import SimpleButton from '@/components/UI/Buttons/SimpleButton';
import FormSelect from '@/components/UI/Formik/FormSelect';
import { getAllCatProps } from '@/components/Products/getAllCatProps';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from 'firebase/storage';
import { storage } from '@/firebase/firebase';
import { createUniqueName } from '@/utils/createUniqueName';
import { child } from 'firebase/database';

const formValidationSchema = Yup.object({
  name: Yup.string().required('Обязательное поле.'),
  desc: Yup.string()
    .max(3000, 'Привышен лимит в 3000 символах в описании.')
    .required('Обязательное поле.'),
  price: Yup.number()
    .typeError('Введите число')
    .positive('Цена должна быть больше нуля')
    .required('Обязательное поле.'),
});

interface Values {
  name: string;
  category: string;
  desc: string;
  price: number | '';
}

const EditById: React.FC<PageProps> = (props) => {
  const router = useRouter();
  const [images, setImages] = useState<FileList | []>([]);
  const [productProperties, setProductProperties] = useState<{
    [key: string]: string;
  }>({});
  const [categories, setCategories] = useState<MongooseCategoryPopulated[] | []>([]);
  const [categorySelected, setCategorySelected] = useState<string>('');
  const [selectedCatProps, setSelectedCatProps] = useState<
    {
      name: string;
      value: string[];
    }[]
  >([]);
  const [uploadedImages, setUploadedImages] = useState<MongooseFile[] | []>([]);
  const [uploadedImagesIdToDelete, setUploadedImagesIdToDelete] = useState<string[]>([]);
  const [initialValues, setInitialValues] = useState<Values>({
    name: '',
    category: '',
    desc: '',
    price: '',
  });
  const setProductProps = (name: string, value: string) => {
    setProductProperties((prev) => {
      const newProps = { ...prev };
      newProps[name] = value;
      return newProps;
    });
  };
  const getProduct = async () => {
    const res = await API.getProductById(props.params.id);
    const { name, desc, price, images, category, properties } = res.data;
    const { data } = await API.getAllCategories();
    setCategories(data);
    properties && setProductProperties(properties);
    images && setUploadedImages(images);
    setCategorySelected(category?._id || '');

    setInitialValues({ name, desc, price, category: category?._id || '' });
  };
  const [newGetProduct, isLoading, error] = useFetching(getProduct);

  const onSubmit = async (values: Values, helpers: FormikHelpers<Values>) => {
    let filesId: string[] | undefined = undefined;
    if (images.length > 0) {
      const formData = new FormData();
      Array.from(images).forEach((file) => {
        formData.append('images', file);
      });
      console.log(storage);
      const res = await API.upload(formData);
      filesId = res.data.map((obj) => obj.fileId);
    }
    if (uploadedImagesIdToDelete.length > 0) {
      await API.deleteFiles(uploadedImagesIdToDelete);
      //УДАЛЕНИЕ ФАЙЛОВ
    }
    const uploadedImagesIdx = uploadedImages.map((img) => img._id);
    const allImages = filesId ? [...filesId, ...uploadedImagesIdx] : uploadedImagesIdx;
    const product = {
      ...values,
      price: +values.price,
      images: allImages,
      properties: productProperties,
    };

    try {
      const res = await API.updateProductById(props.params.id, product);
      helpers.setStatus(null);
      router.refresh();
      router.push('/products');
    } catch (error) {
      helpers.setStatus('Не удалось обновить продукт');
    }
  };

  // let selectedCatProps: {
  //   name: string;
  //   value: string[];
  // }[] = [];

  useEffect(() => {
    newGetProduct();
  }, []);
  useEffect(() => {
    const allCatsProps = getAllCatProps(categorySelected, categories);
    setSelectedCatProps(allCatsProps);
    const defaultProps = allCatsProps.reduce<{
      [key: string]: string;
    }>((acc, prop) => {
      return { ...acc, [prop.name]: prop.value[0] };
    }, {});
    console.log(defaultProps);
    setProductProperties((prev) => (Object.keys(prev).length === 0 ? defaultProps : prev));
  }, [categorySelected]);
  console.log(productProperties);

  if (error) {
    console.log(error);
    return <ErrorMessageC message={error?.response?.data?.message} />;
  }
  return (
    <div className="text-blue-900">
      <h1 className="text-xl font-semibold mb-3">Редактирование товара: {initialValues.name}</h1>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={formValidationSchema}
        onSubmit={onSubmit}>
        {(formik) => (
          <Form className="flex flex-col gap-2">
            <FileInputField
              formSubmitting={formik.isSubmitting}
              label="Добавить изображеня к товару"
              selectedImages={images}
              setSelectedImages={setImages}
              uploadedImages={uploadedImages}
              setUploadedImages={setUploadedImages}
              uploadedImagesIdToDelete={uploadedImagesIdToDelete}
              setUploadedImagesIdToDelete={setUploadedImagesIdToDelete}
              productId={props.params.id}
              isProductLoading={isLoading}
              getProduct={newGetProduct}
            />
            <FormField
              label="Введите название товара"
              disabled={isLoading}
              isLoading={isLoading}
              name="name"
              type="text"
              placeholder={isLoading ? '' : 'Название товара'}
            />
            <FormSelect
              disabled={isLoading}
              // className="w-2/5"
              isLoading={isLoading}
              name="category"
              onChange={(e: React.ChangeEvent<any>) => {
                formik.handleChange(e);
                setCategorySelected(e.target.value);
                setProductProperties({});
              }}
              label="Выберите категорию товара">
              <option value={''}>{isLoading ? '' : 'Без родителя'}</option>
              {categories.map(({ name, _id }) => (
                <option key={_id} value={_id} className="bg-blue-100">
                  {name}
                </option>
              ))}
            </FormSelect>
            {categories.length > 0 && selectedCatProps.length > 0 && (
              <div className="px-3 py-4 bg-blue-50 rounded-lg border-2 border-solid border-blue-100">
                {selectedCatProps.map((prop, idx) => (
                  <div key={idx} className="mb-2 last:mb-0 flex items-center gap-2">
                    <span>{prop.name + ':'}</span>
                    <select
                      value={productProperties[prop.name]}
                      className="rounded"
                      onChange={(e) => setProductProps(prop.name, e.target.value)}>
                      {prop.value.map((prop, idx) => (
                        <option key={idx} value={prop}>
                          {prop}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            )}
            <FormField
              label="Описание товара"
              isLoading={isLoading}
              as="textarea"
              maxLength={6000}
              name="desc"
              rows={2}
              disabled={isLoading}
              placeholder={isLoading ? '' : 'Описание'}
              onChange={(e) => {
                formik.handleChange(e);
                e.target.style.height = '';
                e.target.style.height = e.target.scrollHeight + 4 + 'px';
              }}
            />
            <FormField
              label="Цена"
              isLoading={isLoading}
              disabled={isLoading}
              name="price"
              placeholder={isLoading ? '' : 'Цена'}
            />
            {formik.status && <p>{formik.status}</p>}
            <div className="flex">
              <FormButton
                type="submit"
                loadingText="Обновляется..."
                className="mr-3"
                disabled={!formik.isValid || formik.isSubmitting || isLoading}
                isValid={formik.isValid}
                isLoading={formik.isSubmitting}>
                Обновить
              </FormButton>
              <SimpleButton
                onClick={() => router.push('/products')}
                type="button"
                disabled={formik.isSubmitting}>
                Отмена
              </SimpleButton>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditById;
