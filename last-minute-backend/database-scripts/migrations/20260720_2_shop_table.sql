IF OBJECT_ID('shops') IS NULL
BEGIN
CREATE TABLE shops (
    id INT PRIMARY KEY IDENTITY(1,1),
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    user_id INT,
    CONSTRAINT fk_shops_users FOREIGN KEY(user_id) REFERENCES users(id)
);
END;
