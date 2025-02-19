import { useState, React, useEffect } from 'react';
import PropTypes from 'prop-types';

import './pattern-collab-view.css'

const propTypes = {
    rows: PropTypes.array,
    updaterows: PropTypes.func.isRequired,
};

const defaultProps = {};

const PatternCollabView = ({
    rows,
    ontoggle,
}) => {

    return (
        <div className='collab-add-containerr'>
            {rows && rows.map((row, rowIndex) => {
                return (
                    <div className='collab-add-grid-row' key={rowIndex}>
                        {row.data.map((_, colIndex) => {
                            
                            return (
                                <div key={colIndex}>
                                    <button
                                        onClick={() => ontoggle(rowIndex, colIndex)}
                                        className='collab-add-grid-button'
                                        style={{
                                            backgroundColor: row.data[colIndex] ? row.colors[colIndex] : 'white', 
                                        }}
                                    >
                                    </button>
                                    {colIndex % 4 == 3 && colIndex < 12 ? <div style={{margin: '0 38px'}}></div> : <></>}
                                </div>
                            )
                        })}
                    </div>
                )

            })}
        </div>);
}

PatternCollabView.propTypes = propTypes;
PatternCollabView.default = defaultProps;

export default PatternCollabView;