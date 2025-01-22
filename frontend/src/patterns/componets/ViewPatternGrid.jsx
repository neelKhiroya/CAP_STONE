import PropTypes from "prop-types"
import "./viewpatterngrid.css"

PatternGrid.propTypes = {
    pattern: PropTypes.any.isRequired,
    grid: PropTypes.array.isRequired,
    isMobile: PropTypes.bool.isRequired,
}

function PatternGrid({
    pattern,
    grid,
    isMobile
}) {


    if (isMobile) return (
        <div className="mobile-container">
            <div className="mobile-grid-half">
                {grid.map((rows, rowIndex) => (
                    <div key={`mobile-${rowIndex}-1`} className="mobile-grid-row">
                        <div className="mobile-row-label">{pattern.drumrows[rowIndex].row_name}</div>

                        {rows.slice(0, Math.floor(rows.length / 2)).map((cell, colIndex) => (
                            <>
                                {colIndex % 4 === 0 && <span className="beat-start-gap"></span>}
                                <button
                                    key={`mobile-${rowIndex}-${colIndex}-1`}
                                    className={
                                        `mobile-grid-button ${grid[rowIndex][colIndex] ?
                                            'active' :
                                            (colIndex % 8 < 4 ?
                                                'light' :
                                                'dark'
                                            )
                                        }`
                                    }
                                >
                                </button>
                            </>
                        ))}
                    </div>
                ))}
            </div>

            <div className="mobile-grid-half">
                {grid.map((rows, rowIndex) => (
                    
                    <div key={`mobile-${rowIndex*2}`} className="mobile-grid-row">
                        <div className="mobile-row-label">{pattern.drumrows[rowIndex].row_name}</div>
                        
                        {rows.slice(8, 16).map((cell, colIndex) => (
                            <>
                                {colIndex % 4 === 0 ? <span className="beat-start-gap"></span> : <></>}
                                <button
                                     key={`mobile-${rowIndex*2}-${colIndex*2}-2`}
                                    className={
                                        `mobile-grid-button ${grid[rowIndex][colIndex+8] ?
                                            'active' :
                                            (colIndex % 8 < 4 ?
                                                'light' :
                                                'dark'
                                            )
                                        }`
                                    }
                                >
                                </button>
                            </>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )

    else return (
        <div className="container">
            {grid.map((rows, rowIndex) => (
                <div key={`desktop-${rowIndex}-3`} className="grid-row">

                    <div className="row-label">{pattern.drumrows[rowIndex].row_name}</div>

                    {rows.map((cell, colIndex) => (
                        <>
                            {colIndex % 4 === 0 && <span className="beat-start-gap"></span>}
                            <button
                                    key={`desktop-${rowIndex}-${colIndex}-3`}
                                    className={
                                        `grid-button ${grid[rowIndex][colIndex] ?
                                            'active' :
                                            (colIndex % 8 < 4 ?
                                                'light' :
                                                'dark'
                                            )
                                        }`
                                    }
                                >
                                </button>
                        </>
                    ))}
                </div>
            ))}
        </div>
    )
}

export default PatternGrid