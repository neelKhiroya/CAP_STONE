import axios from 'axios';
import { useState, useEffect } from 'react';

function useGetPaginatedPatterns(limit, offset) {
    const [patterns, setPatterns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      setLoading(true)
      axios.get('http://localhost:8440/patterns', {
        params: {
          limit, offset
        }
    })
        .then(response => {
          setPatterns(response.data); 
          setLoading(false);            
        })
        .catch(caughtError => {
          console.log(caughtError)
          setError(caughtError);        
          setLoading(false);            
        });
    }, [limit, offset]);
    
    return {patterns, loading, error}
}

export default useGetPaginatedPatterns