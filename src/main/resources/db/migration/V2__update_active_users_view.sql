-- Update the existing view with the new column
CREATE OR REPLACE VIEW users.active_users AS
SELECT u.user_id,
       u.user_name,
       u.user_password,
       u.last_auth_date,
       u.is_locked
FROM users.users u
WHERE u.status_id = 0;
