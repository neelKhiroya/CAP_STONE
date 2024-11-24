package db

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"time"

	"github.com/jackc/pgx/v5"
)

var dbConnection *pgx.Conn

type Drum_Row struct {
	ID       int    `json:"id"`
	RowName  string `json:"row_name"`
	DrumData string `json:"drum_data"`
}

type Pattern struct {
	ID          int        `json:"id"`
	Name        string     `json:"name"`
	Author      string     `json:"author"`
	Username    string     `json:"username"`
	Description string     `json:"description"`
	CreatedAt   time.Time  `json:"created_at"`
	DrumRows    []Drum_Row `json:"drumrows"`
}

func Connect() error {

	connStr := "postgres://drumuser:pringle@localhost:5432/drumpatterns"

	conn, err := pgx.Connect(context.Background(), connStr)
	if err != nil {
		return fmt.Errorf("unable to connect to database: %v", err)
	}

	dbConnection = conn
	fmt.Println("Successfully connected to the database.")
	return nil
}

func Close() {
	if dbConnection != nil {
		err := dbConnection.Close(context.Background())
		if err != nil {
			log.Printf("Error closing connection: %v", err)
		} else {
			fmt.Println("Database connection closed.")
		}
	}
}

func Ping() error {
	if dbConnection == nil {
		return fmt.Errorf("no database connection established")
	}

	err := dbConnection.Ping(context.Background())
	if err != nil {
		return fmt.Errorf("unable to ping the database: %v", err)
	}
	return nil
}

func MakeTables() error {

	tx, err1 := dbConnection.Begin(context.Background())
	if err1 != nil {
		return fmt.Errorf("bad connection to postgres: %v", err1)
	}
	defer tx.Rollback(context.Background())

	query1 := `
		CREATE TABLE IF NOT EXISTS patterns (
			id SERIAL PRIMARY KEY,
			name VARCHAR(255) NOT NULL,
			author VARCHAR(255) NOT NULL,
			username VARCHAR(255) NOT NULL,
			description TEXT,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);
	`

	_, err2 := tx.Exec(context.Background(), query1)
	if err2 != nil {
		return fmt.Errorf("bad create table query: %v", err2)
	}

	query2 := `
		CREATE TABLE IF NOT EXISTS drum_rows (
			id SERIAL PRIMARY KEY,
			pattern_id INT NOT NULL,
			row_name VARCHAR(255) NOT NULL,
			drum_data TEXT NOT NULL,
			FOREIGN KEY (pattern_id) REFERENCES patterns(id) ON DELETE CASCADE
		);
	`

	_, err3 := tx.Exec(context.Background(), query2)
	if err3 != nil {
		return fmt.Errorf("bad create table quary: %v", err3)
	}

	err4 := tx.Commit(context.Background())
	if err4 != nil {
		return fmt.Errorf("bad commit to server: %v", err4)
	}

	fmt.Println("all tables created!")
	return nil
}

func DeleteTables() error {
	query := `
	DROP TABLE IF EXISTS drum_rows;
	DROP TABLE IF EXISTS patterns;
	`
	_, err := dbConnection.Exec(context.Background(), query)
	if err != nil {
		fmt.Println(err)
		return fmt.Errorf("error dropping patterns: %v", err)
	}

	fmt.Println("all tables dropped")
	return nil
}

func AddPattern(pattern Pattern) error {

	query := `
		INSERT INTO patterns (name, author, username, description, created_at)
		VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) RETURNING id
`

	var patternID int
	err := dbConnection.QueryRow(context.Background(), query, pattern.Name, pattern.Author, pattern.Username, pattern.Description).Scan(&patternID)
	if err != nil {
		return fmt.Errorf("error inserting pattern: %v", err)
	}

	for _, drumRow := range pattern.DrumRows {
		err := AddDrumRowToPattern(patternID, drumRow)
		if err != nil {
			return fmt.Errorf("error adding drum row: %v", err)
		}
	}

	return nil
}

func AddDrumRowToPattern(id int, drumRow Drum_Row) error {

	query := `
		INSERT INTO drum_rows (pattern_id, row_name, drum_data)
		VALUES ($1, $2, $3)
	`

	_, err := dbConnection.Exec(context.Background(), query, id, drumRow.RowName, drumRow.DrumData)
	if err != nil {
		return fmt.Errorf("error adding drum row to pattern: %v", err)
	}

	return nil
}

func GetPageniatedPatterns(ctx context.Context, limit, offet int) ([]Pattern, error) {

	query := `
		SELECT id, name, author, username, description, created_at 
		FROM patterns
		LIMIT $1 OFFSET $2
	`

	rows, err := dbConnection.Query(ctx, query, limit, offet)
	if err != nil {
		return nil, fmt.Errorf("query error: %v", err)
	}
	defer rows.Close()

	var patterns []Pattern

	for rows.Next() {
		var pattern Pattern
		err := rows.Scan(&pattern.ID, &pattern.Name, &pattern.Author, &pattern.Username, &pattern.Description, &pattern.CreatedAt)
		if err != nil {
			return nil, fmt.Errorf("error assigning data from row: %v", err)
		}
		patterns = append(patterns, pattern)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error handling data from selection: %v", err)
	}

	return patterns, nil
}

func GetPatternByID(id int) (Pattern, error) {

	query := `
			SELECT id, name, author, username, description, created_at FROM patterns where id = $1
		`

	var pattern Pattern

	err := dbConnection.QueryRow(context.Background(), query, id).Scan(
		&pattern.ID,
		&pattern.Name,
		&pattern.Author,
		&pattern.Username,
		&pattern.Description,
		&pattern.CreatedAt)

	if err != nil {
		if err == sql.ErrNoRows {
			return pattern, fmt.Errorf("no pattern found with id: %d", id)
		}
		return pattern, fmt.Errorf("error getting pattern: %v", err)
	}

	drumRows, err := GetDrumRowsForPattern(id)
	if err != nil {
		return pattern, fmt.Errorf("bad drum rows")
	}

	pattern.DrumRows = drumRows

	return pattern, nil
}

func GetDrumRowsForPattern(id int) ([]Drum_Row, error) {

	query := `
		SELECT id, row_name, drum_data
		FROM drum_rows
		WHERE pattern_id = $1
	`
	var drumrows []Drum_Row

	rows, err := dbConnection.Query(context.Background(), query, id)
	if err != nil {
		return drumrows, fmt.Errorf("bad request to postgres: %v", err)
	}
	defer rows.Close()

	for rows.Next() {
		var drumrow Drum_Row
		err := rows.Scan(
			&drumrow.ID,
			&drumrow.RowName,
			&drumrow.DrumData)
		if err != nil {
			return drumrows, fmt.Errorf("bad row scan: %v", err)
		}
		fmt.Println(drumrow)
		drumrows = append(drumrows, drumrow)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("bad rows: %v", err)
	}

	if len(drumrows) == 0 {
		return drumrows, fmt.Errorf("no drums for pattern id %d", id)
	}

	return drumrows, nil
}

func GetPatternsByName(name string) ([]Pattern, error) {

	query := `
		SELECT id, name, author, username, description, created_at
		FROM patterns 
		WHERE name ILIKE $1
	`

	var patterns []Pattern

	rows, err := dbConnection.Query(context.Background(), query, "%"+name+"%")
	if err != nil {
		return patterns, fmt.Errorf("bad request for pattern name: %s", name)
	}
	defer rows.Close()

	if rows.Next() {
		var pattern Pattern
		err := rows.Scan(
			&pattern.ID,
			&pattern.Name,
			&pattern.Author,
			&pattern.Username,
			&pattern.Description)
		if err != nil {
			return patterns, fmt.Errorf("bad data handle: %v", err)
		}
		patterns = append(patterns, pattern)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("bad rows: %v", err)
	}

	if len(patterns) == 0 {
		return nil, fmt.Errorf("bad pattern name: %s", name)
	}

	return patterns, nil
}

func DeletePatternByID(id int) error {

	query := `
		DELETE FROM patterns WHERE id = $1
	`

	commandTag, err := dbConnection.Exec(context.Background(), query, id)
	if err != nil {
		return fmt.Errorf("error deleting pattern with id: %d", id)
	}
	if commandTag.RowsAffected() != 1 {
		return fmt.Errorf("no rows found with id: %d", id)
	}

	return nil
}

func DeletePatternsByIds(ids []int) error {

	if len(ids) == 0 {
		return fmt.Errorf("bad array passed")
	}

	query := `DELETE FROM patterns WHERE id = ANY($1)`

	_, err := dbConnection.Exec(context.Background(), query, ids)
	if err != nil {
		return fmt.Errorf("error deleting patterns: %v", err)
	}

	return nil
}

func DeleteDrumRowFromPattern(id int, name string) error {

	checkQuery := `SELECT COUNT(*) FROM patterns WHERE id = $1`
	var count int

	checkErr := dbConnection.QueryRow(context.Background(), checkQuery, id).Scan(&count)
	if checkErr != nil {
		return fmt.Errorf("bad request to db: %v", checkErr)
	}
	if count == 0 {
		return fmt.Errorf("no pattern with id: %d", id)
	}

	checkQuery = `SELECT COUNT(*) FROM drum_rows WHERE pattern_id = $1`
	checkErr2 := dbConnection.QueryRow(context.Background(), checkQuery, id).Scan(&count)
	if checkErr2 != nil {
		return fmt.Errorf("bad request to db: %v", checkErr2)
	}
	if count <= 2 {
		return fmt.Errorf("already min rows")
	}

	query := `
		DELETE FROM drum_rows 
		WHERE pattern_id = $1
		AND row_name = $2
	`

	_, err := dbConnection.Exec(context.Background(), query, id, name)
	if err != nil {
		return fmt.Errorf("bad drum row deletion: %v", err)
	}

	return nil
}

func UpdatePatternByID(id int, updatedPattern Pattern) error {

	query := `
		SELECT COUNT(*) FROM patterns WHERE id = $1
	`

	var count int
	err := dbConnection.QueryRow(context.Background(), query, id).Scan(&count)
	if err != nil {
		return fmt.Errorf("error checking if pattern exists: %v", err)
	}
	if count == 0 {
		return fmt.Errorf("no pattern found with id: %d", id)
	}

	updateQuery := `
		UPDATE patterns 
		SET name = $2, author = $2, username = $4, description = $5
		WHERE id = $1
	`

	_, err = dbConnection.Exec(context.Background(), updateQuery, id, updatedPattern.Name, updatedPattern.Author, updatedPattern.Username, updatedPattern.Description)
	if err != nil {
		return fmt.Errorf("error updating pattern: %v", err)
	}

	err = UpdateDrumRowByID(id, updatedPattern.DrumRows)
	if err != nil {
		return fmt.Errorf("bad drum rows: %v", err)
	}

	return nil
}

func UpdateDrumRowByID(id int, drumrow []Drum_Row) error {

	updateQuery := `
		UPDATE drum_rows
		SET row_name = $1, drum_data = $2
		WHERE pattern_id = $3
		AND id = $4
	`
	for _, row := range drumrow {
		_, err := dbConnection.Exec(context.Background(), updateQuery, row.RowName, row.DrumData, id, row.ID)
		if err != nil {
			return fmt.Errorf("bad drum row data: %v", err)
		}
	}

	return nil
}

func GetPatternCount() (int, error) {
	query := `SELECT COUNT(*) FROM patterns`

	var count int

	err := dbConnection.QueryRow(context.Background(), query).Scan(&count)
	if err != nil {
		return 0, fmt.Errorf("error getting count: %v", err)
	}

	return count, nil
}
