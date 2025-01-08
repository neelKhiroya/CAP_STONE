import { useEffect, useState } from 'react'

export default function PatternSearch() {

    const [patternName, setPatternName] = useState('')
    const [tempRealTimeName, setTempRealName] = useState('')

    const handleInputChange = (e) => {
        const { value } = e.target;
        setTempRealName(value);
    };

    useEffect(() => {
        const timeoutID = setTimeout(() => {
            setPatternName(tempRealTimeName);
        }, 500); //.5 s

        // clear timeout
        return () => clearTimeout(timeoutID)
    }, [tempRealTimeName])

    useEffect(() => {
        if (patternName) {
            console.log(patternName)
            //run api stuff here
        }
    }, [patternName])



    return (
        <>
            <input
                onChange={handleInputChange}
                value={tempRealTimeName}
                placeholder='Search for Patterns'
                name='patternName'
                type='text'
            />
            <div>
                here
            </div>
        </>
    )
}
