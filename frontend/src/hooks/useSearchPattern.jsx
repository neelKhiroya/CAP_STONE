import { useState, useEffect } from 'react';
import axios from 'axios';

function useSearchPattern (patternName) {
    const [patterns, setPatterns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8440/patterns/search`, {
            params: {
                name: patternName
            }
        })
          .then(response => {
              setPatterns(response.data); 
              setLoading(false);          
          })
          .catch(caughtError => {
              setError(caughtError);       
              setLoading(false);           
          });
      }, [patternName]);
      
      return {patterns, loading, error}
}

export default useSearchPattern