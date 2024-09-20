import { useState } from 'react';
import { load } from '../utils/LocalStorage';
import { API_KEY } from '../api/Constants';

const useDelete = (url) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const del = async () => {
    setLoading(true);
    setError(null);

    const headers = new Headers();
    const accessToken = load('accessToken');

    if (accessToken) {
      headers.append('Authorization', `Bearer ${accessToken}`);
    }

    if (API_KEY) {
      headers.append('X-Noroff-API-Key', API_KEY);
    }

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: headers,
      });
      const result = await response.json();
      setLoading(false);
      return result;
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  return { del, loading, error };
};

export default useDelete;