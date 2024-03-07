import { MongooseCategoryPopulated } from '@/types/types';
import { getSelectedCategory } from './getSelectedCategry';

export const getAllCatProps = (catId: string, categories: [] | MongooseCategoryPopulated[]) => {
  const selectedCatProps = [];
  if (categories.length > 0 && catId) {
    console.log(123);
    let selectedCat = getSelectedCategory(catId, categories);
    selectedCat && selectedCatProps.push(...selectedCat.properties);
    while (selectedCat?.parent) {
      selectedCat = getSelectedCategory(selectedCat?.parent._id, categories);
      selectedCat && selectedCatProps.push(...selectedCat.properties);
    }
  }
  return selectedCatProps;
};
