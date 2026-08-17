IF OBJECT_ID('favorite_shops') IS NULL
BEGIN
    CREATE TABLE favorite_shops (
        user_id INT NOT NULL,
        shop_id INT NOT NULL,
        created_at DATETIME NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT PK_favorite_shops PRIMARY KEY (user_id, shop_id),
        CONSTRAINT FK_favorite_shops_user FOREIGN KEY (user_id) REFERENCES users(id),
        CONSTRAINT FK_favorite_shops_shop FOREIGN KEY (shop_id) REFERENCES shops(id)
    );
END;