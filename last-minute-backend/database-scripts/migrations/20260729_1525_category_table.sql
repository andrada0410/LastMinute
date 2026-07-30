IF OBJECT_ID('categories') IS NULL
BEGIN
CREATE TABLE categories (
    id INT PRIMARY KEY IDENTITY(1, 1),
    name varchar(50)
);
END;