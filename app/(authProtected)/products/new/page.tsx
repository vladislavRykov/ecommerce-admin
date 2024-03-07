'use client';
import { getAllCatProps } from '@/components/Products/getAllCatProps';
import FormSelect from '@/components/UI/Formik/FormSelect';
import API from '@/services/api/api';
import { MongooseCategoryPopulated } from '@/types/types';
import { delay } from '@/utils/delay';
import { Form, Formik, Field, FormikHelpers, ErrorMessage } from 'formik';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';

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
  price: string;
}

const New = () => {
  const router = useRouter();
  const [categorySelected, setCategorySelected] = useState<string>('');
  const [categories, setCategories] = useState<MongooseCategoryPopulated[] | []>([]);
  const [productProperties, setProductProperties] = useState<{
    [key: string]: string;
  }>({});
  const [selectedCatProps, setSelectedCatProps] = useState<
    {
      name: string;
      value: string[];
    }[]
  >([]);
  const fieldStyle =
    'border-2 border-solid border-gray-300 p-2 rounded-xl transition-colors duration-300 focus:border-blue-900';
  const defaultBtnStyles =
    'transition-colors w-fit duration-500 border-solid border-2 border-transparent rounded-md px-3 py-2 bg-blue-900 text-white';
  const errorBtnStyles =
    'transition-colors w-fit duration-500 border-solid border-2 border-transparent rounded-md px-3 py-2 bg-orange-700 text-red-300';
  const pendingBtnStyles =
    'transition-colors w-fit duration-500 border-solid border-2 border-blue-900 rounded-md px-3 py-2 bg-white text-blue-900';
  useEffect(() => {
    (async () => {
      const { data } = await API.getAllCategories();
      setCategories(data);
    })();
  }, []);
  const setProductProps = (name: string, value: string) => {
    setProductProperties((prev) => {
      const newProps = { ...prev };
      newProps[name] = value;
      return newProps;
    });
  };
  useEffect(() => {
    const allCatsProps = getAllCatProps(categorySelected, categories);
    setSelectedCatProps(allCatsProps);
    const defaultProps = allCatsProps.reduce<{
      [key: string]: string;
    }>((acc, prop) => {
      return { ...acc, [prop.name]: prop.value[0] };
    }, {});
    console.log(defaultProps);
    setProductProperties(defaultProps);
  }, [categorySelected]);
  const onSubmit = async (values: Values, helpers: FormikHelpers<Values>) => {
    const product = { ...values, price: +values.price, properties: productProperties };
    try {
      const res = await API.createNewProduct(product);
      helpers.setStatus(null);
      router.refresh();
      router.push('/products');
    } catch (error) {
      helpers.setStatus('Не удалось создать продукт');
    }
    // helpers.setSubmitting(false);
  };
  return (
    <div className="text-blue-900">
      <h1 className="text-xl font-semibold mb-3">Новый товар</h1>
      <Formik
        initialValues={{
          name: '',
          category: '',
          desc: '',
          price: '',
        }}
        validationSchema={formValidationSchema}
        onSubmit={onSubmit}>
        {(formik) => (
          <Form className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <label className="ml-1 text-lg" htmlFor="name">
                Введите имя товара
              </label>
              <Field name="name" type="text" placeholder="Название товара" className={fieldStyle} />
              <div className="text-orange-700">
                <ErrorMessage name="name" />
              </div>
            </div>
            <FormSelect
              // className="w-2/5"
              name="category"
              label="Выберите категорию"
              onChange={(e: React.ChangeEvent<any>) => {
                formik.handleChange(e);
                setCategorySelected(e.target.value);
              }}>
              <option value={''} selected>
                Без родителя
              </option>
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
            <div className="flex flex-col gap-1">
              <label className="ml-1 text-lg" htmlFor="desc">
                Описание товара
              </label>
              <Field
                as="textarea"
                maxLength={6000}
                name="desc"
                rows={2}
                placeholder="Описание"
                className={fieldStyle}
                onChange={(e: React.ChangeEvent<any>) => {
                  formik.handleChange(e);
                  e.target.style.height = '';
                  e.target.style.height = e.target.scrollHeight + 4 + 'px';
                }}
              />
              <div className="text-orange-700">
                <ErrorMessage name="desc" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="ml-1 text-lg" htmlFor="price">
                Цена ($)
              </label>
              <Field name="price" placeholder="Цена" className={fieldStyle} />
              <div className="text-orange-700">
                <ErrorMessage name="price" />
              </div>
            </div>
            {formik.status && <p>{formik.status}</p>}
            <button
              disabled={!formik.isValid || formik.isSubmitting}
              type="submit"
              className={
                !formik.isValid
                  ? errorBtnStyles
                  : formik.isSubmitting
                  ? pendingBtnStyles
                  : defaultBtnStyles
              }>
              <span>{formik.isSubmitting ? 'Создание...' : 'Создать'}</span>
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default New;
