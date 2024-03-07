import { Overwrite } from '@/types/helperTypes';
import {
  ApiMessage,
  Category,
  MongooseCategory,
  MongooseCategoryPopulated,
  MongooseOrder,
  MongooseProduct,
  MongooseProductPopulated,
  Product,
  UploadFileResponseData,
} from '@/types/types';
import axios from 'axios';

const instance = axios.create({
  baseURL: '/api',
});

interface ProductFields
  extends Overwrite<Product, { name?: string; images?: string[]; desc?: string; price?: number }> {}

const API = {
  createNewProduct: (product: Product) => instance.post('/products', product),
  getAllProducts: () => instance.get<MongooseProductPopulated[]>('/products'),
  getProductById: (id: string) => instance.get<MongooseProductPopulated>(`/products?id=${id}`),
  updateProductById: (id: string, product: ProductFields) =>
    instance.put<ApiMessage>(`/products?id=${id}`, product),
  deleteProductById: (id: string) => instance.delete<ApiMessage>(`/products?id=${id}`),
  upload: (body: FormData) =>
    instance.post<UploadFileResponseData>('/upload', body, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  deleteFiles: (body: string[]) => instance.post<ApiMessage>('/delete', body),
  getAllCategories: () => instance.get<MongooseCategoryPopulated[]>('/categories'),
  getCategoryById: (id: string) => instance.get<MongooseCategoryPopulated>(`/categories?id=${id}`),
  createCategory: (category: Category) => instance.post<ApiMessage>('/categories', category),
  updateCategoryById: (id: string, category: Category) =>
    instance.put<ApiMessage>(`/categories?id=${id}`, category),
  deleteCategoryById: (id: string) => instance.delete<ApiMessage>(`/categories?id=${id}`),

  getOrders: () => instance.get<MongooseOrder[]>('/orders'),
};
export default API;
