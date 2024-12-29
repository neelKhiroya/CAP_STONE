package router

import (
	"postgres/api"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// init Gin router
func InitRouter() *gin.Engine {

	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	// fix proxy issues

	router.GET("/patterns", api.GetPageniatedPatterns)
	router.GET("/patterns/count", api.GetPatternCount)
	router.GET("/patterns/:id", api.GetPatternByID)
	router.GET("/drumrows/:id", api.GetDrumRowsForPattern)
	router.GET("/patterns/search", api.GetPatternsByName)
	router.POST("/patterns", api.AddNewPattern)
	router.POST("/patterns/delete", api.DeletePatternsByIds)
	router.DELETE("/patterns/:id", api.DeletePatterByID)
	router.PUT("/patterns/:id", api.UpdatePatternByID)

	return router
}
