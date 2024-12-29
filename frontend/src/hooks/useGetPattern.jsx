import axios from 'axios';
import { useState, useEffect } from 'react';

function useGetPattern(id) {
    const [pattern, setPattern] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      axios.get(`http://localhost:8440/patterns/${id}`)  // Make API call
        .then(response => {
            setPattern(response.data);  // Set the fetched data
            setLoading(false);            // Set loading to false
        })
        .catch(caughtError => {
            setError(caughtError);        // Set any error that occurs
            setLoading(false);            // Set loading to false
        });
    }, [id]);

    console.log(pattern);
    
    return {pattern, loading, error}
}

export default useGetPattern