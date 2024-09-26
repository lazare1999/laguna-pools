CREATE SCHEMA IF NOT EXISTS branches;

CREATE TABLE IF NOT EXISTS branches.branches
(
    id          SERIAL PRIMARY KEY,
    branch_name VARCHAR(80) NOT NULL
);

ALTER TABLE users.users
    ADD COLUMN branch_id INTEGER;

ALTER TABLE users.users
    ADD CONSTRAINT fk_branch
        FOREIGN KEY (branch_id) REFERENCES branches.branches (id) ON DELETE SET NULL;

ALTER TABLE clients.clients
    ADD COLUMN branch_id BIGINT;

ALTER TABLE clients.clients
    ADD CONSTRAINT fk_branch
        FOREIGN KEY (branch_id) REFERENCES branches.branches (id) ON DELETE SET NULL;

ALTER TABLE clients.clients
    ALTER COLUMN branch_id SET DEFAULT NULL;

CREATE INDEX idx_branch_id ON clients.clients (branch_id);

CREATE OR REPLACE VIEW users.active_users AS
SELECT u.user_id,
       u.user_name,
       u.user_password,
       u.last_auth_date,
       u.is_locked,
       u.branch_id
FROM users.users u
WHERE u.status_id = 0;


