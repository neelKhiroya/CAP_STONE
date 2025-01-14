import useSearchPattern from '../../hooks/useSearchPattern'
import PropTypes from "prop-types"
import ShowResults from './ShowResults'
import Spinner from '../componets/Spinner'
import anime from 'animejs'

import "./searchresults.css"
import { useEffect, useState, useRef, useLayoutEffect } from 'react'

SearchResults.propTypes = {
    patternName: PropTypes.any.isRequired
}

export default function SearchResults({
    patternName,
}) {

    const { patterns, loading, error } = useSearchPattern(patternName)
    const [delayedLoading, setLoading] = useState(true)
    const searchRef = useRef(null)

    useEffect(() => {
        if (patternName.length >= 3) {
        setLoading(true);

        const timeoutID = setTimeout(() => {
            setLoading(false);

        }, 1000); //1 s

        // clear timeout after
        return () => clearTimeout(timeoutID)
    }
    }, [loading, patternName])

    useLayoutEffect(() => {

        if (searchRef.current && patternName.length < 3) {
            anime({
                targets: searchRef.current,
                height: '0',
                duration: 200,
                easing: 'easeInOutQuad'
            })
        }
        else if (delayedLoading || loading) {
            if (searchRef.current) {
                anime({
                    targets: searchRef.current,
                    height: '100px',
                    duration: 200,
                    easing: 'easeInOutQuad'
                })
            }
        }

        else if (searchRef.current && !patterns) {
            anime({
                targets: searchRef.current,
                height: '40px',
                duration: 200,
                easing: 'easeInOutQuad'
            })
        }

        else if (searchRef.current) {
            anime({
                targets: searchRef.current,
                height: searchRef.current.scrollHeight,
                duration: 200,
                easing: 'easeInOutQuad'
            })
        }

    }, [patterns, delayedLoading, loading, patternName])

    if (error) return (
        <div className='search-results-container'>
            <h2>Error Searching patterns!</h2>
        </div>
    )

    return (
        <div className='search-results-container' ref={searchRef}>
            {delayedLoading ?
                <Spinner /> :
                <ShowResults
                    patterns={patterns}
                    patternName={patternName}
                />
            }
        </div>
    )
}
