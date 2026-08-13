IF OBJECT_ID('reservations') IS NULL
BEGIN
CREATE TABLE reservations(
    id INT PRIMARY KEY IDENTITY(1, 1),
    user_id INT NOT NULL,
    offer_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status NVARCHAR(30) NOT NULL DEFAULT 'PENDING',
    created_at DATETIME NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT FK_reservations_offers_products FOREIGN KEY (offer_id, product_id) REFERENCES offers_products(offer_id, product_id),
    CONSTRAINT FK_reservations_user FOREIGN KEY (user_id) REFERENCES users(id)
);
END;