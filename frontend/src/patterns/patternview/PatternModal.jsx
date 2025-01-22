import PropTypes from "prop-types"
import PatternGrid from "../componets/ViewPatternGrid"
import moment from 'moment'
import { isMobile } from 'react-device-detect'
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
                <h1 className={isMobile ? "mobile_name" : "name"}>{pattern.name}</h1>
                <p className="uploader">by {pattern.author}</p>
                <p className="createdat">uploaded {moment(pattern.created_at).fromNow()} by {pattern.username}</p>
            </div>

            <PatternGrid pattern={pattern} grid={grid} isMobile={isMobile} />

            <div className={`desc-container ${isMobile ? 'mobile' : ''}`}>
                <p>Notes from uploader:</p>
                <p className="descption">{pattern.description}</p>
            </div>
        </>
    )
}
