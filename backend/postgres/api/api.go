package api

import (
	"net/http"
	"postgres/db"
	"strconv"

	"github.com/gin-gonic/gin"
)

func GetAllPatterns(c *gin.Context) {
	patterns, err := db.GetAllPatterns()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, patterns)
}

func GetPatternByID(c *gin.Context) {
	id := c.Param("id")
	idint, err := strconv.Atoi(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bad ID format"})
		return
	}

	pattern, err := db.GetPatternByID(idint)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, pattern)
}

func GetPatternByName(c *gin.Context) {
	name := c.DefaultQuery("name", "")

	if name == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bad name request - name is needed"})
		return
	}

	pattern, err := db.GetPatternByName(name)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, pattern)
}

func GetPatternCount(c *gin.Context) {
	count, err := db.GetPatternCount()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"count": count})
}

func AddNewPattern(c *gin.Context) {
	var newpattern db.Pattern
	err := c.ShouldBindJSON(&newpattern)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	errer := db.AddPattern(newpattern.Name, newpattern.Username, newpattern.Row0, newpattern.Row1, newpattern.Row2, newpattern.Row3)
	if errer != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": errer.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"success": "pattern addded"})
}

func DeletePatterByID(c *gin.Context) {
	id := c.Param("id")
	idint, err := strconv.Atoi(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bad id format"})
		return
	}

	errer := db.DeletePatternByID(idint)
	if errer != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": errer.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"error": "pattern deleted"})
}

func DeletePatternsByIds(c *gin.Context) {
	var ids []int
	err := c.ShouldBindJSON(&ids)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bad IDs format"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": "patterns deleted"})
}

func UpdatePatternByID(c *gin.Context) {
	id := c.Param("id")
	idint, err := strconv.Atoi(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bad ID format"})
		return
	}
	var updatedPattern db.Pattern
	errer := c.ShouldBindJSON(&updatedPattern)
	if errer != nil {
		c.JSON(http.StatusBadRequest, errer.Error())
		return
	}

	err2 := db.UpdatePatternByID(idint, updatedPattern.Name, updatedPattern.Username, updatedPattern.Row0, updatedPattern.Row1, updatedPattern.Row2, updatedPattern.Row3)
	if err2 != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err2.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": "pattern updated"})
}
