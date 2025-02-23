// hub to mantain rooms

package main

import (
	"fmt"
	"log"
	"slices"
)

type subscription struct {
	client   *client
	room     string
	username string
}

// Hub maintains the set of active clients and broadcasts messages to the
// clients.
type Hub struct {
	// Registered clients.
	rooms map[string]map[*client]bool

	//users
	usernames map[string][]string

	// Inbound messages from the clients.
	broadcast chan data

	// Register requests from the clients.
	register chan subscription

	// Unregister requests from clients.
	unregister chan subscription

	// last message sent
	lastMessage map[string]*pattern

	//	ready users
	readyUsers map[string][]string
}

var hub = Hub{
	broadcast:   make(chan data),
	register:    make(chan subscription),
	unregister:  make(chan subscription),
	rooms:       make(map[string]map[*client]bool),
	usernames:   make(map[string][]string),
	lastMessage: make(map[string]*pattern),
	readyUsers:  make(map[string][]string),
}

func broadcast(connections map[*client]bool, m data) {
	for c := range connections {
		select {
		case c.send <- &m:
			hub.lastMessage[m.RoomID] = &m.Pattern
			if m.SendReady && !slices.Contains(hub.readyUsers[m.RoomID], m.Pattern.Username) {
				hub.readyUsers[m.RoomID] = append(hub.readyUsers[m.RoomID], m.Pattern.Username)
				fmt.Printf("there is %d users ready\n", len(hub.readyUsers[m.RoomID]))
			} else if m.SendReady && slices.Contains(hub.readyUsers[m.RoomID], m.Pattern.Username) {
				for i, username := range hub.usernames[m.RoomID] {
					if username == m.Pattern.Username {
						hub.usernames[m.RoomID] = append(hub.readyUsers[m.RoomID][:i], hub.readyUsers[m.RoomID][i+1:]...)
						break
					}
				}
			}

			fmt.Printf("sending %v for room: %s\n", m.Pattern.Descrip, m.RoomID)
			c.send <- &data{
				m.Pattern,
				m.RoomID,
				hub.usernames[m.RoomID],
				len(hub.readyUsers[m.RoomID]) == len(hub.usernames[m.RoomID]),
			}
		default:
			close(c.send)
			delete(connections, c)
			if len(connections) == 0 {
				delete(hub.rooms, m.RoomID)
				delete(hub.usernames, m.RoomID)
			}
		}
	}
}

func (h *Hub) run() {
	println()
	for {
		select {
		case s := <-h.register:

			if len(h.rooms) >= 5 {
				s.client.ws.WriteJSON(map[string]string{
					"error": "room limit reached",
				})
				s.client.ws.Close()
				continue
			}

			connections := h.rooms[s.room]
			if connections == nil {
				connections = make(map[*client]bool)
				h.rooms[s.room] = connections
				h.usernames[s.room] = []string{} //init username list
				log.Println("new room created: ", s.room)
			}
			if len(connections) >= 3 {
				s.client.ws.WriteJSON(map[string]string{
					"error": "Room is full",
				})
				s.client.ws.Close()
				continue
			}

			h.rooms[s.room][s.client] = true
			h.usernames[s.room] = append(h.usernames[s.room], s.username)
			fmt.Printf("%s is joining!\n", s.username)

			if lastMsg, ok := h.lastMessage[s.room]; ok {
				fmt.Printf("sending last message + updated users\n")
				m := data{
					Pattern: *lastMsg,
					RoomID:  s.room,
					Users:   h.usernames[s.room],
				}
				broadcast(connections, m)
			} else {
				m := data{
					Pattern: pattern{},
					RoomID:  s.room,
					Users:   h.usernames[s.room],
				}
				broadcast(connections, m)
			}

		case s := <-h.unregister:
			connections := h.rooms[s.room]
			if connections != nil {
				if _, ok := connections[s.client]; ok {
					delete(connections, s.client)
					close(s.client.send)

					//remove username
					for i, username := range h.usernames[s.room] {
						if username == s.username {
							h.usernames[s.room] = append(h.usernames[s.room][:i], h.usernames[s.room][i+1:]...)
							break
						}
					}
					//delete room
					if len(connections) == 0 {
						delete(h.rooms, s.room)
						delete(h.usernames, s.room)
					}

					if lastMsg, ok := h.lastMessage[s.room]; ok {
						m := data{
							Pattern: *lastMsg,
							RoomID:  s.room,
							Users:   hub.usernames[s.room],
						}
						broadcast(connections, m)
					} else {
						m := data{
							Pattern: pattern{},
							RoomID:  s.room,
							Users:   hub.usernames[s.room],
						}
						broadcast(connections, m)
					}

				}
			}

		case m := <-h.broadcast:
			connections := h.rooms[m.RoomID]

			broadcast(connections, m)
		}
	}
}
