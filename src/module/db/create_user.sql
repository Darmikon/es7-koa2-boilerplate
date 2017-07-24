-- should be executed before connection via terminal for example
-- SELECT * FROM pg_roles;
-- This create user if not exists
do
$body$
declare
  num_users integer;
begin
   SELECT count(*)
     into num_users
   FROM pg_user
   WHERE usename = 'darmikon';

   IF num_users = 0 THEN
      CREATE ROLE darmikon LOGIN PASSWORD 'pass';
--    CREATE USER darmikon WITH PASSWORD 'pass';
   END IF;
end
$body$
;
REVOKE ALL ON ALL TABLES IN SCHEMA schema_name FROM PUBLIC;
GRANT USAGE ON SCHEMA schema_name TO darmikon;
GRANT SELECT ON ALL TABLES IN SCHEMA schema_name TO darmikon;