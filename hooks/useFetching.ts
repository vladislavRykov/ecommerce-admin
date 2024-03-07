import { useState } from 'react';

export const useFetching = (cb: () => Promise<void>): [() => Promise<void | any>, boolean, any] => {
  const [error, setError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const newFunction = async () => {
    try {
      setError(null);
      setIsLoading(true);
      await cb();
    } catch (errorApi: any) {
      setError(errorApi);
      return errorApi;
    } finally {
      setIsLoading(false);
    }
  };
  return [newFunction, isLoading, error];
};
