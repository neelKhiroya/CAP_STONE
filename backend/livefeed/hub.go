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

type Hub struct {
	rooms map[string]map[*client]bool

	usernames map[string][]string

	broadcast chan data

	register chan subscription

	unregister chan subscription

	lastMessage map[string]*pattern

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

func handleUserReady(m data) {
	if m.IsUserReady && !slices.Contains(hub.readyUsers[m.RoomID], m.Pattern.Username) { // is the user ready and not already in the readyuser list
		hub.readyUsers[m.RoomID] = append(hub.readyUsers[m.RoomID], m.Pattern.Username)
	} else if !m.IsUserReady && slices.Contains(hub.readyUsers[m.RoomID], m.Pattern.Username) { // is the user NOT ready but in the readyuser list
		for i, username := range hub.usernames[m.RoomID] {
			if username == m.Pattern.Username {
				hub.readyUsers[m.RoomID] = append(hub.readyUsers[m.RoomID][:i], hub.readyUsers[m.RoomID][i+1:]...)
				break
			}
		}
	}
}

func broadcast(connections map[*client]bool, m data) {
	for c := range connections { //send to all users in connections
		select {
		case c.send <- &m:
			hub.lastMessage[m.RoomID] = &m.Pattern

			handleUserReady(m)

			c.send <- &data{
				Pattern:            m.Pattern,
				RoomID:             m.RoomID,
				Users:              hub.usernames[m.RoomID],
				IsUserReady:        m.IsUserReady,
				NumberOfReadyUsers: len(hub.readyUsers[m.RoomID]),
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

func roomLimitCheck(s subscription) {
	if len(hub.rooms) >= 5 {
		s.client.ws.WriteJSON(map[string]string{
			"error": "room limit reached",
		})
		s.client.ws.Close()
	}
}

func fillArrayString(length int) []string {
	s := make([]string, length)
	for i := range s {
		s[i] = ""
	}
	return s
}

func fillArrayBool(length int) []bool {
	b := make([]bool, length)
	for i := range b {
		b[i] = false
	}
	return b
}

func newRoomCheck(s subscription, c map[*client]bool) {
	if c == nil {
		connections := make(map[*client]bool)
		hub.rooms[s.room] = connections
		hub.usernames[s.room] = []string{}
		log.Println("created new room", s.room)
		colors16 := fillArrayString(16)
		bool16 := fillArrayBool(16)
		hub.lastMessage[s.room] = &pattern{
			Username: "server",
			Rows: []row{
				{
					Colors: colors16,
					Data:   bool16,
					Name:   "Change me!",
				},
				{
					Colors: colors16,
					Data:   bool16,
					Name:   "Change me!",
				},
			},
		}
	}
}

func userLimitCheck(s subscription, c map[*client]bool) {
	if len(c) >= 3 { // if users in room is more than 3
		s.client.ws.WriteJSON(map[string]string{
			"error": "Room is full",
		})
		s.client.ws.Close()
	}
}

func roomEmptyCheck(s subscription, c map[*client]bool) {
	if c != nil {
		if _, ok := c[s.client]; ok {
			delete(c, s.client)
			close(s.client.send)

			//remove username
			for i, username := range hub.usernames[s.room] {
				if username == s.username {
					hub.usernames[s.room] = append(hub.usernames[s.room][:i], hub.usernames[s.room][i+1:]...)
					break
				}
			}
			//delete room
			if len(c) == 0 {
				fmt.Println("deleting room ", s.room)
				delete(hub.rooms, s.room)
				delete(hub.usernames, s.room)
			} else {
				handleLastMessage(s, c) //update users
			}
		}
	}

}

func handleLastMessage(s subscription, c map[*client]bool) {
	if lastMsg, ok := hub.lastMessage[s.room]; ok {
		fmt.Printf("sending last message + updated users\n")
		m := data{
			Pattern: *lastMsg,
			RoomID:  s.room,
			Users:   hub.usernames[s.room],
		}
		broadcast(c, m)
	} else {
		fmt.Println("no last message!")
		m := data{
			Pattern: pattern{},
			RoomID:  s.room,
			Users:   hub.usernames[s.room],
		}
		broadcast(c, m)
	}
}

func (h *Hub) run() {
	for {
		select {
		case s := <-h.register:

			// checks if the room limit is full (10 rooms max in the hub)
			roomLimitCheck(s)

			// gets list of clients & bools
			connections := h.rooms[s.room]

			// checks if theres any clients in the room (creates starter pattern and new channel)
			newRoomCheck(s, connections)

			//checks if the rooms client limit if full (max 3 clients in a room)
			userLimitCheck(s, connections)

			//	sets true to the client key (client is active and should recive messages)
			h.rooms[s.room][s.client] = true

			//	adds clients username to the list of users in the room. (keeps track of usernames in room)
			h.usernames[s.room] = append(h.usernames[s.room], s.username)

			fmt.Printf("%s is joining!\n", s.username)

			//	broadcast starter pattern and list of usernames to each client.
			handleLastMessage(s, h.rooms[s.room])

		case s := <-h.unregister:
			connections := h.rooms[s.room]
			// checks if last user left the room, also sends out updated userlist when client disconnects.
			roomEmptyCheck(s, connections)

		case m := <-h.broadcast:
			connections := h.rooms[m.RoomID]
			// send data and save last data sent
			broadcast(connections, m)
		}
	}
}
