import { useEffect, useLayoutEffect, useState } from 'react'
import SearchResults from './SearchResults';
import './patternsearch.css'
import anime from 'animejs';

export default function SearchBar() {

    const [patternName, setPatternName] = useState('')
    const [tempRealTimeName, setTempRealName] = useState('')

    const handleInputChange = (e) => {
        const { value } = e.target;
        setTempRealName(value);
    };

    const clearInput = () => {
        setPatternName('')
        setTempRealName('')
    }

    useEffect(() => {
        const timeoutID = setTimeout(() => {
            setPatternName(tempRealTimeName);
        }, 500); //.5 s

        // clear timeout
        return () => clearTimeout(timeoutID)
    }, [tempRealTimeName])

    useLayoutEffect(() => {
        if (patternName.length > 2) {
            anime({
                targets: '.searchbar',
                borderBottomLeftRadius: '0',
                borderBottomRightRadius: '0',
                delay: 100,
                duration: 100
            })
        }
        else if (patternName.length < 3) {
            anime({
                targets: '.searchbar',
                borderBottomLeftRadius: '12px',
                borderBottomRightRadius: '12px',
                delay: 800,
                duration: 100
            })
        }

    }, [patternName])

    return (
        <div className='padding'>
            <div className='searchbarcontainer'>
                <div className='input-bar-container'>
                    <input
                        className='searchbar'
                        onChange={handleInputChange}
                        value={tempRealTimeName}
                        placeholder='Search for Patterns'
                        name='patternName'
                        type='search'
                    />
                    <button className='clear' onClick={clearInput}>X</button>
                </div>

                <SearchResults patternName={patternName.length >= 3 ? patternName : ''} />
            </div>
        </div>
    )
}
