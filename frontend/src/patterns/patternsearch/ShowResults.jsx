import PropTypes from 'prop-types'
import './show-results.css'
import { useNavigate } from 'react-router-dom'

ShowResults.propTypes = {
    patterns: PropTypes.any,
    patternName: PropTypes.string
}

export default function ShowResults({
    patterns,
    patternName
}) {

    const navigate = useNavigate()

    // pump back a bool and id to main.jsx

    if (!patterns && patternName.length >= 3) return (
        <div className='no-results'>uh oh! nothing found for : {patternName}</div>
    )

    const handlePatternSelect = (patternID) => {
        navigate(`/pattern/${patternID}`)
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