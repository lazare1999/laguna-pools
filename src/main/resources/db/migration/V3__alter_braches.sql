-- Step 1: Alter clients table
ALTER TABLE clients.clients
    ALTER COLUMN branch_id SET DEFAULT 0;

-- Step 2: Make branch_name unique in branches table
ALTER TABLE branches.branches
    ADD CONSTRAINT unique_branch_name UNIQUE (branch_name);

-- Step 3: Insert default branch
INSERT INTO branches.branches (id, branch_name)
VALUES (0, 'საერთო');
