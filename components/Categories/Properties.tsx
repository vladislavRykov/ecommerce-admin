import React from 'react';
import Button from '../UI/Buttons/Button/Button';
import { RxCross2 } from 'react-icons/rx';

interface PropertiesProps {
  properties:
    | {
        name: string;
        value: string[];
      }[]
    | [];
  setProperties: React.Dispatch<
    React.SetStateAction<
      {
        name: string;
        value: string[];
      }[]
    >
  >;
}
const Properties: React.FC<PropertiesProps> = ({ properties, setProperties }) => {
  const fieldStyle =
    'leading-6 resize-none w-full border-2 border-solid border-gray-300 p-2 rounded-xl transition-colors duration-300 focus:border-blue-900';
  return (
    <div className=" max-w-xl">
      <div className="flex flex-col mb-2 justify-center">
        <label className="ml-1 text-lg">Properties</label>
        <button
          className="w-1/2 px-4 py-3 border-2 border-solid border-blue-900 rounded-3xl"
          onClick={() => setProperties((prev) => [...prev, { name: '', value: [] }])}
          type="button">
          Добавить новое свойство
        </button>
      </div>
      <ul>
        {properties.map((property, idx) => (
          <li key={idx} className="flex gap-2 items-center mb-1 last:mb-0">
            <input
              placeholder={`Название ${idx + 1} свойства`}
              className={fieldStyle}
              onChange={(e) =>
                setProperties((prev) => {
                  const propers = [...prev];
                  propers[idx].name = e.target.value;
                  return propers;
                })
              }
              value={property.name}
            />
            <input
              placeholder={`Значение ${idx + 1} свойства: без пробелов, отделять запятыми`}
              className={fieldStyle}
              onChange={(e) =>
                setProperties((prev) => {
                  const propers = [...prev];
                  propers[idx].value = e.target.value.toLowerCase().split(',');
                  return propers;
                })
              }
              value={property.value}
            />
            <Button
              type="button"
              onClick={() =>
                setProperties((prev) => {
                  const propers = [...prev];
                  propers.splice(idx, 1);
                  return propers;
                })
              }>
              <RxCross2 />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Properties;
