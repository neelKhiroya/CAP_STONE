import PropTypes from 'prop-types'

import './pattern-buttons.css'

PatternButtons.propTypes = {
    decreaseOffset: PropTypes.func.isRequired,
    increaseOffset: PropTypes.func.isRequired,
    showDecrease: PropTypes.bool.isRequired,
    showIncrease: PropTypes.bool.isRequired
}

export default function PatternButtons({
    decreaseOffset,
    increaseOffset,
    showDecrease,
    showIncrease
}) {
    return (
        <div className="list-buttons">
            <button onClick={decreaseOffset} className={`back-button ${showDecrease ? 'disabled' : ''}`}>
                <i className="fa-solid fa-arrow-left" />
            </button>
            <button onClick={increaseOffset} className={`back-button ${showIncrease ? 'disabled' : ''}`}>
                <i className="fa-solid fa-arrow-right" />
            </button>
        </div>
    )
}
