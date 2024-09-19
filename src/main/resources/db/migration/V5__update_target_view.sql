CREATE OR REPLACE VIEW users.target_view AS
SELECT target_id,
       target_name,
       target_description
FROM users.targets
ORDER BY target_id;
