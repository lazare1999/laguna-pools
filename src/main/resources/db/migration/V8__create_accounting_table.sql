CREATE SCHEMA IF NOT EXISTS accounting;

CREATE SEQUENCE IF NOT EXISTS accounting.accounting_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE IF NOT EXISTS accounting.accounting
(
    id        BIGINT PRIMARY KEY    DEFAULT nextval('accounting.accounting_id_seq'),
    amount    VARCHAR(255) NOT NULL,
    date      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    type      VARCHAR(255) NOT NULL,
    client_id BIGINT       NOT NULL,
    CONSTRAINT fk_client
        FOREIGN KEY (client_id)
            REFERENCES clients.clients (id)
            ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_accounting_client_id ON accounting.accounting (client_id);

