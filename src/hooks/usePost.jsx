import { useState } from 'react';
import { load } from '../utils/LocalStorage';
import { API_KEY } from '../api/Constants';

const usePost = (url) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const post = async (data) => {
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

    headers.append('Content-Type', 'application/json');

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data),
      });
      const result = await response.json();
      setLoading(false);
      return result;
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  return { post, loading, error };
};

export default usePost;