IF OBJECT_ID('shops') IS NOT NULL
BEGIN
    ALTER TABLE shops
    ADD category_id INT;

    ALTER TABLE shops
    ADD CONSTRAINT fk_shops_categories
    FOREIGN KEY (category_id) REFERENCES categories(id);
END;