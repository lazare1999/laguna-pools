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
    add_data       timestamp with time zone default now()
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
    status_id      INTEGER DEFAULT 0,
    login_attempts INTEGER DEFAULT 0,
    is_locked      BOOLEAN DEFAULT FALSE,
    created_by     TEXT,
    updated_by     TEXT,
    last_login_ip  TEXT,
    add_date       TIMESTAMP DEFAULT NOW() NOT NULL,
    last_auth_date TIMESTAMP
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
    target_name        TEXT NOT NULL,
    target_description TEXT,
    app_id             INTEGER NOT NULL,
    order_by           INTEGER DEFAULT 0 NOT NULL,
    group_by           TEXT DEFAULT '0' NOT NULL,
    CONSTRAINT fk_app FOREIGN KEY (app_id) REFERENCES users.apps (id)
);

-- User Roles table with foreign key constraints
CREATE TABLE IF NOT EXISTS users.user_roles
(
    user_role_id SERIAL PRIMARY KEY,
    user_id      INTEGER NOT NULL,
    target_id    INTEGER NOT NULL,
    add_date     TIMESTAMP DEFAULT NOW() NOT NULL,
    status_id    INTEGER DEFAULT 0,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users.users (user_id),
    CONSTRAINT fk_target FOREIGN KEY (target_id) REFERENCES users.targets (target_id)
);

-- Ensure uniqueness of user roles (user_id, target_id)
CREATE UNIQUE INDEX user_roles_users_uniq
    ON users.user_roles (user_id, target_id);

-- Active Users view (includes last_auth_date for more context)
CREATE OR REPLACE VIEW users.active_users AS
SELECT
    u.user_id,
    u.user_name,
    u.user_password,
    u.last_auth_date
FROM users.users u
WHERE u.status_id = 0;

-- User Roles View (Mapped to roles)
CREATE OR REPLACE VIEW users.user_role_sv AS
SELECT
    u.user_name,
    t.target_name AS role
FROM
    users.user_roles r
        JOIN
    users.active_users u ON r.user_id = u.user_id
        JOIN
    users.targets t ON r.target_id = t.target_id;

-- Insert initial data into apps
INSERT INTO users.apps (id, app_name, role_target_id, order_id, browser_hash, parent_id)
VALUES
    (1, 'laguna', 'ROLE_LAGUNA', 1, 'laguna', NULL);

-- Insert initial data into targets
INSERT INTO users.targets (target_id, target_name, target_description, app_id, order_by, group_by)
VALUES
    (1, 'ROLE_LAGUNA', 'laguna', 1, 1, 'laguna'),
    (2, 'ROLE_LAGUNA_ADMIN', 'laguna admin', 1, 2, 'laguna');
