// hub to mantain rooms

package main

import (
	"log"
)

type message struct {
	room string
	data *pattern
}

type subscription struct {
	client *client
	room   string
}

// Hub maintains the set of active clients and broadcasts messages to the
// clients.
type Hub struct {
	// Registered clients.
	rooms map[string]map[*client]bool

	// Inbound messages from the clients.
	broadcast chan message

	// Register requests from the clients.
	register chan subscription

	// Unregister requests from clients.
	unregister chan subscription
}

var hub = Hub{
	broadcast:  make(chan message),
	register:   make(chan subscription),
	unregister: make(chan subscription),
	rooms:      make(map[string]map[*client]bool),
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
		case s := <-h.unregister:
			connections := h.rooms[s.room]
			if connections != nil {
				if _, ok := connections[s.client]; ok {
					delete(connections, s.client)
					close(s.client.send)
					if len(connections) == 0 {
						delete(h.rooms, s.room)
					}
				}
			}
		case m := <-h.broadcast:
			connections := h.rooms[m.room]
			for c := range connections {
				select {
				case c.send <- m.data:
				default:
					close(c.send)
					delete(connections, c)
					if len(connections) == 0 {
						delete(h.rooms, m.room)
					}
				}
			}
		}
	}
}
