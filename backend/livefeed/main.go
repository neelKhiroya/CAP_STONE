package main

import (
	"flag"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

var addr = flag.String("addr", ":7220", "http service address")

func main() {
	flag.Parse()
	go hub.run()

	r := mux.NewRouter()
	r.HandleFunc("/ws/{room}", serveWs)
	http.Handle("/", r)

	err := http.ListenAndServe(*addr, nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
