import { useEffect, useState } from "react"
import PopUp from "../componets/PopUp"
import BackButton from "../componets/BackButton"
import { useNavigate } from "react-router-dom"
import { useWebSocket } from '../../hooks/useWebSocket'

import './pattern-collab.css';
import PatternCollabConnected from "./PatternCollabConnected"
import useAddPattern from "../../hooks/useAddPattern"
import { convertGridAndNamesToStrings } from "../../util/convertStringsAndGrids"

export default function PatternCollab() {

    const [roomID, setID] = useState()
    const [userName, setUserName] = useState('')
    const [userColor, setUserColor] = useState(null)
    const [joinPopUp, setJoinPopUp] = useState(false)
    const [createPopUp, setCreatePopUp] = useState(false)
    const [shouldSendData, setSendData] = useState(false)
    const [isUserReady, setUserReady] = useState(false)
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

    const [data, setData] = useState({
        pattern: pattern,
        roomid: roomID,
        users: [],
        isuserready: false,
        numberofreadyusers: 0
    })

    useEffect(() => {
        console.log(data.isuserready)
    }, [data.isuserready])

    const { ws, connectToRoom } = useWebSocket(data, userName, shouldSendData, setSendData, setData, setError);

    const navagate = useNavigate()

    const selectableColors = ['#fb5607', '#ff006e', '#8338ec', '#3a86ff']

    const postPattern = () => {

        if (data.numberofreadyusers == data.users.length) {
            let combinedUsernames = ''
            data.users.map((name, index) => {
                if (index == 0) {
                    combinedUsernames += name
                } else {
                    combinedUsernames += ` & ${name}`
                }
            })

            let convertedRowNames = []
            let convertedDrumRows = []

            data.pattern.rows.map(row => {
                convertedRowNames.push(row.name)
                convertedDrumRows.push(row.data)
            })

            const namesAndStrings = convertGridAndNamesToStrings(convertedDrumRows, convertedRowNames)

            const patternToGo = {
                name: data.pattern.title,
                username: combinedUsernames,
                author: data.pattern.author,
                description: data.pattern.descrip,
                drumrows: namesAndStrings,
            }

            const result = addPattern(patternToGo)
            if (result) {
                setSuccess(1);
            } else {
                sentSucessful(-1);
            }
            console.log(sentSucessful)
        }
    }

    const toggleReady = () => {
            console.log(`user is ready/unready`)
            setData({...data, isuserready: !isUserReady})
            setUserReady(!isUserReady)
            setSendData(true)
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

    if (error) return (
        <div className="error-post">
            Uh oh! that didnt work, pleas try again!
            <button onClick={() => navagate('/')}>home</button>
        </div>
    )

    if (sentSucessful) return (
        <div className="completed">
            <h1 className="posted-title">
            posted!
            </h1>
            <button onClick={() => navagate('/')} className="dashboard-button">View the DashBoard to see your pattern!</button>
        </div>
    )

    if (ws) return (
        <PatternCollabConnected
            ws={ws}
            userColor={userColor}
            data={data}
            useData={setData}
            sendData={setSendData}
            toggleReady={toggleReady}
            postData={postPattern}
        />
    )

    return (
        <div>
            <BackButton onPress={() => navagate('/')} />
            <PopUp // newroom popup
                prompt=""
                isOpen={createPopUp}
                onCancel={() => setCreatePopUp(false)}
                onSubmit={() => {
                    if (userColor && userName) {
                        connectToRoom('new', userName)
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
                        {selectableColors.map((color, i) => {
                            return (
                                <button key={i} className="collab-colors" style={{ backgroundColor: color, outline: userColor == color ? 'purple 2px solid' : 'none' }} onClick={() => setUserColor(color)}></button>
                            )
                        })}
                    </div>
                </div>
            </PopUp>

            <PopUp  // join room popup
                prompt=""
                isOpen={joinPopUp}
                onCancel={() => setJoinPopUp(false)}
                onSubmit={() => connectToRoom(roomID, userName)}
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
                    <div className="color-container">
                        {selectableColors.map((color, i) => {
                            return (
                                <button key={i} className="collab-colors" style={{ backgroundColor: color, outline: userColor == color ? 'purple 2px solid' : 'none' }} onClick={() => setUserColor(color)}></button>
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