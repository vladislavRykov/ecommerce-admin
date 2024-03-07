import { Models } from '@/models/models';
import { MongooseOrder } from '@/types/types';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const orders: MongooseOrder[] = await Models.Order.find();
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Ошибки при получении заказов' }, { status: 500 });
  }
}
