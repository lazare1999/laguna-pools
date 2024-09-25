-- Set the timezone for the session
SET TIME ZONE 'GMT+4';

-- logs
CREATE SCHEMA logs;

create table if not exists logs.authorise_history
(
    id             serial
        constraint authorise_history_pk
            primary key,
    user_id        integer,
    is_success     integer,
    remote_address text,
    add_data       TIMESTAMPTZ DEFAULT now()
);

comment on column logs.authorise_history.is_success is '0 - success
1 - not nuccess';

-- Create the users schema
CREATE SCHEMA users;

-- Users table
CREATE TABLE IF NOT EXISTS users.users
(
    user_id        SERIAL PRIMARY KEY,
    user_name      TEXT NOT NULL UNIQUE,
    user_password  TEXT NOT NULL,
    status_id      INTEGER     DEFAULT 0,
    login_attempts INTEGER     DEFAULT 0,
    is_locked      BOOLEAN     DEFAULT FALSE,
    created_by     TEXT,
    updated_by     TEXT,
    last_login_ip  TEXT,
    add_date       TIMESTAMPTZ DEFAULT now(),
    last_auth_date TIMESTAMPTZ DEFAULT now()
);

-- Applications table
CREATE TABLE IF NOT EXISTS users.apps
(
    id             SERIAL PRIMARY KEY,
    app_name       TEXT NOT NULL,
    role_target_id TEXT,
    order_id       INTEGER,
    browser_hash   TEXT,
    parent_id      INTEGER
);

-- Targets table
CREATE TABLE IF NOT EXISTS users.targets
(
    target_id          SERIAL PRIMARY KEY,
    target_name        TEXT                NOT NULL UNIQUE,
    target_description TEXT UNIQUE,
    app_id             INTEGER             NOT NULL,
    order_by           INTEGER DEFAULT 0   NOT NULL,
    group_by           TEXT    DEFAULT '0' NOT NULL,
    CONSTRAINT fk_app FOREIGN KEY (app_id) REFERENCES users.apps (id)
);

CREATE OR REPLACE VIEW users.target_view AS
SELECT target_id,
       target_name,
       target_description
FROM users.targets
ORDER BY target_id;

-- User Roles table with foreign key constraints
CREATE TABLE IF NOT EXISTS users.user_roles
(
    user_role_id SERIAL PRIMARY KEY,
    user_id      INTEGER                   NOT NULL,
    target_id    INTEGER                   NOT NULL,
    add_date     TIMESTAMPTZ DEFAULT now() NOT NULL,
    status_id    INTEGER     DEFAULT 0,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users.users (user_id),
    CONSTRAINT fk_target FOREIGN KEY (target_id) REFERENCES users.targets (target_id)
);

-- Ensure uniqueness of user roles (user_id, target_id)
CREATE UNIQUE INDEX user_roles_users_uniq
    ON users.user_roles (user_id, target_id);

-- Active Users view (includes last_auth_date for more context)
CREATE OR REPLACE VIEW users.active_users AS
SELECT u.user_id,
       u.user_name,
       u.user_password,
       u.last_auth_date,
       u.is_locked
FROM users.users u
WHERE u.status_id = 0;

-- User Roles View (Mapped to roles)
CREATE OR REPLACE VIEW users.user_role_sv AS
SELECT u.user_name,
       t.target_name AS role
FROM users.user_roles r
         JOIN
     users.active_users u ON r.user_id = u.user_id
         JOIN
     users.targets t ON r.target_id = t.target_id;

-- Insert initial data into apps
INSERT INTO users.apps (id, app_name, role_target_id, order_id, browser_hash, parent_id)
VALUES (1, 'laguna', 'ROLE_LAGUNA', 1, 'laguna', 0);

-- Insert initial data into targets
INSERT INTO users.targets (target_id, target_name, target_description, app_id, order_by, group_by)
VALUES (1, 'ROLE_LAGUNA', 'ოპერატორი', 1, 1, 'laguna'),
       (2, 'ROLE_LAGUNA_ADMIN', 'ადმინისტრატორი', 1, 2, 'laguna');


-- Create the schema for clients if it doesn't already exist
CREATE SCHEMA IF NOT EXISTS clients;

-- Define the Clients table
CREATE TABLE IF NOT EXISTS clients.clients
(
    id                BIGSERIAL PRIMARY KEY,
    first_name        VARCHAR(255) NOT NULL,
    last_name         VARCHAR(255) NOT NULL,
    age               DATE,
    cost              NUMERIC(10, 2),
    exp_date          DATE,
    doctor_check_till DATE,
    phone_number      VARCHAR(20),
    id_status         BOOLEAN,
    contract_status   BOOLEAN,
    notes             TEXT,
    parent            VARCHAR(255),
    created_by        VARCHAR(255) NOT NULL,
    updated_by        VARCHAR(255),
    CONSTRAINT ck_phone_number CHECK (phone_number ~ '^[0-9]+$')
);

-- Create an ENUM type for days of the week
CREATE TYPE day_enum AS ENUM (
    'SUNDAY',
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY'
    );

-- Create an ENUM type for hours
CREATE TYPE hour_enum AS ENUM (
    '00:00', '01:00', '02:00', '03:00', '04:00',
    '05:00', '06:00', '07:00', '08:00', '09:00',
    '10:00', '11:00', '12:00', '13:00', '14:00',
    '15:00', '16:00', '17:00', '18:00', '19:00',
    '20:00', '21:00', '22:00', '23:00'
    );

-- Define the Groups table
CREATE TABLE IF NOT EXISTS clients.groups
(
    id   BIGSERIAL PRIMARY KEY,
    day  day_enum  NOT NULL,
    hour hour_enum NOT NULL
);

-- Create indexes for optimization on the Groups table
CREATE INDEX idx_day_hour ON clients.groups (day, hour);

-- Define the Client Groups table
CREATE TABLE IF NOT EXISTS clients.client_groups
(
    id        BIGSERIAL PRIMARY KEY,
    group_id  BIGINT NOT NULL,
    client_id BIGINT NOT NULL,
    CONSTRAINT fk_group FOREIGN KEY (group_id) REFERENCES clients.groups (id) ON DELETE CASCADE,
    CONSTRAINT fk_client FOREIGN KEY (client_id) REFERENCES clients.clients (id) ON DELETE CASCADE
);

-- Create sequences for clients and groups
CREATE SEQUENCE IF NOT EXISTS clients.groups_id_seq START 1;
CREATE SEQUENCE IF NOT EXISTS clients.clients_id_seq START 1;
CREATE SEQUENCE IF NOT EXISTS clients.client_groups_id_seq START 1;


