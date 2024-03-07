'use client';

import { useFetching } from '@/hooks/useFetching';
import API from '@/services/api/api';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { useParams, useRouter } from 'next/navigation';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import * as Yup from 'yup';
import ErrorMessageC from '@/components/Errors/ErrorMessageC';
import { delay } from '@/utils/delay';
import ProductField from '@/components/UI/Formik/FormField';
import {
  Category,
  MongooseCategory,
  MongooseCategoryPopulated,
  MongooseFile,
  UploadFileResponseData,
} from '@/types/types';
import FileInputField from '@/components/Products/Edit/Formik/FileInputField/FileInputField';
import FormButton from '@/components/UI/Formik/FormButton';
import SimpleButton from '@/components/UI/Buttons/SimpleButton';
import FormSelect from '@/components/UI/Formik/FormSelect';
import GearsSpinner from '@/components/Loaders/GearsSpinner';
import Link from 'next/link';
import Properties from '@/components/Categories/Properties';
import CheckAuth from '@/components/Auth/CheckAuth';

const formValidationSchema = Yup.object({
  name: Yup.string().required('Обязательное поле.').max(50, 'Максимум 50 символов'),
  parent: Yup.string(),
});

interface Values {
  name: string;
  parent: string;
}

const Categories: React.FC = () => {
  const router = useRouter();
  const initialValues = { name: '', parent: '' };
  const [categories, setCategories] = useState<MongooseCategoryPopulated[]>([]);
  const [properties, setProperties] = useState<{ name: string; value: string[] }[]>([]);
  const getCategories = async () => {
    const { data } = await API.getAllCategories();
    setCategories(data);
  };
  const [newGetCategories, isLoading, error] = useFetching(getCategories);
  console.log(error);

  const onSubmit = async (values: Values, helpers: FormikHelpers<Values>) => {
    const res = await API.createCategory({ ...values, properties });
    helpers.resetForm();
    setProperties([]);
    newGetCategories();
  };

  useEffect(() => {
    newGetCategories();
  }, []);

  return (
    <div className="text-blue-900">
      <h1 className="text-xl font-semibold mb-3">Просмотр и добавление категорий</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={formValidationSchema}
        onSubmit={onSubmit}>
        {(formik) => (
          <Form className="flex flex-col gap-2">
            <div className="flex gap-4">
              <ProductField
                label="Введите название категории"
                className="w-2/5"
                disabled={isLoading}
                isLoading={isLoading}
                name="name"
                type="text"
                placeholder={isLoading ? '' : 'Название категории'}
              />
              <FormSelect
                disabled={isLoading}
                // className="w-2/5"
                isLoading={isLoading}
                name="parent"
                label="Выберите родителя категории">
                <option value={''} selected>
                  {isLoading ? '' : 'Без родителя'}
                </option>
                {categories.map(({ name, _id }) => (
                  <option key={_id} value={_id} className="bg-blue-100">
                    {name}
                  </option>
                ))}
              </FormSelect>
            </div>
            <Properties setProperties={setProperties} properties={properties} />
            {formik.status && <p>{formik.status}</p>}
            <div className="flex">
              <FormButton
                type="submit"
                loadingText="Добавление..."
                className="mr-3"
                disabled={!formik.isValid || formik.isSubmitting}
                isValid={formik.isValid}
                isLoading={formik.isSubmitting}>
                Добавить
              </FormButton>
            </div>
          </Form>
        )}
      </Formik>
      {!isLoading ? (
        <ul className="mt-9 flex items-start gap-2 flex-wrap">
          {categories.map(({ name, _id, parent }) => (
            <li key={_id} title={`Родитель: ${parent?.name || 'нет'}`}>
              <Link
                href={`/categories/edit/${_id}`}
                className="text-center bg-blue-200 border-2 border-solid border-blue-400 px-3 py-2 break-all max-w-xs">
                {name}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="w-full mt-4">
          <GearsSpinner className="block mx-auto " alt="Loading..." />
        </div>
      )}
    </div>
  );
};

export default Categories;
