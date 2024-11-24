import PropTypes from "prop-types"
import useGetPattern from '../hooks/useGetPattern';
import { convertStringsToGrid } from "../util/convertStringToGrid";

import './styles/css/patternModal.css'
import { useEffect, useState } from "react";

PatternModal.propTypes = {
    onClose: PropTypes.func,
    id: PropTypes.number.isRequired,
}

function PatternModal({
    onClose,
    id,
}) {

    const { pattern, loading, error } = useGetPattern(id);

    if (loading) return <div>Loading!!</div>

    if (error) return <div>error: {error.message}</div>

    const stringRows = [pattern.Row0, pattern.Row1, pattern.Row2, pattern.Row3]
    const grid = convertStringsToGrid(stringRows);

    const handleClose = () => {
        onClose(false)
    }

    return (
        <div>
            <div className="mybutton">
                <button onClick={handleClose}>
                    <i className="fa-solid fa-arrow-left"></i>
                </button>
            </div>

            <div className="title">
                <h1 className="name">{pattern.Name}</h1>
                <p className="uploader">by {pattern.Username}</p>
            </div>

            <div className="container">
  {grid.map((rows, rowIndex) => (
    <div key={rowIndex} className="grid-row">
      {/* Row Label - Positioned in the left-most column */}
      <div className="row-label">{`Row ${rowIndex + 1}`}</div>

      {/* Render Buttons - Buttons in remaining columns */}
      {rows.map((cell, colIndex) => (
        <button
          key={`${rowIndex}-${colIndex}`}
          className={`grid-button ${grid[rowIndex][colIndex] ? 'active' : ''}`}
        >
          {/* Optional button text */}
        </button>
      ))}
    </div>
  ))}
</div>

        </div>
    )
}

export default PatternModal