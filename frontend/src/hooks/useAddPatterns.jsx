import { useState } from 'react';
import axios from 'axios';

// Custom hook to handle adding a new pattern
const useAddPattern = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addPattern = async (pattern) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:8440/patterns', pattern);

      if (response.status === 200 || response.status === 201) {
        console.log('Pattern added:', response.data);
        return response.data; // Return the response data in case you need to use it
      }
    } catch (err) {
      setError(err); // Store error if the request fails
      console.error('Error adding pattern:', err);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, addPattern };
};

export default useAddPattern;