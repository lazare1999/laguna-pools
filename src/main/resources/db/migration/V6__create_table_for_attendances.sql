CREATE SCHEMA IF NOT EXISTS clients;

CREATE TABLE IF NOT EXISTS clients.attendances (
                                               id BIGINT PRIMARY KEY,
                                               time TIMESTAMP NOT NULL,
                                               attended BOOLEAN NOT NULL,
                                               client_id BIGINT,
                                               CONSTRAINT fk_client
                                               FOREIGN KEY (client_id)
    REFERENCES clients.clients(id)
    ON DELETE SET NULL
    );