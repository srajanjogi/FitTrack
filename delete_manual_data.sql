-- Delete all manually entered data from FitTrack database
-- This will keep the table structures and seed data (exercise_definitions)

-- Delete in order to respect foreign key constraints

-- 1. Delete all workout sets (most child table)
DELETE FROM workout_sets;

-- 2. Delete all workout exercises
DELETE FROM workout_exercises;

-- 3. Delete all workout sessions
DELETE FROM workout_sessions;

-- 4. Delete all user accounts (manually created via signup)
DELETE FROM users;

-- 5. Delete all members (if any were manually added)
DELETE FROM members;

-- Note: exercise_definitions table is NOT deleted (seed data is kept)
