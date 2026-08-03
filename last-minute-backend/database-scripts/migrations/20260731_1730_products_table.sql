IF OBJECT_ID('products') IS NULL
BEGIN
CREATE TABLE products(
	id INT PRIMARY KEY IDENTITY(1,1),
    shop_id INT NOT NULL,
    name NVARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description NVARCHAR(1000) NOT NULL,
    photo_path NVARCHAR(255) NULL,
    is_deleted BIT NOT NULL DEFAULT 0,

    CONSTRAINT FK_products_shops FOREIGN KEY (shop_id) REFERENCES shops(id)
);
END;