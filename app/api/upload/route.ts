import { mongooseConnect } from '@/lib/mongoose';
import { NextRequest, NextResponse } from 'next/server';
import formidable from 'formidable';
import { format } from 'date-fns/format';
import { join } from 'path';
import { mkdir, stat, writeFile } from 'fs/promises';
import mime from 'mime';
import { Models } from '@/models/models';
import { MongooseFile } from '@/types/types';
import { createUniqueName } from '@/utils/createUniqueName';
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '@/firebase/firebase';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const files = formData.getAll('images') as (Blob & { name: string })[] | null;
  if (!files) {
    return NextResponse.json({ error: 'File blob is required.' }, { status: 400 });
  }
  ///
  try {
    const filesUrls = files?.map(async (file, index) => {
      const imageRef = ref(storage, `images/${createUniqueName(file)}`);
      const uploadTask = uploadBytesResumable(imageRef, file);
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
          },
          (error) => {
            console.error('Error uploading file: ', error);
            reject(error);
          },
          async () => {
            const url = await getDownloadURL(imageRef);
            console.log('File uploaded successfully: ' + url);
            const fileName = file.name;
            const mdbFile: MongooseFile = await Models.File.create({
              fileName: fileName,
              source: url,
              size: file.size,
              mimetype: file.type,
            });
            resolve({ fileId: mdbFile._id });
          },
        );
      });
    });
    const payload = await Promise.all(filesUrls);
    return NextResponse.json(payload, { status: 200 });
  } catch (error) {
    console.error('Error uploading file: ', error);
  }

  ///

  // const relativeUploadDir = `/uploads/${format(Date.now(), 'dd-MM-Y')}`;
  // const uploadDir = join(process.cwd(), 'public', relativeUploadDir);
  // try {
  //   await stat(uploadDir);
  // } catch (e: any) {
  //   if (e.code === 'ENOENT') {
  //     await mkdir(uploadDir, { recursive: true });
  //   } else {
  //     console.error('Error while trying to create directory when uploading a file\n', e);
  //     return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  //   }
  // }
  // try {
  //   const filesUrls: Promise<{ fileId: string }>[] = files.map(async (file) => {
  //     const buffer = Buffer.from(await file.arrayBuffer());
  //     const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  //     const filename = `${file.name.replace(/\.[^/.]+$/, '')}-${uniqueSuffix}.${mime.getExtension(
  //       file.type,
  //     )}`;
  //     await writeFile(`${uploadDir}/${filename}`, buffer);
  //     const mdbFile: MongooseFile = await Models.File.create({
  //       fileName: file.name,
  //       source: `${relativeUploadDir}/${filename}`,
  //       size: file.size,
  //       mimetype: file.type,
  //     });
  //     return { fileId: mdbFile._id };
  //   });
  //   const payload = await Promise.all(filesUrls);
  //   return NextResponse.json(payload, { status: 200 });
  // } catch (e) {
  //   console.error('Error while trying to upload a file\n', e);
  //   return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  // }
}
// export const config = {
//   api: {
//     bodyParser: false, // enable form data
//   },
// };
