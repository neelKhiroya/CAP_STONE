import { React } from 'react';
import PropTypes from 'prop-types';

import './pattern-collab-view.css'

const propTypes = {
    rows: PropTypes.array,
    onToggle: PropTypes.func.isRequired,
    onRowNameChange: PropTypes.func.isRequired,
    toggleAddRow: PropTypes.func.isRequired,
    toggleRemoveRow: PropTypes.func.isRequired,
};

const defaultProps = {};

const PatternCollabView = ({
    rows,
    onToggle,
    onRowNameChange,
    toggleAddRow,
    toggleRemoveRow,
}) => {

    return (
        <div className='collab-add-container'>
            {rows && rows.map((row, rowIndex) => {
                return (
                    <div className='collab-add-grid-row' key={rowIndex}>
                        <input
                            key={rowIndex}
                            value={row.name}
                            onChange={(e) => onRowNameChange(e, rowIndex)}
                            className='collab-add-row-label'
                        />
                        {row.data.map((_, colIndex) => {
                            return (
                                <>
                                    <button
                                        onClick={() => onToggle(rowIndex, colIndex)}
                                        className='collab-add-grid-button'
                                        style={{
                                            backgroundColor: row.data[colIndex] ? row.colors[colIndex] : (
                                                colIndex % 8 >= 4 ? 'gray' : 'black'
                                            ),
                                        }}
                                    >
                                    </button>
                                    {colIndex != 0 && colIndex % 4 == 3 ? // 3 for last in bar
                                        <div style={{ margin: '0 8px' }}></div> :
                                        <></>}
                                </>
                            )
                        })}
                        <button onClick={() => toggleRemoveRow(rowIndex)} className='collab-trash'>
                            <i className="fa-solid fa-trash" />
                        </button>
                    </div>
                )
            })}
            <button className='collab-add-row' onClick={toggleAddRow}>+</button>
        </div>);
}

PatternCollabView.propTypes = propTypes;
PatternCollabView.default = defaultProps;

export default PatternCollabView;