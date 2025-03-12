// client to handle connection

package main

import (
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"time"

	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
)

// https://github.com/gorilla/websocket/issues/46

type row struct {
	Colors []string `json:"colors"`
	Data   []bool   `json:"data"`
	Name   string   `json:"name"`
}

type pattern struct {
	Username string `json:"username"`
	Title    string `json:"title"`
	Author   string `json:"author"`
	Descrip  string `json:"descrip"`
	Rows     []row  `json:"rows"`
}

type data struct {
	Pattern            pattern  `json:"pattern"`
	RoomID             string   `json:"roomid"`
	Users              []string `json:"users"`
	IsUserReady        bool     `json:"isuserready"`
	NumberOfReadyUsers int      `json:"numberofreadyusers"`
}

const (
	writeWait = 10 * time.Second

	pongWait = 60 * time.Second

	pingPeriod = (pongWait * 9) / 10

	maxMessageSize = 1536
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		// allow WebSocket connections from localhost:5173
		return r.Header.Get("Origin") == "http://localhost:5173"
	},
}

type client struct {
	ws *websocket.Conn

	send chan *data
}

func (s subscription) readPump() {
	c := s.client
	defer func() {
		hub.unregister <- s
		c.ws.Close()
	}()
	c.ws.SetReadLimit(maxMessageSize)
	c.ws.SetReadDeadline(time.Now().Add(pongWait))
	c.ws.SetPongHandler(func(string) error { c.ws.SetReadDeadline(time.Now().Add(pongWait)); return nil })
	for {
		var msg *data
		//read message
		err := c.ws.ReadJSON(&msg)
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error: %v", err)
			}
			break
		}

		//send to hub
		hub.broadcast <- *msg
	}
}

func (s *subscription) writePump() {
	c := s.client
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.ws.Close()
	}()
	for {
		select {
		case message, ok := <-c.send:
			c.ws.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				// closed
				c.ws.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			err := c.ws.WriteJSON(message)
			if err != nil {
				fmt.Println(err)
				return
			}

			// n := len(c.send)
			// for i := 0; i < n; i++ {
			// 	w.Write(newline)
			// 	w.Write(<-c.send)
			// }

			// if err := w.Close(); err != nil {
			// 	return
			// }
		case <-ticker.C:
			c.ws.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.ws.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

var letters = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")

func generateNewRoomID() string {
	s := make([]rune, 10)
	for i := range s {
		s[i] = letters[rand.Intn(len(letters))]
	}
	return string(s)
}

func roomParamsCheck(room string, w http.ResponseWriter, r *http.Request) {
	if len(room) != 10 && room != "new" {
		log.Println("invalid roomID: ", room)

		//upgrade to ws just to send back error.
		ws, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Println(err)
			return
		}

		errorMessage := map[string]string{
			"error": "roomID is not valid",
		}
		ws.WriteJSON(errorMessage)
		ws.Close()
		return
	}
}

func serveWs(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	room := vars["room"]
	username := vars["username"]

	roomParamsCheck(room, w, r)

	//upgrade to ws
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	//user wants new room
	if room == "new" {
		room = generateNewRoomID()
	}

	c := &client{send: make(chan *data), ws: ws}
	s := subscription{c, room, username}

	//send to hub
	hub.register <- s

	//start listening
	go s.writePump()
	s.readPump()
}
