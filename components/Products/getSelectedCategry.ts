import { MongooseCategoryPopulated } from '@/types/types';

export const getSelectedCategory = (
  catId: string,
  categories: [] | MongooseCategoryPopulated[],
) => {
  const cat = categories.find((value) => value._id === catId);
  return cat;
};
