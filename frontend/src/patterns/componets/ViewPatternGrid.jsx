import PropTypes from "prop-types"
import "./viewpatterngrid.css"

PatternGrid.propTypes = {
    pattern: PropTypes.any.isRequired,
    grid: PropTypes.array.isRequired,
}

function PatternGrid({
    pattern,
    grid
}) {
    return (
        <div className="container">
            {grid.map((rows, rowIndex) => (
                <div key={rowIndex} className="grid-row">
                    
                    <div className="row-label">{pattern.drumrows[rowIndex].row_name}</div>

                    {rows.map((cell, colIndex) => (
                        <button
                            key={`${rowIndex}-${colIndex}`}
                            className={`grid-button ${grid[rowIndex][colIndex] ? 'active' : ''}`}
                        >
                        </button>
                    ))}
                </div>
            ))}
        </div>
    )
}

export default PatternGrid