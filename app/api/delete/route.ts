import { mongooseConnect } from '@/lib/mongoose';
import { NextRequest, NextResponse } from 'next/server';
import formidable from 'formidable';
import { format } from 'date-fns/format';
import path, { join } from 'path';
import { mkdir, stat, writeFile } from 'fs/promises';
import mime from 'mime';
import { MongooseFile } from '@/types/types';
import fs from 'fs';
import { Models } from '@/models/models';
import { storage } from '@/firebase/firebase';
import { deleteObject, ref } from 'firebase/storage';

export async function POST(req: NextRequest) {
  const filesIds: string[] = await req.json();
  filesIds.forEach(async (fileId) => {
    const deletedFile: MongooseFile | null = await Models.File.findByIdAndDelete(fileId);
    if (!deletedFile)
      return NextResponse.json({ message: 'Такого файла не существует' }, { status: 400 });

    const fileRef = ref(storage, deletedFile.source);

    deleteObject(fileRef)
      .then(() => {
        console.log('Файл успешно удален');
      })
      .catch((error) => {
        console.error('Ошибка при удалении файла: ', error);
      });
    ///старый способ
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
  return NextResponse.json({ message: 'Файлы успешно удалены' }, { status: 200 });
}
