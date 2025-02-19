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
	Rows     []row  `json:"rows"`
}

type data struct {
	Pattern pattern  `json:"pattern"`
	RoomID  string   `json:"roomID"`
	Users   []string `json:"users"`
}

const (
	// max send wait time.
	writeWait = 10 * time.Second

	// recive ping cooldown.
	pongWait = 60 * time.Second

	// send ping and wait.
	pingPeriod = (pongWait * 9) / 10

	// max message size.
	maxMessageSize = 512
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		// Only allow WebSocket connections from localhost:3000 (React dev server)
		return r.Header.Get("Origin") == "http://localhost:5173"
	},
}

// middleman between the websocket connection and the hub.
type client struct {

	// websocket.
	ws *websocket.Conn

	// message channel.
	send chan *data
}

// readPump pumps messages from the websocket connection to the hub.
//
// The application runs readPump in a per-connection goroutine. The application
// ensures that there is at most one reader on a connection by executing all
// reads from this goroutine.
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
		var msg *pattern
		err := c.ws.ReadJSON(&msg)
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error: %v", err)
			}
			break
		}
		// message = bytes.TrimSpace(bytes.Replace(message, newline, space, -1))

		//	message is read here!
		m := data{
			*msg,
			s.room,
			hub.usernames[s.room],
		}
		hub.broadcast <- m
	}
}

// writePump pumps messages from the hub to the websocket connection.
//
// A goroutine running writePump is started for each connection. The
// application ensures that there is at most one writer to a connection by
// executing all writes from this goroutine.

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
				// The hub closed the channel.
				c.ws.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			dataToGo := data{
				message.Pattern,
				s.room,
				hub.usernames[s.room],
			}

			err := c.ws.WriteJSON(dataToGo)
			if err != nil {
				fmt.Println(err)
				return
			}

			// // Add queued chat messages to the current websocket message.
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

// serveWs handles websocket requests from the peer.
func serveWs(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	room := vars["room"]

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

	if _, exists := hub.rooms[room]; !exists && room != "new" {
		log.Println("non-existing roomID:", room)

		//upgrade to ws just to send back error.
		ws, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Println(err)
			return
		}

		errorMessage := map[string]string{
			"error": "room does not exist",
		}
		ws.WriteJSON(errorMessage)
		ws.Close()
		return
	}

	//upgrade to ws, and to handle roomID return.
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	if room == "new" {
		room = generateNewRoomID()
		ws.WriteJSON(data{pattern{"", []row{}}, room, []string{}})
	}

	var initialMessage struct {
		Username string `json:"username"`
	}

	err = ws.ReadJSON(&initialMessage)
	if err != nil {
		fmt.Printf("error reading user via: %v\n", err)

		errorMessage := map[string]string{
			"error": "invalid username",
		}

		ws.WriteJSON(errorMessage)
		ws.Close()
		return
	}

	//create send channel and subscribe client to roomID
	c := &client{send: make(chan *data), ws: ws}
	s := subscription{c, room, initialMessage.Username}
	hub.register <- s

	//start listening
	go s.writePump()
	s.readPump()
}
