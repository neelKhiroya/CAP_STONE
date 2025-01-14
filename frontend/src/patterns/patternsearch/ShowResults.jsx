import PropTypes from 'prop-types'
import './show-results.css'
import { useState } from 'react'

ShowResults.propTypes = {
    patterns: PropTypes.any,
    patternName: PropTypes.string
}

export default function ShowResults({
    patterns,
    patternName
}) {

    const [isSelected, setSelected] = useState(false)
    const [patternID, setPatternID] = useState(-1)

    // pump back a bool and id to main.jsx

    if (!patterns && patternName.length >= 3) return (
        <div className='show-results-container'>no pattern found with : {patternName}</div>
    )

    const handlePatternSelect = (patternID) => {
        setSelected(true)
        setPatternID(patternID)
    }

    if (patterns) return (
        <>
            <h2 className='result-title'>what we found: </h2>
            <div className='pattern-list-container'>
                {patterns.map((pattern) => {
                    return <div className='pattern-item' key={pattern.id} onClick={() => handlePatternSelect(pattern.id)}>
                       {pattern.name} uploaded by {pattern.username}
                       
                    </div>
                })
                }
            </div>
        </>
    )
}