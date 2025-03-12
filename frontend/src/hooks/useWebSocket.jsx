import { useState, useEffect } from 'react';

export function useWebSocket(data, username, shouldSendRows, setSendRows, setData, setError) {
    const api = import.meta.env.VITE_WS_URL
    const [ws, setWs] = useState(null)

    const sendData = () => {
        if (ws) {

            const dataToGo = {...data}
            dataToGo.pattern.username = username

            ws.send(JSON.stringify(dataToGo));
            setSendRows(false);
            console.log('sending data!', dataToGo);
        }
    }

    // handles sending data AFTER .25 s NO CHANGE
    useEffect(() => {
        if (shouldSendRows && ws && data.pattern.rows != null) {
            const timeoutID = setTimeout(() => {
                sendData()
            }, 250)
            return () => clearTimeout(timeoutID)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ws, data])

    // handles connecting to room
    const connectToRoom = (roomID, username) => {
        const socket = new WebSocket(`${api}/ws/${roomID}/${username}`);

        socket.onopen = () => {
            console.log("connected to room!");
            setWs(socket);
        }

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.error) {
                setError(message.error);
                socket.close();
            } else {
                setData(message)
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
        connectToRoom,
    }

}