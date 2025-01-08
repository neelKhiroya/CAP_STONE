import PropTypes from "prop-types"
import PatternGrid from "../componets/ViewPatternGrid"

import "../styles/css/patternModal.css"

PatternModal.propTypes = {
    pattern: PropTypes.any.isRequired,
    grid: PropTypes.array.isRequired,
}

export default function PatternModal({
    pattern,
    grid
}) {
    return (
        <>
            <div className="title">
                <h1 className="name">{pattern.name}</h1>
                <p className="uploader">by {pattern.username}</p>
                <p className="createdat">uploaded at {pattern.created_at}</p>
            </div>

            <PatternGrid pattern={pattern} grid={grid} />
        </>
    )
}
