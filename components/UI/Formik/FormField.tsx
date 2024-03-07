import React, { ClassAttributes, InputHTMLAttributes } from 'react';
import { Field, FieldAttributes, FieldHookConfig, useField } from 'formik';
import ThreeDots from '../../Loaders/ThreeDots';

interface FormFieldProps {
  label?: string;
  isLoading?: boolean;
}

const FormField: React.FC<FormFieldProps & FieldAttributes<any>> = ({
  label,
  isLoading = false,
  className,
  ...props
}) => {
  const [field, meta, helpers] = useField(props);
  const fieldStyle =
    'leading-6 resize-none w-full border-2 border-solid border-gray-300 p-2 rounded-xl transition-colors duration-300 focus:border-blue-900';
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && <label className="ml-1 text-lg">{label}</label>}
      <div className="relative">
        <Field {...field} {...props} className={fieldStyle} />
        {isLoading && (
          <ThreeDots className="absolute top-1/2 -translate-y-1/2 left-3" alt="loading..." />
        )}
      </div>
      {meta.touched && meta.error && <div className="text-orange-700">{meta.error}</div>}
    </div>
  );
};
export default FormField;
