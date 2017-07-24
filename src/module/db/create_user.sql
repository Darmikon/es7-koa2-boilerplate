-- should be executed before connection via terminal for example
-- SELECT * FROM pg_roles;
DROP ROLE IF EXISTS username;
CREATE USER username WITH PASSWORD 'passwd';
REVOKE ALL ON ALL TABLES IN SCHEMA scheme_name FROM PUBLIC;
GRANT USAGE ON SCHEMA scheme_name TO username;
GRANT SELECT ON ALL TABLES IN SCHEMA scheme_name TO username;