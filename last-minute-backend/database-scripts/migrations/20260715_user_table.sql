IF OBJECT_ID('users') IS NULL
BEGIN
CREATE TABLE users (
    id INT IDENTITY(1, 1),
    email VARCHAR(50) UNIQUE,
    password VARCHAR(50),
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    CONSTRAINT pk_users PRIMARY KEY(id)
);
END
