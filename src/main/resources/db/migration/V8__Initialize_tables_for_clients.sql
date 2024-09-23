-- Create schema
CREATE SCHEMA IF NOT EXISTS clients;

-- Create 'groups' table
CREATE TABLE IF NOT EXISTS clients.groups
(
    id         BIGSERIAL PRIMARY KEY,
    group_name VARCHAR(255) NOT NULL,
    dates      VARCHAR(255),
    notes      TEXT
);

-- Create 'clients' table
CREATE TABLE IF NOT EXISTS clients.clients
(
    id                  BIGSERIAL PRIMARY KEY,
    first_name          VARCHAR(255) NOT NULL,
    last_name           VARCHAR(255) NOT NULL,
    age                 VARCHAR(3),
    cost                NUMERIC(10, 2),
    phone_number        VARCHAR(20),
    id_status           VARCHAR(50),
    exp_date            TIMESTAMPTZ, -- DateTime will be mapped to TIMESTAMPTZ in PostgreSQL
    doctor_check_status VARCHAR(255),
    notes               TEXT,
    group_id            BIGINT,      -- Foreign key to the 'groups' table
    CONSTRAINT fk_group
        FOREIGN KEY (group_id)
            REFERENCES clients.groups (id)
            ON DELETE SET NULL
);

-- Optional: Add indexes on foreign keys or any important fields
CREATE INDEX idx_client_group ON clients.clients (group_id);