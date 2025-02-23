import axios from 'axios';
import { useState, useEffect } from 'react';

function useGetPattern(id) {
    const api = import.meta.env.VITE_API_URL;
    const [pattern, setPattern] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`${api}/patterns/${id}`)  
            .then(response => {
                setPattern(response.data);  
                setLoading(false);          
            })
            .catch(caughtError => {
                setError(caughtError);      
                setLoading(false);          
            });
    }, [id]);

    return { pattern, loading, error }
}

export default useGetPattern