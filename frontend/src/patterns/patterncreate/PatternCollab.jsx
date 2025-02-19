import { useEffect, useState } from "react"
import PopUp from "../componets/PopUp"
import BackButton from "../componets/BackButton"
import { data, useNavigate } from "react-router-dom"
import { useWebSocket } from '../../hooks/useWebSocket'

import './pattern-collab.css';
import PatternCollabView from "./PatternCollabView";

export default function PatternCollab() {

    const [roomID, setID] = useState()
    const [userName, setUserName] = useState('')
    const [rows, setRows] = useState(null)
    const [userColor, setUserColor] = useState(null)
    const [colors, setColors] = useState(null)
    const [rowNames, setNames] = useState(["snare", "kick"])
    const [joinPopUp, setJoinPopUp] = useState(false)
    const [createPopUp, setCreatePopUp] = useState(false)
    const [shouldSendRows, setSendRows] = useState(false)
    const [error, setError] = useState(null)

    const navagate = useNavigate()

    const {ws, messages, userNames, connectToRoom} = useWebSocket(userName, rows, shouldSendRows, setSendRows, setRows, setID, setError);

    const toggleRowData = (row, col) => {
        setRows((prevRows) => {
            const newRows = [...prevRows];
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
            return newRows;
        });
        setSendRows(true);
    }

    let templateNames = ["Snare", "Kick", "Closed Hat", "Open Hat", "808"];

    const handleCreateRoom = () => {
        setCreatePopUp(true);
        let colors = Array(16).fill("")
        let rowData = Array(16).fill(false)

        const myRow = {
            colors: colors,
            data: rowData,
            name: 'snare',
        }

        let temprows = Array(2).fill(myRow)
        setRows(temprows)
        setSendRows(true)
        setUserColor('blue')
    }

    const handleJoinRoom = () => {
        setJoinPopUp(true);
        setUserColor('green')
    }

    if (error) return (
        <div>
             <BackButton onPress={() =>  setError(null)} />
                {error} (roomID: {roomID})
                </div>
    )

    if (ws) return (
        <div>
            <BackButton onPress={() => ws.close() } />
            connected users in room ({roomID}): <ul>{userNames.map(name => {
                return (
                    <li>{name}</li>
                )
            })}</ul>
            <PatternCollabView
                websocket={ws}
                rows={rows}
                updaterows={setRows}
                ontoggle={toggleRowData}
            />
        </div>
    )

    return (
        <div>
            <BackButton onPress={() => navagate('/')} />
            <PopUp
                prompt=""
                isOpen={createPopUp}
                onCancel={() => setCreatePopUp(false)}
                onSubmit={() => connectToRoom("new")}
            >
                <div className="collab-input-group field">
                    <input
                        type="input"
                        className="collab-input"
                        placeholder="username"
                        required
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)} />
                    <label htmlFor="username" className="collab-label">username</label>
                </div>
            </PopUp>

            <PopUp
                prompt=""
                isOpen={joinPopUp}
                onCancel={() => setJoinPopUp(false)}
                onSubmit={() => connectToRoom(roomID)}
            >
                <div className="collab-input-group">
                    <input
                        type="input"
                        className="collab-input"
                        placeholder="username"
                        required
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)} />
                    <label htmlFor="username" className="collab-label">username</label>
                </div>
                <div className="collab-input-group" style={{ marginTop: '12px' }}>
                    <input
                        className="collab-input"
                        placeholder="roomID"
                        onChange={(e) => setID(e.target.value)}
                        value={roomID}
                        type="input"
                        required
                    />
                    <label
                        htmlFor="roomID"
                        className="collab-label">
                        roomID
                    </label>
                </div>
            </PopUp>

            <div className="collab-input-container">
                <button className='create-room-button' onClick={handleCreateRoom}>click to create room</button>
                <button className="join-room-button" onClick={handleJoinRoom}>click to join room</button>
            </div>

        </div>
    )
}
