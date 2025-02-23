import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import BackButton from '../componets/BackButton';
import PatternCollabView from './PatternCollabView';

import './pattern-collab-connected.css'

const propTypes = {
    ws: PropTypes.any.isRequired,
    roomID: PropTypes.string,
    userColor: PropTypes.string,
    userNames: PropTypes.array.isRequired,
    pattern: PropTypes.object.isRequired,
    usePattern: PropTypes.func.isRequired,
    sendPattern: PropTypes.func.isRequired,
    postPattern: PropTypes.func.isRequired,
};

const defaultProps = {
    roomID: '0',
    userColor: 'yellow'
};

const PatternCollabConnected = ({
    ws,
    roomID,
    userNames,
    userColor,
    pattern,
    usePattern,
    sendPattern,
    postPattern,
}) => {

    const templateNames = ["Snare", "Kick", "Closed Hat", "Open Hat", "808"];

    const toggleRowData = (row, col) => {
        usePattern((prevPattern) => {

            const newRows = [...prevPattern.rows]
            const updatedRow = { ...newRows[row] };

            updatedRow.data = [...updatedRow.data];
            updatedRow.data[col] = !updatedRow.data[col];

            updatedRow.colors = [...updatedRow.colors];
            if (updatedRow.colors[col] == '') {
                updatedRow.colors[col] = userColor;
            } else {
                updatedRow.colors[col] = ''
            }

            newRows[row] = updatedRow;
            return { ...prevPattern, rows: newRows };
        });
        sendPattern(true);
    }

    const handleRowNameChange = (e, row) => {
        const { value } = e.target;
        usePattern((prevPattern) => {
            const newRows = [...prevPattern.rows];
            const updatedRow = { ...newRows[row] };
            updatedRow.name = value
            newRows[row] = updatedRow
            return { ...pattern, rows: newRows }
        })
        sendPattern(true)
    }

    const handleAddRow = () => {
        if (pattern.rows.length < 6) {
            let colors = Array(16).fill("")
            let rowData = Array(16).fill(false)
            let randomInt = Math.floor(Math.random() * templateNames.length)
            const myRow = {
                colors: colors,
                data: rowData,
                name: templateNames[randomInt],
            }
            usePattern((prevPattern) => {
                const newRows = [...prevPattern.rows, myRow]
                return { ...prevPattern, rows: newRows }
            })
            sendPattern(true)
        }
    }

    const handleRemoveRow = (index) => {
        if (pattern.rows.length > 2) {
            usePattern((prevPattern) => {
                const tempRows = [...prevPattern.rows]
                tempRows.splice(index, 1)
                return { ...prevPattern, rows: tempRows }
            })
            sendPattern(true)
        }
    }

    return (
        <div>
            <div className="collab-top-bar-contianer">
                <BackButton onPress={() => ws.close()} />
                <h3>currently in room ({roomID})</h3>
                <span>users:
                    {userNames}
                </span>
            </div>
            <PatternCollabView
                rows={pattern.rows}
                onToggle={toggleRowData}
                onRowNameChange={handleRowNameChange}
                toggleAddRow={handleAddRow}
                toggleRemoveRow={handleRemoveRow}
            />
            <div className="collab-info-container">
                <div className="collab-info-box">
                    <div className="collab-info">
                        <h3 className="collab-info-label">pattern title</h3>
                        <input
                            id="pattern-name"
                            className="collab-info-input"
                            value={pattern.title}
                            onChange={(e) => { usePattern({ ...pattern, title: e.target.value }); sendPattern(true) }}
                        />
                    </div>
                    <div className="collab-info">
                        <h3 className="collab-info-label">pattern author</h3>
                        <input
                            id="pattern-name"
                            className="collab-info-input"
                            value={pattern.author}
                            onChange={(e) => { usePattern({ ...pattern, author: e.target.value }); sendPattern(true) }}
                        />
                    </div>
                </div>
                <div className='collab-add-desc-container'>
                    <h3 className="collab-info-label">desc/notes</h3>
                    <textarea
                        type="text"
                        id='description'
                        className='add-description'
                        value={pattern.descrip}
                        onChange={(e) => { usePattern({ ...pattern, descrip: e.target.value }); sendPattern(true) }}
                    />
                </div>
            </div>
            <div className='collab-add-pattern-conatiner'>
                <button className='collab-add-pattern-button' onClick={postPattern}>send</button>
            </div>
        </div>
    )
}

PatternCollabConnected.propTypes = propTypes;
PatternCollabConnected.default = defaultProps;

export default PatternCollabConnected;