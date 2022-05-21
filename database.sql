CREATE DATABASE users;

CREATE TABLE usersInfo (
    users_id SERIAL PRIMARY KEY,
    users_name TEXT NOT NULL,
    users_email TEXT NOT NULL,
    users_password TEXT NOT NULL
);

SELECT * FROM usersinfo;
INSERT INTO usersinfo (users_name,users_email,users_password) VALUES ($1,$2,$3)
SELECT * FROM usersinfo WHERE users_email = $1
SELECT * FROM usersinfo WHERE users_email = $1
UPDATE usersinfo SET users_password = $1 where users_email = $2
