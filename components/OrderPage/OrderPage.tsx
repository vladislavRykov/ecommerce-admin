'use client';
import { MongooseOrder } from '@/types/types';
import React, { useEffect, useState } from 'react';
import API from '@/services/api/api';

const OrderPage = () => {
  const [orders, setOrders] = useState<MongooseOrder[]>([]);
  useEffect(() => {
    const getOrders = async () => {
      const { data } = await API.getOrders();
      setOrders(data);
    };
    getOrders();
  }, []);

  return (
    <div>
      <div className="">
        <div className="shadow-md text-center">
          <div className="grid grid-cols-order text-lg text-gray-500 shadow-md p-2 bg-gray-200">
            <div className="">Статус</div>
            <div className="">Дата</div>
            <div>Покупатель</div>
            <div>Продукт</div>
          </div>
          {orders.map((order) => (
            <div
              key={order._id}
              className="grid grid-cols-order py-4 px-2 items-center border-b-2 border-solid border-gray-100">
              <div>
                {order.paid ? (
                  <span className="text-green-500">Оплачено</span>
                ) : (
                  <span className="text-red-500">Не оплачено</span>
                )}
              </div>
              <div>{new Date(order.createdAt).toDateString()}</div>
              <div>
                <div>{order.name}</div>
                <div>
                  {order.country}, {order.street}
                </div>
              </div>
              <div>
                {order.line_items.map((item, idx) => (
                  <div key={idx + item.price_data.product_data.name} className="mb-1 shadow-md p-2">
                    {item.price_data.product_data.name} x{item.quantity}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
