import { useEffect, useState } from "react";

export function useFetch(url) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    async function getData(url) {
      try {
        setIsLoading(true);
        setHasError(false);
    
        const response = await fetch(url);
        console.log("Response:", response);
    
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
    
        const json = await response.json();
        setData(json.data);
      } catch (error) {
        console.error(error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    }

    getData(url);
  }, [url]);

  return { data, isLoading, hasError };
};
