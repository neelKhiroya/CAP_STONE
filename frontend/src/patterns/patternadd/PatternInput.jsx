import PropTypes from "prop-types"

import './pattern-input.css'

PatternInput.propTypes = {
    patternName: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    isRequired: PropTypes.bool.isRequired,
    className: PropTypes.string,
}

export default function PatternInput({
    patternName,
    title,
    value,
    onChange,
    isRequired,
    className
}) {
    return (
        <div className="input-container">
            <input
                className={className}
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
