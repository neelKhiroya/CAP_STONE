import axios from 'axios'
import { useEffect, useState } from 'react'

function useGetTotalPatternCount() {
    const api = import.meta.env.VITE_API_URL
    const [patternCount, setCount] = useState()
    const [loadingCount, setLoading] = useState(false)
    const [countError, setError] = useState(null)

    useEffect(() => {
        setLoading(true)
        axios.get(`${api}/patterns/count`)
        .then(response => {
            setCount(response.data.count)
            setLoading(false)
        })
        .catch(error => {
            setError(error)
            setLoading(false)
        })
    }, [])

    return { patternCount, loadingCount, countError}
}

export default useGetTotalPatternCount