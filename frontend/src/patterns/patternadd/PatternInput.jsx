import PropTypes from "prop-types"

import './pattern-input.css'

PatternInput.propTypes = {
    patternName: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    isRequired: PropTypes.bool.isRequired,
}

export default function PatternInput({
    patternName,
    title,
    value,
    onChange,
    isRequired
}) {
    return (
        <div className="input-container">
            <input
                className="my-input"
                type="text"
                id={patternName}
                name={patternName}
                value={value}
                onChange={onChange}
                required={isRequired}
                placeholder={title}
            />
        </div>
    )
}
