import { useEffect, useState } from "react";
import { load } from "../utils/LocalStorage";
import { API_KEY } from "../api/Constants";

export function useFetch(url) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    async function getData(url) {
      try {
        setIsLoading(true);
        setHasError(false);

        const headers = new Headers();
        const accessToken = load('accessToken');

        if (accessToken) {
          headers.append('Authorization', `Bearer ${accessToken}`);
        }

        if (API_KEY) {
          headers.append('X-Noroff-API-Key', API_KEY);
        }

        headers.append('Content-Type', 'application/json');

        const response = await fetch(url, { headers });
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