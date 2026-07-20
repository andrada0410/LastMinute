IF OBJECT_ID('users') IS NOT NULL
BEGIN
    CREATE TABLE user_roles
    (
        id INT PRIMARY KEY,
        role VARCHAR(20) NOT NULL
    );

    ALTER TABLE users
    DROP COLUMN last_name, first_name;

    ALTER TABLE users
    ADD role INT,
    CONSTRAINT fk_user_role FOREIGN KEY (role) REFERENCES user_roles(id);

    CREATE TABLE user_details
    (
        user_id INT PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        CONSTRAINT fk_user_details FOREIGN KEY(user_id) REFERENCES users(id)
    );
END;