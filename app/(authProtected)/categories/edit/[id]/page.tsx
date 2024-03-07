'use client';
import API from '@/services/api/api';
import { Form, Formik, FormikHelpers } from 'formik';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import FormSelect from '@/components/UI/Formik/FormSelect';
import { MongooseCategoryPopulated } from '@/types/types';
import { useFetching } from '@/hooks/useFetching';
import FormField from '@/components/UI/Formik/FormField';
import FormButton from '@/components/UI/Formik/FormButton';
import SimpleButton from '@/components/UI/Buttons/SimpleButton';
import DeleteButton from '@/components/UI/Buttons/DeleteButton';
import { delay } from '@/utils/delay';
import AreYouSure from '@/components/PopUp/AreYouSure';
import { useRouter } from 'next/navigation';
import Properties from '@/components/Categories/Properties';
const formValidationSchema = Yup.object({
  name: Yup.string().required('Обязательное поле.').max(50, 'Максимум 50 символов'),
  parent: Yup.string(),
});

interface Values {
  name: string;
  parent: string;
}
interface ParamsProps {
  params: any;
  searchParams: any;
}
const EditCat: React.FC<ParamsProps> = (props) => {
  const router = useRouter();
  const [properties, setProperties] = useState<{ name: string; value: string[] }[]>([]);
  const [initialValues, setInitialValues] = useState<Values>({
    name: '',
    parent: '',
  });
  const [categories, setCategories] = useState<MongooseCategoryPopulated[]>([]);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const getCategoriesData = async () => {
    const { data: cats } = await API.getAllCategories();
    const { data: cat } = await API.getCategoryById(props.params.id);
    const { name, parent, properties } = cat;
    setCategories(cats);
    setProperties(properties);
    setInitialValues({ name, parent: parent?._id || '' });
  };
  const deleteCategory = async () => {
    if (openDeleteModal && props.params.id) {
      const res = await API.deleteCategoryById(props.params.id);
      router.push('/categories');
      return res.data;
    }
  };
  const [newGetCategoriesData, isLoading, error] = useFetching(getCategoriesData);

  const onSubmit = async (values: Values, helpers: FormikHelpers<Values>) => {
    try {
      const res = await API.updateCategoryById(props.params.id, { ...values, properties });
      helpers.setStatus(null);
      router.push('/categories');
    } catch (error) {
      helpers.setStatus('Не удалось обновить продукт');
    }
  };

  useEffect(() => {
    newGetCategoriesData();
  }, []);

  return (
    <div className="text-blue-900">
      <h1 className="text-xl font-semibold mb-3">
        Редактировать или удалить категорию: {initialValues.name}
      </h1>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={formValidationSchema}
        onSubmit={onSubmit}>
        {(formik) => (
          <Form className="flex flex-col gap-2">
            <div className="flex gap-4">
              <FormField
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
                <option value={''} selected={Boolean(initialValues.parent === '')}>
                  {isLoading ? '' : 'Без родителя'}
                </option>
                {categories.map(({ name, _id }) => (
                  <option
                    selected={_id === initialValues.parent}
                    key={_id}
                    value={_id}
                    className="bg-blue-100">
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
                loadingText="Обновление..."
                className="mr-3"
                disabled={!formik.isValid || formik.isSubmitting}
                isValid={formik.isValid}
                isLoading={formik.isSubmitting}>
                Обновить
              </FormButton>
              <DeleteButton
                onClick={() => setOpenDeleteModal(true)}
                type="button"
                className="mr-3"
                disabled={formik.isSubmitting}>
                Удалить
              </DeleteButton>
            </div>
          </Form>
        )}
      </Formik>
      {openDeleteModal && (
        <AreYouSure
          action={deleteCategory}
          closeModal={() => setOpenDeleteModal(false)}
          message="Вы точно хотите удалить эту категорию?"
        />
      )}
      <div className="h-screen"></div>
    </div>
  );
};

export default EditCat;
