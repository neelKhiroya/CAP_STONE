package api

import (
	"fmt"
	"net/http"
	"postgres/db"
	"strconv"

	"github.com/gin-gonic/gin"
)

func GetPageniatedPatterns(c *gin.Context) {

	pageLimitStr := c.DefaultQuery("limit", "10")
	pageoffsetStr := c.DefaultQuery("offset", "0")

	pageLimit, err := strconv.Atoi(pageLimitStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bad limit"})
		return
	}
	pageOffset, err := strconv.Atoi(pageoffsetStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bad offset"})
		return
	}

	patterns, err := db.GetPageniatedPatterns(c, pageLimit, pageOffset)
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

	pattern, err := db.GetPatternByID(c, idint)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, pattern)
}

func GetPatternsByName(c *gin.Context) {
	name := c.DefaultQuery("name", "")

	if name == "" {
		c.JSON(http.StatusOK, nil)
		return
	}
	patterns, err := db.GetPatternsByName(c, name)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, patterns)
}

func GetDrumRowsForPattern(c *gin.Context) {
	id := c.Param("id")
	idint, err := strconv.Atoi(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	drum_rows, err := db.GetDrumRowsForPattern(c, idint)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, drum_rows)
}

func GetPatternCount(c *gin.Context) {
	count, err := db.GetPatternCount(c)
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

	if newpattern.Name == "" || newpattern.Username == "" || newpattern.Author == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bad name or username request"})
		return
	}

	if len(newpattern.DrumRows) < 2 || len(newpattern.DrumRows) > 6 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bad drum pattern"})
		return
	}

	fmt.Println(newpattern.DrumRows)

	errer := db.AddPattern(c, newpattern)
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

	errer := db.DeletePatternByID(c, idint)
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
		c.JSON(http.StatusBadRequest, gin.H{"error": errer.Error()})
		return
	}
	if len(updatedPattern.DrumRows) < 2 || len(updatedPattern.DrumRows) > 6 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bad Drum length"})
		return
	}
	if updatedPattern.Name == "" || updatedPattern.Username == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bad name or username"})
	}

	err2 := db.UpdatePatternByID(c, idint, updatedPattern)
	if err2 != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err2.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": "pattern updated"})
}
