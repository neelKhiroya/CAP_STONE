import {useState, useEffect } from 'react';

export function useWebSocket(username, rows, shouldSendRows, setSendRows, setRows, setID, setError) {

    const [ws, setWs] = useState(null)
    const [messages, setMessages] = useState([])
    const [userNames, setUserNames] = useState([])

    // handles sending data
    useEffect(() => {
        if (shouldSendRows && ws && rows != null) {
            const patternToGo = {
                username: username,
                rows: rows
            }
            ws.send(JSON.stringify(patternToGo))
            setSendRows(false);
            console.log('sending data!', patternToGo)
        }
    }, [ws, rows, shouldSendRows])

    // handles connecting to room
    const connectToRoom = (roomID) => {
        const socket = new WebSocket(`ws://localhost:7220/ws/${roomID}`);

        socket.onopen = () => {
            console.log("connected to room!");
            setWs(socket);

            const userNameToGo = {
                username: username,
                rows: rows,
            }
            socket.send(JSON.stringify(userNameToGo))
        }

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.error) {
                setError(message.error);
                socket.close();
            } else {
                setMessages((prevMessages) => [...prevMessages, JSON.stringify(message.pattern)]);
                if (message.pattern.rows.length >= 1) {
                    console.log('recived new data!')
                    setRows(message.pattern.rows)
                }
                if (message.roomID) {
                    setID(message.roomID);
                }
                if (message.users) {
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