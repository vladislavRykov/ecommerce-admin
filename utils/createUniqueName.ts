import mime from 'mime';
export const createUniqueName = (file: File | Blob) => {
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const filename = `${file.name.replace(/\.[^/.]+$/, '')}-${uniqueSuffix}.${mime.getExtension(
    file.type,
  )}`;
  return filename;
};
