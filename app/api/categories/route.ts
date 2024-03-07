import { mongooseConnect } from '@/lib/mongoose';
import { Models } from '@/models/models';
import { Category, MongooseCategory, MongooseCategoryPopulated } from '@/types/types';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { checkAuth, checkAuthV2 } from '../auth/[...nextauth]/route';

export async function GET(req: NextRequest) {
  await mongooseConnect();
  try {
    await checkAuth();
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    } else {
      return NextResponse.json({ message: error }, { status: 400 });
    }
  }
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (id) {
    try {
      const category = await Models.Category.findById(id).populate(['parent']);
      if (!category)
        return NextResponse.json('Такой категории не существует в базе', { status: 400 });
      return NextResponse.json(category, { status: 200 });
    } catch (error) {
      return NextResponse.json(
        { message: 'Ошибка: не получилось получить категорию' },
        { status: 400 },
      );
    }
  } else {
    try {
      const categories: MongooseCategoryPopulated[] = await Models.Category.find().populate([
        'parent',
      ]);
      return NextResponse.json(categories, { status: 200 });
    } catch (error) {
      return NextResponse.json(
        { message: 'Ошибка: не получилось получить категории' },
        { status: 400 },
      );
    }
  }
}
export async function POST(req: NextRequest) {
  await mongooseConnect();
  const { name, parent, properties }: Category = await req.json();
  try {
    const category: Category = await Models.Category.create({
      name,
      parent: parent || undefined,
      properties,
    });

    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Ошибка: не получилось создать категорию' },
      { status: 400 },
    );
  }
}
export async function PUT(req: NextRequest) {
  await mongooseConnect();
  const { searchParams } = new URL(req.url);
  const body: Category = await req.json();
  const id = searchParams.get('id');

  const cat = body.parent ? { parent: body.parent } : { $unset: { parent: true } };
  try {
    const category: MongooseCategory | null = await Models.Category.findByIdAndUpdate(id, {
      name: body.name,
      properties: body.properties,
      ...cat,
    });
    // await Product.create(errorBody);
    if (!category)
      return NextResponse.json('Такой категории не существует в базе', { status: 400 });
    return NextResponse.json({ message: 'Категория успешно обновлена.' }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Ошибка: Не получилось обновить данные о категории' },
      { status: 400 },
    );
  }
}
export async function DELETE(req: NextRequest) {
  await mongooseConnect();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  try {
    const deletedCategory: MongooseCategory | null = await Models.Category.findByIdAndDelete(id);
    if (!deletedCategory)
      return NextResponse.json(
        { message: 'Такой категории не существует в базе' },
        { status: 400 },
      );
    const objId = new ObjectId(deletedCategory._id);
    const res = await Models.Category.updateMany(
      {
        parent: objId,
      },
      { $unset: { parent: true } },
    );

    return NextResponse.json({ message: 'Категория успешно удалёна.' }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'Ошибка: не удалось удалить категорию' }, { status: 400 });
  }
}
