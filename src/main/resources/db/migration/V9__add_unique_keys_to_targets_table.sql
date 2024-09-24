ALTER TABLE users.targets
    ADD CONSTRAINT unique_target_name_description UNIQUE (target_name, target_description);
