import { useState, useEffect } from 'react';
const useFetch = <T>(
  url: string,
  options?: RequestInit
): [T | null, unknown] => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<T | null>(null);

  useEffect(() => {
    fetch(url, options)
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => setError(err));
  }, [url, options]);
  return [data, error];
};

export default useFetch;
