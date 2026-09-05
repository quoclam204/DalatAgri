-- Keep existing users readable after UserRole was renamed from FARMER to WORKER.
UPDATE "User"
SET "role" = 'WORKER'
WHERE "role" = 'FARMER';
