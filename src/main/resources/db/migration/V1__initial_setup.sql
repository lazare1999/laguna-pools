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
    column_5       integer,
    column_6       integer,
    column_7       integer,
    column_8       integer,
    column_9       integer,
    add_data       timestamp with time zone default now()
);

comment on column logs.authorise_history.is_success is '0 - success
1 - not nuccess';

-- users
CREATE SCHEMA users;

create table if not exists users.users
(
    user_id                      serial
        constraint users_pk
            primary key,
    user_name                   text,
    user_password                text,
    status_id                    integer   default 0,
    column_15                    integer,
    column_16                    integer,
    column_17                    integer,
    column_18                    integer,
    column_19                    integer,
    add_date                     timestamp default now() not null,
    last_auth_date               timestamp
);

create table if not exists users.user_roles
(
    user_role_id serial
        constraint user_roles_pkey
            primary key,
    user_id      integer                 not null,
    target_id    integer                 not null,
    add_date     timestamp default now() not null,
    status_id    integer   default 0
);

create unique index user_roles_users_uniq
    on users.user_roles (user_id, target_id);

create table if not exists users.targets
(
    target_id          serial
        constraint targets_pkey
            primary key,
    target_name        text              not null,
    target_description text,
    app_id             integer default 0 not null,
    order_by           integer default 0 not null,
    group_by           text    default 0 not null
);

create table if not exists users.apps
(
    id             serial
        constraint apps_pkey
            primary key,
    app_name       text,
    role_target_id text,
    order_id       integer,
    browser_hash   text,
    parent_id      integer
);

create or replace view users.active_users(user_id, user_name, user_password) as
SELECT users.user_id,
       users.user_name,
       users.user_password
FROM users.users
WHERE users.status_id = 0;

create or replace view users.user_rolesv(user_name, role) as
SELECT u.user_name,
       t.target_name AS role
FROM users.user_roles r,
     users.active_users u,
     users.targets t
WHERE r.user_id = u.user_id
  AND r.target_id = t.target_id;

insert into users.apps (id, app_name, role_target_id, order_id, browser_hash, parent_id)
values  (1, 'laguna', 'ROLE_LAGUNA', 1, 'laguna', null);

insert into users.targets (target_id, target_name, target_description, app_id, order_by, group_by)
values  (1, 'ROLE_LAGUNA', 'laguna', 1, 1, 'laguna'),
        (2, 'ROLE_LAGUNA_ADMIN', 'laguna admin', 1, 2, 'laguna');