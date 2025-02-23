import { useEffect, useState } from "react"
import PopUp from "../componets/PopUp"
import BackButton from "../componets/BackButton"
import { useNavigate } from "react-router-dom"
import { useWebSocket } from '../../hooks/useWebSocket'

import './pattern-collab.css';
import PatternCollabView from "./PatternCollabView";
import PatternCollabConnected from "./PatternCollabConnected"
import useAddPattern from "../../hooks/useAddPattern"
import { convertGridAndNamesToStrings } from "../../util/convertStringsAndGrids"

export default function PatternCollab() {

    const [roomID, setID] = useState()
    const [userName, setUserName] = useState('testie')
    const [userColor, setUserColor] = useState(null)
    const [joinPopUp, setJoinPopUp] = useState(false)
    const [createPopUp, setCreatePopUp] = useState(false)
    const [shouldSendRows, setSendRows] = useState(false)
    const [wsError, setError] = useState(null)
    const { loading, error, addPattern } = useAddPattern();
    const [sentSucessful, setSuccess] = useState(0)

    const [pattern, setPattern] = useState({
        username: '',
        title: '',
        author: '',
        descrip: '',
        rows: [],
    })

    useEffect(() => {
        setPattern({ ...pattern, username: userName })
        setSendRows(true)
    }, [userName])

    const navagate = useNavigate()

    const { ws, messages, userNames, connectToRoom } = useWebSocket(pattern, shouldSendRows, setSendRows, setPattern, setID, setError);

    const selectableColors = ['#fb5607', '#ff006e', '#8338ec', '#3a86ff']

    useEffect(() => {
            console.log("names", userNames)
    }, [userNames])

    const postPattern = () => {

        let combinedUsernames = ''
        userNames.map((name, index) => {
            if (index == 0) {
                combinedUsernames += name
            } else {
                combinedUsernames += ` & ${name}`
            }
        })

        let convertedRowNames = []
        let convertedDrumRows = []

        pattern.rows.map(row => {
            convertedRowNames.push(row.name)
            convertedDrumRows.push(row.data)
        })

        const namesAndStrings = convertGridAndNamesToStrings(convertedDrumRows, convertedRowNames)

        const patternToGo = {
            name: pattern.title,
            username: combinedUsernames,
            author: pattern.author,
            description: pattern.descrip,
            drumrows: namesAndStrings,
        }

        // const result = addPattern(patternToGo)
        // if (result) {
        //     setSuccess(1);
        // } else {
        //     sentSucessful(-1);
        // }
        ws.send(JSON.stringify({
            sendready: true,
        }))
    }

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
        setPattern({ ...pattern, rows: temprows })
        setSendRows(true)
    }

    const handleJoinRoom = () => {
        setJoinPopUp(true);
    }

    if (wsError) return (
        <div>
            <BackButton onPress={() => setError(null)} />
            {wsError} (roomID: {roomID})
        </div>
    )

    if (loading) return (
        <div>
            loading
        </div>
    )

    if (sentSucessful) return (
        <h1>
            sent!
            <button onClick={() => navagate('/')} >home</button>
        </h1>
    )

    if (ws) return (
        <PatternCollabConnected
            ws={ws}
            roomID={roomID}
            userNames={userNames}
            userColor={userColor}
            pattern={pattern}
            usePattern={setPattern}
            sendPattern={setSendRows}
            postPattern={postPattern}
        />
    )

    return (
        <div>
            <BackButton onPress={() => navagate('/')} />
            <PopUp
                prompt=""
                isOpen={createPopUp}
                onCancel={() => setCreatePopUp(false)}
                onSubmit={() => {
                    if (userColor && pattern.username) {
                        connectToRoom('new')
                    }
                }}
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
                    <div className="color-container">
                        {selectableColors.map(color => {
                            return (
                                <button className="collab-colors" style={{ backgroundColor: color, outline: userColor == color ? 'purple 2px solid' : 'none' }} onClick={() => setUserColor(color)}></button>
                            )
                        })}
                    </div>
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
                        value={pattern.username}
                        onChange={(e) => setPattern({ ...pattern, username: e.target.value })} />
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
                    <div className="color-container">
                        {selectableColors.map(color => {
                            return (
                                <button className="collab-colors" style={{ backgroundColor: color, outline: userColor == color ? 'purple 2px solid' : 'none' }} onClick={() => setUserColor(color)}></button>
                            )
                        })}
                    </div>
                </div>
            </PopUp>

            <div className="collab-input-container">
                <button className='create-room-button' onClick={handleCreateRoom}>click to create room</button>
                <button className="join-room-button" onClick={handleJoinRoom}>click to join room</button>
            </div>

        </div>
    )
}