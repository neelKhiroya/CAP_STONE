package main

import (
	"fmt"
	"postgres/db"
	"postgres/router"
)

func main() {
	err := db.Connect()

	if err != nil {
		fmt.Println(err)
	}
	defer db.Close()

	router := router.InitRouter()

	routerErr := router.Run(":7210")
	if routerErr != nil {
		fmt.Println(routerErr)
	}
}
