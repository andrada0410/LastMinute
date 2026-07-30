IF OBJECT_ID('categories') IS NOT NULL
BEGIN
    INSERT INTO categories (name) VALUES
    ('Restaurant'), ('Fast-Food'), ('Confectionery'), ('Bakery'), ('Supermarket')
END;