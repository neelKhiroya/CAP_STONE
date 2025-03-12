import PropTypes from 'prop-types';
import BackButton from '../componets/BackButton';
import PatternCollabView from './PatternCollabView';

import './pattern-collab-connected.css'

const propTypes = {
    ws: PropTypes.any.isRequired,
    userColor: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
    useData: PropTypes.func.isRequired,
    sendData: PropTypes.func.isRequired,
    toggleReady: PropTypes.func.isRequired,
    postData: PropTypes.func.isRequired,
};

const defaultProps = {
    userColor: 'yellow'
};

const PatternCollabConnected = ({
    ws,
    userColor,
    data,
    useData,
    sendData,
    toggleReady,
    postData,
}) => {

    const templateNames = ["Snare", "Kick", "Closed Hat", "Open Hat", "808"];

    const ToggleRowData = (row, col) => {
        useData((prevData) => {

            const updatedPattern = { ...prevData.pattern, rows: [...prevData.pattern.rows] };
            const updatedRow = { ...updatedPattern.rows[row] };
            updatedRow.data = [...updatedRow.data]; //deep copy..?
            updatedRow.colors = [...updatedRow.colors]; //another deepie...?

            updatedRow.data[col] = !updatedRow.data[col]; // bool toggle

            if (updatedRow.colors[col] == '') { // color toggle
                updatedRow.colors[col] = userColor;
            } else {
                updatedRow.colors[col] = ''
            }

            updatedPattern.rows[row] = updatedRow;

            console.log(row, col, updatedPattern.rows[row].data)

            return { ...prevData, pattern: updatedPattern };
        });
        sendData(true);
    }

    const HandleRowNameChange = (e, row) => {
        const { value } = e.target;
        useData((prevData) => {
            const updatedPattern = { ...prevData.pattern, rows: [...prevData.pattern.rows] };
            const updatedRow = { ...updatedPattern.rows[row] };
            updatedRow.name = value
            updatedPattern.rows[row] = updatedRow
            return { ...data, pattern: updatedPattern }
        })
        sendData(true)
    }

    const HandleAddRow = () => {
        let sendCheck = false;
        let myRow = {
            colors: [],
            data: [],
            name: '',
        }

        if (data.pattern.rows.length < 6) {
            myRow.colors = Array(16).fill("")
            myRow.data = Array(16).fill(false)
            let randomInt = Math.floor(Math.random() * templateNames.length)
            myRow.name = templateNames[randomInt];
            sendCheck = true
        }

        useData((prevData) => {
            if (sendCheck) {
                const updatedPattern = {
                    ...prevData.pattern,
                    rows: [...prevData.pattern.rows, myRow]
                };
                return { ...prevData, pattern: updatedPattern }
            }
            return { ...prevData }
        })
        sendData(sendCheck)
    }

    const HandleRemoveRow = (index) => {
        useData((prevData) => {
            if (data.pattern.rows.length > 2) {
                const updatedPattern = { ...prevData.pattern, rows: [...prevData.pattern.rows] };
                const updatedRows = [...updatedPattern.rows];
                console.log(updatedRows)
                updatedRows.splice(index, 1)
                updatedPattern.rows = updatedRows
                return { ...prevData, pattern: updatedPattern }
            }
            return { ...prevData }
        })
        sendData(true)
    }


    const ChangeTitle = (e) => {
        useData(((prevData) => {
            const updatedPattern = { ...prevData.pattern, rows: [...prevData.pattern.rows] };
            updatedPattern.title = e.target.value;
            return { ...prevData, pattern: updatedPattern }
        }))
    }

    const ChangeAuthor = (e) => {
        useData(((prevData) => {
            const updatedPattern = { ...prevData.pattern, rows: [...prevData.pattern.rows] };
            updatedPattern.author = e.target.value;
            return { ...prevData, pattern: updatedPattern }
        }))
    }

    const ChangeDescip = (e) => {
        useData(((prevData) => {
            const updatedPattern = { ...prevData.pattern, rows: [...prevData.pattern.rows] };
            updatedPattern.descrip = e.target.value;
            return { ...prevData, pattern: updatedPattern }
        }))
    }

    return (
        <div>
            <div className="collab-top-bar-contianer">
                <BackButton onPress={() => ws.close()} />
                <h3>currently in room ({data.roomid})</h3>
                <span>users:
                    {data.users.map((user, i) => {
                        return <span key={i}>{user} </span>
                    })}
                </span>
            </div>
            <PatternCollabView
                rows={data.pattern.rows}
                onToggle={ToggleRowData}
                onRowNameChange={HandleRowNameChange}
                toggleAddRow={HandleAddRow}
                toggleRemoveRow={HandleRemoveRow}
            />
            <div className="collab-info-container">
                <div className='last-message-box'>
                    last message sent by {data.pattern.username}
                </div>
                <div className="collab-info-box">
                    <div className="collab-info">
                        <h3 className="collab-info-label">pattern title</h3>
                        <input
                            id="pattern-name"
                            className="collab-info-input"
                            value={data.pattern.title}
                            onChange={(e) => { ChangeTitle(e); sendData(true) }}
                        />
                    </div>
                    <div className="collab-info">
                        <h3 className="collab-info-label">pattern author</h3>
                        <input
                            id="pattern-name"
                            className="collab-info-input"
                            value={data.pattern.author}
                            onChange={(e) => { ChangeAuthor(e); sendData(true) }}
                        />
                    </div>
                </div>
                <div className='collab-add-desc-container'>
                    <h3 className="collab-info-label">desc/notes</h3>
                    <textarea
                        type="text"
                        id='description'
                        className='add-description'
                        value={data.pattern.descrip}
                        onChange={(e) => { ChangeDescip(e); sendData(true) }}
                    />
                </div>
            </div>
            <div className='collab-add-pattern-conatiner'>
                <button className='collab-add-pattern-button' onClick={toggleReady}>{data.numberofreadyusers > 0 ? `Unready (${data.numberofreadyusers}/${data.users.length})` : `Ready`}</button>
            </div>
            {data.numberofreadyusers == data.users.length ?
                <div className='collab-post-pattern-conatiner'>
                    <button className='collab-add-pattern-button' onClick={postData}>
                        Click to post Pattern!
                    </button>
                </div> :
                <></>
            }
        </div>
    )
}

PatternCollabConnected.propTypes = propTypes;
PatternCollabConnected.default = defaultProps;

export default PatternCollabConnected;