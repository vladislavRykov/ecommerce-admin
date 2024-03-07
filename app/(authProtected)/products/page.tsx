'use client';
import AreYouSure from '@/components/PopUp/AreYouSure';
import API from '@/services/api/api';
import { MongooseProduct, MongooseProductPopulated } from '@/types/types';
import { delay } from '@/utils/delay';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const Products = () => {
  // await delay(10000);
  const [productToDelete, setProductToDelete] = useState<MongooseProductPopulated | null>(null);
  const [products, setProducts] = useState<MongooseProductPopulated[]>([]);
  const getAllProducts = async () => {
    const res = await API.getAllProducts();
    setProducts(res.data);
  };
  const deleteProduct = async () => {
    if (productToDelete) {
      const res = await API.deleteProductById(productToDelete._id);
      getAllProducts();
      return res.data;
    }
  };
  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <div>
      <Link
        className="mb-3 bg-green-600 text-white py-3 px-4 rounded-lg inline-block hover:bg-green-300 hover:text-green-800 duration-300 focus:outline-none focus:ring focus:ring-green-200"
        href={'/products/new'}>
        Добавить товар
      </Link>
      <div className="flex justify-center h-max">
        <ul className="flex flex-col w-4/5 text-blue-900">
          {products.map((product, idx) => (
            <li
              key={product._id}
              className="relative bg-blue-50 border-b-2 border-gray-200 border-solid py-3 px-4 mb-1">
              <div className="flex gap-14 justify-between items-start">
                <div className="mb-4 text-xl flex flex-col gap-4">
                  <span title="Название">{product.name}</span>
                  <span title="Цена" className="">
                    {product.price}
                  </span>
                </div>
                <div className="flex gap-4 text-white">
                  <Link
                    href={`/products/edit/${product._id}`}
                    className="transition-all p-2 bg-blue-500 rounded hover:bg-blue-200 active:scale-95">
                    Редактировать
                  </Link>
                  <button
                    onClick={() => setProductToDelete(product)}
                    className="transition-all p-2 bg-red-500 rounded hover:bg-red-200 active:scale-95">
                    Удалить
                  </button>
                </div>
              </div>
              <p className="bg-blue-100 rounded-sm p-2 text-sm font-medium break-all">
                {product.desc}
              </p>
              <div className="flex justify-center items-center text-xs absolute top-4 -left-8 w-6 h-6 bg-blue-100 rounded-full p-1 font-semibold">
                {idx + 1}
              </div>
            </li>
          ))}
        </ul>
      </div>
      {productToDelete && (
        <AreYouSure
          action={deleteProduct}
          closeModal={() => setProductToDelete(null)}
          message={`Вы уверены, что хотите удалить этот товар: ${productToDelete?.name}`}
        />
      )}
    </div>
  );
};

export default Products;
