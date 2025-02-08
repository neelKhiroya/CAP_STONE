import PropTypes from 'prop-types'

import './backbutton.css'

BackButton.propTypes = {
    onPress: PropTypes.func.isRequired
}

export default function BackButton({
    onPress
}) {
    return (
        <button onClick={onPress} className="back-button">
            <i className="fa-solid fa-arrow-left"></i>
        </button>
    )
}
