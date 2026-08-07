IF OBJECT_ID('offers') IS NULL
BEGIN
CREATE TABLE offers(
    id INT PRIMARY KEY IDENTITY(1,1),
    shop_id INT NOT NULL,
    start_date DATETIME NOT NULL DEFAULT GETDATE(),
    hours_available INT NOT NULL,
    end_date DATETIME NOT NULL,
    is_deleted BIT NOT NULL DEFAULT 0,

    CONSTRAINT FK_offers_shops FOREIGN KEY (shop_id) REFERENCES shops(id)
);
END;
