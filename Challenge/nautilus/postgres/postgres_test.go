package postgres_test

import (
	"database/sql"
	"nl/postgres"
	"testing"

	_ "github.com/lib/pq"
)

// Postgres database for, information taken directly from docker-compose.yaml
var config = postgres.Config{
	Host:     "localhost",
	Port:     5433,
	User:     "nl_ship_psql_test",
	Password: "password",
	DBname:   "ship_db_test",
}

func TestNewShipRepository(t *testing.T) {
	// Dummy sql connection
	conn := &sql.DB{}

	_, err := postgres.NewShipRepository(conn)
	if err != nil {
		t.Errorf("Error creating ship repository: %v\n", err)
	}
}

func TestCreateConnection(t *testing.T) {
	conn, err := postgres.CreateConnection(config)
	if err != nil {
		t.Errorf("Error creating postgres connection: %v\n", err)
	}

	defer conn.Close()
}
