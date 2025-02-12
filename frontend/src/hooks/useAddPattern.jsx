import { useState } from 'react';
import axios from 'axios';

// add dat patty
const useAddPattern = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addPattern = async (pattern) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://192.168.2.18:8440/patterns', pattern, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200 || response.status === 201) {
        console.log('Pattern added:', response.data);
        return response.data;
      }
    } catch (err) {
      setError(err);
      console.error('Error adding pattern:', err);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, addPattern };
};

export default useAddPattern;