import { useEffect, useRef } from 'react';
import * as React from 'react';

interface FileInputProps extends React.ComponentPropsWithoutRef<'input'> {
  fileList: File[];
  setFileList: (fileList: FileList | []) => void;
}
const FileInput = ({ fileList = [], setFileList, ...rest }: FileInputProps) => {
  const { onChange, ...restt } = rest;
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      const dataTransfer = new DataTransfer();
      fileList.forEach((file) => dataTransfer.items.add(file));
      inputRef.current.files = dataTransfer.files;
    }
  }, [fileList]);

  return (
    <input
      type="file"
      ref={inputRef}
      data-testid="uploader"
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        setFileList(e.target.files || []);
        onChange?.(e);
      }}
      {...restt}
    />
  );
};
export default FileInput;
