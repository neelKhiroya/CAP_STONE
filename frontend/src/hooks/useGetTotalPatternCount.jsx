import axios from 'axios'
import { useEffect, useState } from 'react'

function useGetTotalPatternCount() {
    const [patternCount, setCount] = useState()
    const [loadingCount, setLoading] = useState(false)
    const [countError, setError] = useState(null)

    useEffect(() => {
        setLoading(true)
        axios.get('http://localhost:8440/patterns/count')
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