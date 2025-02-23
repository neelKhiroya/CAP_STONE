import { useState, useEffect } from 'react';

export function useWebSocket(pattern, shouldSendRows, setSendRows, setPattern, setID, setError) {
    const api = import.meta.env.VITE_WS_URL
    const [ws, setWs] = useState(null)
    const [messages, setMessages] = useState([])
    const [userNames, setUserNames] = useState([])

    const sendData = () => {
        ws.send(JSON.stringify(pattern))
        setSendRows(false);
        console.log('sending data!', pattern)
    }

    // handles sending data
    useEffect(() => {
        if (shouldSendRows && ws && pattern.rows != null) {
            const timeoutID = setTimeout(() => {
                sendData()
            }, 250)
            return () => clearTimeout(timeoutID)
        }
    }, [ws, pattern, shouldSendRows])

    // handles connecting to room
    const connectToRoom = (roomID) => {
        const socket = new WebSocket(`${api}/ws/${roomID}`);

        socket.onopen = () => {
            console.log("connected to room!");
            setWs(socket);

            const userName = {
                username: pattern.username,
            }
            socket.send(JSON.stringify(userName))
        }

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.sent) {
                console.log('caught')
            }
            if (message.error) {
                setError(message.error);
                socket.close();
            } else {
                setMessages((prevMessages) => [...prevMessages, JSON.stringify(message.pattern)]);
                if (message.pattern.rows.length >= 1) {
                    setPattern({
                        username: message.pattern.username,
                        title: message.pattern.title,
                        author: message.pattern.author,
                        descrip: message.pattern.descrip,
                        rows: message.pattern.rows,
                    })
                }
                if (message.roomID) {
                    setID(message.roomID);
                }
                if (message.users) {
                    console.log(message.users)
                    setUserNames(message.users)
                }
            }
        };

        socket.onerror = (error) => {
            setError(`WebSocket error: ${error.message}`);
        };

        socket.onclose = () => {
            setWs(null)
        }
    }

    return {
        ws,
        messages,
        userNames,
        connectToRoom,
    }

}