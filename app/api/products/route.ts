import clientPromise from '@/lib/mongodb';
import { mongooseConnect } from '@/lib/mongoose';
import { Models } from '@/models/models';
import {
  MongooseFile,
  MongooseProduct,
  MongooseProductPopulated,
  Product as ProductType,
} from '@/types/types';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { deleteObject, ref } from 'firebase/storage';
import { storage } from '@/firebase/firebase';

type ResponseData = {
  message: string;
};

export async function POST(req: NextRequest) {
  await mongooseConnect();
  const body: ProductType = await req.json();
  const errorBody = { name: body.name, desc: body.desc };
  try {
    await Models.Product.create({ ...body, category: body.category || undefined });
    // await Product.create(errorBody);
    return NextResponse.json({ message: 'Продукт успешно создан' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Ошибка' }, { status: 400 });
  }
}
export async function GET(req: NextRequest) {
  await mongooseConnect();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (id) {
    try {
      const product: MongooseProductPopulated | null = await Models.Product.findById(id).populate([
        'images',
        'category',
      ]);
      if (!product)
        return NextResponse.json('Такого продукта не существует в базе', { status: 400 });
      return NextResponse.json(product, { status: 200 });
    } catch (error) {
      return NextResponse.json(
        { message: 'Ошибка: Не удалось получить продукт по id' },
        { status: 400 },
      );
    }
  } else {
    try {
      const products: MongooseProduct[] = await Models.Product.find().populate([
        'images',
        'category',
      ]);
      return NextResponse.json(products, { status: 200 });
    } catch (error) {
      return NextResponse.json(
        { message: 'Ошибка: не удалось получить продукты' },
        { status: 400 },
      );
    }
  }
}
export async function PUT(req: NextRequest) {
  await mongooseConnect();
  const { searchParams } = new URL(req.url);
  const body: ProductType = await req.json();
  const { category, ...restBody } = body;
  const id = searchParams.get('id');
  const cat = category ? { category } : { $unset: { category: true } };

  try {
    const product: MongooseProduct | null = await Models.Product.findByIdAndUpdate(id, {
      ...restBody,
      ...cat,
    });
    if (!product) return NextResponse.json('Такого продукта не существует в базе', { status: 400 });
    return NextResponse.json({ message: 'Продукт успешно обновлен.' }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Ошибка: Не получилось обновить данные о продукте' },
      { status: 400 },
    );
  }
}
export async function DELETE(req: NextRequest) {
  await mongooseConnect();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  try {
    const product: MongooseProduct | null = await Models.Product.findByIdAndDelete(id);
    if (!product)
      return NextResponse.json(
        { message: 'Такого продукта не существует в базе' },
        { status: 400 },
      );
    if (product?.images) {
      product.images.forEach(async (fileId) => {
        const deletedFile: MongooseFile | null = await Models.File.findByIdAndDelete(fileId);
        if (!deletedFile)
          return NextResponse.json({ message: 'Такого файла не существует' }, { status: 200 });

        const fileRef = ref(storage, deletedFile.source);

        deleteObject(fileRef)
          .then(() => {
            console.log('Файл успешно удален');
          })
          .catch((error) => {
            console.error('Ошибка при удалении файла: ', error);
          });
        // fs.unlink(path.join(process.cwd(), '/public', deletedFile.source), (err) => {
        //   if (err) {
        //     return NextResponse.json(
        //       { message: 'Ошибка при удаление файла из директории' },
        //       { status: 200 },
        //     );
        //   } else {
        //     console.log('File deleted', deletedFile);
        //   }
        // });
      });
    }
    return NextResponse.json({ message: 'Продукт успешно удалён.' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Ошибка: не удалось удалить продукт' }, { status: 400 });
  }
}
