package db

import (
	"context"
	"fmt"
	"log"

	"github.com/jackc/pgx/v5"
)

var dbConnection *pgx.Conn

type Pattern struct {
	ID       int
	Name     string
	Username string
	Row0     string
	Row1     string
	Row2     string
	Row3     string
}

// Initialize the database connection
func Connect() error {
	// Replace with your actual connection string
	connStr := "postgres://drumuser:pringle@localhost:5432/drumpatterns"

	// Establish connection to the database
	conn, err := pgx.Connect(context.Background(), connStr)
	if err != nil {
		return fmt.Errorf("unable to connect to database: %v", err)
	}

	// Store the connection for use in other functions
	dbConnection = conn
	fmt.Println("Successfully connected to the database.")
	return nil
}

// Close the database connection when the app shuts down
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

// Run a simple query to check if the database is responsive
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

func MakeTable() error {
	query := `
		CREATE TABLE IF NOT EXISTS patterns(
			id SERIAL PRIMARY KEY,
			name TEXT NOT NULL,
			username TEXT NOT NULL,
			row0 TEXT NOT NULL,
			row1 TEXT NOT NULL,
			row2 TEXT NOT NULL,
			row3 TEXT NOT NULL
			);`
	_, err := dbConnection.Exec(context.Background(), query)
	if err != nil {
		fmt.Println(err)
		return fmt.Errorf("query error making table: %v", err)
	}

	fmt.Println("patterns table created!")
	return nil
}

func DeleteTable() error {
	query := `DROP TABLE patterns;`
	_, err := dbConnection.Exec(context.Background(), query)
	if err != nil {
		fmt.Println(err)
		return fmt.Errorf("error dropping patterns: %v", err)
	}

	fmt.Println("patterns table dropped")
	return nil
}

func AddPattern(name, username, row0, row1, row2, row3 string) error {

	query := `
		INSERT INTO patterns (name, username, row0, row1, row2, row3)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id;
	`
	var id int
	err := dbConnection.QueryRow(context.Background(), query, name, username, row0, row1, row2, row3).Scan(&id)

	if err != nil {
		fmt.Println(err)
		return fmt.Errorf("error adding pattern: %v", err)
	}

	fmt.Println("Pattern added with id:", id)
	return nil
}

func GetAllPatterns() ([]Pattern, error) {

	query := `
		SELECT id, name, username, row0, row1, row2, row3 FROM patterns
	`

	rows, err := dbConnection.Query(context.Background(), query)
	if err != nil {
		return nil, fmt.Errorf("query error: %v", err)
	}
	defer rows.Close()

	var patterns []Pattern

	for rows.Next() {
		var pattern Pattern
		err := rows.Scan(&pattern.ID, &pattern.Name, &pattern.Username, &pattern.Row0, &pattern.Row1, &pattern.Row2, &pattern.Row3)
		if err != nil {
			return nil, fmt.Errorf("error assigning data from row: %v", err)
		}
		patterns = append(patterns, pattern)
	}

	if rows.Err() != nil {
		return nil, fmt.Errorf("error handling data from selection %v", err)
	}

	return patterns, nil
}

func GetPatternByID(id int) (Pattern, error) {

	query := `
			SELECT id, name, username, row0, row1, row2, row3 FROM patterns where id = $1
		`

	var pattern Pattern

	row, err := dbConnection.Query(context.Background(), query, id)
	if err != nil {
		return pattern, fmt.Errorf("error getting pattern: %v", err)
	}
	defer row.Close()

	if row.Next() {
		err := row.Scan(&pattern.ID, &pattern.Name, &pattern.Username, &pattern.Row0, &pattern.Row1, &pattern.Row2, &pattern.Row3)
		if err != nil {
			return pattern, fmt.Errorf("error handling data: %v", err)
		}
	} else {
		return pattern, fmt.Errorf("no pattern found with id: %d", id)
	}

	return pattern, nil
}

func GetPatternByName(name string) (Pattern, error) {

	query := `
		SELECT id, name, username, row0, row1, row2, row3 
		FROM patterns 
		WHERE name ILIKE $1
	`

	var pattern Pattern

	row, err := dbConnection.Query(context.Background(), query, "%"+name+"%")
	if err != nil {
		return pattern, fmt.Errorf("error finding pattern with name: %s", name)
	}
	defer row.Close()

	if row.Next() {
		err := row.Scan(&pattern.ID, &pattern.Name, &pattern.Username, &pattern.Row0, &pattern.Row1, &pattern.Row2, &pattern.Row3)
		if err != nil {
			return pattern, fmt.Errorf("error handling data: %v", err)
		}
	} else {
		return pattern, fmt.Errorf("no pattern found with name: %s", name)
	}

	return pattern, nil
}

func DeletePatternByID(id int) error {

	query := `
		DELETE FROM patterns where id = $1
	`

	commandTag, err := dbConnection.Exec(context.Background(), query, id)
	if err != nil {
		return fmt.Errorf("error deleting pattern with id: %d", id)
	}
	if commandTag.RowsAffected() != 1 {
		return fmt.Errorf("no rows found with id: %d", id)
	}

	fmt.Printf("deleted row with id: %d\n", id)
	return nil
}

func DeletePatternsByIds(ids []int) error {
	query := `DELETE FROM patterns WHERE id = ANY($1)`

	_, err := dbConnection.Exec(context.Background(), query, ids)
	if err != nil {
		return fmt.Errorf("error deleting patterns: %v", err)
	}

	return nil
}

func UpdatePatternByID(id int, name, username, row0, row1, row2, row3 string) error {

	query := `
		UPDATE patterns 
		SET name = $2, username = $3, row0 = $4, row1 = $5, row2 = $6, row3 = $7
		WHERE id = $1
	`

	commandTag, err := dbConnection.Exec(context.Background(), query, id, name, username, row0, row1, row2, row3)
	if err != nil {
		return fmt.Errorf("error updating pattern: %v", err)
	}
	if commandTag.RowsAffected() != 1 {
		return fmt.Errorf("no pattern found with id: %d", id)
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
