import { useState } from "react"
import PopUp from "../componets/PopUp"
import BackButton from "../componets/BackButton"
import { useNavigate } from "react-router-dom"

import './pattern-collab.css';

export default function PatternCollab() {

    const [roomID, setID] = useState()
    const [ws, setWs] = useState(null)
    const [error, setError] = useState(null)
    const [messages, setMessages] = useState([])
    const [userName, setUserName] = useState('')
    const [color, setColor] = useState('')
    const [row0, setRow0] = useState('')
    const [row1, setRow1] = useState('')
    const [row2, setRow2] = useState('')
    const [row3, setRow3] = useState('')
    const [joinPopUp, setJoinPopUp] = useState(false)
    const [createPopUp, setCreatePopUp] = useState(false)

    const navagate = useNavigate()

    const connectToRoom = (roomID) => {
        const socket = new WebSocket(`ws://192.168.2.18:7992/ws/${roomID}`);

        socket.onopen = () => {
            setWs(socket);
        }

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.error) {
                setError(message.error);
                socket.close();
            } else {
                setMessages((prevMessages) => [...prevMessages, event.data]);
                setID(message.roomID)
            }
        };

        socket.onerror = (error) => {
            setError(`WebSocket error: ${error.message}`);
        };

        socket.onclose = () => {
            setWs(null)
        }
    }

    const sendMessage = () => {
        if (ws && userName) {
            const patternMessage = {
                username: userName,
                color: color,
                row0: row0,
                row1: row1,
                row2: row2,
                row3: row3,
            };

            ws.send(JSON.stringify(patternMessage))
        }
    }

    const handleCreateRoom = () => {
        setCreatePopUp(true);
        setColor('blue')
    }

    const handleJoinRoom = () => {
        setJoinPopUp(true)
        setColor('purple')
    }

    if (error) return (
        <div>{error}</div>
    )

    if (ws) return (
        <div>
            {messages.map(message => {
                return (<div key={message.id}>{message}</div>)
            })}
            <input
                type="text"
                value={row0}
                onChange={(e) => setRow0(e.target.value)}
                placeholder="row 0" />
            <input
                type="text"
                value={row1}
                onChange={(e) => setRow1(e.target.value)}
                placeholder="row 1" />
            <input
                type="text"
                value={row2}
                onChange={(e) => setRow2(e.target.value)}
                placeholder="row 2" />
            <input
                type="text"
                value={row3}
                onChange={(e) => setRow3(e.target.value)}
                placeholder="row 3" />
            <button onClick={sendMessage}>send</button>
            <div>
                room id: {roomID}
            </div>
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
                   <div className="collab-input-group" style={{marginTop: '12px'}}>
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
