import axios from 'axios';
import { useState, useEffect } from 'react';

function useGetPatterns() {
    const [patterns, setPatterns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      axios.get('http://localhost:8440/patterns')  // Make API call
        .then(response => {
          setPatterns(response.data);  // Set the fetched data
          setLoading(false);            // Set loading to false
        })
        .catch(caughtError => {
          setError(caughtError);        // Set any error that occurs
          setLoading(false);            // Set loading to false
        });
    }, []);
    
    return {patterns, loading, error}
}

export default useGetPatterns