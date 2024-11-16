package main

import (
	"fmt"
	"postgres/db"
	"postgres/router"
)

func ReadAll(patterns []db.Pattern) {
	for _, pattern := range patterns {
		fmt.Printf("ID: %d, Name: %s Row1: %s Row2: %s Row3: %s Row4: %s\n", pattern.ID, pattern.Name, pattern.Row0, pattern.Row1, pattern.Row2, pattern.Row3)
	}
}

func main() {
	err := db.Connect()

	if err != nil {
		fmt.Println(err)
	}
	defer db.Close()

	router := router.InitRouter()

	routerErr := router.Run(":8440")
	if routerErr != nil {
		fmt.Println(routerErr)
	}
}
