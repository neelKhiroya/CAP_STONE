import { useState, useEffect } from 'react';
import axios from 'axios';

function useSearchPattern (patternName) {
    const [patterns, setPatterns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`http://192.168.2.18:8440/patterns/search`, {
            params: {
                name: patternName
            }
        })
          .then(response => {
              setPatterns(response.data);  // Set the fetched data
              setLoading(false);            // Set loading to false
          })
          .catch(caughtError => {
              setError(caughtError);        // Set any error that occurs
              setLoading(false);            // Set loading to false
          });
      }, [patternName]);
      
      return {patterns, loading, error}
}

export default useSearchPattern